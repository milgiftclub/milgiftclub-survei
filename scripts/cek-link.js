// Membuka link survei seperti responden di HP (tanpa login Google) lalu melaporkan apa yang tampil.
const pw = require('playwright');
const U = process.env.LINK || 'https://milgiftclub.github.io/milgiftclub-survei/';
const note = (m) => console.log('::warning::' + String(m).replace(/\n/g, ' ').slice(0, 900));
(async () => {
  const IG = ' Instagram 350.0.0.0 (iPhone14,5; iOS 17_0; id_ID; scale=3.00; 1170x2532) AppleWebKit/420+';
  for (const [nm, eng, dev, ig] of [['android', 'chromium', 'Pixel 7'], ['iphone', 'webkit', 'iPhone 13'], ['iphone-instagram', 'webkit', 'iPhone 13', 1]]) {
    const b = await pw[eng].launch(); const d = { ...pw.devices[dev] }; if (ig) d.userAgent += IG; const ctx = await b.newContext(d); const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    try {
      await p.goto(U, { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(8000);
      await p.screenshot({ path: nm + '_1.png' });
      const texts = []; for (const f of p.frames()) { try { texts.push(f.url().slice(0, 60) + ' => ' + (await f.evaluate(() => document.body ? document.body.innerText : '')).replace(/\s+/g, ' ').slice(0, 250)); } catch (e) { texts.push(f.url().slice(0, 60) + ' => (err ' + e.message.slice(0, 80) + ')'); } }
      note(nm + ' URL ' + p.url().slice(0, 120)); texts.forEach(t => note(nm + ' FRAME ' + t));
      // coba klik setuju + Mulai
      const f = p.frames().find(x => /googleusercontent/.test(x.url()) && x !== p.mainFrame()) || p.mainFrame();
      const fr = p.frames()[p.frames().length - 1];
      try { await fr.locator('label.opt').first().click({ timeout: 5000 }); await fr.locator('#next').click({ timeout: 5000 }); await p.waitForTimeout(1500);
        await fr.locator('#body input').fill('@cek_link_test', { timeout: 5000 }); await fr.locator('#next').click(); await p.waitForTimeout(6000); note(nm + ' SETELAH MULAI ' + (await fr.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').slice(0, 200)); } catch (e) { note(nm + ' klik gagal: ' + e.message.slice(0, 150)); }
      await p.screenshot({ path: nm + '_2.png' });
    } catch (e) { note(nm + ' GAGAL ' + e.message.slice(0, 200)); }
    errs.slice(0, 6).forEach(x => note(nm + ' ' + x));
    await b.close();
  }
})();
