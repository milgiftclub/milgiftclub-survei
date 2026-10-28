<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Survei MIL Gift Club</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
__STYLE__
<style>
  .sv{display:flex;gap:12px;align-items:center;background:var(--white);border:2px solid var(--line);border-radius:18px;padding:14px 16px;margin-top:12px;text-decoration:none;color:var(--brown)}
  .sv .t{flex:1;min-width:0} .sv b{display:block;font-size:16px} .sv small{display:block;color:var(--brown2);font-size:13px;line-height:1.45;margin-top:2px}
  .sv .m{font-size:12.5px;color:var(--brown2);margin-top:6px;font-weight:700} .sv .go{flex:none;background:var(--coral);color:#fff;font-weight:800;border-radius:14px;padding:10px 14px;font-size:14px}
  .sv.done{background:#F1EFEC;border-color:#E2DDD6;color:#9A928A;pointer-events:none} .sv.done b,.sv.done small{color:#9A928A} .sv.done .go{background:#D9D3CB;color:#7d756d}
  .kup{display:flex;gap:14px;align-items:center;background:var(--yellow-l);border:2px solid var(--yellow);border-radius:18px;padding:14px 16px;margin-top:14px;color:var(--brown)}
  .kup .kn{font-family:var(--display);font-size:30px;font-weight:700;flex:none} .kup p{margin:2px 0 0;font-size:14px;color:var(--brown2);line-height:1.45}
  .small{font-size:12.5px;color:var(--brown2);margin-top:14px;line-height:1.5} .small a{color:var(--coral-d);font-weight:800}
  .pr-r{display:flex;justify-content:space-between;gap:12px;border-top:1px dashed var(--line);padding:6px 0}
</style>
</head>
<body>
<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="blob b4"></div>
<header>
  <div class="logo">MIL Gift Club<span class="dot">.</span></div>
  <div class="tag">INSIGHT · COMMUNITY · REWARDS</div>
</header>
<main id="app"></main>
<nav id="nav"><div><button id="back" type="button" style="visibility:hidden">Kembali</button><button id="next" type="button">Mulai</button></div></nav>
<script src="config.js"></script>
<script>
var SK_HTML = __SK_JSON__;
(function () {
  var C = window.SURVEI_CONFIG || {}, T = C.TAMPILAN || {}, API = String(C.API_V1 || '').trim();
  var $ = function (id) { return document.getElementById(id); }, app = $('app'), nb = $('next'), bb = $('back');
  var esc = function (s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; };
  function qs(n) { var m = new RegExp('[?&]' + n + '=([^&#]*)').exec(location.search); return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : ''; }
  function api(fn, args) { return fetch(API, { method: 'POST', body: JSON.stringify({ fn: fn, args: args }) }).then(function (r) { return r.text(); }).then(function (t) { var j = JSON.parse(t); if (!j.ok) throw new Error(j.error || 'gagal'); return j.data; }); }
  var SRC = qs('src') || qs('utm_source') || 'langsung', CFG = {}, ST = { step: 'o1', ok: null, ig: '' };
  try { var sv = JSON.parse(sessionStorage.getItem('milhub') || 'null'); if (sv) ST = sv; } catch (e) {}
  if (qs('ig')) { ST.ig = '@' + qs('ig').replace(/^@/, ''); if (qs('ok') === '1') { ST.ok = true; ST.step = 'list'; } }
  function save() { try { sessionStorage.setItem('milhub', JSON.stringify(ST)); } catch (e) {} }
  var IGH = function () { return CFG.ig || T.IG_HANDLE || '@milgiftclub'; };
  function skBox() {
    var b = SK_HTML.replace(/\{IG\}/g, esc(IGH())).replace(/\{MINTAG\}/g, esc(CFG.minTag || 3)).replace(/\{SUSP\}/g, esc(CFG.suspendBulan || 6))
      .replace(/\{EMAIL\}/g, esc(CFG.emailAkses || 'milgiftclub@gmail.com')).replace(/\{CEK\}/g, 'cek/');
    return '<div class="skbox"><div class="skh">📜 Syarat &amp; Ketentuan Giveaway</div><div class="skc">' + b + '</div><div class="skf">Dengan memilih bersedia mengikuti survei, kamu dianggap telah membaca dan menyetujui Syarat &amp; Ketentuan di atas.</div></div>';
  }
  function promo() {
    var r = '', hd = CFG.hadiah || [];
    if (CFG.periodeLabel) r += '<div class="pr-l">' + esc(CFG.periodeLabel) + '</div>';
    if (CFG.hadiahUtama) r += '<div class="pr-u"><span>🎁 Hadiah utama</span><b>' + esc(CFG.hadiahUtama) + '</b></div>';
    if (hd.length) r += '<div class="pr-s">Hadiah lainnya</div><ul>' + hd.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    if (CFG.periode) r += '<div class="pr-r"><span>📅 Periode Giveaway</span><b>' + esc(CFG.periode) + '</b></div>';
    if (CFG.announce) r += '<div class="pr-r"><span>🏆 Pengumuman Pemenang</span><b>' + esc(CFG.announce) + '</b></div>';
    return r ? '<div class="promo">' + r + '</div>' : '';
  }
  function render() {
    save(); window.scrollTo(0, 0); bb.style.visibility = ST.step === 'o1' ? 'hidden' : 'visible'; nb.style.display = ST.step === 'list' ? 'none' : ''; bb.textContent = ST.step === 'list' ? 'Ganti akun' : 'Kembali';
    if (ST.step === 'o1') {
      nb.textContent = 'Mulai';
      app.innerHTML = '<div class="section">Selamat datang</div>' + promo() +
        '<p class="intro">Terima kasih sudah mau berbagi pengalaman belanja online kamu. Setelah setuju, kamu bisa memilih survei yang ingin diisi. <b>Setiap survei yang diisi valid = 1 kupon undian</b>, jadi makin banyak survei, makin besar peluang menang.</p>' +
        '<h1>Apakah Anda bersedia mengikuti survei ini?</h1>' + skBox() + '<div id="body"><div class="opts">' +
        ['Ya, saya setuju dan bersedia mengikuti survei', 'Tidak bersedia'].map(function (t, i) { return '<label class="opt' + (ST.ok === (i === 0) ? ' on' : '') + '" data-i="' + i + '"><input type="radio" name="o1"' + (ST.ok === (i === 0) ? ' checked' : '') + '><span>' + t + '</span></label>'; }).join('') + '</div></div><div class="err" id="err"></div>';
      [].forEach.call(app.querySelectorAll('label.opt'), function (l) { l.onclick = function (e) { e.preventDefault(); ST.ok = l.dataset.i === '0'; [].forEach.call(app.querySelectorAll('label.opt'), function (x) { x.classList.toggle('on', x === l); x.querySelector('input').checked = x === l; }); $('err').textContent = ''; }; });
    } else if (ST.step === 'ig') {
      nb.textContent = 'Lanjut';
      app.innerHTML = '<div class="section">Akun kamu</div><h1>Tuliskan username Instagram Anda</h1><p class="hint">Dipakai untuk melihat survei mana yang sudah kamu isi, menghitung kupon, dan verifikasi giveaway.</p>' +
        '<div id="body"><input type="text" id="igv" placeholder="@usernamekamu" autocomplete="off" value="' + esc(ST.ig) + '"></div><div class="err" id="err"></div><div class="wait" id="wait"></div>';
      $('igv').onkeydown = function (e) { if (e.key === 'Enter') next(); };
    } else if (ST.step === 'bye') {
      nb.style.display = 'none'; bb.style.visibility = 'visible';
      app.innerHTML = '<div class="section">Terima kasih</div><h1>Tidak apa-apa 😊</h1><p class="intro">Terima kasih sudah mampir. Kalau berubah pikiran, kamu bisa kembali kapan saja. Pantau Instagram ' + esc(IGH()) + ' untuk survei & giveaway berikutnya.</p>';
    } else list();
  }
  function list() {
    app.innerHTML = '<div class="section">Pilih survei</div><h1>Halo ' + esc(ST.ig) + '! Survei mana yang mau kamu isi?</h1><div class="wait on"><i></i><span>Memuat daftar survei…</span></div>';
    api('hubList', [ST.ig]).then(function (d) {
      if (d.blocked) { app.innerHTML = '<div class="section">Akun dibatasi</div><h1>Akun ' + esc(d.ig) + ' sedang ' + (d.blocked.state === 'suspend' ? 'disuspend' : 'diblokir') + '</h1><p class="intro">Karena riwayat jawaban yang tidak valid' + (d.blocked.until ? ', sampai ' + esc(d.blocked.until) : '') + '. Hubungi ' + esc(d.blocked.email) + ' untuk membuka akses.</p>'; return; }
      var todo = d.list.filter(function (x) { return !x.done; }).length;
      var h = '<div class="section">Pilih survei</div><h1>Halo ' + esc(d.ig) + '! Survei mana yang mau kamu isi?</h1>' +
        '<div class="kup"><div class="kn">🎟️ ' + d.kupon + '</div><div><b>Kupon undian kamu di ' + esc(d.periode || 'periode ini') + '</b><p>' + (todo ? 'Masih ada <b>' + todo + ' survei</b> yang bisa kamu isi untuk menambah kupon.' : 'Kamu sudah mengisi semua survei yang sedang dibuka. Terima kasih!') + '</p></div></div>';
      h += d.list.map(function (x) {
        var u = x.link + (x.link.indexOf('?') < 0 ? '?' : '&') + 'ig=' + encodeURIComponent(d.ig.replace(/^@/, '')) + '&ok=1&src=' + encodeURIComponent(SRC);
        return '<a class="sv' + (x.done ? ' done' : '') + '" href="' + esc(u) + '"><div class="t"><b>' + (x.done ? '✓ ' : '') + esc(x.name) + '</b><small>' + esc(x.desc) + '</small>' +
          '<div class="m">' + (x.done ? 'Sudah diisi' + (x.valid ? '' : ' · tidak valid') : '±' + x.est + ' menit · +1 kupon') + '</div></div><span class="go">' + (x.done ? '✓ Selesai' : 'Mulai →') + '</span></a>';
      }).join('') + (d.list.length ? '' : '<p class="intro">Belum ada survei yang dibuka. Pantau Instagram ' + esc(IGH()) + ' ya!</p>');
      h += '<p class="small">Bukan akun kamu? Klik "Ganti akun" di bawah. · <a href="cek/?ig=' + encodeURIComponent(d.ig.replace(/^@/, '')) + '">🔎 Cek status giveaway</a></p>';
      app.innerHTML = h;
    }, function () { app.innerHTML = '<div class="err">Koneksi bermasalah. <a href="#" onclick="location.reload();return false">Coba lagi</a></div>'; });
  }
  function next() {
    if (ST.step === 'o1') { if (ST.ok == null) { $('err').textContent = 'Pilih salah satu jawaban dulu ya.'; return; } ST.step = ST.ok ? 'ig' : 'bye'; return render(); }
    if (ST.step === 'ig') {
      var v = $('igv').value.trim(); if (!/^@?[A-Za-z0-9._]{1,30}$/.test(v)) { $('err').textContent = 'Format username Instagram belum sesuai (contoh: @namaanda).'; return; }
      ST.ig = '@' + v.replace(/^@/, ''); ST.step = 'list'; return render();
    }
  }
  nb.onclick = next;
  bb.onclick = function () { ST.step = ST.step === 'list' ? 'ig' : 'o1'; render(); };
  render();
  if (API) api('config', ['v1', SRC]).then(function (c) { CFG = c; if (ST.step === 'o1') render(); }, function () {});
})();
</script>
</body>
</html>
