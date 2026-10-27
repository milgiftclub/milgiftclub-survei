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
  .scale{display:flex;gap:6px;flex-wrap:wrap}
  .scale button{flex:1 1 44px;font-family:var(--display);font-size:17px;font-weight:600;padding:12px 0;border:2px solid var(--line);border-radius:12px;background:var(--white);cursor:pointer;color:var(--brown)}
  .scale button.on{background:var(--coral);color:var(--white);border-color:var(--coral)}
  .pvw{background:#2F6FD6;color:#fff;font-weight:800;font-size:13px;text-align:center;padding:8px 12px;border-radius:12px;margin-bottom:12px}
  .loading{text-align:center;padding:60px 10px;font-weight:700;color:var(--brown2)}
  .loading i{display:block;margin:0 auto 14px;width:30px;height:30px;border:4px solid var(--line);border-top-color:var(--coral);border-radius:50%;animation:spin .8s linear infinite}
</style>
</head>
<body>
<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="blob b4"></div>
<header>
  <div class="logo">MIL Gift Club<span class="dot">.</span></div>
  <div class="tag">INSIGHT · COMMUNITY · REWARDS</div>
  <div class="bar"><i id="prog"></i></div>
</header>
<main id="app"><div class="loading"><i></i>Memuat survei…</div></main>
<nav id="nav" style="display:none"><div><button id="back" type="button">Kembali</button><button id="next" type="button">Lanjut</button></div></nav>
<script src="../config.js"></script>
<script>
var VERSION = '__VERSION__';
var STD = __STD__;          // pertanyaan standar (pembuka, IG, profil, attention check, penutup)
var CITIES = __CITIES__;    // [nama, provinsi, tipe, jabodetabek]

(function () {
  var C = window.SURVEI_CONFIG || {}, T = C.TAMPILAN || {};
  var API_URL = String(C.API_V1 || '').trim();
  var app = document.getElementById('app'), nav = document.getElementById('nav'), btnN = document.getElementById('next'), btnB = document.getElementById('back');
  function qs(n) { var m = new RegExp('[?&]' + n + '=([^&#]*)').exec(location.search); return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : ''; }
  var ID = qs('id'), PREVIEW = qs('preview') === '1', SRC = qs('src') || qs('utm_source') || 'langsung';
  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
  function api(fn, args) {
    return fetch(API_URL, { method: 'POST', body: JSON.stringify({ fn: fn, args: args }) })
      .then(function (r) { return r.text(); })
      .then(function (t) { var j; try { j = JSON.parse(t); } catch (e) { throw new Error('Server belum siap (kode Apps Script belum versi terbaru?)'); } if (!j.ok) throw new Error(j.error || 'gagal'); return j.data; });
  }
  var CFG = {
    linkLain: T.LINK_SURVEI_LAIN, tombolLain: T.TOMBOL_SURVEI_LAIN, linkIg: T.LINK_INSTAGRAM, tombolIg: T.TOMBOL_INSTAGRAM,
    teksTidakEligible: T.TEKS_TIDAK_ELIGIBLE, teksSudahIsi: T.TEKS_SUDAH_ISI, teksMenolak: T.TEKS_MENOLAK,
    periodeLabel: T.PERIODE_LABEL, hadiahUtama: T.HADIAH_UTAMA, hadiah: T.HADIAH || [], periode: T.PERIODE_GIVEAWAY, announce: T.PENGUMUMAN_PEMENANG,
    ig: T.IG_HANDLE || '@milgiftclub', langkah: T.LANGKAH_PENUTUP || [], pesanPenutup: T.PESAN_PENUTUP, privacy: T.PRIVACY_URL, tnc: T.TNC_URL
  };
  function ctaButtons(igFirst) {
    var ig = CFG.linkIg ? '<a class="cta ' + (igFirst ? '' : 'cta2') + '" href="' + esc(CFG.linkIg) + '" target="_blank" rel="noopener">' + esc(CFG.tombolIg || ('Follow ' + CFG.ig)) + '</a>' : '';
    var sv = CFG.linkLain ? '<a class="cta ' + (igFirst ? 'cta2' : '') + '" href="' + esc(CFG.linkLain) + '">' + esc(CFG.tombolLain || 'Isi survei lainnya') + ' →</a>' : '';
    return '<div class="ctas">' + (igFirst ? ig + sv : sv + ig) + '</div>';
  }
  function finish(t, m, note, extra, after) {
    nav.style.display = 'none';
    document.getElementById('prog').style.width = '100%';
    app.innerHTML = '<div class="end"><div class="big">🎁</div><h1>' + esc(t) + '</h1><p class="intro">' + esc(m) + '</p>' + (extra || '') + (note ? '<div class="note">' + esc(note) + '</div>' : '') + (after || '') + '</div>';
    window.__done = true;
  }
  if (!ID) return finish('Link survei tidak lengkap', 'Mohon buka survei dari link resmi MIL Gift Club.', '', ctaButtons(false));
  if (!API_URL) return finish('Survei belum siap', 'Pengaturan website belum lengkap (config.js).', '');

  var tries = 0;
  (function load() {
    api('getSurvey', [ID, PREVIEW]).then(start, function (e) {
      if (/tidak ditemukan/i.test(e.message)) return finish('Survei tidak ditemukan', 'Link survei ini tidak aktif. Cek survei MIL Gift Club lainnya, ya!', '', ctaButtons(false));
      if (++tries < 3) return setTimeout(load, 1500 * tries);
      app.innerHTML = '<div class="loading">Gagal memuat survei. Periksa koneksi internet lalu muat ulang halaman.<br><small style="font-weight:400">' + esc(e.message) + '</small></div>';
    });
  })();

  function shade(hex, k) {   // k<0 lebih gelap, k>0 lebih terang
    var m = String(hex || '').match(/^#?([0-9a-f]{6})$/i); if (!m) return hex;
    var n = parseInt(m[1], 16), r = n >> 16, g = n >> 8 & 255, b = n & 255;
    var f = function (x) { return Math.max(0, Math.min(255, Math.round(k < 0 ? x * (1 + k) : x + (255 - x) * k))); };
    return '#' + [f(r), f(g), f(b)].map(function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
  }
  function applyBrand(B) {
    var root = document.documentElement.style, p = B.primary || '#F2575D', a = B.accent || '#F9C23C';
    root.setProperty('--coral', p); root.setProperty('--coral-d', shade(p, -0.18)); root.setProperty('--yellow', a); root.setProperty('--yellow-l', shade(a, 0.75));
    var ink = B.ink || '#3A2A20', bg = B.bg || shade(p, 0.94);
    root.setProperty('--brown', ink); root.setProperty('--brown2', shade(ink, 0.35)); root.setProperty('--cream', bg); root.setProperty('--cream2', shade(p, 0.86)); root.setProperty('--line', shade(p, 0.8));
    var nv = document.getElementById('nav'); if (nv) nv.style.background = bg;
    var h = String(B.ig || '').trim().replace(/^@?/, '@'); if (h === '@') h = '';
    CFG.ig = h; CFG.linkIg = h ? 'https://www.instagram.com/' + h.slice(1) + '/' : ''; CFG.tombolIg = h ? 'Follow ' + h + ' di Instagram' : '';
    CFG.linkLain = ''; CFG.pesanPenutup = ''; CFG.periodeLabel = 'Giveaway ' + B.name;
    CFG.langkah = (CFG.langkah || []).map(function (t) { return String(t).replace(/@milgift_club|@milgiftclub/gi, h || 'kami'); }).filter(function (t) { return h || !/follow/i.test(t); });
    CFG.teksTidakEligible = 'Kamu belum termasuk kriteria survei ini. Terima kasih banyak atas waktumu!';
    CFG.teksSudahIsi = 'Akun Instagram ini sudah pernah mengisi survei ini. Satu akun hanya bisa ikut satu kali. Terima kasih!';
    CFG.teksMenolak = 'Tidak apa-apa kalau kamu belum ingin mengisi survei ini. Terima kasih!';
    var lg = document.querySelector('header .logo'), tg = document.querySelector('header .tag');
    lg.innerHTML = B.logoData ? '<img src="' + B.logoData + '" alt="' + esc(B.name) + '" style="max-height:64px;max-width:240px;object-fit:contain">' : esc(B.name);
    tg.textContent = '';
  }
  function start(D) {
    var S = D.schema || {};
    var G = S.giveaway !== false, PROF = S.profile !== false;
    if (S.hadiahUtama) CFG.hadiahUtama = S.hadiahUtama;
    var prize = function (h) { return String(h.nama || '').trim() + (Number(h.nilai) ? ' · Rp' + Number(h.nilai).toLocaleString('id-ID') : ''); };
    var HD = (S.hadiah || []).filter(function (h) { return String(h.nama || '').trim(); });
    if (HD.length) { CFG.hadiahUtama = prize(HD[0]); CFG.hadiah = HD.slice(1).map(prize); }
    CFG.periode = S.periode || '';   // batas waktu survei ini (kosong = tidak ditampilkan)
    var BR = D.brand && D.brand.mode === 'client' ? D.brand : null, ORG = BR ? BR.name : 'MIL Gift Club';
    if (BR) applyBrand(BR);
    if (S.periodeLabel) CFG.periodeLabel = S.periodeLabel;
    document.title = D.name + ' — ' + ORG;
    if (!D.open) return finish('Survei telah ditutup', 'Terima kasih atas minat kamu. Pantau Instagram ' + CFG.ig + ' untuk survei dan giveaway berikutnya.', '', ctaButtons(true));

    // ---------- susun pertanyaan ----------
    var BY = {};
    var std = function (id) { var q = JSON.parse(JSON.stringify(STD[id])); q.std = true; BY[id] = q; return id; };
    var custom = (S.questions || []).map(function (q) {
      var t = { id: q.id, topic: q.topic || D.name, text: q.text, hint: q.hint || '', ct: q.type, optional: q.required === false, max: Number(q.max) || 0, rnd: !!q.random, showIf: q.showIf || null, scale: q.scale || {}, min: q.min, maxNum: q.maxNum,
        options: (q.options || []).filter(function (o) { return String(o.t || '').trim(); }).map(function (o) { return { t: String(o.t).trim(), other: !!o.other, ex: !!o.exclusive, screen: !!o.screen }; }) };
      t.type = { single: 'sa', multi: 'ma', dropdown: 'dropdown', text: 'oa', longtext: 'oa', number: 'num', scale: 'scale' }[q.type] || 'oa';
      if (q.type === 'longtext') t.long = true;
      BY[t.id] = t; return t.id;
    });
    var PRE = [std('O1')];
    var CY = new Date().getFullYear();
    if (G) { PRE.push(std('Z2')); if (PROF) { PRE.push(std('PV')); PRE.push(std('PR')); } }
    if (PROF || G) { PRE.push(std('S0')); PRE.push(std('S0B')); BY.S0B.showIf = { q: 'S0', op: 'is', val: String(CY - 18) }; }
    if (PROF) {
      PRE.push(std('S2')); if (S.screenIndustri !== false) PRE.push(std('S3'));
      ['A1', 'A18', 'A19', 'A4M', 'A4N', 'A4K', 'A5', 'A6', 'A7N', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A16'].forEach(function (x) { PRE.push(std(x)); });
      BY.A4N.showIf = { q: 'A4M', op: 'isnot', val: BY.A4M.options[0].t };
      BY.A4K.showIf = { q: 'A4N', op: 'isnot', val: BY.A4N.options[0].t };
      BY.A19.showIf = { q: 'A18', op: 'isnot', val: 'Kos / kamar sewa' };
    }
    else if (S.gender && S.gender !== 'all') PRE.push(std('S2'));
    if (BY.A15) BY.A15.showIf = { q: 'S2', op: 'is', val: 'Wanita' };
    var S1O = STD.S1.options.map(function (o) { return o.t; });
    var MAIN = custom.slice();
    if (S.attention !== false && MAIN.length) { std('QC1'); MAIN.splice(Math.ceil(MAIN.length / 2), 0, 'QC1'); }
    var POST = G ? [std('Z1'), std('Z3')] : [];
    var intro = (S.intro ? S.intro.trim().replace(/([^.!?])$/, '$1.') + ' ' : 'Terima kasih telah berpartisipasi dalam survei ' + D.name + '. ') +
      (S.estimasi ? 'Survei ini membutuhkan waktu ±' + S.estimasi + ' menit. ' : '') + 'Jawaban Anda bersifat rahasia dan hanya digunakan untuk keperluan riset.' +
      (G ? ' Data kontak hanya digunakan untuk keperluan undian dan verifikasi pemenang.' : '');
    BY.O1.intro = intro;
    if (BY.Z2) BY.Z2.text = BR ? 'Tuliskan username Instagram Anda (untuk verifikasi keikutsertaan giveaway' + (CFG.ig ? ' ' + CFG.ig : '') + ').' : BY.Z2.text.replace(/@milgift_club|@milgiftclub/g, CFG.ig);
    if (BR && BY.Z1) BY.Z1.text = BY.Z1.text.replace(/MIL Gift Club/g, BR.name + ' dan MIL Digital');
    if (BR) BY.O1.intro += ' Survei ini diselenggarakan oleh MIL Digital untuk ' + BR.name + '.';

    var KEY = 'milc_' + ID + (PREVIEW ? '_p' : '');
    var CITY = {}; CITIES.forEach(function (c) { CITY[c[0]] = c; });
    var ST = load() || { a: {}, cur: null, sid: uid(), start: null, order: {} };
    if (ST.prSum && BY.PR) BY.PR.hint = ST.prSum;
    var lastKey = null;
    function uid() { return 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
    function save() { try { sessionStorage.setItem(KEY, JSON.stringify(ST)); } catch (e) {} }
    function load() { try { var s = sessionStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
    function clearSave() { try { sessionStorage.removeItem(KEY); } catch (e) {} }
    function arr(v) { return Array.isArray(v) ? v : []; }
    function opts(id) { return BY[id].options.map(function (o) { return o.t; }); }
    function excl(id) { return BY[id].options.filter(function (o) { return o.ex; }).map(function (o) { return o.t; }); }
    function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    var ANCHOR = /^(Tidak|Lainnya|Belum pernah|Saya tidak)/;
    function optionsOf(q) {
      var list = q.options || [];
      if (!q.rnd) return list;
      var normal = list.filter(function (o) { return !(o.ex || o.other || ANCHOR.test(o.t)); }), tail = list.filter(function (o) { return o.ex || o.other || ANCHOR.test(o.t); });
      var sig = normal.map(function (o) { return o.t; }).join('|'), sv = ST.order[q.id];
      if (!sv || sv.sig !== sig) { sv = ST.order[q.id] = { sig: sig, idx: shuffle(normal.map(function (o, i) { return i; })) }; save(); }
      return sv.idx.map(function (i) { return normal[i]; }).concat(tail);
    }
    function ansText(id) { var v = ST.a[id]; if (Array.isArray(v)) v = v.join(', '); return v == null ? '' : String(v); }
    function fill(t) { return String(t).replace(/\{(Q[0-9A-Za-z_]+)\}/g, function (m, id) { return ansText(id) || 'jawaban Anda sebelumnya'; }).replace(/@milgift_club/g, CFG.ig); }

    function visible(id) {
      if (ST.pre && ST.pre.indexOf(id) >= 0) return false;
      if (id === 'PV') return !!ST.known;
      if (id === 'PR') return !!ST.stale;
      var q = BY[id], c = q && q.showIf;
      if (c && c.q && (BY[c.q] || ST.a[c.q] != null)) {
        if (BY[c.q] && !(ST.pre && ST.pre.indexOf(c.q) >= 0) && !visible(c.q)) return false;
        var v = ST.a[c.q], has = Array.isArray(v) ? v.indexOf(c.val) >= 0 : String(v == null ? '' : v) === String(c.val);
        if (c.op === 'isnot') return v != null && v !== '' && !has;
        return has;
      }
      return true;
    }
    function seq() { return PRE.concat(MAIN, POST).filter(function (id) { return BY[id] && visible(id); }); }
    function screenout(id, v) {
      var q = BY[id], o = q.options ? opts(id) : [];
      if (id === 'O1' && v === o[1]) return 'Menolak persetujuan';
      if (id === 'S2' && S.gender && S.gender !== 'all' && v !== S.gender) return 'Survei khusus responden ' + S.gender.toLowerCase();
      if (id === 'S3' && arr(v).some(function (x) { return o.slice(0, 3).indexOf(x) >= 0; })) return 'Bekerja di industri terkait';
      if (!q.std && q.options) {
        var hit = q.options.filter(function (x) { return x.screen && (v === x.t || arr(v).indexOf(x.t) >= 0); })[0];
        if (hit) return 'Tidak lolos kriteria: ' + id + ' = ' + hit.t;
      }
      return null;
    }

    // ---------- tampilan ----------
    function promoBox() {
      if (!G) return '';
      var hd = CFG.hadiah || [], rows = '';
      if (CFG.periodeLabel) rows += '<div class="pr-l">' + esc(CFG.periodeLabel) + '</div>';
      if (CFG.hadiahUtama) rows += '<div class="pr-u"><span>🎁 Hadiah utama</span><b>' + esc(CFG.hadiahUtama) + '</b></div>';
      if (hd.length) rows += '<div class="pr-s">' + (CFG.hadiahUtama ? 'Hadiah lainnya' : 'Hadiah') + '</div><ul>' + hd.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
      if (CFG.periode) rows += '<div class="pr-r"><span>📅 Periode Giveaway</span><b>' + esc(CFG.periode) + '</b></div>';
      if (CFG.announce) rows += '<div class="pr-r"><span>🏆 Pengumuman Pemenang</span><b>' + esc(CFG.announce) + '</b></div>';
      return rows ? '<div class="promo">' + rows + '<div class="pr-f">Pemenang dipilih secara acak dari respons yang lolos verifikasi dan diumumkan di Instagram ' + esc(CFG.ig) + '.</div></div>' : '';
    }
    function stepsBox() {
      var st = CFG.langkah || []; if (!G || !st.length) return '';
      return '<div class="steps"><div class="pr-s">Supaya bisa ikut diundi, lanjutkan langkah berikut:</div><ol><li class="ok">✅ Isi survei ini <b>(selesai!)</b></li>' + st.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></div>';
    }
    function cur() { var s = seq(), i = ST.cur ? s.indexOf(ST.cur) : 0; return { s: s, i: Math.max(i, 0) }; }
    function render() {
      var c = cur(), id = c.s[c.i], q = BY[id], v = ST.a[id];
      ST.cur = id; save();
      nav.style.display = '';
      document.getElementById('prog').style.width = Math.round(c.i / c.s.length * 100) + '%';
      btnB.style.visibility = c.i === 0 ? 'hidden' : 'visible';
      btnN.textContent = c.i === c.s.length - 1 ? 'Kirim jawaban' : id === 'O1' ? 'Mulai' : 'Lanjut';
      var h = PREVIEW ? '<div class="pvw">MODE PRATINJAU · jawaban tidak disimpan</div>' : '';
      h += '<div class="section">' + esc(q.topic || D.name) + '</div>';
      if (id === 'O1') h += promoBox();
      if (q.intro) h += '<p class="intro">' + esc(fill(q.intro)) + '</p>';
      h += '<h1>' + esc(fill(id === 'O1' ? (T.PERTANYAAN_PEMBUKA || q.text) : q.text)) + '</h1>';
      var hint = q.hint || (q.type === 'ma' ? (q.max ? 'Pilih maksimal ' + q.max + ' jawaban' : 'Boleh pilih lebih dari satu') : '');
      if (hint) h += '<p class="hint">' + esc(hint) + '</p>';
      if (id === 'O1' && (CFG.privacy || CFG.tnc)) h += '<p class="links">' + (CFG.privacy ? '<a href="' + esc(CFG.privacy) + '" target="_blank" rel="noopener">Kebijakan Privasi</a>' : '') + (CFG.privacy && CFG.tnc ? ' · ' : '') + (CFG.tnc ? '<a href="' + esc(CFG.tnc) + '" target="_blank" rel="noopener">Syarat & Ketentuan Giveaway</a>' : '') + '</p>';
      h += '<div id="body"></div><div class="err" id="err"></div><div class="wait" id="wait"></div>';
      if (id === 'O1') h += '<p class="ver">Versi ' + VERSION + ' · ' + esc(ID) + '</p>';
      app.innerHTML = h;
      var body = document.getElementById('body');
      ({ sa: rSA, ma: rMA, dropdown: rDrop, city: rCity, oa: rOA, num: rNum, scale: rScale })[q.type](body, q, id, v);
      if (id !== lastKey) { window.scrollTo(0, 0); lastKey = id; }
    }
    function optEl(type, name, o, on) {
      var l = document.createElement('label'); l.className = 'opt' + (on ? ' on' : '');
      var i = document.createElement('input'); i.type = type; i.name = name; i.checked = !!on;
      var s = document.createElement('span'); s.textContent = o.t;
      l.appendChild(i); l.appendChild(s); return { l: l, i: i };
    }
    function otherBox(K, show) {
      var d = document.createElement('div'); d.className = 'other'; d.style.display = show ? 'block' : 'none';
      var t = document.createElement('input'); t.type = 'text'; t.placeholder = 'Sebutkan...'; t.value = ST.a[K + '_lainnya'] || '';
      t.oninput = function () { ST.a[K + '_lainnya'] = t.value; save(); };
      d.appendChild(t); return d;
    }
    function rSA(body, q, K, v) {
      var w = document.createElement('div'); w.className = 'opts';
      optionsOf(q).forEach(function (o) {
        var e = optEl('radio', K, o, v === o.t);
        e.i.onchange = function () { ST.a[K] = o.t; if (!o.other) delete ST.a[K + '_lainnya']; save(); render(); };
        w.appendChild(e.l); if (o.other) w.appendChild(otherBox(K, v === o.t));
      });
      body.appendChild(w);
    }
    function rMA(body, q, K, v) {
      v = arr(v);
      var w = document.createElement('div'); w.className = 'opts';
      optionsOf(q).forEach(function (o) {
        var on = v.indexOf(o.t) >= 0, full = q.max && v.length >= q.max && !on;
        var e = optEl('checkbox', K, o, on); if (full) { e.l.className += ' dis'; e.i.disabled = true; }
        e.i.onchange = function () {
          var c = arr(ST.a[K]).slice();
          if (e.i.checked) { if (o.ex) c = [o.t]; else { c = c.filter(function (x) { return excl(q.id).indexOf(x) < 0; }); c.push(o.t); } }
          else c = c.filter(function (x) { return x !== o.t; });
          ST.a[K] = c; if (o.other && !e.i.checked) delete ST.a[K + '_lainnya'];
          save(); render();
        };
        w.appendChild(e.l); if (o.other) w.appendChild(otherBox(K, on));
      });
      body.appendChild(w);
    }
    function rDrop(body, q, K, v) {
      var s = document.createElement('select');
      s.innerHTML = '<option value="">— Pilih —</option>' + q.options.map(function (o) { return '<option' + (v === o.t ? ' selected' : '') + '>' + esc(o.t) + '</option>'; }).join('');
      var ob = null, other = q.options.filter(function (o) { return o.other; })[0];
      s.onchange = function () { ST.a[K] = s.value || undefined; save(); if (ob) ob.style.display = other && s.value === other.t ? 'block' : 'none'; };
      body.appendChild(s);
      if (other) { ob = otherBox(K, v === other.t); ob.style.marginLeft = 0; ob.style.marginTop = '8px'; body.appendChild(ob); }
    }
    function rCity(body, q, K, v) {
      var inp = document.createElement('input'); inp.type = 'text'; inp.placeholder = 'Ketik nama kota/kabupaten, mis. Bandung'; inp.value = v || ''; inp.autocomplete = 'off';
      var list = document.createElement('div'); list.className = 'opts'; list.style.marginTop = '8px';
      var hint = function (txt) { var p = document.createElement('p'); p.className = 'hint'; p.textContent = txt; list.appendChild(p); };
      var draw = function () {
        list.innerHTML = '';
        if (CITY[inp.value]) { var c0 = CITY[inp.value]; return hint('✓ ' + c0[0] + ', ' + c0[1]); }
        var qv = inp.value.toLowerCase().replace(/^(kota|kab\.?|kabupaten)\s+/, '').trim();
        if (qv.length < 2) return hint('Ketik minimal 2 huruf, lalu pilih dari daftar.');
        var hits = CITIES.filter(function (c) { return c[0].toLowerCase().indexOf(qv) >= 0; }).slice(0, 12);
        if (!hits.length) return hint('Tidak ditemukan. Coba ejaan lain.');
        hits.forEach(function (c) {
          var b = document.createElement('div'); b.className = 'opt';
          b.innerHTML = '<span><b>' + esc(c[0]) + '</b><br><small>' + esc(c[1]) + '</small></span>';
          b.onclick = function () { inp.value = c[0]; setCity(c[0]); draw(); };
          list.appendChild(b);
        });
      };
      inp.oninput = function () { setCity(CITY[inp.value] ? inp.value : null); draw(); };
      body.appendChild(inp); body.appendChild(list); draw();
    }
    function setCity(name) {
      var c = name && CITY[name];
      if (c) { ST.a.A1 = c[0]; ST.a.provinsi = c[1]; ST.a.tipe_wilayah = c[2]; ST.a.jabodetabek = c[3]; }
      else { delete ST.a.A1; delete ST.a.provinsi; delete ST.a.tipe_wilayah; delete ST.a.jabodetabek; }
      save();
    }
    function rOA(body, q, K, v) {
      var t = q.long ? document.createElement('textarea') : document.createElement('input');
      if (!q.long) t.type = (K === 'Z3' || K === 'PV') ? 'tel' : 'text';
      if (K === 'PV') t.maxLength = 4;
      if (q.placeholder) t.placeholder = q.placeholder;
      if (K === 'Z3' || K === 'PV') t.inputMode = 'numeric';
      t.value = v || ''; t.oninput = function () { ST.a[K] = t.value; save(); };
      body.appendChild(t);
    }
    function rNum(body, q, K, v) {
      var t = document.createElement('input'); t.type = 'text'; t.inputMode = 'decimal'; t.placeholder = 'Tulis angka';
      t.value = v == null ? '' : v; t.oninput = function () { ST.a[K] = t.value.replace(/[^\d.,-]/g, ''); save(); };
      body.appendChild(t);
    }
    function rScale(body, q, K, v) {
      var sc = q.scale || {}, mn = Number(sc.min == null ? 1 : sc.min), mx = Number(sc.max || 5);
      var g = document.createElement('div'); g.className = 'scale';
      for (var n = mn; n <= mx; n++) (function (n) {
        var b = document.createElement('button'); b.type = 'button'; b.textContent = n; if (Number(v) === n && v !== '' && v != null) b.className = 'on';
        b.onclick = function () { ST.a[K] = n; save(); render(); };
        g.appendChild(b);
      })(n);
      body.appendChild(g);
      if (sc.minLabel || sc.maxLabel) { var l = document.createElement('div'); l.className = 'npsl'; l.innerHTML = '<span>' + mn + ' = ' + esc(sc.minLabel || '') + '</span><span>' + mx + ' = ' + esc(sc.maxLabel || '') + '</span>'; body.appendChild(l); }
    }

    function validate(q) {
      var K = q.id, v = ST.a[K];
      if (q.optional && (v == null || v === '' || (Array.isArray(v) && !v.length))) return '';
      if (q.type === 'city') return CITY[v] ? '' : 'Mohon pilih kota/kabupaten dari daftar yang muncul.';
      if (q.type === 'ma') { if (!arr(v).length) return 'Mohon pilih minimal satu jawaban.'; }
      else if (q.type === 'scale') { if (v == null || v === '') return 'Mohon pilih salah satu nilai.'; }
      else if (v == null || String(v).trim() === '') return (q.type === 'oa' || q.type === 'num') ? 'Mohon isi jawaban Anda.' : 'Mohon pilih salah satu jawaban.';
      if (q.type === 'num') {
        var n = Number(String(v).replace(',', '.'));
        if (isNaN(n)) return 'Mohon isi dengan angka.';
        if (q.min !== '' && q.min != null && n < Number(q.min)) return 'Angka minimal ' + q.min + '.';
        if (q.maxNum !== '' && q.maxNum != null && n > Number(q.maxNum)) return 'Angka maksimal ' + q.maxNum + '.';
      }
      var other = (q.options || []).filter(function (o) { return o.other; })[0];
      if (other && (v === other.t || arr(v).indexOf(other.t) >= 0) && !(ST.a[K + '_lainnya'] || '').trim()) return 'Mohon sebutkan jawaban "Lainnya".';
      if (K === 'Z3' && !/^(\+?62|0)8\d{7,12}$/.test(String(v).replace(/[\s-]/g, ''))) return 'Format nomor WhatsApp belum sesuai (contoh: 081234567890).';
      if (K === 'Z2' && !/^@?[A-Za-z0-9._]{1,30}$/.test(String(v).trim())) return 'Format username Instagram belum sesuai (contoh: @namaanda).';
      return '';
    }
    function errBox(t) { document.getElementById('err').textContent = t; }
    function waitMsg(t) {
      var w = document.getElementById('wait'); if (!w) return;
      w.innerHTML = t ? '<i></i><span>' + t + '</span>' : ''; w.className = 'wait' + (t ? ' on' : '');
      [].forEach.call(document.querySelectorAll('#body input, #body textarea, #body select'), function (x) { x.disabled = !!t; });
    }
    var label = '';
    function busy(b, txt) { if (b) { label = btnN.textContent; btnN.textContent = txt || 'Memproses...'; } else if (label) btnN.textContent = label; btnN.disabled = b; }
    function go(d) { var c = cur(), n = c.s[c.i + d]; if (!n) return; ST.cur = n; save(); render(); }
    function next() {
      var c = cur(), id = c.s[c.i], q = BY[id];
      var e = validate(q); errBox(e); if (e) return;
      if (id === 'O1' && !ST.start) ST.start = Date.now();
      var so = screenout(id, ST.a[id]); if (so) return endScreenout(so);
      if (id === 'S0' || id === 'S0B') { ageBand(); save(); if (ST.a.S1 === S1O[0]) return endScreenout('Usia di bawah 18 tahun'); }
      if (id === 'PR' && ST.a.PR === opts('PR')[1]) { (ST.pre || []).forEach(function (x) { delete ST.a[x]; }); delete ST.pre; ST.profOk = false; save(); }
      if (id === 'PR' && ST.a.PR === opts('PR')[0]) { ST.profOk = true; save(); }
      if (id === 'Z2' && !PREVIEW) {
        busy(true, 'Memverifikasi...'); ST.known = false; delete ST.pre;
        waitMsg('Tunggu sesaat, kami sedang memverifikasi data kamu di database kami.');
        var done1 = false, go1 = function () { if (done1) return; done1 = true; waitMsg(''); busy(false); save(); go(1); };
        setTimeout(go1, 8000);
        return api('lookupIg', [ST.a.Z2, ID]).then(function (res) {
          if (done1) return; res = res || {};
          if (res.state === 'sudah_isi') { done1 = true; return endScreenout('Sudah pernah mengisi survei ini (Instagram sama)'); }
          if (res.state === 'diblokir' || res.state === 'suspend') { done1 = true; return endBlocked(res); }
          ST.known = PROF && !!res.known; ST.pvTry = 0; go1();
        }, go1);
      }
      if (id === 'PV') {
        var pv = String(ST.a.PV || '').replace(/\D/g, '');
        if (!pv) { go(1); ST.known = false; save(); return; }
        busy(true, 'Memverifikasi...'); waitMsg('Tunggu sesaat, kami sedang mencocokkan data kamu di database kami.');
        return api('verifyProfile', [ST.a.Z2, pv]).then(function (res) {
          waitMsg(''); busy(false);
          if (res && res.ok) {
            ST.pre = Object.keys(res.profile); ST.pre.forEach(function (x) { ST.a[x] = res.profile[x]; });
            ST.stale = !!res.stale; ST.prSum = ST.stale ? profSummary(res.profile) : ''; if (BY.PR) BY.PR.hint = ST.prSum;
            if (ST.a.S0) ageBand(); if (ST.a.S1 === S1O[0]) return endScreenout('Usia di bawah 18 tahun');
            save();
            for (var i = 0; i < ST.pre.length; i++) { var so2 = BY[ST.pre[i]] ? screenout(ST.pre[i], ST.a[ST.pre[i]]) : null; if (so2) return endScreenout(so2); }
            return go(1);
          }
          ST.pvTry = (ST.pvTry || 0) + 1;
          if (ST.pvTry >= 3) { delete ST.a.PV; go(1); ST.known = false; save(); return; }
          errBox('4 digit tidak cocok. Coba lagi, atau kosongkan lalu klik Lanjut untuk mengisi data diri dari awal.');
        }, function () { waitMsg(''); busy(false); go(1); ST.known = false; save(); });
      }
      if (c.i === c.s.length - 1) return submit();
      go(1);
    }
    function ageBand() {
      var y = ST.a.S0; if (!y) return;
      var age = /sebelum/.test(y) ? 99 : CY - parseInt(y, 10);
      if (age === 18) { if (!ST.a.S0B) return; age = ST.a.S0B === opts('S0B')[0] ? 18 : 17; } else delete ST.a.S0B;
      ST.a.S1 = age < 18 ? S1O[0] : age <= 24 ? S1O[1] : age <= 34 ? S1O[2] : age <= 44 ? S1O[3] : age <= 54 ? S1O[4] : S1O[5];
    }
    function profSummary(p) {
      return [p.S0 ? 'Lahir ' + p.S0 : p.S1, p.S2, p.A1, p.A4M || p.A4, p.A5, p.A7 ? 'Pengeluaran ' + p.A7 : ''].filter(Boolean).join(' · ');
    }
    function payload(extra) {
      var fp = [navigator.userAgent, navigator.language, screen.width + 'x' + screen.height, (Intl.DateTimeFormat().resolvedOptions().timeZone || '')].join('|');
      var hsh = 0; for (var i = 0; i < fp.length; i++) { hsh = ((hsh << 5) - hsh + fp.charCodeAt(i)) | 0; }
      var vis = {}; seq().forEach(function (x) { vis[x] = 1; });
      var a = {}; Object.keys(ST.a).forEach(function (k) { var base = k.replace(/_lainnya$/, ''); if (!BY[base] || vis[base] || (ST.pre && ST.pre.indexOf(base) >= 0)) a[k] = ST.a[k]; });
      var o = { sid: ST.sid, ver: VERSION, variant: ID, prefilled: !!(ST.pre && ST.pre.length), profOk: !!ST.profOk, answers: a, cats: [], durasi: ST.start ? Math.round((Date.now() - ST.start) / 1000) : '', src: SRC, ua: navigator.userAgent, fp: 'fp' + (hsh >>> 0).toString(36) };
      for (var x in extra) o[x] = extra[x];
      return o;
    }
    function submit() {
      if (PREVIEW) { clearSave(); return finish('Pratinjau selesai', 'Ini tampilan akhir survei. Di mode pratinjau, jawaban tidak disimpan.', '', stepsBox()); }
      busy(true, 'Mengirim...');
      api('submitResponse', [payload({})]).then(function () { clearSave(); done(); }, function (e) {
        busy(false); btnN.textContent = 'Coba kirim lagi';
        document.getElementById('err').innerHTML = 'Jawaban belum terkirim karena gangguan koneksi. Mohon tekan tombol kirim sekali lagi.' + (e && e.message ? '<br><small style="color:#9a8a7a;font-weight:400">Detail: ' + esc(String(e.message).slice(0, 160)) + '</small>' : '');
      });
    }
    function endScreenout(reason) {
      if (!PREVIEW) api('logScreenout', [payload({ reason: reason })]).then(function () {}, function () {});
      clearSave();
      if (/di bawah 18/.test(reason)) return finish('Terima kasih atas waktumu', 'Mohon maaf, survei dan giveaway ini hanya untuk peserta berusia 18 tahun ke atas.');
      var msg = /Sudah pernah/.test(reason) ? (CFG.teksSudahIsi || 'Akun Instagram ini sudah pernah mengisi survei ini.')
        : /Menolak/.test(reason) ? (CFG.teksMenolak || 'Tidak apa-apa kalau kamu belum ingin mengisi survei ini.')
        : (CFG.teksTidakEligible || 'Kamu belum termasuk kriteria survei ini.');
      finish('Terima kasih atas waktumu', msg, '', ctaButtons(false));
    }
    function endBlocked(res) {
      api('logScreenout', [payload({ reason: res.state === 'suspend' ? 'Akun suspend (riwayat asal-asalan)' : 'Akun diblokir (riwayat asal-asalan)' })]).then(function () {}, function () {});
      clearSave();
      var em = res.email || 'milgiftclub@gmail.com';
      var msg = res.state === 'suspend'
        ? 'Akses akun ini ke survei ' + ORG + ' ditutup sementara sampai ' + res.until + ' karena jawaban sebelumnya tidak lolos verifikasi kualitas.'
        : 'Akses akun ini ke survei ' + ORG + ' ditutup karena jawaban sebelumnya tidak lolos verifikasi kualitas. Untuk membuka kembali, kirim email ke ' + em + ' dengan menyertakan username Instagram dan nomor WhatsApp kamu.';
      finish('Akses survei ditutup', msg, '', CFG.linkIg ? '<div class="ctas"><a class="cta cta2" href="' + esc(CFG.linkIg) + '" target="_blank" rel="noopener">' + esc(CFG.tombolIg || 'Follow Instagram') + '</a></div>' : '');
    }
    function done() {
      finish('Terima kasih!', 'Jawaban kamu sudah kami terima.' + (G ? ' Pemenang diumumkan di Instagram ' + CFG.ig + (CFG.announce ? ' pada ' + CFG.announce : '') + '.' : ''), G ? (CFG.pesanPenutup || '') : '', stepsBox(), ctaButtons(true));
    }
    btnN.onclick = next;
    btnB.onclick = function () { errBox(''); go(-1); };
    window.__ctl = { at: function () { return ST.cur; }, done: function () { return !!window.__done; } };
    render();
  }
})();
</script>
</body>
</html>
