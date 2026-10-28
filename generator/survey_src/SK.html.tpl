<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Syarat & Ketentuan Giveaway — MIL Gift Club</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
__STYLE__
<style>
  .now{background:var(--yellow-l);border:2px solid var(--yellow);border-radius:18px;padding:14px 16px;margin-top:14px;font-size:14.5px;line-height:1.55;color:var(--brown)}
  .now b.t{font-family:var(--display);font-size:17px;display:block;margin-bottom:6px}
  .now .r{display:flex;justify-content:space-between;gap:12px;border-top:1px dashed var(--line);padding:6px 0} .now .r:first-of-type{border-top:0}
  #skb .sk{background:var(--white);border:2px solid var(--line);border-radius:18px;padding:6px 18px 12px;margin-top:14px}
  .small{font-size:12.5px;color:var(--brown2);margin-top:14px;line-height:1.5}
  .sk a,.small a,.now a{color:var(--coral-d);font-weight:800}
</style>
</head>
<body>
<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="blob b4"></div>
<header>
  <div class="logo">MIL Gift Club<span class="dot">.</span></div>
  <div class="tag">INSIGHT · COMMUNITY · REWARDS</div>
</header>
<main>
  <div class="section">Giveaway</div>
  <h1>Syarat &amp; Ketentuan Giveaway</h1>
  <p class="intro">Dengan mengisi survei dan mengikuti giveaway MIL Gift Club, peserta dianggap telah membaca dan menyetujui seluruh Syarat &amp; Ketentuan berikut.</p>

  <div class="now" id="now"><b class="t">Periode yang sedang berjalan</b><div class="r"><span>Memuat informasi periode…</span></div></div>

  <div id="skb">__SK_BODY__</div>
  <p class="small">Terakhir diperbarui: 28 Oktober 2026.</p>
</main>
<script src="../config.js"></script>
<script>
(function () {
  var C = window.SURVEI_CONFIG || {}, T = C.TAMPILAN || {}, API = String(C.API_V1 || '').trim();
  var esc = function (s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; };
  var SKSRC = document.getElementById('skb').innerHTML;
  function fillSk(c) {
    var ig = c.ig || T.IG_HANDLE || '@milgiftclub';
    document.getElementById('skb').innerHTML = SKSRC.replace(/\{IG\}/g, esc(ig)).replace(/\{MINTAG\}/g, esc(c.minTag || 3)).replace(/\{SUSP\}/g, esc(c.suspendBulan || 6))
      .replace(/\{EMAIL\}/g, esc(c.emailAkses || 'milgiftclub@gmail.com')).replace(/\{CEK\}/g, '../cek/');
  }
  fillSk({});
  function show(c) {
    var r = function (k, v) { return v ? '<div class="r"><span>' + k + '</span><b>' + esc(v) + '</b></div>' : ''; };
    var hd = c.hadiah || [];
    var h = '<b class="t">' + esc(c.periodeLabel || 'Periode yang sedang berjalan') + '</b>' + r('📅 Periode Giveaway', c.periode) + r('🏆 Pengumuman Pemenang', c.announce) +
      r('🎁 Hadiah utama', c.hadiahUtama) + (hd.length ? '<div class="r"><span>Hadiah lainnya</span><b style="text-align:right">' + hd.map(esc).join('<br>') + '</b></div>' : '');
    document.getElementById('now').innerHTML = h;
    fillSk(c);
  }
  if (!API) { document.getElementById('now').style.display = 'none'; return; }
  fetch(API, { method: 'POST', body: JSON.stringify({ fn: 'config', args: ['v1', 'sk'] }) }).then(function (x) { return x.text(); }).then(function (t) {
    var j = JSON.parse(t); if (!j.ok) throw 0; show(j.data);
  }).catch(function () { document.getElementById('now').innerHTML = '<b class="t">Periode yang sedang berjalan</b><div class="r"><span>Lihat informasi periode, hadiah, dan tanggal pengumuman pada halaman survei atau Instagram ' + esc(T.IG_HANDLE || '@milgiftclub') + '.</span></div>'; });
})();
</script>
</body>
</html>
