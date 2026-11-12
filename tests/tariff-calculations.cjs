// Execute the actual calculator with the SQLite export used by the UI.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const rows = JSON.parse(fs.readFileSync('tariffs.json', 'utf8'));
const exported = JSON.parse(fs.readFileSync('build/tariffs.json', 'utf8'));
assert.deepEqual(exported, rows);
const app = fs.readFileSync('app.js', 'utf8');
const match = app.match(/^const TARIFFS=(\[.*\]);$/m);
assert.ok(match, 'Browser tariff declaration missing');
assert.deepEqual(JSON.parse(match[1]), exported);
const calc = vm.runInNewContext(fs.readFileSync('calc-engine.js', 'utf8') + '\nSTCCalc;');
let count = 0;
for (const row of exported) {
  for (let q = 1; q <= 50; q++) {
    const result = calc.compute({
      items: [], kg: q * 100, region: row.region, zone: row.zone,
      supp: '0', markupPercent: '0'
    }, exported);
    const band = q <= 3 ? 0 : q <= 10 ? 1 : q <= 15 ? 2 : q <= 20 ? 3
      : q <= 30 ? 4 : q <= 40 ? 5 : 6;
    assert.equal(result.valid, true);
    assert.equal(result.totalCents, (band === 0 ? row.cents[0] : row.cents[band] * q)
      + (row.supplementCents || 0));
    count++;
  }
  const over = calc.compute({items: [], kg: 5100, region: row.region, zone: row.zone}, exported);
  assert.equal(over.valid, false, 'Above 50 q requires a manual quote');
}
console.log(count + ' calculations verified against the SQLite export.');

const aliasRows = JSON.parse(JSON.stringify(exported));
aliasRows[0].aliases = ['ALIAS-VERIFICATO'];
const apply = app.slice(app.indexOf('function applySavedTariffs(){'),
                        app.indexOf('function syncCurrentZoneAliases(){'));
const actualAliases = vm.runInNewContext(
  'const TARIFFS=' + JSON.stringify(aliasRows) + ';'
  + 'const ORIGINAL_TARIFFS=TARIFFS.map(t=>({...t,cents:[...t.cents]}));'
  + 'const state={};'
  + 'function tariffKey(t){return t.region+"|"+(t.originalZone||t.zone)}'
  + 'function zoneLabelValid(v){return v}'
  + apply + '\napplySavedTariffs();JSON.stringify(TARIFFS[0].aliases);'
);
assert.ok(JSON.parse(actualAliases).includes('ALIAS-VERIFICATO'));
