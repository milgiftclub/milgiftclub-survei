// Minimal in-memory mock of the Apps Script services used by Code.gs
const vm = require('vm');
const fs = require('fs');

function makeEnv() {
  const sheets = {};
  function Sheet(name) {
    this.name = name; this.d = [];
  }
  Sheet.prototype = {
    setName(n) { delete sheets[this.name]; this.name = n; sheets[n] = this; return this; },
    getName() { return this.name; },
    getLastRow() { return this.d.length; },
    getLastColumn() { return this.d.reduce((m, r) => Math.max(m, r.length), 0); },
    appendRow(r) { this.d.push(r.slice()); return this; },
    setFrozenRows() { return this; }, setColumnWidth() { return this; },
    getMaxColumns() { return Math.max(26, this.getLastColumn()); }, insertColumnsAfter() { return this; }, deleteRow(n) { this.d.splice(n - 1, 1); return this; }, deleteRows(n, k) { this.d.splice(n - 1, k); return this; }, hideSheet() { this.hidden = true; return this; },
    clear() { this.d = []; return this; }, clearContents() { this.d = []; return this; }, hideSheet() { return this; },
    getRange(r, c, nr = 1, nc = 1) { return new Range(this, r, c, nr, nc); },
  };
  function Range(s, r, c, nr, nc) { Object.assign(this, { s, r, c, nr, nc }); }
  Range.prototype = {
    getValues() {
      const o = [];
      for (let i = 0; i < this.nr; i++) { const row = []; for (let j = 0; j < this.nc; j++) { const R = this.s.d[this.r - 1 + i] || []; const v = R[this.c - 1 + j]; row.push(v === undefined ? '' : v); } o.push(row); }
      return o;
    },
    getValue() { return this.getValues()[0][0]; },
    setValues(v) {
      if (v.length !== this.nr || v[0].length !== this.nc) throw new Error('setValues dim mismatch ' + v.length + 'x' + v[0].length + ' vs ' + this.nr + 'x' + this.nc);
      for (let i = 0; i < this.nr; i++) { const idx = this.r - 1 + i; while (this.s.d.length <= idx) this.s.d.push([]); for (let j = 0; j < this.nc; j++) this.s.d[idx][this.c - 1 + j] = v[i][j]; }
      return this;
    },
    setValue(v) { return this.setValues([[v]]); },
    clearContent() { for (let i = 0; i < this.nr; i++) { const R = this.s.d[this.r - 1 + i]; if (R) for (let j = 0; j < this.nc; j++) R[this.c - 1 + j] = ''; } while (this.s.d.length && this.s.d[this.s.d.length - 1].every(x => x === '' || x == null)) this.s.d.pop(); return this; }, setFontWeight() { return this; }, setNote(n) { (this.s.notes = this.s.notes || {})[this.r + ":" + this.c] = n; return this; }, getNote() { return (this.s.notes || {})[this.r + ":" + this.c] || ""; }, setBackground() { return this; }, setDataValidation() { return this; }, insertCheckboxes() { return this.setValue(false); }, setNumberFormat() { return this; }, getSheet() { return this.s; }, getRow() { return this.r; }, getColumn() { return this.c; },
  };
  const ss = {
    getId: () => 'SHEET123',
    getSheetByName: (n) => sheets[n] || null,
    insertSheet: (n) => (sheets[n] = new Sheet(n)),
    getSheets: () => Object.values(sheets),
    deleteSheet: (s) => { delete sheets[s.name]; },
  };
  sheets['Sheet1'] = new Sheet('Sheet1');
  const props = {};
  const dv = { requireValueInList() { return dv; }, build() { return {}; } };
  const ctx = {
    SpreadsheetApp: { getActiveSpreadsheet: () => ss, openById: () => ss, getUi: () => ({ alert() {}, createMenu() { const m = { addItem: () => m, addSeparator: () => m, addToUi: () => m }; return m; } }), newDataValidation: () => dv },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] || null, setProperty: (k, v) => { props[k] = v; }, deleteProperty: (k) => { delete props[k]; } }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, tryLock() { return true; }, releaseLock() {} }) },
    HtmlService: { XFrameOptionsMode: { ALLOWALL: 1 }, createTemplateFromFile: (f) => { const t = { file: f, evaluate() { const o = { file: f, vars: t, title: '' }; o.setTitle = (x) => { o.title = x; return o; }; o.addMetaTag = () => o; o.setXFrameOptionsMode = () => o; o.setSandboxMode = () => o; o.setFaviconUrl = () => o; return o; } }; return t; }, createHtmlOutputFromFile: (f) => ({ file: f, setTitle() { return this; }, addMetaTag() { return this; }, setXFrameOptionsMode() { return this; } }) }, Session: { getActiveUser: () => ({ getEmail: () => (global.__viewer || '') }) }, Utilities: { formatDate: (d, tz, f) => { const x = new Date(new Date(d).getTime() + 7*3600e3).toISOString(); return /HH/.test(f||'') ? x.slice(0,16).replace('T',' ') : /MMM/.test(f||'') ? x.slice(0,10) : x.slice(0,10); }, getUuid: () => 'abcd-1234-efgh-5678' }, ScriptApp: { getService: () => ({ getUrl: () => 'https://script.google.com/macros/s/AKfycbzf.../exec' }), getProjectTriggers: () => [], newTrigger: () => ({ timeBased: () => ({ everyHours: () => ({ create: () => ({}) }) }) }) }, UrlFetchApp: { fetch: (u, o) => { global.__aiReq = o; const r = global.__aiRes || { content: [{ type: 'text', text: '{}' }] }; return { getResponseCode: () => 200, getContentText: () => JSON.stringify(r) }; } }, ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (t) => ({ t, setMimeType() { return this; }, getContent() { return t; } }) }, Math, JSON, Date, Number, String, Object, Array,
  };
  // gzip/base64/blob & trigger (untuk snapshot Dashboard)
  const zlib = require('zlib');
  const blob = (buf) => ({ _b: Buffer.from(buf), getBytes() { return Array.from(this._b); }, getDataAsString() { return this._b.toString('utf8'); }, setContentType() { return this; } });
  Object.assign(ctx.Utilities, {
    newBlob: (d) => blob(typeof d === 'string' ? Buffer.from(d, 'utf8') : Buffer.from(d.map ? d.map(x => x & 255) : d)),
    gzip: (b) => blob(zlib.gzipSync(b._b)), ungzip: (b) => blob(zlib.gunzipSync(b._b)),
    base64Encode: (x) => Buffer.from(Array.isArray(x) ? x.map(v => v & 255) : x).toString('base64'),
    base64Decode: (s) => Array.from(Buffer.from(s, 'base64')).map(v => v > 127 ? v - 256 : v),
  });
  // CacheService: default tidak menyimpan apa pun (tes deterministik); MOCK_CACHE=1 untuk menguji cache sungguhan
  const cstore = {};
  ctx.CacheService = { getScriptCache: () => process.env.MOCK_CACHE ? { get: k => (k in cstore ? cstore[k] : null), getAll: ks => { const o = {}; ks.forEach(k => { if (k in cstore) o[k] = cstore[k]; }); return o; }, put: (k, v) => { if (String(v).length > 100000) throw new Error('too big'); cstore[k] = String(v); }, putAll: o => { Object.keys(o).forEach(k => { cstore[k] = String(o[k]); }); }, remove: k => { delete cstore[k]; } }
    : { get: () => null, getAll: () => ({}), put() {}, putAll() {}, remove() {} } };
  ctx.__cstore = cstore;
  const trig = [];
  Object.assign(ctx.ScriptApp, { getProjectTriggers: () => trig, newTrigger: (h) => { const b = { timeBased: () => b, everyMinutes: () => b, everyHours: () => b, create: () => { trig.push({ getHandlerFunction: () => h }); } }; return b; }, deleteTrigger: () => {} });
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(__dirname + '/../survey_out/Code.gs', 'utf8'), ctx);
  return { ctx, sheets };
}
module.exports = { makeEnv };
