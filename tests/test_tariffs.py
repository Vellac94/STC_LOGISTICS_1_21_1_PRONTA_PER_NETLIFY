import copy
import json
import sqlite3
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from build_tariffs import build, create_database, export_rows, render_app, validate


class TariffsTest(unittest.TestCase):
    def setUp(self):
        self.rows = json.loads((ROOT / "tariffs.json").read_text(encoding="utf-8"))

    def test_all_prices_survive_sqlite_and_browser_export(self):
        with sqlite3.connect(":memory:") as db:
            create_database(db, self.rows)
            exported = export_rows(db)
            self.assertEqual(exported, self.rows)
            self.assertEqual(db.execute("SELECT count(*) FROM tariff_table").fetchone()[0],
                             len(self.rows) * 7)
            for row in self.rows:
                actual = db.execute(
                    "SELECT cents FROM tariff_table WHERE region=? AND zone=? ORDER BY band_index",
                    (row["region"], row["zone"])).fetchall()
                self.assertEqual([r[0] for r in actual], row["cents"])

    def test_optional_fields_and_unicode(self):
        rows = [{"region": "REGIONE", "zone": "Città", "cents": [0, 1, 2, 3, 4, 5, 6],
                 "aliases": ["Cittadina"], "supplementCents": 123}]
        with sqlite3.connect(":memory:") as db:
            create_database(db, rows)
            self.assertEqual(export_rows(db), rows)

    def test_reject_invalid_input(self):
        cases = [[], {}, self.rows + [copy.deepcopy(self.rows[0])]]
        for field, value in [
            ("cents", [1] * 6), ("cents", [True] * 7),
            ("cents", [1.5] * 7), ("cents", [-1] * 7),
            ("cents", [100000001] * 7), ("supplementCents", "2,50"),
            ("region", ""), ("zone", "   "), ("aliases", ["VR", "VR"]),
            ("unknown_condition", 1),
        ]:
            row = copy.deepcopy(self.rows[0])
            row[field] = value
            cases.append([row])
        for rows in cases:
            with self.subTest(rows=str(rows)[:80]):
                with self.assertRaises(ValueError):
                    validate(rows)

    def test_alias_cannot_hide_another_zone(self):
        rows = copy.deepcopy(self.rows[:2])
        rows[0]["aliases"] = [rows[1]["zone"]]
        with self.assertRaises(ValueError):
            validate(rows)

    def test_only_tariff_declaration_changes(self):
        app = (ROOT / "app.js").read_text(encoding="utf-8")
        rows = copy.deepcopy(self.rows)
        rows[0]["cents"][0] += 1
        updated = render_app(app, rows)
        self.assertEqual(app.splitlines()[2:], updated.splitlines()[2:])
        self.assertIn('"cents": [' + str(rows[0]["cents"][0]), updated)
        with self.assertRaises(ValueError):
            render_app("const TARIFFS = [];", rows)

    def test_build_is_repeatable_and_invalid_input_leaves_outputs_intact(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            for name in ("app.js", "sw.js", "tariffs.json"):
                (root / name).write_bytes((ROOT / name).read_bytes())
            build(root)
            paths = ["app.js", "sw.js", "build/listino.sqlite", "build/tariffs.json"]
            before = {p: (root / p).read_bytes() for p in paths}
            build(root)
            self.assertEqual(before, {p: (root / p).read_bytes() for p in paths})
            changed = copy.deepcopy(self.rows)
            changed[0]["cents"][0] += 1
            (root / "tariffs.json").write_text(json.dumps(changed), encoding="utf-8")
            build(root)
            self.assertNotEqual(before["app.js"], (root / "app.js").read_bytes())
            self.assertNotEqual(before["sw.js"], (root / "sw.js").read_bytes())
            valid = {p: (root / p).read_bytes() for p in paths}
            (root / "tariffs.json").write_text("[]", encoding="utf-8")
            with self.assertRaises(ValueError):
                build(root)
            self.assertEqual(valid, {p: (root / p).read_bytes() for p in paths})


if __name__ == "__main__":
    unittest.main()
