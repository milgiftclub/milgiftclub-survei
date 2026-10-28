const fs = require('fs'), path = require('path'); const { makeEnv } = require('../gsmock');
module.exports = function load() {
  const st = JSON.parse(fs.readFileSync(path.join(__dirname, 'sim_state.json'), 'utf8'), (k, v) => typeof v === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z$/.test(v) ? new Date(v) : v);
  const env = makeEnv(); const ss = env.ctx.SpreadsheetApp.getActiveSpreadsheet();
  for (const [k, d] of Object.entries(st.sheets)) { const sh = ss.getSheetByName(k) || ss.insertSheet(k); sh.d = d; }
  env.customId = st.customId; global.__viewer = 'robert@mildigital.id'; return env;
};
