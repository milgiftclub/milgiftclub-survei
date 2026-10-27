<!DOCTYPE html>
<html lang="id">
<head>
<base target="_top">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Survei Belanja Online — MIL Gift Club</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&family=Caveat:wght@600&display=swap" rel="stylesheet">
<style>
  :root{
    --cream:#FBF1E1; --cream2:#F6E6CC; --coral:#F2575D; --coral-d:#D9444A; --yellow:#F9C23C; --yellow-l:#FFF1C9;
    --brown:#4A2A1A; --brown2:#7A5440; --line:#EBD7B8; --white:#FFFFFF; --err:#C62828;
    --display:"Fredoka","Nunito",system-ui,sans-serif; --body:"Nunito",-apple-system,"Segoe UI",Roboto,Arial,sans-serif; --hand:"Caveat","Comic Sans MS",cursive;
  }
  *{box-sizing:border-box}
  html,body{margin:0;background:var(--cream);color:var(--brown);font-family:var(--body);font-size:16px;line-height:1.45;-webkit-text-size-adjust:100%}
  body{min-height:100vh;position:relative;overflow-x:hidden}
  .blob{position:fixed;z-index:0;pointer-events:none;border-radius:58% 42% 63% 37% / 45% 55% 45% 55%}
  .b1{width:230px;height:200px;background:var(--yellow);top:-90px;left:-110px;transform:rotate(-12deg)}
  .b2{width:210px;height:230px;background:var(--coral);top:-110px;right:-120px;transform:rotate(20deg);opacity:.9}
  .b3{width:240px;height:220px;background:var(--coral);bottom:-150px;right:-130px;opacity:.85}
  .b4{width:200px;height:190px;background:var(--yellow);bottom:-140px;left:-120px;transform:rotate(30deg);opacity:.9}
  header,main,nav{position:relative;z-index:1}
  header{padding:18px 16px 6px;text-align:center}
  .logo{font-family:var(--display);font-weight:700;color:var(--brown);font-size:26px;line-height:1;letter-spacing:.01em}
  .logo .dot{color:var(--coral)}
  .tag{font-size:10px;letter-spacing:.28em;color:var(--brown2);margin-top:6px;font-weight:700}
  .bar{max-width:520px;margin:14px auto 0;height:10px;background:var(--white);border:2px solid var(--line);border-radius:10px;overflow:hidden}
  .bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--yellow),var(--coral));border-radius:8px;transition:width .3s}
  main{max-width:560px;margin:0 auto;padding:16px 16px 130px}
  .section{font-size:12px;font-weight:800;letter-spacing:.14em;color:var(--coral);text-transform:uppercase;margin-bottom:6px}
  .catpill{display:inline-block;background:var(--yellow);color:var(--brown);font-size:13px;font-weight:800;padding:5px 14px;border-radius:999px;margin-bottom:10px;transform:rotate(-1.5deg);box-shadow:2px 2px 0 var(--brown)}
  h1{font-family:var(--display);font-weight:600;font-size:22px;line-height:1.3;margin:0 0 8px;color:var(--brown)}
  .intro{font-size:15px;color:var(--brown2);margin:0 0 14px;background:var(--white);border-radius:16px;padding:14px 16px;border:2px dashed var(--line)}
  .hint{font-size:14px;font-weight:700;color:var(--coral-d);margin:0 0 12px;line-height:1.4}
  .opts{display:flex;flex-direction:column;gap:9px}
  .opt{display:flex;gap:12px;align-items:flex-start;background:var(--white);border:2px solid var(--line);border-radius:16px;padding:13px 15px;cursor:pointer;user-select:none;min-height:50px;font-weight:600;transition:transform .08s,border-color .15s,background .15s}
  .opt:active{transform:scale(.99)}
  .opt input{margin:2px 0 0;accent-color:var(--coral);width:20px;height:20px;flex:none}
  .opt.on{border-color:var(--coral);background:var(--yellow-l);box-shadow:3px 3px 0 var(--coral)}
  .opt.dis{opacity:.45;cursor:not-allowed}
  .opt small{font-weight:600}
  .grp{font-family:var(--display);font-size:14px;font-weight:600;color:var(--coral-d);margin:14px 0 2px}
  .other{margin:4px 0 0 32px}
  input[type=text],input[type=tel],select,textarea{width:100%;font:inherit;font-weight:600;padding:13px 15px;border:2px solid var(--line);border-radius:16px;background:var(--white);color:var(--brown);outline:none}
  input:focus,select:focus,textarea:focus{border-color:var(--coral);box-shadow:0 0 0 3px rgba(242,87,93,.15)}
  textarea{min-height:110px;resize:vertical}
  .mrow{background:var(--white);border:2px solid var(--line);border-radius:16px;padding:13px;margin-bottom:10px}
  .mrow.miss{border-color:var(--err)}
  .mrow .lbl{font-weight:800;font-size:15px;margin-bottom:9px}
  .chips{display:flex;flex-wrap:wrap;gap:7px}
  .chip{border:2px solid var(--line);border-radius:999px;padding:7px 14px;font-size:14px;font-weight:700;cursor:pointer;background:var(--cream);user-select:none;color:var(--brown)}
  .chip.on{background:var(--coral);border-color:var(--coral);color:var(--white)}
  .nps{display:grid;grid-template-columns:repeat(11,1fr);gap:4px}
  .nps button{font-family:var(--display);font-size:16px;font-weight:600;padding:12px 0;border:2px solid var(--line);border-radius:12px;background:var(--white);cursor:pointer;color:var(--brown)}
  .nps button.on{background:var(--coral);color:var(--white);border-color:var(--coral)}
  .npsl{display:flex;justify-content:space-between;font-size:12px;color:var(--brown2);margin-top:6px;font-weight:600}
  .wait{display:none;align-items:center;gap:12px;margin-top:12px;padding:14px 16px;border-radius:14px;background:#EEF6FF;color:#1F3B73;font-size:14px;font-weight:700;line-height:1.45}
  .wait.on{display:flex}
  .wait i{flex:0 0 20px;width:20px;height:20px;border:3px solid #BFD6F6;border-top-color:#2F6FD6;border-radius:50%;animation:spin .8s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .err{color:var(--err);font-size:14px;font-weight:700;margin-top:12px;min-height:20px}
  nav{position:fixed;left:0;right:0;bottom:0;background:rgba(251,241,225,.94);backdrop-filter:blur(6px);border-top:2px solid var(--line);padding:12px 16px calc(12px + env(safe-area-inset-bottom));z-index:5}
  nav div{max-width:560px;margin:0 auto;display:flex;gap:10px}
  nav button{font-family:var(--display);font-size:17px;font-weight:600;border-radius:999px;padding:13px;cursor:pointer;border:0}
  #back{background:var(--white);color:var(--brown);border:2px solid var(--brown);flex:0 0 110px}
  #next{background:var(--coral);color:var(--white);flex:1;box-shadow:0 4px 0 var(--coral-d)}
  #next:active{transform:translateY(2px);box-shadow:0 2px 0 var(--coral-d)}
  #next[disabled]{opacity:.6;cursor:wait}
  .end{text-align:center;padding-top:30px}
  .end .big{font-size:56px}
  .end .note{margin-top:14px;background:var(--yellow-l);border:2px solid var(--yellow);border-radius:16px;padding:12px 16px;font-weight:800;font-size:15px;color:var(--brown);line-height:1.4}
  .end .note:before{content:'✨ '}
  .end .ctas{margin-top:16px}
  .end .cta2{background:var(--white)!important;color:var(--coral-d)!important;border:2px solid var(--coral);box-shadow:none!important}
  .end .cta{display:block;margin:12px 0 0;background:var(--coral);color:#fff;text-decoration:none;font-weight:800;font-size:16px;border-radius:16px;padding:14px 18px;box-shadow:0 4px 0 var(--coral-d)}
  .ver{font-size:11px;color:var(--brown2);opacity:.6;text-align:center;margin-top:18px}
  .links{font-size:14px;margin:10px 0 0;font-weight:700}
  .promo{background:var(--white);border:2px solid var(--line);border-radius:18px;padding:14px 16px;margin:0 0 16px;font-size:14.5px;color:var(--brown2)}
  .promo .pr-l{display:inline-block;background:var(--yellow-l);color:var(--brown);font-weight:800;font-size:12.5px;border-radius:20px;padding:4px 10px;margin-bottom:8px}
  .promo .pr-u{display:flex;flex-direction:column;margin-bottom:8px}
  .promo .pr-u span{font-weight:700;font-size:13px}
  .promo .pr-u b{font-family:var(--display);font-size:22px;color:var(--coral-d);line-height:1.2}
  .pr-s{font-weight:800;color:var(--brown);margin:2px 0 4px}
  .steps{text-align:left;background:var(--white);border:2px solid var(--line);border-radius:18px;padding:14px 16px;margin:14px 0 0;font-size:15px;color:var(--brown)}
  .steps ol{margin:4px 0 0;padding-left:22px}
  .steps li{margin:6px 0}
  .steps li.ok{color:var(--brown2)}
  .promo ul{margin:0 0 10px;padding-left:20px}
  .promo li{margin:2px 0;font-weight:700;color:var(--brown)}
  .promo .pr-r{display:flex;justify-content:space-between;gap:10px;border-top:1px dashed var(--line);padding:7px 0}
  .promo .pr-r span{white-space:nowrap}
  .promo .pr-r b{color:var(--brown);text-align:right}
  .promo .pr-f{font-size:12.5px;opacity:.8;margin-top:4px}
  .links a{color:var(--coral-d)}
  @media (max-width:380px){.nps{grid-template-columns:repeat(6,1fr)} h1{font-size:20px}}
</style>
</head>
<body>
<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="blob b4"></div>
<header>
  <div class="logo">MIL Gift Club<span class="dot">.</span></div>
  <div class="tag">INSIGHT · COMMUNITY · REWARDS</div>
  <div class="bar"><i id="prog"></i></div>
</header>
<main id="app"></main>
<nav id="nav"><div><button id="back" type="button">Kembali</button><button id="next" type="button">Lanjut</button></div></nav>

<script>
var CFG = <?!= cfgJson ?>;
var VERSION = '27 Okt 2026 · v30';
var SCHEMAS = __SCHEMA__;
var VARIANT = CFG.variant === 'v2' ? 'v2' : 'v1';
var SCHEMA = SCHEMAS[VARIANT];
var GROUPS = __GROUPS__;
var FASHION = __FASHION__;
var CITIES = __CITIES__; // [nama, provinsi, tipe, jabodetabek]

(function () {
  var BY = {}; SCHEMA.forEach(function (q) { BY[q.id] = q; });
  var PRE = ['O1','Z2','PV','PR','S0','S0B','S1','S2','S3','S4','SC1','S5','A1','A4M','A4N','A4K','A4','A5','A6','A7','A8','A9','A10','A11','A12','A13','A14','A15','A16','B2','B4','C1','C2'];
  var LOOP = SCHEMA.filter(function (q) { return q.loop; }).map(function (q) { return q.id; });
  var POST = ['D0','D1','D4','D5','Z1','Z3'];
  var CY = new Date().getFullYear();
  var MAIN_PLAT = ['Shopee', 'TikTok Shop', 'Tokopedia'];
  var MKT = ['Shopee', 'TikTok Shop', 'Tokopedia', 'Lazada', 'Blibli'];
  var CITY = {}; CITIES.forEach(function (c) { CITY[c[0]] = c; });
  var lastKey = null, keepY = 0;
  var ST = load() || { a: {}, cats: null, cur: null, sid: uid(), start: null, order: {} };
  if (ST.prSum && BY.PR) BY.PR.hint = ST.prSum;
  var app = document.getElementById('app'), btnN = document.getElementById('next'), btnB = document.getElementById('back');
  var api = window.google && google.script && google.script.run;

  function uid() { return 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function save() { try { sessionStorage.setItem('milsurvey_' + VARIANT, JSON.stringify(ST)); } catch (e) {} }
  function load() { try { var s = sessionStorage.getItem('milsurvey_' + VARIANT); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function clearSave() { try { sessionStorage.removeItem('milsurvey_' + VARIANT); } catch (e) {} }
  function key(id, k) { return k == null ? id : 'L' + (k + 1) + '_' + id; }
  function get(id, k) { return ST.a[key(id, k)]; }
  function opts(id) { return BY[id].options.map(function (o) { return o.t; }); }
  function excl(id) { return BY[id].options.filter(function (o) { return o.ex; }).map(function (o) { return o.t; }); }
  function arr(v) { return Array.isArray(v) ? v : []; }

  // ---------- piping ----------
  var ANCHOR = /^(Tidak|Lainnya|Belum pernah|Saya tidak|Kategori lain)/;
  function isAnchor(o) { return !!(o.ex || o.other || ANCHOR.test(o.t)); }
  function randomized(list, key) {
    // acak urutan opsi biasa; opsi "Lainnya / Tidak ... / eksklusif" tetap di akhir; urutan disimpan per responden
    var normal = list.filter(function (o) { return !isAnchor(o); }), tail = list.filter(isAnchor);
    var sig = normal.map(function (o) { return o.t; }).join('|');
    var saved = ST.order[key];
    if (!saved || saved.sig !== sig) { saved = ST.order[key] = { sig: sig, idx: shuffle(normal.map(function (o, i) { return i; })) }; save(); }
    return saved.idx.map(function (i) { return normal[i]; }).concat(tail);
  }
  function pipedOptions(q, k) {
    var list = q.options;
    if (q.pipe === 'S4' || q.pipe === 'S4-AW1') {
      var base = arr(get('S4')).filter(function (x) { return excl('S4').indexOf(x) < 0; });
      if (q.pipe === 'S4-AW1') base = base.filter(function (x) { return x !== get('AW1', k); });
      list = base.map(function (t) { return { t: t }; });
    }
    if (q.pipe === 'SC1') list = sc1Cats().map(function (t) { return { t: t }; });
    if (q.pipe === 'PROD') list = (q.byCat || {})[ST.cats && k != null ? ST.cats[k] : ''] || [{ t: 'Lainnya', other: true }];
    return q.rnd ? randomized(list, 'o_' + key(q.id, k)) : list;
  }
  function sc1Cats() { return BY.SC1 ? arr(get('SC1')).filter(function (x) { return excl('SC1').indexOf(x) < 0; }) : []; }
  function plats() { return arr(get('S4')).filter(function (x) { return excl('S4').indexOf(x) < 0; }); }
  function colsOf(q) { return q.pipeCols === 'MKT' ? plats().filter(function (x) { return MKT.indexOf(x) >= 0; }).concat(q.cols) : q.cols; }
  function isOtherCat(v) { return BY.C1.options.some(function (o) { return o.other && o.t === v; }); }
  function rowsOf(q) {
    if (q.pipe === 'C1') return arr(get('C1')).filter(function (x) { return excl('C1').indexOf(x) < 0; });
    return q.rndRows ? randomized(q.rows.map(function (r) { return { t: r }; }), 'r_' + q.id).map(function (o) { return o.t; }) : q.rows;
  }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  // ---------- visibility ----------
  function visible(id, k) {
    var o = function (x) { return opts(x); };
    if (k == null && ST.pre && ST.pre.indexOf(id) >= 0) return false; // profil sudah ada dari survei sebelumnya
    switch (id) {
      case 'PV': return !!ST.known;
      case 'PR': return !!ST.stale;
      case 'S1': case 'A4': return false; // diturunkan otomatis (tahun lahir / status & anak)
      case 'S0B': return get('S0') === String(CY - 18);
      case 'A4N': return shown('A4M') && !!get('A4M') && get('A4M') !== o('A4M')[0];
      case 'A4K': return shown('A4N') && !!get('A4N') && get('A4N') !== o('A4N')[0];
      case 'A15': return get('S2') === 'Wanita';
      case 'B2': return plats().length > 1;
      case 'C1': return BY.C1.pipe === 'SC1' ? sc1Cats().length > 1 : true;
      case 'B4': return colsOf(BY.B4).length > 2;
      case 'C2': return !!get('C1') && !isOtherCat(get('C1'));
      case 'AW6': return /^(Video pendek|Live shopping|Konten kreator|Iklan di media sosial)/.test(get('AW5', k) || '');
      case 'PU7': return [o('PU6')[0], o('PU6')[1]].indexOf(get('PU6', k)) >= 0;
      case 'LO2': var i = o('LO1').indexOf(get('LO1', k)); return i >= 0 && i < 4;
      case 'RE3': var r = arr(get('RE2', k)), rv = opts('RE2').slice(0, 6); return r.some(function (x) { return rv.indexOf(x) >= 0; });
      case 'FA1': case 'FA2': return !!(ST.cats && FASHION.indexOf(ST.cats[k]) >= 0);
      case 'G1': case 'G2': case 'G3': return ST.cats && ST.cats[k] === 'Bunga & tanaman';
      case 'OF2': case 'OF3': var of1 = o('OF1').indexOf(get('OF1', k)); return of1 === 0 || of1 === 1;
      case 'OF4': var of1b = o('OF1').indexOf(get('OF1', k)); return of1b === 1 || of1b === 2;
      case 'D4': var d1 = o('D1').indexOf(get('D1')); return d1 === 2 || d1 === 3;
    }
    return true;
  }
  function shown(id) { return (ST.pre && ST.pre.indexOf(id) >= 0) || visible(id); }
  function ageBand() {
    var y = get('S0'); if (!y) return;
    var age = /sebelum/.test(y) ? 99 : CY - parseInt(y, 10);
    if (age === 18) { if (!get('S0B')) return; age = get('S0B') === opts('S0B')[0] ? 18 : 17; } else delete ST.a.S0B;
    var o = opts('S1');
    ST.a.S1 = age < 18 ? o[0] : age <= 24 ? o[1] : age <= 34 ? o[2] : age <= 44 ? o[3] : age <= 54 ? o[4] : o[5];
  }
  function seq() {
    var s = [];
    var push = function (id, k) { if (BY[id] && visible(id, k)) s.push({ id: id, k: k }); };
    PRE.forEach(function (id) { push(id); });
    var cats = ST.cats || [];
    if (ST.cats !== null) {
      if (cats.length) LOOP.forEach(function (id) { push(id, 0); });
      push('QC1');
      POST.forEach(function (id) { push(id); });
    }
    return s;
  }
  function screenout(id, v) {
    var o = opts(id);
    if (id === 'O1' && v === o[1]) return 'Menolak persetujuan';
    if (id === 'S1' && v === o[0]) return 'Usia di bawah 18 tahun';
    if (id === 'S2' && VARIANT === 'v2' && v === 'Pria') return 'Survei v2 khusus responden wanita';
    if (id === 'SC1' && arr(v).some(function (x) { return excl('SC1').indexOf(x) >= 0; })) return 'Tidak membeli kategori fokus dalam 1 bulan terakhir';
    if (id === 'S3' && arr(v).some(function (x) { return o.slice(0, 3).indexOf(x) >= 0; })) return 'Bekerja di industri terkait';
    if (id === 'S4' && !arr(v).some(function (x) { return MAIN_PLAT.indexOf(x) >= 0; })) return 'Tidak berbelanja di Shopee/TikTok Shop/Tokopedia dalam 1 bulan';
    return null;
  }

  // ---------- text ----------
  var LO1MAP = ['brand yang sama', 'toko / seller yang sama', 'platform yang sama', 'kreator / host live yang sama'];
  function prodName(k) {
    var p = get('PT1', k), cat = ST.cats && k != null ? ST.cats[k] : '';
    if (p && p !== 'Lainnya') return p;
    return (ST.a[key('PT1', k) + '_lainnya'] || '').trim() || cat || 'produk tersebut';
  }
  function fill(t, k) {
    return t.replace(/\{CAT\}/g, ST.cats && k != null ? ST.cats[k] : (get('C1') || ''))
      .replace(/\{B2\}/g, get('B2') || 'platform utama Anda')
      .replace(/\{AW1\}/g, get('AW1', k) || 'platform tersebut')
      .replace(/\{LO1X\}/g, LO1MAP[opts('LO1').indexOf(get('LO1', k))] || 'pilihan tersebut')
      .replace(/\{PT1X\}/g, prodName(k)).replace(/\{TANGGAL\}/g, CFG.announce).replace(/@milgift_club/g, ig());
  }
  function ig() { return CFG.ig || '@milgift_club'; }
  function igfix(t) { return String(t).replace(/@milgift_club/g, ig()); }
  function promoBox() {
    var hd = CFG.hadiah || [], rows = '';
    if (CFG.periodeLabel) rows += '<div class="pr-l">' + esc(CFG.periodeLabel) + '</div>';
    if (CFG.hadiahUtama) rows += '<div class="pr-u"><span>🎁 Hadiah utama</span><b>' + esc(CFG.hadiahUtama) + '</b></div>';
    if (hd.length) rows += '<div class="pr-s">' + (CFG.hadiahUtama ? 'Hadiah lainnya' : 'Hadiah') + '</div><ul>' + hd.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    if (CFG.periode) rows += '<div class="pr-r"><span>📅 Periode Giveaway</span><b>' + esc(CFG.periode) + '</b></div>';
    if (CFG.announce && !/^\[/.test(CFG.announce)) rows += '<div class="pr-r"><span>🏆 Pengumuman Pemenang</span><b>' + esc(CFG.announce) + '</b></div>';
    return rows ? '<div class="promo">' + rows + '<div class="pr-f">Pemenang dipilih secara acak dari respons yang lolos verifikasi dan diumumkan di Instagram ' + esc(ig()) + '.</div></div>' : '';
  }
  function ctaButtons(igFirst) {
    var ig = CFG.linkIg ? '<a class="cta ' + (igFirst ? '' : 'cta2') + '" href="' + esc(CFG.linkIg) + '" target="_blank" rel="noopener">' + esc(CFG.tombolIg || ('Follow ' + ig())) + '</a>' : '';
    var sv = CFG.linkLain ? '<a class="cta ' + (igFirst ? 'cta2' : '') + '" href="' + esc(CFG.linkLain) + '">' + esc(CFG.tombolLain || 'Isi survei lainnya') + ' →</a>' : '';
    return '<div class="ctas">' + (igFirst ? ig + sv : sv + ig) + '</div>';
  }
  function stepsBox() {
    var st = CFG.langkah || [];
    if (!st.length) return '';
    return '<div class="steps"><div class="pr-s">Supaya bisa ikut diundi, lanjutkan langkah berikut:</div><ol>' +
      '<li class="ok">✅ Isi survei ini <b>(selesai!)</b></li>' + st.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></div>';
  }
  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }

  // ---------- render ----------
  function cur() { var s = seq(); var i = ST.cur ? s.findIndex(function (x) { return x.id === ST.cur.id && (x.k == null ? null : x.k) === (ST.cur.k == null ? null : ST.cur.k); }) : 0; return { s: s, i: Math.max(i, 0) }; }

  function render() {
    keepY = window.scrollY;
    var c = cur(), step = c.s[c.i];
    ST.cur = step; save();
    var q = BY[step.id], k = step.k, K = key(q.id, k), v = ST.a[K];
    document.getElementById('prog').style.width = Math.round(c.i / (c.s.length + (ST.cats === null ? 50 : 0)) * 100) + '%';
    btnB.style.visibility = c.i === 0 ? 'hidden' : 'visible';
    btnN.textContent = q.id === 'Z3' ? 'Kirim jawaban' : q.id === 'O1' ? 'Mulai' : 'Lanjut';
    var h = '<div class="section">' + esc(q.topic) + '</div>';
    if (k != null) h += '<div class="catpill">' + (get('PT1', k) ? esc(ST.cats[k]) + ' · ' + esc(prodName(k)) : 'Kategori: ' + esc(ST.cats[k])) + '</div>';
    if (q.id === 'O1') h += promoBox();
    var intro = (q.id === 'O1' && CFG.intro) || q.intro;
    if (intro) h += '<p class="intro">' + esc(fill(intro, k)) + '</p>';
    h += '<h1>' + esc(fill((q.id === 'O1' && CFG.o1q) || q.text, k)) + '</h1>';
    var hint = q.hint || (q.type === 'ma' ? (q.max ? 'Pilih maksimal ' + q.max + ' jawaban' : 'Boleh pilih lebih dari satu') : '');
    if (hint) h += '<p class="hint">' + esc(hint) + '</p>';
    if (q.id === 'O1' && (CFG.privacy || CFG.tnc)) {
      h += '<p class="links">' + (CFG.privacy ? '<a href="' + esc(CFG.privacy) + '" target="_blank" rel="noopener">Kebijakan Privasi</a>' : '') +
        (CFG.privacy && CFG.tnc ? ' · ' : '') + (CFG.tnc ? '<a href="' + esc(CFG.tnc) + '" target="_blank" rel="noopener">Syarat & Ketentuan Giveaway</a>' : '') + '</p>';
    }
    h += '<div id="body"></div><div class="err" id="err"></div><div class="wait" id="wait"></div>';
    if (q.id === 'O1') h += '<p class="ver">Versi ' + VERSION + '</p>';
    app.innerHTML = h;
    var body = document.getElementById('body');
    ({ sa: rSA, dropdown: rDrop, city: rCity, ma: rMA, matrix_sa: rMatrix, matrix_ma: rMatrix, nps: rNPS, oa: rOA })[q.type](body, q, k, K, v);
    if (K !== lastKey) { window.scrollTo(0, 0); lastKey = K; } else window.scrollTo(0, keepY);
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
  function rSA(body, q, k, K, v) {
    var w = document.createElement('div'); w.className = 'opts';
    var lastG = null;
    pipedOptions(q, k).forEach(function (o) {
      var gname = q.id === 'C1' ? (GROUPS[o.t] || 'Lainnya') : null;
      if (gname && gname !== lastG) { lastG = gname; var gEl = document.createElement('div'); gEl.className = 'grp'; gEl.textContent = gname; w.appendChild(gEl); }
      var e = optEl('radio', K, o, v === o.t);
      var ob = o.other ? otherBox(K, v === o.t) : null;
      e.i.onchange = function () { ST.a[K] = o.t; if (!o.other) delete ST.a[K + '_lainnya']; save(); render(); };
      w.appendChild(e.l); if (ob) w.appendChild(ob);
    });
    body.appendChild(w);
  }
  function rDrop(body, q, k, K, v) {
    var s = document.createElement('select');
    s.innerHTML = '<option value="">— Pilih —</option>' + q.options.map(function (o) { return '<option' + (v === o.t ? ' selected' : '') + '>' + esc(o.t) + '</option>'; }).join('');
    s.onchange = function () { ST.a[K] = s.value || undefined; save(); };
    body.appendChild(s);
  }
  function rCity(body, q, k, K, v) {
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
        b.innerHTML = '<span><b>' + esc(c[0]) + '</b><br><small style="color:var(--grey)">' + esc(c[1]) + '</small></span>';
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
  function rMA(body, q, k, K, v) {
    v = arr(v);
    var w = document.createElement('div'); w.className = 'opts';
    var list = pipedOptions(q, k), lastG = null;
    list.forEach(function (o) {
      if (q.id === 'C1' && GROUPS[o.t] && GROUPS[o.t] !== lastG) { lastG = GROUPS[o.t]; var g = document.createElement('div'); g.className = 'grp'; g.textContent = lastG; w.appendChild(g); }
      if (q.id === 'C1' && o.ex) { var g2 = document.createElement('div'); g2.className = 'grp'; g2.textContent = ' '; w.appendChild(g2); }
      var on = v.indexOf(o.t) >= 0, full = q.max && v.length >= q.max && !on;
      var e = optEl('checkbox', K, o, on); if (full) { e.l.className += ' dis'; e.i.disabled = true; }
      e.i.onchange = function () {
        var cur = arr(ST.a[K]).slice();
        if (e.i.checked) {
          if (o.ex) cur = [o.t];
          else { cur = cur.filter(function (x) { return excl(q.id).indexOf(x) < 0; }); cur.push(o.t); }
        } else cur = cur.filter(function (x) { return x !== o.t; });
        ST.a[K] = cur; if (!o.other || !e.i.checked) { if (o.other) delete ST.a[K + '_lainnya']; }
        save(); render();
      };
      w.appendChild(e.l);
      if (o.other) w.appendChild(otherBox(K, on));
    });
    body.appendChild(w);
  }
  function rMatrix(body, q, k, K, v) {
    v = v || {};
    var multi = q.type === 'matrix_ma';
    rowsOf(q).forEach(function (row) {
      var d = document.createElement('div'); d.className = 'mrow'; d.dataset.row = row;
      d.innerHTML = '<div class="lbl">' + esc(row) + '</div>';
      var ch = document.createElement('div'); ch.className = 'chips';
      colsOf(q).forEach(function (col) {
        var sel = multi ? arr(v[row]).indexOf(col) >= 0 : v[row] === col;
        var c = document.createElement('span'); c.className = 'chip' + (sel ? ' on' : ''); c.textContent = col; c.setAttribute('role', 'button'); c.tabIndex = 0;
        c.onclick = function () {
          var m = Object.assign({}, ST.a[K] || {});
          if (multi) {
            var cur = arr(m[row]).slice(), isEx = col === q.colEx;
            if (cur.indexOf(col) >= 0) cur = cur.filter(function (x) { return x !== col; });
            else cur = isEx ? [col] : cur.filter(function (x) { return x !== q.colEx; }).concat([col]);
            m[row] = cur;
          } else m[row] = col;
          ST.a[K] = m; save(); render();
        };
        ch.appendChild(c);
      });
      d.appendChild(ch); body.appendChild(d);
    });
  }
  function rNPS(body, q, k, K, v) {
    var g = document.createElement('div'); g.className = 'nps';
    for (var n = 0; n <= 10; n++) (function (n) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = n; if (v === n) b.className = 'on';
      b.onclick = function () { ST.a[K] = n; save(); render(); };
      g.appendChild(b);
    })(n);
    body.appendChild(g);
    var l = document.createElement('div'); l.className = 'npsl'; l.innerHTML = '<span>0 = Sangat tidak mungkin</span><span>10 = Sangat mungkin</span>';
    body.appendChild(l);
  }
  function rOA(body, q, k, K, v) {
    var t = q.long ? document.createElement('textarea') : document.createElement('input');
    if (!q.long) t.type = (q.id === 'Z3' || q.id === 'PV') ? 'tel' : 'text';
    if (q.id === 'PV') t.maxLength = 4;
    if (q.placeholder) t.placeholder = q.placeholder;
    if (q.id === 'Z3' || q.id === 'PV') t.inputMode = 'numeric';
    t.value = v || ''; t.oninput = function () { ST.a[K] = t.value; save(); };
    body.appendChild(t);
  }

  // ---------- validation ----------
  function validate(q, k) {
    var K = key(q.id, k), v = ST.a[K];
    if (q.optional) return '';
    if (q.type === 'matrix_sa' || q.type === 'matrix_ma') {
      var miss = rowsOf(q).filter(function (r) { var x = (v || {})[r]; return q.type === 'matrix_ma' ? !arr(x).length : !x; });
      document.querySelectorAll('.mrow').forEach(function (d) { d.classList.toggle('miss', miss.indexOf(d.dataset.row) >= 0); });
      return miss.length ? 'Mohon lengkapi semua baris.' : '';
    }
    if (q.type === 'city') return CITY[v] ? '' : 'Mohon pilih kota/kabupaten dari daftar yang muncul.';
    if (q.type === 'ma') { if (!arr(v).length) return 'Mohon pilih minimal satu jawaban.'; }
    else if (q.type === 'nps') { if (typeof v !== 'number') return 'Mohon pilih nilai 0-10.'; }
    else if (v == null || String(v).trim() === '') return q.type === 'oa' ? 'Mohon isi jawaban Anda.' : 'Mohon pilih salah satu jawaban.';
    var other = (q.byCat ? pipedOptions(q, k) : (q.options || [])).filter(function (o) { return o.other; })[0];
    if (other && (v === other.t || arr(v).indexOf(other.t) >= 0) && !(ST.a[K + '_lainnya'] || '').trim()) return 'Mohon sebutkan jawaban "Lainnya".';
    if (q.id === 'Z3' && !/^(\+?62|0)8\d{7,12}$/.test(String(v).replace(/[\s-]/g, ''))) return 'Format nomor WhatsApp belum sesuai (contoh: 081234567890).';
    if (q.id === 'Z2' && !/^@?[A-Za-z0-9._]{1,30}$/.test(String(v).trim())) return 'Format username Instagram belum sesuai (contoh: @namaanda).';
    return '';
  }

  // ---------- navigation ----------
  function waitMsg(t) {
    var w = document.getElementById('wait'); if (!w) return;
    w.innerHTML = t ? '<i></i><span>' + t + '</span>' : ''; w.className = 'wait' + (t ? ' on' : '');
    [].forEach.call(document.querySelectorAll('#body input, #body textarea'), function (x) { x.disabled = !!t; });
  }
  function busy(b) { btnN.disabled = b; btnN.textContent = b ? 'Memproses...' : btnN.textContent; }
  function call(fn, arg, ok, fail) {
    if (!api) { setTimeout(function () { ok(arg.slice(0, 1)); }, 50); return; }
    google.script.run.withSuccessHandler(ok).withFailureHandler(fail)[fn](arg, ST.sid);
  }
  function callP(fn, arg, ok, fail) {
    if (!api) { setTimeout(function () { ok({ ok: true }); }, 50); return; }
    google.script.run.withSuccessHandler(ok).withFailureHandler(fail)[fn](arg);
  }
  function next() {
    var c = cur(), step = c.s[c.i], q = BY[step.id];
    var e = validate(q, step.k); document.getElementById('err').textContent = e;
    if (e) return;
    if (q.id === 'O1' && !ST.start) ST.start = Date.now();
    var so = step.k == null ? screenout(q.id, ST.a[q.id]) : null;
    if (so) return endScreenout(so);
    if (q.id === 'S0' || q.id === 'S0B') { ageBand(); save(); if (ST.a.S1 === opts('S1')[0]) return endScreenout('Usia di bawah 18 tahun'); }
    if (q.id === 'PR' && ST.a.PR === opts('PR')[1]) { (ST.pre || []).forEach(function (x) { delete ST.a[x]; }); delete ST.pre; ST.profOk = false; save(); }
    if (q.id === 'PR' && ST.a.PR === opts('PR')[0]) { ST.profOk = true; save(); }
    if (q.id === 'S4') {
      var p = plats();
      if (p.length === 1) ST.a.B2 = p[0]; else if (p.indexOf(ST.a.B2) < 0) delete ST.a.B2;
      if (ST.a.B4) { var cs = colsOf(BY.B4), mm = {}; Object.keys(ST.a.B4).forEach(function (r) { if (cs.indexOf(ST.a.B4[r]) >= 0) mm[r] = ST.a.B4[r]; }); ST.a.B4 = mm; }
      save();
    }
    if (q.id === 'SC1') {
      var sc = sc1Cats();
      if (sc.indexOf(ST.a.C1) < 0) delete ST.a.C1;
      if (sc.length === 1) { ST.a.C1 = sc[0]; busy(true); return assign([sc[0]], function () { busy(false); go(1); }); }
      save();
    }
    if (q.id === 'Z2' && api) {
      busy(true); ST.known = false; delete ST.pre; btnN.textContent = 'Memverifikasi...';
      waitMsg('Tunggu sesaat, kami sedang memverifikasi data kamu di database kami.');
      var done1 = false, go1 = function () { if (done1) return; done1 = true; waitMsg(''); busy(false); save(); go(1); };
      setTimeout(go1, 8000); // server lambat -> lanjut saja, cek ganda tetap dilakukan saat kirim
      return google.script.run.withSuccessHandler(function (res) {
        if (done1) return;
        res = res || {};
        if (res.state === 'sudah_isi') { done1 = true; waitMsg(''); busy(false); return endScreenout('Sudah pernah mengisi survei ini (Instagram sama)'); }
        if (res.state === 'diblokir' || res.state === 'suspend') { done1 = true; waitMsg(''); busy(false); return endBlocked(res); }
        ST.known = !!res.known; ST.pvTry = 0;
        go1();
      }).withFailureHandler(go1).lookupIg(ST.a.Z2, VARIANT);
    }
    if (q.id === 'PV') {
      var pv = String(ST.a.PV || '').replace(/\D/g, '');
      if (!pv) { go(1); ST.known = false; save(); return; }
      busy(true); btnN.textContent = 'Memverifikasi...';
      waitMsg('Tunggu sesaat, kami sedang mencocokkan data kamu di database kami.');
      return google.script.run.withSuccessHandler(function (res) {
        waitMsg(''); busy(false); btnN.textContent = 'Lanjut';
        if (res && res.ok) {
          ST.pre = Object.keys(res.profile);
          ST.pre.forEach(function (x) { ST.a[x] = res.profile[x]; });
          ST.stale = !!res.stale; ST.prSum = ST.stale ? profSummary(res.profile) : ''; if (BY.PR) BY.PR.hint = ST.prSum;
          if (ST.a.S0) ageBand();
          save();
          for (var i = 0; i < ST.pre.length; i++) { var so2 = BY[ST.pre[i]] ? screenout(ST.pre[i], ST.a[ST.pre[i]]) : null; if (so2) return endScreenout(so2); }
          return go(1);
        }
        ST.pvTry = (ST.pvTry || 0) + 1;
        if (ST.pvTry >= 3) { delete ST.a.PV; go(1); ST.known = false; save(); return; }
        document.getElementById('err').textContent = '4 digit tidak cocok. Coba lagi, atau kosongkan lalu klik Lanjut untuk mengisi data diri dari awal.';
      }).withFailureHandler(function () { waitMsg(''); busy(false); go(1); ST.known = false; save(); }).verifyProfile(ST.a.Z2, pv);
    }
    if (q.id === 'C1') {
      var c1 = ST.a.C1;
      var eligible = !isOtherCat(c1) && (CFG.funnelAll !== false || (CFG.high || []).indexOf(c1) >= 0);
      busy(true);
      return assign(eligible ? [c1] : [], function () { busy(false); go(1); });
    }
    if (q.id === 'Z3') return submit();
    go(1);
  }
  function profSummary(p) {
    return [p.S0 ? 'Lahir ' + p.S0 : p.S1, p.S2, p.A1, p.A4M || p.A4, p.A5, p.A7 ? 'Pengeluaran ' + p.A7 : ''].filter(Boolean).join(' · ');
  }
  function netErr() { busy(false); btnN.textContent = 'Lanjut'; document.getElementById('err').textContent = 'Koneksi bermasalah. Silakan coba lagi.'; }
  function setCats(nc) {
    if (JSON.stringify(ST.cats) !== JSON.stringify(nc)) Object.keys(ST.a).forEach(function (x) { if (/^L[12]_/.test(x)) delete ST.a[x]; });
    ST.cats = nc; if (nc) ST.a.kategori_ditugaskan = nc.slice(); else delete ST.a.kategori_ditugaskan;
  }
  function assign(list, then) {
    if (!list.length) { setCats([]); return then(); }
    // kategori langsung dipakai; pencatatan kuota ke server berjalan di belakang (tidak membuat responden menunggu)
    setCats(list.slice(0, 1)); save();
    if (api) call('assignCategories', list, function () {}, function () {});
    then();
  }
  function go(d) {
    var c = cur(), n = c.s[c.i + d];
    if (!n) return;
    ST.cur = n; save(); render();
  }
  function payload(extra) {
    var fp = [navigator.userAgent, navigator.language, screen.width + 'x' + screen.height, (Intl.DateTimeFormat().resolvedOptions().timeZone || '')].join('|');
    var hsh = 0; for (var i = 0; i < fp.length; i++) { hsh = ((hsh << 5) - hsh + fp.charCodeAt(i)) | 0; }
    var o = { sid: ST.sid, ver: VERSION, variant: VARIANT, prefilled: !!(ST.pre && ST.pre.length), profOk: !!ST.profOk, answers: ST.a, cats: ST.cats || [], durasi: ST.start ? Math.round((Date.now() - ST.start) / 1000) : '', src: CFG.src, ua: navigator.userAgent, fp: 'fp' + (hsh >>> 0).toString(36) };
    for (var x in extra) o[x] = extra[x];
    return o;
  }
  function submit() {
    busy(true);
    callP('submitResponse', payload({}), function () { clearSave(); done(); }, function (e) {
      busy(false); btnN.textContent = 'Coba kirim lagi';
      document.getElementById('err').innerHTML = 'Jawaban belum terkirim karena gangguan koneksi. Mohon tekan tombol kirim sekali lagi.' +
        (e && e.message ? '<br><small style="color:#9a8a7a;font-weight:400">Detail: ' + esc(String(e.message).slice(0, 160)) + '</small>' : '');
    });
  }
  function endScreenout(reason) {
    busy(true);
    callP('logScreenout', payload({ reason: reason }), function () {}, function () {});
    clearSave();
    // Semua yang tidak lolos / menolak diarahkan ke survei lainnya, KECUALI usia di bawah 18 tahun
    if (!/di bawah 18/.test(reason)) {
      var msg = /Sudah pernah/.test(reason)
        ? (CFG.teksSudahIsi || 'Akun Instagram ini sudah pernah mengisi survei ini. Satu akun hanya bisa ikut satu kali. Tapi jangan khawatir, kamu masih bisa memenangkan hadiah dengan mengisi survei lainnya.')
        : /Menolak/.test(reason)
        ? (CFG.teksMenolak || 'Tidak apa-apa kalau kamu belum ingin mengisi survei ini. Kamu masih bisa memenangkan hadiah dengan mengisi survei lainnya.')
        : (CFG.teksTidakEligible || 'Kamu belum termasuk kriteria survei ini. Tapi jangan khawatir, kamu masih bisa memenangkan hadiah dengan mengisi survei lainnya.');
      return finish('Terima kasih atas waktumu', msg, '', ctaButtons(false));
    }
    finish('Terima kasih atas waktumu', 'Mohon maaf, survei dan giveaway ini hanya untuk peserta berusia 18 tahun ke atas.');
  }
  function endBlocked(res) {
    callP('logScreenout', payload({ reason: res.state === 'suspend' ? 'Akun suspend (riwayat asal-asalan)' : 'Akun diblokir (riwayat asal-asalan)' }), function () {}, function () {});
    clearSave();
    var em = res.email || 'milgiftclub@gmail.com';
    var msg = res.state === 'suspend'
      ? 'Akses akun ini ke survei MIL Gift Club ditutup sementara sampai ' + res.until + ' karena jawaban sebelumnya tidak lolos verifikasi kualitas.'
      : 'Akses akun ini ke survei MIL Gift Club ditutup karena jawaban sebelumnya tidak lolos verifikasi kualitas. Untuk membuka kembali, kirim email ke ' + em + ' dengan menyertakan username Instagram dan nomor WhatsApp kamu.';
    var ig = CFG.linkIg ? '<div class="ctas"><a class="cta cta2" href="' + esc(CFG.linkIg) + '" target="_blank" rel="noopener">' + esc(CFG.tombolIg || 'Follow Instagram') + '</a></div>' : '';
    finish('Akses survei ditutup', msg, '', ig);
  }
  function done() { var z = BY.Z5; finish('Terima kasih!', fill(z.text, null).replace(/^Terima kasih!\s*/, ''), (CFG.pesanPenutup || 'Isi survei lainnya untuk memperbesar kesempatan kamu menang!'), stepsBox(), ctaButtons(true)); }
  function finish(t, m, note, extra, after) {
    document.getElementById('nav').style.display = 'none';
    document.getElementById('prog').style.width = '100%';
    app.innerHTML = '<div class="end"><div class="big">🎁</div><h1>' + esc(t) + '</h1><p class="intro">' + esc(igfix(m)) + '</p>' + (extra || '') + (note ? '<div class="note">' + esc(note) + '</div>' : '') + (after || '') + '</div>';
    window.__done = true;
  }
  btnN.onclick = next;
  btnB.onclick = function () { document.getElementById('err').textContent = ''; go(-1); };

  window.__ctl = { render: render, at: function () { return ST.cur && ST.cur.id; }, done: function () { return !!window.__done; },
    close: function () { finish('Survei telah ditutup', 'Terima kasih atas minat Anda. Pantau Instagram @milgift_club untuk survei dan giveaway berikutnya.', '', ctaButtons(true)); } };
  if (!CFG.open) { finish('Survei telah ditutup', 'Terima kasih atas minat Anda. Pantau Instagram @milgift_club untuk survei dan giveaway berikutnya.', '', ctaButtons(true)); return; }
  render();
  window.__ST = ST; window.__seq = seq;
})();
</script>
</body>
</html>
