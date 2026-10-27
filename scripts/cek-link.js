// Membuka link survei seperti responden di HP (tanpa login Google) lalu melaporkan apa yang tampil.
const pw = require('playwright');
const U = process.env.LINK || 'https://script.google.com/macros/s/AKfycbzfKRzS_qZhPjaH9CrXr-l-afFfX-7QCerSDxc5aIDemYNpuHWA5xWVmaMwxGQUZ9IaoQ/exec?survei=v1';
const note = (m) => console.log('::warning::' + String(m).replace(/\n/g, ' ').slice(0, 900));
(async () => {
  for (const [nm, eng, dev] of [['android', 'chromium', 'Pixel 7'], ['iphone', 'webkit', 'iPhone 13']]) {
    const b = await pw[eng].launch(); const ctx = await b.newContext({ ...pw.devices[dev] }); const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    try {
      await p.goto(U, { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(8000);
      await p.screenshot({ path: nm + '_1.png' });
      const texts = []; for (const f of p.frames()) { try { texts.push(f.url().slice(0, 60) + ' => ' + (await f.evaluate(() => document.body ? document.body.innerText : '')).replace(/\s+/g, ' ').slice(0, 250)); } catch (e) { texts.push(f.url().slice(0, 60) + ' => (err ' + e.message.slice(0, 80) + ')'); } }
      note(nm + ' URL ' + p.url().slice(0, 120)); texts.forEach(t => note(nm + ' FRAME ' + t));
      // coba klik setuju + Mulai
      const f = p.frames().find(x => /googleusercontent/.test(x.url()) && x !== p.mainFrame()) || p.mainFrame();
      const fr = p.frames()[p.frames().length - 1];
      try { await fr.locator('label.opt').first().click({ timeout: 5000 }); await fr.locator('#next').click({ timeout: 5000 }); await p.waitForTimeout(3000); note(nm + ' SETELAH MULAI ' + (await fr.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').slice(0, 200)); } catch (e) { note(nm + ' klik gagal: ' + e.message.slice(0, 150)); }
      await p.screenshot({ path: nm + '_2.png' });
    } catch (e) { note(nm + ' GAGAL ' + e.message.slice(0, 200)); }
    errs.slice(0, 6).forEach(x => note(nm + ' ' + x));
    await b.close();
  }
})();
