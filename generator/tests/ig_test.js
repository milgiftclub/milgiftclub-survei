// Uji: sambung Instagram (Graph API tiruan), sinkron komentar, status giveaway, undian wajib komentar, halaman /cek/
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'); const assert = require('assert');
const { makeEnv } = require('./gsmock'); const { ctx } = makeEnv(); ctx.setup();
const SP = process.env.SHOTS || require('os').tmpdir() + '/', ROOT = path.join(__dirname, '..', '..', 'site');
const G = (u) => {
  if (/me\/accounts/.test(u)) return { data: [{ name: 'MIL Gift Club', access_token: 'PAGE_TOKEN', instagram_business_account: { id: '1784', username: 'milgiftclub' } }] };
  if (/1784\/media/.test(u)) return { data: [{ id: 'M1', shortcode: 'GIVE01', permalink: 'https://www.instagram.com/p/GIVE01/' }, { id: 'M2', shortcode: 'OTHER' }] };
  if (/M1\/comments/.test(u) && !/after=/.test(u)) return { data: [
    { id: 'c1', username: 'rina', text: 'Ikutan! @a @b @c', timestamp: '2026-10-28T03:00:00+0000', replies: { data: [{ id: 'r1', username: 'budi', text: '@milgiftclub @x', timestamp: '2026-10-28T03:05:00+0000' }] } },
    { id: 'c2', username: 'dodi', text: 'mau @k @l', timestamp: '2026-10-28T03:10:00+0000' }], paging: { next: 'https://graph.facebook.com/v21.0/M1/comments?after=2' } };
  if (/after=2/.test(u)) return { data: [{ id: 'c3', username: 'sari', text: '@p1 @p2 @p3 @p4 semoga menang', timestamp: '2026-10-28T04:00:00+0000' }] };
  return { error: { message: 'unknown ' + u } };
};
ctx.UrlFetchApp = { fetch: (u) => ({ getContentText: () => JSON.stringify(G(u)), getResponseCode: () => 200 }) };
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Tidak', S1: '25-34 tahun', S2: 'Wanita' };
[['rina', 'Biru'], ['dodi', 'Biru'], ['budi', 'Merah'], ['eko', 'Biru']].forEach(([u, qc], i) => ctx.submitResponse({ sid: 's' + i, variant: 'v1', answers: Object.assign({}, base, { Z2: '@' + u, Z3: '08123000000' + i, QC1: qc }) }));
global.__viewer = 'robert@mildigital.id';
let st = ctx.adminIgConnect('USER_TOKEN'); assert(st.connected && st.username === 'milgiftclub');
ctx.adminSaveSettings({ IG_POST_GIVEAWAY: 'https://www.instagram.com/p/GIVE01/?igsh=abc' });
st = ctx.adminIgSync(); console.log('sync:', st.lastMsg, '| komentar', st.comments);
const S = (u) => ctx.giveawayStatus(u);
const r = S('@rina'), d = S('dodi'), b = S('budi'), x = S('nobody');
console.log('rina', r.surveyOk, r.komentar, r.eligible); console.log('dodi', d.komentar, d.eligible); console.log('budi', b.surveys[0].reason, b.komentar, b.eligible); console.log('nobody', x.surveys.length, x.komentar.state);
assert(r.eligible && r.komentar.state === 'ok' && r.komentar.n === 3);
assert(d.komentar.state === 'kurang' && d.komentar.n === 2 && !d.eligible);
assert(!b.surveyOk && /Biru/.test(b.surveys[0].reason) && b.komentar.n === 1, 'tag ke akun sendiri tidak dihitung');
assert(S('eko').komentar.state === 'belum');
assert.strictEqual(ctx.adminEligible('all').count, 3);
ctx.adminSaveSettings({ SYARAT_KOMENTAR_WAJIB: true }); ctx.SET_MEMO_ = null;
const el = ctx.adminEligible('all'); console.log('eligible wajib komentar:', el.count, el.rows.map(r => r[1]));
assert.strictEqual(el.count, 1);
(async () => {
  const bz = await chromium.launch(); const p = await (await bz.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('https://survei.test/**', rt => { let u = new URL(rt.request().url()).pathname; if (u.endsWith('/')) u += 'index.html'; let body = fs.readFileSync(path.join(ROOT, u), 'utf8'); if (u.endsWith('config.js')) body = body.replace(/https:\/\/script[^']*/g, 'https://api.test/exec'); rt.fulfill({ body, contentType: u.endsWith('.js') ? 'application/javascript' : 'text/html' }); });
  await p.route('https://api.test/**', rt => { const out = ctx.doPost({ postData: { contents: rt.request().postData() } }); rt.fulfill({ body: out.getContent(), contentType: 'application/json', headers: { 'access-control-allow-origin': '*' } }); });
  await p.route('https://fonts.googleapis.com/**', rt => rt.abort());
  for (const u of ['dodi', 'rina', 'budi']) {
    await p.goto('https://survei.test/cek/?ig=' + u); await p.waitForTimeout(900);
    console.log('cek', u, ':', (await p.$eval('#out', e => e.innerText)).replace(/\s+/g, ' ').slice(0, 230));
    await p.screenshot({ path: SP + 'cek_' + u + '.png', fullPage: true });
  }
  console.log('JS errors:', errs); await bz.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
