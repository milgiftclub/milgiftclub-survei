// Uji Survei Profil wajib: responden baru diarahkan ke Survei Profil, lalu otomatis kembali ke survei pilihan tanpa isi data diri lagi
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'); const assert = require('assert');
process.env.MOCK_CACHE = '1';
const { makeEnv } = require('./gsmock'); const { ctx } = makeEnv(); ctx.setup(); global.__viewer = 'admin@mildigital.id'; global.__owner = 'admin@mildigital.id';
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Tidak', S1: '25-34 tahun', S2: 'Wanita', A1: 'DKI Jakarta' };
ctx.submitResponse({ sid: 'old1', variant: 'v1', answers: Object.assign({}, base, { Z2: '@lama', Z3: '081211110009' }) });   // responden lama, sudah punya profil
const live = ctx.adminBuilderSave({ name: 'Survei Live Shopping', target: 300, questions: [{ text: 'Seberapa sering kamu nonton live shopping?', type: 'single', options: [{ t: 'Sering' }, { t: 'Jarang' }] }] }, true);
// tugas sekali jalan membuat Survei Profil & mengaktifkan aturan
global.__viewer = ''; ctx.autoSnapshot(); global.__viewer = 'admin@mildigital.id';
const st = ctx.adminTugasStatus()['2026-11-26-survei-profil']; console.log('tugas:', JSON.stringify(st.hasil)); assert(st.ok);
ctx.SET_MEMO_ = null; ctx.CUSTOM_MEMO_ = null; const PID = ctx.set_('SURVEI_PROFIL'); assert(PID);
// server
let r = ctx.lookupIg('@baru', live.id); console.log('baru -> live:', JSON.stringify(r.profilDulu)); assert(r.profilDulu && r.profilDulu.v === PID);
r = ctx.lookupIg('@lama', live.id); console.log('lama -> live: known', r.known, 'gate', !!r.profilDulu); assert(r.known && !r.profilDulu);
r = ctx.lookupIg('@lama', PID); console.log('lama -> profil:', r.state); assert.strictEqual(r.state, 'sudah_profil');
let h = ctx.hubList('@baru'); console.log('hub baru: needProfil', h.needProfil, '| urutan:', h.list.map(x => x.name).join(' > ')); assert(h.needProfil && h.list[0].v === PID);
h = ctx.hubList('@lama'); console.log('hub lama: needProfil', h.needProfil, '| daftar:', h.list.map(x => x.name).join(' > ')); assert(!h.needProfil && !h.list.some(x => x.v === PID));
// UI
const root = path.join(__dirname, '../../site'); const SP = '/tmp/claude-0/-home-claude/50b0d3e0-1ee4-51c7-ac80-d59da6a08266/scratchpad/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('https://milgiftclub.github.io/**', rt => { let u = new URL(rt.request().url()).pathname.replace('/milgiftclub-survei', ''); if (u.endsWith('/')) u += 'index.html'; let body = fs.readFileSync(path.join(root, u), 'utf8');
    if (u.endsWith('config.js')) body = body.replace(/API_V1:\s*'[^']*'/, "API_V1: 'https://api.test/x'").replace(/API_V2:\s*'[^']*'/, "API_V2: 'https://api.test/x'");
    rt.fulfill({ body, contentType: u.endsWith('.js') ? 'application/javascript' : 'text/html' }); });
  await p.route('https://api.test/**', rt => { const q = JSON.parse(rt.request().postData()); global.__viewer = ''; ctx.MEMO_ = null; ctx.CUSTOM_MEMO_ = null; ctx.SET_MEMO_ = null; rt.fulfill({ contentType: 'application/json', body: ctx.webApi(q.fn, q.args) }); });
  await p.route('https://fonts.googleapis.com/**', rt => rt.abort());
  // 1. hub untuk akun baru
  await p.goto('https://milgiftclub.github.io/milgiftclub-survei/?ig=dina&ok=1'); await p.waitForSelector('.pf-b', { timeout: 15000 }); await p.waitForTimeout(500);
  await p.screenshot({ path: SP + 'profil_1_hub.png', fullPage: false });
  const cards = await p.$$eval('a.sv', x => x.map(a => a.querySelector('b').textContent + ' [' + a.querySelector('.go').textContent + ']')); console.log('kartu hub:', cards.join(' | '));
  // 2. buka Live Shopping langsung (bukan dari hub) -> diarahkan
  await p.goto(live.link.replace(/^.*\/s\//, 'https://milgiftclub.github.io/milgiftclub-survei/s/'));
  const clickNext = async () => { await p.click('#next'); await p.waitForTimeout(350); };
  const answerCur = async () => {
    const r = p, at = await p.evaluate(() => { if (window.__ST) window.__ST.start = Date.now() - 600000; return window.__ctl.at(); }); if (process.env.DBG) console.log('  at', at, (await p.$eval('#app', e => e.innerText.replace(/\s+/g, ' ').slice(0, 80)).catch(() => '')));
    if (at === 'Z2') { await r.waitForSelector('#body input', { timeout: 15000 }); await r.fill('#body input', '@dina'); }
    else if (at === 'Z3') { await r.fill('#body input', '081299990001'); await r.evaluate(() => { window.__ST.start = Date.now() - 600000; }); }
    else if (at === 'A1') { await r.fill('#body input', 'Surabaya'); await r.click('#body .opt >> nth=0'); }
    else if (await r.$('#body .scale')) await r.click('#body .scale button >> nth=3');
    else if (at === 'S0') await r.selectOption('#body select', '1995');
    else if (await r.$('#body select')) await r.selectOption('#body select', { index: 1 });
    else if (await r.$('#body input[type=radio]')) {
      const labels = await r.$$eval('#body .opt span', e => e.map(x => x.textContent));
      const pickT = labels.find(t => !/^(Di bawah 18|Tidak bersedia|Merah|Hijau|Kuning|Pria)/.test(t) && !/tidak pernah/i.test(t)) || labels[0];
      await r.click('#body .opt:has-text("' + (at === 'QC1' ? 'Biru' : pickT) + '") >> nth=0');
    } else if (await r.$('#body input[type=checkbox]')) {
      const labels = await r.$$eval('#body .opt span', e => e.map(x => x.textContent));
      const pickT = at === 'S3' ? labels.find(t => /^Tidak satu/.test(t)) : labels.find(t => !/^(Tidak|Lainnya)/.test(t)) || labels[0];
      await r.click('#body .opt:has-text("' + pickT + '") >> nth=0');
    } else if (await r.$('#body textarea')) await r.fill('#body textarea', 'jawaban');
    else if (await r.$('#body input[type=text]')) await r.fill('#body input', 'jawaban');
    return at;
  };
  await answerCur(); await clickNext(); await answerCur(); await clickNext(); await p.waitForTimeout(1200);
  const gateTxt = await p.textContent('.end'); console.log('gerbang:', gateTxt.replace(/\s+/g, ' ').slice(0, 170)); assert(/Satu langkah dulu/.test(gateTxt));
  await p.screenshot({ path: SP + 'profil_2_gerbang.png' });
  await p.click('.end a.cta'); await p.waitForTimeout(1500);
  console.log('di survei profil:', new URL(p.url()).searchParams.get('id') === PID, '| mulai di', await p.evaluate(() => window.__ctl.at()));
  const seen = []; for (let i = 0; i < 60; i++) { if (await p.$('.end')) break; const a = await answerCur(); seen.push(a); await clickNext(); if (a === 'Z2' || a === 'PV') await p.waitForTimeout(900); }
  console.log('pertanyaan profil:', seen.join(' '));
  await p.waitForSelector('#lanjut-go', { timeout: 10000 }); await p.screenshot({ path: SP + 'profil_3_selesai.png' });
  await p.waitForURL(/[?&]t=/, { timeout: 12000 }); await p.waitForTimeout(1500);
  console.log('kembali ke live shopping:', new URL(p.url()).searchParams.get('id') === live.id);
  const seen2 = []; for (let i = 0; i < 30; i++) { if (await p.$('.end')) break; const a = await answerCur(); seen2.push(a); await clickNext(); if (a === 'Z2' || a === 'PV') await p.waitForTimeout(1500); }
  console.log('pertanyaan di live shopping:', seen2.join(' ')); assert(!seen2.includes('PV') && !seen2.includes('S2') && !seen2.includes('A1') && !seen2.includes('Z3'), 'profil & WA tidak ditanya lagi');
  await p.screenshot({ path: SP + 'profil_4_live.png' });
  ctx.CUSTOM_MEMO_ = null; const tab = ctx.customById_(live.id).tab; const sh = ctx.SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tab); const d = sh.d; const hd = d[0], row = d[d.length - 1];
  console.log('baris live: ig', row[hd.indexOf('ig_normal')], '| wa', row[hd.indexOf('wa_normal')], '| S2', row[hd.indexOf('S2')], '| profil_dari_sebelumnya', row[hd.indexOf('profil_dari_survei_sebelumnya')], '| status', row[hd.indexOf('status')]);
  assert.strictEqual(row[hd.indexOf('ig_normal')], 'dina'); assert(row[hd.indexOf('S2')]);
  // survei utama (Semua Kategori) untuk akun baru lain -> juga diarahkan
  await p.goto('https://milgiftclub.github.io/milgiftclub-survei/semua/?ig=eko&ok=1'); await p.waitForSelector('#body input', { timeout: 15000 }); await p.fill('#body input', '@eko'); await p.click('#next'); await p.waitForTimeout(1500);
  const g2 = await p.textContent('#app'); console.log('semua kategori (akun baru):', /Satu langkah dulu/.test(g2)); assert(/Satu langkah dulu/.test(g2));
  const href = await p.getAttribute('.end a.cta', 'href'); console.log('  tombol ->', href.replace(/^.*\/s\//, 's/').slice(0, 150));
  // hub sesudahnya
  await p.goto('https://milgiftclub.github.io/milgiftclub-survei/?ig=dina&ok=1'); await p.waitForSelector('a.sv', { timeout: 15000 }); await p.waitForTimeout(800);
  console.log('hub sesudah: banner', !!(await p.$('.pf-b')), '|', (await p.$$eval('a.sv', x => x.map(a => a.querySelector('b').textContent))).join(' | '));
  console.log('JS errors:', errs); await b.close(); assert(!errs.length); console.log('OK profil_test');
})();
