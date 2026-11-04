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
  .kt-h{font-family:var(--display);font-size:20px;margin:4px 0 4px;color:var(--brown)}
  .kt .kt-img{width:56px;height:56px;border-radius:14px;object-fit:cover;flex:none;background:var(--cream)} .kt-ph{display:flex;align-items:center;justify-content:center;font-size:26px}
  .kt button.go{border:0;font:inherit;cursor:pointer} .kt button.go:disabled{background:#D9D3CB;color:#7d756d;cursor:not-allowed} .kt.kurang{opacity:.85}
  .ck{background:var(--white);border:2px solid var(--line);border-radius:18px;padding:14px 16px;margin-top:14px} .tk-r{display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-top:1px dashed var(--line);font-size:14px} .tk-r small{color:var(--brown2)}
  .verdict{border-radius:18px;padding:14px 16px;margin:0 0 12px;font-weight:700;line-height:1.5} .verdict.ok{background:#E7F5EC;color:#22663F;border:2px solid #9fd6b3} .verdict.no{background:#FDECEC;color:#7A2323;border:2px solid #F3B9B9}
  .tk-x{font-size:12.5px;color:var(--brown2);margin-top:2px;line-height:1.5} .tk-b{display:inline-block;border-radius:10px;padding:2px 9px;font-size:12px;font-weight:800;background:#EEE8E0;color:var(--brown)} .tk-b.ok{background:#E7F5EC;color:#22663F} .tk-b.no{background:#FDECEC;color:#7A2323}
  .tk-kr{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:6px} .kr-b{color:#fff;font-weight:800;font-size:12px;border-radius:8px;padding:4px 9px;letter-spacing:.2px} .kr-logo{height:24px;border-radius:4px;background:#fff}
  .kr-r{font-family:ui-monospace,Menlo,monospace;font-weight:700;font-size:13px;background:var(--cream);border-radius:8px;padding:3px 8px} .kr-btn{border:2px solid var(--line);background:var(--white);color:var(--brown);border-radius:10px;font:inherit;font-weight:800;font-size:12.5px;padding:4px 10px;cursor:pointer;text-decoration:none} .kr-btn.go{background:var(--brown);border-color:var(--brown);color:#fff}
  .tk-it{border-top:1px dashed var(--line);padding:9px 0} .tk-it:first-of-type{border-top:0} .tk-tag{margin-top:6px;border:0;border-radius:12px;background:var(--coral);color:#fff;font:inherit;font-weight:800;font-size:13px;padding:7px 12px;cursor:pointer}
  .rd{background:var(--white);border:2px solid var(--line);border-radius:18px;padding:16px;margin-top:12px} .rd label.f{display:block;font-weight:800;font-size:14px;margin:12px 0 5px} .rd textarea{width:100%;min-height:84px;font:inherit;padding:12px 14px;border:2px solid var(--line);border-radius:14px;box-sizing:border-box}
  .rd .row2{display:grid;grid-template-columns:1.4fr 1fr;gap:10px} .rd .chk{display:flex;gap:10px;align-items:flex-start;margin-top:12px;font-size:14px;line-height:1.5} .rd .chk input{margin-top:4px;width:18px;height:18px;flex:none}
  .rd-i{background:var(--yellow-l);border:2px solid var(--yellow);border-radius:16px;padding:12px 14px;margin-top:12px;font-size:14px;line-height:1.55} .rd-i b{color:var(--brown)}
  .rd-btn{display:block;width:100%;margin-top:14px;border:0;border-radius:16px;background:var(--coral);color:#fff;font:inherit;font-weight:800;font-size:16px;padding:14px;cursor:pointer} .rd-btn.sec{background:transparent;color:var(--brown);border:2px solid var(--brown)}
  .rd-btn:disabled{opacity:.6;cursor:wait} .rd-err{color:#B42323;font-weight:700;font-size:14px;margin-top:10px}
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
        '<p class="intro">Terima kasih sudah mau berbagi pengalaman belanja online kamu. Setelah setuju, kamu bisa memilih survei yang ingin diisi. <b>Setiap survei yang diisi dengan serius memberi 1–3 kupon</b>. Kupon menambah peluang undian dan bisa ditukar hadiah dari katalog.</p>' +
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
  var PRE = null, PREP = null;   // daftar survei dimuat di belakang layar sejak halaman dibuka
  function preload() { if (!PREP && API) PREP = api('hubSurveys', []).then(function (d) { PRE = d; return d; }, function () { PREP = null; }); return PREP; }
  function list() {
    var my = (list.n = (list.n || 0) + 1);
    var show = function (d, checking) {
      var todo = d.list.filter(function (x) { return !x.done; }).length;
      var h = '<div class="section">Pilih survei</div><h1>Halo ' + esc(ST.ig) + '! Survei mana yang mau kamu isi?</h1>' +
        '<div class="kup"><div class="kn">🎟️ ' + (checking ? '…' : d.saldo ? d.saldo.sisa : d.kupon) + '</div><div><b>Kupon kamu</b><p>' + (checking ? 'Memeriksa survei yang sudah kamu isi…' : 'Bisa ditukar hadiah di bawah, dan ' + d.kupon + ' kupon ikut undian ' + esc(d.periode || 'periode ini') + '. ' + (todo ? 'Isi <b>' + todo + ' survei lagi</b> untuk menambah kupon.' : 'Semua survei yang dibuka sudah kamu isi. Terima kasih!') +
          (d.saldo && d.saldo.segera ? '<br>⏳ <b>' + d.saldo.segera.n + ' kupon</b> hangus pada ' + esc(d.saldo.segera.tgl) + ' (kupon berlaku ' + d.saldo.berlaku + ' bulan).' : '') + (d.saldo && d.saldo.hangus ? '<br><span style="opacity:.8">' + d.saldo.hangus + ' kupon sudah hangus.</span>' : '')) + '</p></div></div>';
      h += d.list.map(function (x) {
        var u = x.link + (x.link.indexOf('?') < 0 ? '?' : '&') + 'ig=' + encodeURIComponent(ST.ig.replace(/^@/, '')) + '&ok=1&src=' + encodeURIComponent(SRC);
        return '<a class="sv' + (x.done ? ' done' : '') + '" href="' + esc(u) + '"><div class="t"><b>' + (x.done ? '✓ ' : '') + esc(x.name) + '</b><small>' + esc(x.desc) + '</small>' +
          '<div class="m">' + (x.done ? 'Sudah diisi' + (x.valid ? '' : ' · tidak valid') : '±' + x.est + ' menit · +' + (x.nilai || 1) + ' kupon') + '</div></div><span class="go">' + (x.done ? '✓ Selesai' : 'Mulai →') + '</span></a>';
      }).join('') + (d.list.length ? '' : '<p class="intro">Belum ada survei yang dibuka. Pantau Instagram ' + esc(IGH()) + ' ya!</p>');
      if (!checking && d.katalog && d.katalog.length) {
        var sisa = d.saldo ? d.saldo.sisa : 0;
        h += '<div class="section" style="margin-top:22px">Tukar kupon</div><h2 class="kt-h">🎁 Tukar kupon dengan hadiah</h2>' + d.katalog.map(function (k) {
          var bisa = sisa >= k.kupon && k.stok > 0;
          return '<div class="sv kt' + (bisa ? '' : ' kurang') + '">' + (k.gambar ? '<img src="' + esc(k.gambar) + '" alt="" class="kt-img">' : '<div class="kt-img kt-ph">🎁</div>') + '<div class="t"><b>' + esc(k.nama) + '</b><small>' + esc((k.brand ? k.brand + ' · ' : '') + (k.deskripsi || '')) + '</small>' +
            '<div class="m">' + (k.stok > 0 ? 'Sisa ' + k.stok : 'Stok habis') + (bisa || k.stok <= 0 ? '' : ' · kurang ' + (k.kupon - sisa) + ' kupon') + '</div></div><button class="go" type="button" data-id="' + esc(k.id) + '"' + (bisa ? '' : ' disabled') + '>🎟️ ' + k.kupon + '</button></div>';
        }).join('');
        if (d.tukar && d.tukar.length) h += '<div class="ck"><b>Riwayat penukaran</b>' + d.tukar.map(function (t) {
          var x = [], sent = t.status === 'Dikirim' || t.status === 'Diterima';
          if ((t.status === 'Menunggu' || t.status === 'Diproses') && t.batas) x.push('📦 Dikirim paling lambat ' + esc(t.batas));
          var kr = t.kurir, krH = '';
          if (kr || t.resi) krH = '<div class="tk-kr">' + (kr ? (kr.logo ? '<img src="' + esc(kr.logo) + '" alt="' + esc(kr.nama) + '" class="kr-logo">' : '<span class="kr-b" style="background:' + esc(kr.warna || '#6B7280') + '">' + esc(kr.nama) + '</span>') : '') +
            (t.resi ? '<span class="kr-r">' + esc(t.resi) + '</span><button type="button" class="kr-btn" data-copy="' + esc(t.resi) + '">Salin</button>' : '') +
            (kr && kr.lacak ? '<a class="kr-btn go" href="' + esc(kr.lacak) + '" target="_blank" rel="noopener" data-copy="' + esc(t.resi || '') + '">Lacak paket ↗</a>' : '') + '</div>';
          var tag = t.tagStatus === 'Terverifikasi' ? '<span class="tk-b ok">✓ Konten terverifikasi · +' + (t.bonus || 1) + ' kupon</span>' : t.tagStatus === 'Menunggu cek' ? '<span class="tk-b">⏳ Link konten sedang dicek</span>' : t.tagStatus === 'Tidak sesuai' ? '<span class="tk-b no">Konten belum sesuai, kirim ulang link</span>' : '';
          var btn = sent && t.tagStatus !== 'Terverifikasi' && t.tagStatus !== 'Menunggu cek' ? '<br><button class="tk-tag" type="button" data-tid="' + esc(t.id) + '">📸 Sudah posting & tag ' + esc(IGH()) + '? Kirim link (+1 kupon)</button>' : '';
          return '<div class="tk-it"><div class="tk-r" style="border:0;padding:0"><span>' + esc(t.hadiah) + ' <small>(' + t.kupon + ' kupon · ' + esc(t.waktu) + ')</small></span><b>' + esc(t.status) + '</b></div>' + (x.length ? '<div class="tk-x">' + x.join(' · ') + '</div>' : '') + krH + (tag ? '<div class="tk-x">' + tag + '</div>' : '') + btn + '</div>';
        }).join('') + '</div>';
      }
      h += '<p class="small">Bukan akun kamu? Klik "Ganti akun" di bawah. · <a href="cek/?ig=' + encodeURIComponent(ST.ig.replace(/^@/, '')) + '">🔎 Cek status giveaway</a></p>';
      app.innerHTML = h;
      [].forEach.call(app.querySelectorAll('.kt button[data-id]'), function (b) { b.onclick = function () { tukar(d.katalog.filter(function (k) { return k.id === b.dataset.id; })[0]); }; });
      [].forEach.call(app.querySelectorAll('.tk-tag'), function (b) { b.onclick = function () { tagLink(b.dataset.tid); }; });
      [].forEach.call(app.querySelectorAll('.kr-btn[data-copy]'), function (b) { b.addEventListener('click', function (e) { var v = b.dataset.copy; if (!v) return; try { navigator.clipboard.writeText(v); } catch (er) {} if (b.tagName === 'BUTTON') { b.textContent = '✓ Disalin'; setTimeout(function () { b.textContent = 'Salin'; }, 1500); } }); });
      if (!checking && PENDING) { var pm = PENDING; PENDING = null; alertBox(pm[0], pm[1]); }
    };
    if (PRE) show(PRE, true);
    else { app.innerHTML = '<div class="section">Pilih survei</div><h1>Halo ' + esc(ST.ig) + '! Survei mana yang mau kamu isi?</h1><div class="wait on"><i></i><span>Memuat daftar survei…</span></div>'; preload() && PREP.then(function (d) { if (d && my === list.n && !list.got) show(d, true); }); }
    list.got = false;
    api('hubList', [ST.ig]).then(function (d) {
      if (my !== list.n) return; list.got = true;
      if (d.blocked) { app.innerHTML = '<div class="section">Akun dibatasi</div><h1>Akun ' + esc(d.ig) + ' sedang ' + (d.blocked.state === 'suspend' ? 'disuspend' : 'diblokir') + '</h1><p class="intro">Karena riwayat jawaban yang tidak valid' + (d.blocked.until ? ', sampai ' + esc(d.blocked.until) : '') + '. Hubungi ' + esc(d.blocked.email) + ' untuk membuka akses.</p>'; return; }
      show(d, false);
    }, function () { app.innerHTML = '<div class="err">Koneksi bermasalah. <a href="#" onclick="location.reload();return false">Coba lagi</a></div>'; });
  }
  // ---- penukaran kupon: verifikasi -> data penerima (tersimpan untuk berikutnya) -> konfirmasi ----
  var RD = null, L4 = '', PENDING = null;
  function rdView(inner) { $('nav').style.display = 'none'; app.innerHTML = '<div class="section">Tukar kupon</div>' + inner; window.scrollTo(0, 0); }
  function rdBack() { $('nav').style.display = ''; bb.style.visibility = 'visible'; list(); }
  function rdItem(k) { return '<div class="sv kt" style="pointer-events:none">' + (k.gambar ? '<img src="' + esc(k.gambar) + '" alt="" class="kt-img">' : '<div class="kt-img kt-ph">🎁</div>') + '<div class="t"><b>' + esc(k.nama) + '</b><small>' + esc((k.brand ? k.brand + ' · ' : '') + (k.deskripsi || '')) + '</small></div><span class="go">🎟️ ' + k.kupon + '</span></div>'; }
  function tukar(k) {
    RD = { k: k };
    rdView('<h1>Tukar ' + k.kupon + ' kupon</h1>' + rdItem(k) + '<div class="rd"><label class="f" for="rd-l4">Verifikasi: 4 digit terakhir nomor WhatsApp yang kamu isi di survei</label><input type="text" id="rd-l4" inputmode="numeric" maxlength="4" placeholder="mis. 1234" value="' + esc(L4) + '"><div class="rd-err" id="rd-err"></div>' +
      '<button class="rd-btn" id="rd-go" type="button">Lanjut</button><button class="rd-btn sec" type="button" id="rd-x">Batal</button></div>');
    $('rd-x').onclick = rdBack; $('rd-l4').focus();
    $('rd-go').onclick = function () {
      var v = $('rd-l4').value.replace(/\D/g, ''); if (v.length !== 4) { $('rd-err').textContent = 'Isi 4 angka terakhir nomor WhatsApp.'; return; }
      this.disabled = true; this.textContent = 'Memeriksa…'; var btn = this;
      api('penerimaInfo', [ST.ig, v]).then(function (r) { if (!r.ok) { btn.disabled = false; btn.textContent = 'Lanjut'; $('rd-err').textContent = r.msg; return; } L4 = v; RD.info = r; rdForm(); },
        function () { btn.disabled = false; btn.textContent = 'Lanjut'; $('rd-err').textContent = 'Koneksi bermasalah, coba lagi.'; });
    };
  }
  function rdForm() {
    var k = RD.k, inf = RD.info, sv = inf.tersimpan, useSaved = sv && RD.mode !== 'baru';
    var f = function (id, lab, ph, extra) { return '<label class="f" for="' + id + '">' + lab + '</label><input type="text" id="' + id + '" placeholder="' + ph + '"' + (extra || '') + '>'; };
    var h = '<h1>Data penerima hadiah</h1>' + rdItem(k) + '<div class="rd">';
    if (sv) h += '<div class="opts">' +
      '<label class="opt' + (useSaved ? ' on' : '') + '" data-m="simpan"><input type="radio" name="rdm"' + (useSaved ? ' checked' : '') + '><span>Kirim ke data tersimpan<br><small style="font-weight:600;opacity:.8">' + esc(sv.nama) + ' · ' + esc(sv.hp) + '<br>' + esc(sv.alamat) + ', ' + esc(sv.kota) + ' ' + esc(sv.kodepos) + '</small></span></label>' +
      '<label class="opt' + (useSaved ? '' : ' on') + '" data-m="baru"><input type="radio" name="rdm"' + (useSaved ? '' : ' checked') + '><span>Pakai data penerima baru</span></label></div>';
    if (!useSaved) h += (sv ? '' : '<p class="hint" style="margin-top:0">Isi sekali saja. Data ini disimpan untuk penukaran berikutnya.</p>') +
      f('rd-nama', 'Nama lengkap penerima', 'Sesuai nama di paket', ' autocomplete="name"') + f('rd-hp', 'Nomor HP / WhatsApp penerima', '081234567890', ' inputmode="tel" autocomplete="tel"') +
      '<label class="f" for="rd-al">Alamat lengkap</label><textarea id="rd-al" placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, patokan" autocomplete="street-address"></textarea>' +
      '<div class="row2"><div>' + f('rd-kota', 'Kota / kabupaten', 'mis. Kota Bandung') + '</div><div>' + f('rd-kp', 'Kode pos', '40115', ' inputmode="numeric" maxlength="5"') + '</div></div>' +
      '<label class="chk"><input type="checkbox" id="rd-simpan" checked><span>Simpan data ini untuk penukaran berikutnya</span></label>';
    h += '<div class="rd-i">📦 Hadiah dikirim <b>paling lambat ' + inf.hariKerja + ' hari kerja</b> setelah penukaran.<br>📸 Saat hadiah diterima, kamu <b>wajib membuat konten</b> (foto/video di feed, story, reels, atau TikTok) dan <b>tag ' + esc(IGH()) + '</b>. Kirim link kontennya lewat riwayat penukaran untuk mendapat <b>+' + inf.bonusTag + ' kupon</b> tambahan.</div>' +
      '<label class="chk"><input type="checkbox" id="rd-ok"><span>Saya bersedia membuat konten dan men-tag ' + esc(IGH()) + ' saat hadiah diterima.</span></label>' +
      '<div class="rd-err" id="rd-err"></div><button class="rd-btn" id="rd-go" type="button">Tukar ' + k.kupon + ' kupon</button><button class="rd-btn sec" type="button" id="rd-x">Batal</button></div>' +
      '<p class="small">Sisa kupon setelah penukaran: <b>' + Math.max(0, inf.saldo.sisa - k.kupon) + '</b>.</p>';
    rdView(h);
    [].forEach.call(app.querySelectorAll('label.opt[data-m]'), function (l) { l.onclick = function (e) { e.preventDefault(); RD.mode = l.dataset.m; rdForm(); }; });
    $('rd-x').onclick = rdBack;
    $('rd-go').onclick = function () {
      if (!$('rd-ok').checked) { $('rd-err').textContent = 'Centang persetujuan membuat konten & tag dulu ya.'; return; }
      var p = 'tersimpan';
      if (!useSaved) { p = { nama: $('rd-nama').value, hp: $('rd-hp').value, alamat: $('rd-al').value, kota: $('rd-kota').value, kodepos: $('rd-kp').value, simpan: $('rd-simpan').checked };
        if (!p.nama.trim() || !p.hp.trim() || !p.alamat.trim() || !p.kota.trim() || !p.kodepos.trim()) { $('rd-err').textContent = 'Lengkapi semua data penerima.'; return; } }
      var btn = this; btn.disabled = true; btn.textContent = 'Memproses penukaran…';
      api('tukarKupon', [ST.ig, L4, k.id, p]).then(function (r) {
        if (!r.ok) { btn.disabled = false; btn.textContent = 'Tukar ' + k.kupon + ' kupon'; $('rd-err').textContent = r.msg; return; }
        PRE = null; PREP = null;
        rdView('<h1>🎉 Penukaran tercatat!</h1>' + rdItem(k) + '<div class="rd-i">Nomor penukaran: <b>' + esc(r.id) + '</b><br>📦 Hadiah dikirim <b>paling lambat ' + esc(r.batas) + '</b> (' + r.hariKerja + ' hari kerja).<br>📸 Setelah diterima, buat konten dan tag <b>' + esc(IGH()) + '</b>, lalu kirim link-nya di riwayat penukaran untuk <b>+' + r.bonusTag + ' kupon</b>.<br>Sisa kupon kamu: <b>' + r.sisa + '</b></div><button class="rd-btn" type="button" id="rd-x">Kembali ke daftar survei</button>');
        $('rd-x').onclick = rdBack;
      }, function () { btn.disabled = false; btn.textContent = 'Tukar ' + k.kupon + ' kupon'; $('rd-err').textContent = 'Koneksi bermasalah, coba lagi.'; });
    };
  }
  function tagLink(tid) {
    rdView('<h1>Kirim link konten kamu</h1><div class="rd"><p class="hint" style="margin-top:0">Tempel link postingan Instagram (feed/reels) atau TikTok yang men-tag <b>' + esc(IGH()) + '</b>. Untuk Instagram Story, kirim tangkapan layar ke DM ' + esc(IGH()) + ' lalu tempel link profil kamu di sini.</p>' +
      '<label class="f" for="tg-l">Link konten</label><input type="text" id="tg-l" placeholder="https://www.instagram.com/p/…">' +
      '<label class="f" for="tg-4">4 digit terakhir nomor WhatsApp</label><input type="text" id="tg-4" inputmode="numeric" maxlength="4" value="' + esc(L4) + '">' +
      '<div class="rd-err" id="rd-err"></div><button class="rd-btn" id="rd-go" type="button">Kirim link</button><button class="rd-btn sec" type="button" id="rd-x">Batal</button></div>');
    $('rd-x').onclick = rdBack;
    $('rd-go').onclick = function () {
      var btn = this, l4 = $('tg-4').value.replace(/\D/g, ''); btn.disabled = true;
      api('kirimTagLink', [ST.ig, l4, tid, $('tg-l').value]).then(function (r) { if (!r.ok) { btn.disabled = false; $('rd-err').textContent = r.msg; return; } L4 = l4; PRE = null; PREP = null; PENDING = ['✅ Link terkirim. Tim kami akan mengecek kontenmu; kupon bonus masuk setelah terverifikasi.', 'ok']; rdBack(); },
        function () { btn.disabled = false; $('rd-err').textContent = 'Koneksi bermasalah, coba lagi.'; });
    };
  }
  function alertBox(html, cls) { var b = document.createElement('div'); b.className = 'verdict ' + cls; b.innerHTML = html; app.insertBefore(b, app.firstChild); window.scrollTo(0, 0); }
  function next() {
    if (ST.step === 'o1') { if (ST.ok == null) { $('err').textContent = 'Pilih salah satu jawaban dulu ya.'; return; } ST.step = ST.ok ? 'ig' : 'bye'; return render(); }
    if (ST.step === 'ig') {
      var v = $('igv').value.trim(); if (!/^@?[A-Za-z0-9._]{1,30}$/.test(v)) { $('err').textContent = 'Format username Instagram belum sesuai (contoh: @namaanda).'; return; }
      ST.ig = '@' + v.replace(/^@/, ''); ST.step = 'list'; return render();
    }
  }
  nb.onclick = next;
  bb.onclick = function () { ST.step = ST.step === 'list' ? 'ig' : 'o1'; render(); };
  render(); preload();
  if (API) api('config', ['v1', SRC]).then(function (c) { CFG = c; if (ST.step === 'o1') render(); }, function () {});
})();
</script>
</body>
</html>
