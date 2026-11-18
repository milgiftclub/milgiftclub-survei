process.env.MOCK_CACHE = '1';
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const { makeEnv } = require('./gsmock'); const { instrument } = require('./prof_lib'); const { ctx, sheets } = makeEnv(); ctx.setup();
global.__owner = 'admin@mildigital.id'; global.__viewer = 'admin@mildigital.id';
let s = ctx.adminSimulasiMulai(); while (!s.selesai) s = ctx.adminSimulasiBatch(); ctx.snapBuild_ && ctx.snapBuild_();
console.log('jawaban simulasi:', Object.values(sheets).filter(x => /^Jawaban/.test(x.name)).map(x => x.name + '=' + (x.d.length - 1)).join(', '));
const I = instrument(ctx, sheets); const log = [];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1360, height: 900 } });
  let page = 'awal';
  await p.exposeFunction('gsCall', (fn, args) => { global.__viewer = 'admin@mildigital.id'; ctx.MEMO_ = null; ctx.CUSTOM_MEMO_ = null; ctx.SET_MEMO_ = null; try { const [r, m] = I.measure(() => ctx[fn](...JSON.parse(args))); log.push({ page, fn, ...m, kb: Math.round(JSON.stringify(r === undefined ? null : r).length / 1024) }); return JSON.stringify({ ok: r }); } catch (x) { log.push({ page, fn, err: x.message }); return JSON.stringify({ err: x.message }); } });
  await p.addInitScript(`window.google={script:{run:(function mk(ok,fail){return new Proxy({},{get(_,fn){if(fn==='withSuccessHandler')return f=>mk(f,fail);if(fn==='withFailureHandler')return f=>mk(ok,f);return (...a)=>window.gsCall(fn,JSON.stringify(a)).then(r=>{r=JSON.parse(r); if(r.err){fail&&fail(new Error(r.err))} else ok&&ok(r.ok)})}})})()}};`);
  await p.route('https://cdnjs.cloudflare.com/**', rt => rt.fulfill({ body: fs.readFileSync(path.join(path.dirname(require.resolve('chart.js')), 'chart.umd.js'), 'utf8'), contentType: 'application/javascript' }));
  await p.route('https://fonts.googleapis.com/**', rt => rt.fulfill({ body: '', contentType: 'text/css' }));
  const html = fs.readFileSync('../survey_out/Admin.html', 'utf8').replace('<?= userEmail ?>', 'admin@mildigital.id').replace('<?= userRole ?>', 'admin').replace('<?= userRoleLabel ?>', 'Admin');
  fs.writeFileSync(path.join(__dirname, 'admin_page_prof.html'), html);
  await p.goto('file://' + path.join(__dirname, 'admin_page_prof.html')); await p.waitForTimeout(3000);
  const navs = await p.$$eval('nav.side > button[data-p]', x => x.map(b => b.getAttribute('data-p')));
  for (const n of navs) { page = n; await p.click('nav.side > button[data-p="' + n + '"]'); await p.waitForTimeout(2500); }
  page = 'survei-utama'; await p.locator('#sv-list button').first().click(); await p.waitForTimeout(2500);
  page = 'survei-custom'; await p.locator('#sv-list button').nth(2).click(); await p.waitForTimeout(2500);
  await b.close(); fs.unlinkSync(path.join(__dirname, 'admin_page_prof.html'));
  const byPage = {}; log.forEach(l => { (byPage[l.page] = byPage[l.page] || []).push(l); });
  for (const [pg, ls] of Object.entries(byPage)) { const tot = ls.reduce((a, l) => a + (l.model || 0) + (l.cpu || 0), 0); console.log(`\n# ${pg}  ~${tot} ms (${ls.length} panggilan)`); ls.forEach(l => console.log(`   ${l.fn.padEnd(22)} model ${String(l.model).padStart(5)}ms cpu ${String(l.cpu).padStart(4)}ms ${String(l.kb).padStart(5)}KB ${l.err ? 'ERR ' + l.err : JSON.stringify(l.ops)}`)); }
  fs.writeFileSync('/tmp/claude-0/-home-claude/50b0d3e0-1ee4-51c7-ac80-d59da6a08266/scratchpad/prof/log.json', JSON.stringify(log));
})();
