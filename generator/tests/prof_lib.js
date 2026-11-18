// Model biaya Apps Script (perkiraan kasar ms per panggilan layanan) untuk profiling di mock
const COST = { getValues: 60, getValuesCell: 0.004, setValues: 90, getSheetByName: 15, getLastRow: 25, getLastColumn: 25, appendRow: 120, prop: 25, cacheGet: 12, cachePut: 20, lock: 30, base: 120 };
function instrument(ctx, sheets) {
  const st = { ms: 0, ops: {} }; const add = (k, ms) => { st.ms += ms; st.ops[k] = (st.ops[k] || 0) + 1; };
  const any = Object.values(sheets)[0]; const S = Object.getPrototypeOf(any), R = Object.getPrototypeOf(any.getRange(1, 1));
  for (const [o, k, c] of [[S, 'getLastRow', 'getLastRow'], [S, 'getLastColumn', 'getLastColumn'], [S, 'appendRow', 'appendRow'], [R, 'setValues', 'setValues']]) { const f = o[k]; o[k] = function (...a) { add(c, COST[c]); return f.apply(this, a); }; }
  const gv = R.getValues; R.getValues = function () { add('getValues', COST.getValues + this.nr * this.nc * COST.getValuesCell); return gv.call(this); };
  const ss = ctx.SpreadsheetApp.getActiveSpreadsheet(); const gs = ss.getSheetByName; ss.getSheetByName = n => { add('getSheetByName', COST.getSheetByName); return gs(n); };
  const P = ctx.PropertiesService.getScriptProperties(); const gp = ctx.PropertiesService.getScriptProperties; ctx.PropertiesService.getScriptProperties = () => { const p = gp(); return { getProperty: k => { add('prop', COST.prop); return p.getProperty(k); }, setProperty: (k, v) => { add('prop', COST.prop); return p.setProperty(k, v); }, deleteProperty: k => p.deleteProperty(k) }; };
  const gc = ctx.CacheService.getScriptCache; ctx.CacheService.getScriptCache = () => { const c = gc(); return { get: k => { add('cacheGet', COST.cacheGet); return c.get(k); }, getAll: ks => { add('cacheGet', COST.cacheGet); return c.getAll(ks); }, put: (k, v, t) => { add('cachePut', COST.cachePut); return c.put(k, v, t); }, putAll: (o, t) => { add('cachePut', COST.cachePut); return c.putAll && c.putAll(o, t); }, remove: k => c.remove && c.remove(k) }; };
  return { measure(fn) { st.ms = COST.base; st.ops = {}; const t = Date.now(); let r, err; try { r = fn(); } catch (e) { err = e; } const real = Date.now() - t; const out = { model: Math.round(st.ms), cpu: real, ops: { ...st.ops } }; if (err) throw err; return [r, out]; } };
}
module.exports = { instrument, COST };
