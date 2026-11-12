"""Build the SQLite price archive and the existing browser tariff declaration."""
import argparse
from contextlib import closing
import hashlib
import json
import re
import sqlite3
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIMIT = 100_000_000
BANDS = [(0, 0, 3, "flat"), (1, 3, 10, "per_q"), (2, 10, 15, "per_q"),
         (3, 15, 20, "per_q"), (4, 20, 30, "per_q"),
         (5, 30, 40, "per_q"), (6, 40, 50, "per_q")]


def validate(rows):
    if not isinstance(rows, list) or not rows:
        raise ValueError("Il listino deve contenere almeno una zona")
    keys, names = set(), set()
    for row in rows:
        if not isinstance(row, dict) or set(row) - {
            "region", "zone", "cents", "supplementCents", "aliases"
        }:
            raise ValueError("Campi tariffari non riconosciuti")
        for field in ("region", "zone"):
            value = row.get(field)
            if not isinstance(value, str) or not value.strip() or value != value.strip():
                raise ValueError("Regione e zona devono essere testi non vuoti, senza spazi esterni")
        key = (row["region"], row["zone"])
        if key in keys:
            raise ValueError("Zona duplicata: " + str(key))
        keys.add(key)
        prices = row.get("cents")
        if not isinstance(prices, list) or len(prices) != 7:
            raise ValueError("Sono obbligatorie esattamente sette fasce")
        amounts = prices + ([row["supplementCents"]] if "supplementCents" in row else [])
        if any(type(n) is not int or not 0 <= n <= LIMIT for n in amounts):
            raise ValueError("Gli importi devono essere centesimi interi tra 0 e 100000000")
        aliases = row.get("aliases", [])
        if not isinstance(aliases, list) or any(
            not isinstance(a, str) or not a.strip() or a != a.strip() for a in aliases
        ):
            raise ValueError("Alias non validi")
        for name in [row["zone"], *aliases]:
            lookup = (row["region"], name)
            if lookup in names:
                raise ValueError("Nome o alias ambiguo: " + str(lookup))
            names.add(lookup)
    return rows


def create_database(connection, rows):
    validate(rows)
    connection.executescript("""
        PRAGMA foreign_keys = ON;
        PRAGMA user_version = 1;
        CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
        CREATE TABLE bands (
            id INTEGER PRIMARY KEY CHECK(id BETWEEN 0 AND 6),
            lower_q INTEGER NOT NULL,
            upper_q INTEGER NOT NULL CHECK(upper_q > lower_q),
            mode TEXT NOT NULL CHECK(mode IN ('flat', 'per_q'))
        );
        CREATE TABLE zones (
            id INTEGER PRIMARY KEY,
            position INTEGER NOT NULL UNIQUE,
            region TEXT NOT NULL,
            zone TEXT NOT NULL,
            supplement_cents INTEGER CHECK(supplement_cents IS NULL OR (
                typeof(supplement_cents) = 'integer'
                AND supplement_cents BETWEEN 0 AND 100000000)),
            aliases_present INTEGER NOT NULL CHECK(aliases_present IN (0, 1)),
            UNIQUE(region, zone)
        );
        CREATE TABLE rates (
            zone_id INTEGER NOT NULL REFERENCES zones(id),
            band_id INTEGER NOT NULL REFERENCES bands(id),
            cents INTEGER NOT NULL CHECK(
                typeof(cents) = 'integer' AND cents BETWEEN 0 AND 100000000),
            PRIMARY KEY(zone_id, band_id)
        );
        CREATE TABLE aliases (
            zone_id INTEGER NOT NULL REFERENCES zones(id),
            position INTEGER NOT NULL,
            name TEXT NOT NULL,
            PRIMARY KEY(zone_id, position),
            UNIQUE(zone_id, name)
        );
        CREATE INDEX zones_lookup ON zones(region, zone);
        CREATE VIEW tariff_table AS
            SELECT z.position, z.region, z.zone, b.id AS band_index,
                   b.lower_q, b.upper_q, b.mode, r.cents,
                   COALESCE(z.supplement_cents, 0) AS supplement_cents
            FROM zones z JOIN rates r ON r.zone_id = z.id
                         JOIN bands b ON b.id = r.band_id;
    """)
    connection.executemany("INSERT INTO bands VALUES (?, ?, ?, ?)", BANDS)
    digest = hashlib.sha256(json.dumps(rows, ensure_ascii=False, sort_keys=True,
                                       separators=(",", ":")).encode("utf-8")).hexdigest()
    connection.executemany("INSERT INTO metadata VALUES (?, ?)", [
        ("currency", "EUR"), ("weight_unit", "quintale_100_kg"),
        ("source", "tariffs.json"), ("source_sha256", digest),
        ("status", "existing_repository_tariffs_not_new_supplier_files"),
    ])
    for pos, row in enumerate(rows):
        zone_id = pos + 1
        connection.execute("INSERT INTO zones VALUES (?, ?, ?, ?, ?, ?)",
                           (zone_id, pos, row["region"], row["zone"],
                            row.get("supplementCents"), int("aliases" in row)))
        connection.executemany("INSERT INTO rates VALUES (?, ?, ?)",
                               [(zone_id, i, n) for i, n in enumerate(row["cents"])])
        connection.executemany("INSERT INTO aliases VALUES (?, ?, ?)",
                               [(zone_id, i, name) for i, name in enumerate(row.get("aliases", []))])
    connection.commit()
    if connection.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
        raise ValueError("Archivio SQLite non integro")
    if connection.execute("PRAGMA foreign_key_check").fetchall():
        raise ValueError("Collegamenti SQLite non validi")


def export_rows(connection):
    rows = []
    for zid, region, zone, supplement, has_aliases in connection.execute(
        "SELECT id, region, zone, supplement_cents, aliases_present FROM zones ORDER BY position"
    ):
        rates = connection.execute(
            "SELECT band_id, cents FROM rates WHERE zone_id = ? ORDER BY band_id", (zid,)
        ).fetchall()
        if [r[0] for r in rates] != list(range(7)):
            raise ValueError("Fasce mancanti per " + zone)
        row = {"region": region, "zone": zone, "cents": [r[1] for r in rates]}
        if supplement is not None:
            row["supplementCents"] = supplement
        if has_aliases:
            row["aliases"] = [r[0] for r in connection.execute(
                "SELECT name FROM aliases WHERE zone_id = ? ORDER BY position", (zid,))]
        rows.append(row)
    return validate(rows)


def render_app(source, rows):
    declaration = "const TARIFFS=" + json.dumps(rows, ensure_ascii=False) + ";"
    pattern = r"(?m)^const TARIFFS=\[.*\];$"
    if len(re.findall(pattern, source)) != 1:
        raise ValueError("Dichiarazione TARIFFS non trovata o ambigua: aggiornamento annullato")
    return re.sub(pattern, lambda _: declaration, source, count=1)


def render_sw(source, rows):
    digest = hashlib.sha256(json.dumps(rows, ensure_ascii=False, sort_keys=True,
                                       separators=(",", ":")).encode("utf-8")).hexdigest()[:16]
    pattern = r"(?m)^const CACHE='[^']+';$"
    if len(re.findall(pattern, source)) != 1:
        raise ValueError("Versione cache non riconosciuta: aggiornamento annullato")
    return re.sub(pattern, "const CACHE='stc-logistics-tariffs-" + digest + "';", source, count=1)


def build(root=ROOT):
    source = json.loads((root / "tariffs.json").read_text(encoding="utf-8-sig"))
    validate(source)
    app_path, sw_path = root / "app.js", root / "sw.js"
    old_app = app_path.read_text(encoding="utf-8")
    old_sw = sw_path.read_text(encoding="utf-8")
    out = root / "build"
    out.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(dir=out) as temp:
        database = Path(temp) / "listino.sqlite"
        with closing(sqlite3.connect(database)) as connection:
            create_database(connection, source)
            rows = export_rows(connection)
            if rows != source:
                raise ValueError("La conversione SQLite ha alterato i dati")
        new_app = render_app(old_app, rows)
        candidate_sw = render_sw(old_sw, rows)
        new_sw = candidate_sw if new_app != old_app else old_sw
        web_export = json.dumps(rows, ensure_ascii=False, indent=2)
        database.replace(out / "listino.sqlite")
        (out / "tariffs.json").write_text(web_export, encoding="utf-8")
    for path, old, new in ((app_path, old_app, new_app), (sw_path, old_sw, new_sw)):
        if old != new:
            path.write_text(new, encoding="utf-8", newline="\n")
    print(f"Verificate {len(rows)} zone e {len(rows) * 7} tariffe. SQLite: {out / 'listino.sqlite'}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
    build(parser.parse_args().root)
