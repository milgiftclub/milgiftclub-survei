<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cek Status Giveaway — MIL Gift Club</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
__STYLE__
<style>
  .ck{background:var(--white);border:2px solid var(--line);border-radius:18px;padding:16px;margin-top:14px}
  .ck h2{font-family:var(--display);font-size:18px;margin:0 0 10px;color:var(--brown)}
  .it{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-top:1px dashed var(--line)} .it:first-of-type{border-top:0}
  .ic{font-size:20px;line-height:1.2;flex:none;width:26px;text-align:center}
  .it b{display:block;color:var(--brown)} .it p{margin:2px 0 0;color:var(--brown2);font-size:14px;line-height:1.45}
  .verdict{border-radius:18px;padding:16px;margin-top:14px;font-weight:800;line-height:1.45}
  .verdict.ok{background:#E7F5EC;color:#22663F;border:2px solid #9fd6b3} .verdict.no{background:var(--yellow-l);color:var(--brown);border:2px solid var(--yellow)}
  .row2{display:flex;gap:8px;margin-top:10px} .row2 input{flex:1} .row2 button{flex:none;font:inherit;font-weight:800;border:0;border-radius:16px;padding:0 20px;background:var(--coral);color:#fff;cursor:pointer}
  .kp{display:inline-block;background:#E7F5EC;color:#22663F;border-radius:999px;padding:0 8px;font-size:12px;font-weight:800}
  .kupon{display:flex;gap:14px;align-items:center;background:var(--yellow-l);border:2px solid var(--yellow);border-radius:18px;padding:14px 16px;margin-top:14px;color:var(--brown)}
  .kupon .kn{font-family:var(--display);font-size:30px;font-weight:700;flex:none} .kupon p{margin:2px 0 0;font-size:14px;color:var(--brown2);line-height:1.45}
  .more{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 14px;margin-top:8px;border-radius:14px;background:var(--cream);border:2px solid var(--line);text-decoration:none;color:var(--brown);font-weight:700}
  .more b{color:var(--coral-d);flex:none;font-size:13.5px}
  .small{font-size:12.5px;color:var(--brown2);margin-top:14px;line-height:1.5}
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
  <h1>Cek status keikutsertaan kamu</h1>
  <p class="intro" id="per">Masukkan username Instagram yang kamu pakai saat mengisi survei untuk melihat syarat mana yang sudah dan belum dipenuhi.</p>
  <div class="row2"><input type="text" id="ig" placeholder="@usernamekamu" autocomplete="off"><button id="go" type="button">Cek</button></div>
  <div class="err" id="err"></div>
  <div id="out"></div>
</main>
<script src="../config.js"></script>
<script>
(function () {
  var C = window.SURVEI_CONFIG || {}, T = C.TAMPILAN || {}, API = String(C.API_V1 || '').trim();
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; };
  var IGH = T.IG_HANDLE || '@milgiftclub';
  function api(fn, args) {
    return fetch(API, { method: 'POST', body: JSON.stringify({ fn: fn, args: args }) }).then(function (r) { return r.text(); })
      .then(function (t) { var j = JSON.parse(t); if (!j.ok) throw new Error(j.error || 'gagal'); return j.data; });
  }
  function item(ic, title, text) { return '<div class="it"><div class="ic">' + ic + '</div><div><b>' + title + '</b>' + (text ? '<p>' + text + '</p>' : '') + '</div></div>'; }
  function cek() {
    var v = $('ig').value.trim(); $('err').textContent = '';
    if (!/^@?[A-Za-z0-9._]{1,30}$/.test(v)) { $('err').textContent = 'Tulis username Instagram yang benar, mis. @namakamu'; return; }
    $('go').disabled = true; $('go').textContent = '…';
    $('out').innerHTML = '<div class="wait on"><i></i><span>Tunggu sesaat, kami sedang mengecek data kamu…</span></div>';
    api('giveawayStatus', [v]).then(function (d) {
      $('go').disabled = false; $('go').textContent = 'Cek';
      if (!d.ok) { $('out').innerHTML = ''; $('err').textContent = d.msg || 'Gagal mengecek'; return; }
      var h = '<div class="ck"><h2>Syarat giveaway ' + esc(d.ig) + '</h2>', kurang = [];
      // 1. survei
      if (d.blocked) { h += item('⛔', 'Akun sedang ' + (d.blocked.state === 'suspend' ? 'disuspend' : 'diblokir'), 'Karena riwayat jawaban asal-asalan' + (d.blocked.until ? ', sampai ' + esc(d.blocked.until) : '') + '. Hubungi ' + esc(d.blocked.email) + ' untuk membuka akses.'); kurang.push('akses akun'); }
      if (!d.surveys.length) { h += item('❌', 'Isi survei', 'Belum ada survei yang terisi dengan username ini. Pastikan username sama persis dengan yang kamu tulis di survei.'); kurang.push('isi survei'); }
      else {
        var sv = d.surveys.map(function (x) { return (x.valid ? '✅ ' : '❌ ') + esc(x.name) + (x.kupon ? ' <span class="kp">+1 kupon</span>' : '') + (x.reason ? ' — ' + esc(x.reason) : ''); }).join('<br>');
        h += item(d.surveyOk ? '✅' : '❌', 'Isi survei', sv); if (!d.surveyOk && !d.blocked) kurang.push('survei yang valid');
      }
      // 2. komentar + tag
      var k = d.komentar, post = d.posts && d.posts[0] ? ' di <a href="' + esc(d.posts[0]) + '" target="_blank" rel="noopener">postingan giveaway</a>' : ' di postingan giveaway';
      if (k.state === 'ok') h += item('✅', 'Komentar & tag ' + k.min + ' teman', 'Ditemukan komentar kamu dengan ' + k.n + ' teman berbeda di-tag.');
      else if (k.state === 'kurang') { h += item('❌', 'Komentar & tag ' + k.min + ' teman', 'Komentar kamu baru men-tag ' + k.n + ' teman. Tambahkan komentar dan tag ' + (k.min - k.n) + ' teman lagi' + post + '.'); kurang.push('tag teman'); }
      else if (k.state === 'belum') { h += item('❌', 'Komentar & tag ' + k.min + ' teman', 'Belum ada komentar dari akun ini' + post + '. Komentar dicek berkala, jadi kalau baru saja berkomentar, cek lagi sekitar 1 jam lagi.'); kurang.push('komentar & tag teman'); }
      else h += item('⏳', 'Komentar & tag ' + (k.min || 3) + ' teman', 'Tulis komentar dan tag ' + (k.min || 3) + ' teman berbeda' + post + '. Dicek saat undian.');
      // 3. syarat yang dicek manual
      h += item('⏳', 'Follow Instagram ' + esc(IGH) + ', like & share ke Story', 'Instagram tidak mengizinkan kami membaca ini secara otomatis, jadi dicek manual saat pemenang diundi. Pastikan akun kamu tidak private supaya bisa kami cek.');
      h += '</div>';
      h += d.eligible ? '<div class="verdict ok">🎉 Semua syarat yang bisa kami cek sudah terpenuhi. Pastikan juga sudah follow, like & share ke Story ya!</div>'
        : '<div class="verdict no">Masih ada yang kurang: ' + esc(kurang.join(', ') || 'syarat di atas') + '. Lengkapi dulu supaya bisa ikut diundi.</div>';
      // kupon & survei lain
      var per = esc(d.periodeAktif || 'periode ini');
      h += '<div class="kupon"><div class="kn">🎟️ ' + (d.kupon || 0) + '</div><div><b>Kupon undian kamu di ' + per + '</b><p>Setiap survei yang terisi valid = 1 kupon. Makin banyak kupon, makin besar peluang menang.</p></div></div>';
      if (d.surveiLain && d.surveiLain.length) {
        h += '<div class="ck"><h2>Tambah kupon: isi survei lainnya</h2>' + d.surveiLain.map(function (x) {
          var u = String(x.link || ''); u += (u.indexOf('?') < 0 ? '?' : '&') + 'src=cek';
          return '<a class="more" href="' + esc(u) + '" target="_blank" rel="noopener"><span>' + esc(x.name) + '</span><b>' + (x.kupon === false ? 'Isi ulang (ronde baru) →' : 'Isi survei · +1 kupon →') + '</b></a>';
        }).join('') + '</div>';
      } else if (d.surveys.length) h += '<p class="small">Kamu sudah mengisi semua survei yang sedang dibuka. Pantau Instagram ' + esc(IGH) + ' untuk survei berikutnya.</p>';
      if (d.periode) h += '<p class="small">' + esc(d.periode) + '. Status diperbarui berkala; hasil akhir ditentukan saat verifikasi pemenang.</p>';
      $('out').innerHTML = h;
    }, function () { $('go').disabled = false; $('go').textContent = 'Cek'; $('out').innerHTML = ''; $('err').textContent = 'Koneksi bermasalah. Coba lagi.'; });
  }
  $('go').onclick = cek; $('ig').onkeydown = function (e) { if (e.key === 'Enter') cek(); };
  var m = /[?&]ig=([^&#]*)/.exec(location.search); if (m && decodeURIComponent(m[1])) { $('ig').value = decodeURIComponent(m[1]); cek(); }
})();
</script>
</body>
</html>
