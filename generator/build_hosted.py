# Build versi hosting (Netlify/GitHub Pages) dari survey_out/Index.html.
# Tampilan sama persis; komunikasi ke Apps Script lewat fetch POST (doPost), bukan google.script.run.
import os, re, sys, json, subprocess

OUT = sys.argv[1] if len(sys.argv) > 1 else 'hosted/survei-milgift'
src = open('survey_out/Index.html').read()

i = src.index('<script>\nvar CFG = <?!= cfgJson ?>;')
j = src.rindex('</script>')
body = src[i + len('<script>\nvar CFG = <?!= cfgJson ?>;'):j]

BOOT = r'''<script src="%(cfgpath)s"></script>
<script>
(function () {
  var FIXED_VARIANT = '%(variant)s';
  var C = window.SURVEI_CONFIG || {};
  var API_URL = String(C[FIXED_VARIANT === 'v2' ? 'API_V2' : 'API_V1'] || '').trim();
  var app = document.getElementById('app');

  function qs(name) { var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(location.search); return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : ''; }
  function apiCall(fn, args) {
    return fetch(API_URL, { method: 'POST', body: JSON.stringify({ fn: fn, args: args }) })
      .then(function (r) { return r.text().then(function (t) {
        try { return JSON.parse(t); } catch (e) {
          throw new Error(/doPost/.test(t) ? 'API-1: kode Apps Script belum versi terbaru (doPost tidak ditemukan)'
            : /accounts\.google|ServiceLogin|signin/i.test(t) ? 'API-2: akses deployment belum "Siapa saja"'
            : 'API-3: respons server tidak dikenali (HTTP ' + r.status + ')');
        } }); }, function () { throw new Error('NET: tidak bisa menghubungi server (internet / URL di config.js)'); })
      .then(function (j) { if (!j || !j.ok) throw new Error('SRV: ' + ((j && j.error) || 'gagal')); return j.data; });
  }
  // pengganti google.script.run supaya kode survei tidak perlu diubah
  function runner(ok, fail) {
    var r = {
      withSuccessHandler: function (f) { return runner(f, fail); },
      withFailureHandler: function (f) { return runner(ok, f); }
    };
    ['assignCategories', 'logScreenout', 'submitResponse', 'checkIg', 'lookupIg', 'verifyProfile'].forEach(function (n) {
      r[n] = function () {
        var args = Array.prototype.slice.call(arguments);
        apiCall(n, args).then(function (d) { if (ok) ok(d); }, function (e) { if (fail) fail(e); });
      };
    });
    return r;
  }
  window.google = { script: { run: runner() } };

  function loading(msg, retry) {
    app.innerHTML = '<section class="card" style="text-align:center;padding:40px 20px"><p style="font-weight:700">' + msg + '</p>' +
      (retry ? '<p><button type="button" id="retry" style="margin-top:12px">Coba lagi</button></p>' : '') + '</section>';
    document.getElementById('nav').style.display = retry || msg ? 'none' : '';
    if (retry) document.getElementById('retry').onclick = boot;
  }
  function boot() {
    if (!API_URL || /TEMPEL/.test(API_URL)) { loading('Survei belum dikonfigurasi (API belum diisi di config.js).', false); return; }
    var src = qs('src') || qs('utm_source') || 'langsung';
    // Survei langsung tampil; pengaturan dari server dimuat di belakang layar
    // Nilai awal = pengaturan saat website dibuat; lalu cache kunjungan terakhir; lalu versi terbaru dari server
    var CFG = %(defaults)s;
    // Teks tampilan diambil dari config.js (bagian TAMPILAN) -> langsung tampil, tanpa menunggu server
    var T = C.TAMPILAN || {};
    var MAP = { PERIODE_LABEL: 'periodeLabel', HADIAH_UTAMA: 'hadiahUtama', HADIAH: 'hadiah', PERIODE_GIVEAWAY: 'periode',
      PENGUMUMAN_PEMENANG: 'announce', LINK_CEK_STATUS: 'linkCek', IG_HANDLE: 'ig', LANGKAH_PENUTUP: 'langkah', PESAN_PENUTUP: 'pesanPenutup', PRIVACY_URL: 'privacy', TNC_URL: 'tnc', TEKS_PEMBUKA: 'intro', PERTANYAAN_PEMBUKA: 'o1q', TEKS_TIDAK_ELIGIBLE: 'teksTidakEligible', TEKS_MENOLAK: 'teksMenolak', TEKS_SUDAH_ISI: 'teksSudahIsi', LINK_SURVEI_LAIN: 'linkLain', TOMBOL_SURVEI_LAIN: 'tombolLain', LINK_INSTAGRAM: 'linkIg', TOMBOL_INSTAGRAM: 'tombolIg' };
    for (var t in MAP) if (T[t] !== undefined) CFG[MAP[t]] = T[t];
    CFG.src = src; CFG.variant = FIXED_VARIANT;
    document.getElementById('nav').style.display = '';
    app.innerHTML = '';
    window.__startSurvey(CFG);
    var tries = 0;
    (function load() {
      apiCall('config', [FIXED_VARIANT, src]).then(function (cfg) {
        // dari server hanya diambil status buka/tutup & pengaturan kuota (tampilan tidak berubah)
        CFG.open = cfg.open; CFG.funnelAll = cfg.funnelAll; CFG.high = cfg.high || CFG.high;
        // periode & tanggal tutup selalu mengikuti Pengaturan Dashboard
        var ch = (cfg.periodeLabel && cfg.periodeLabel !== CFG.periodeLabel) || (cfg.periode && cfg.periode !== CFG.periode) || (cfg.announce && cfg.announce !== CFG.announce);
        if (cfg.periodeLabel) CFG.periodeLabel = cfg.periodeLabel; if (cfg.periode) CFG.periode = cfg.periode; if (cfg.announce) CFG.announce = cfg.announce;
        var ctl = window.__ctl; if (!ctl || ctl.done()) return;
        if (!CFG.open) return ctl.close();
        if (ch && ctl.at() === 'O1') ctl.render();
      }, function () { if (++tries < 3) setTimeout(load, 2000 * tries); });
    })();
  }
  window.__bootSurvey = boot;
})();

window.__startSurvey = function (CFG) {
%(body)s
};
window.__bootSurvey();
</script>'''

def defaults(variant):
    js = "const {makeEnv}=require('./tests/gsmock');const {ctx}=makeEnv();ctx.setup();process.stdout.write(JSON.stringify(ctx.publicConfig_(process.argv[1],'')))"
    out = subprocess.check_output(['node', '-e', js, variant], cwd=os.path.dirname(os.path.abspath(__file__)))
    d = json.loads(out); d.pop('src', None)
    return json.dumps(d, ensure_ascii=False)

def build(variant, path, cfgpath):
    lab = 'Semua Kategori' if variant == 'v1' else 'Fashion Wanita, Tas & Aksesori, Hijab'
    b = re.sub(r"var VERSION = '([^']*)';", lambda m: "var VERSION = '" + m.group(1) + ' · ' + lab + "';", body)
    html = src[:i] + BOOT % {'variant': variant, 'body': b, 'cfgpath': cfgpath, 'defaults': defaults(variant)} + src[j + len('</script>'):]
    html = html.replace('<base target="_top">\n', '')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w').write(html)

build('v1', os.path.join(OUT, 'index.html'), 'config.js')
build('v2', os.path.join(OUT, 'fokus', 'index.html'), '../config.js')
CONFIG_JS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'hosted_config.js')).read()
open(os.path.join(OUT, 'config.js'), 'w').write(CONFIG_JS)
print('ok', OUT)

# ---- halaman survei generik (survei yang dibuat dari Dashboard): /s/?id=... ----
m = re.search(r'var SCHEMAS = (\{.*?\});\nvar VARIANT', src, re.S)
schemas = json.loads(m.group(1))
STD_IDS = ['O1', 'Z2', 'PV', 'PR', 'S0', 'S0B', 'S1', 'S2', 'S3', 'A1', 'A18', 'A19', 'A4M', 'A4N', 'A4K', 'A5', 'A6', 'A7N', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A13H', 'A14', 'A15', 'A16', 'QC1', 'Z1', 'Z3']
std = {q['id']: q for q in schemas['v1'] if q['id'] in STD_IDS}
missing = [x for x in STD_IDS if x not in std]
assert not missing, missing
style = re.search(r'<style>.*?</style>', src, re.S).group(0)
ver = re.search(r"var VERSION = '([^']*)';", src).group(1)
tpl = open('survey_src/Custom.html.tpl').read()
html = tpl.replace('__STYLE__', style).replace('__STD__', json.dumps(std, ensure_ascii=False)).replace('__CITIES__', open('cities.json').read()).replace('__VERSION__', ver + ' · survei baru')
os.makedirs(os.path.join(OUT, 's'), exist_ok=True)
open(os.path.join(OUT, 's', 'index.html'), 'w').write(html)
print('ok s/')
# ---- halaman cek status giveaway: /cek/?ig=... ----
ck = open('survey_src/Cek.html.tpl').read().replace('__STYLE__', style)
os.makedirs(os.path.join(OUT, 'cek'), exist_ok=True)
open(os.path.join(OUT, 'cek', 'index.html'), 'w').write(ck)
print('ok cek/')
# ---- halaman Syarat & Ketentuan giveaway: /sk/ ----
sk = open('survey_src/SK.html.tpl').read().replace('__STYLE__', style)
os.makedirs(os.path.join(OUT, 'sk'), exist_ok=True)
open(os.path.join(OUT, 'sk', 'index.html'), 'w').write(sk)
print('ok sk/')
