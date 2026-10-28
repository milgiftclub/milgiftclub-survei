# Versi Apps Script dari halaman website (site/): tampilan & teks persis sama dengan versi website,
# tapi disajikan langsung oleh link script.google.com (tanpa Netlify).
#   site/semua/index.html -> survey_out/Web_v1.html (site/index.html = halaman depan daftar survei)
#   site/fokus/index.html -> survey_out/Web_v2.html
#   site/s/index.html     -> survey_out/Web_s.html   (survei yang dibuat dari Dashboard)
import os, sys
SITE = sys.argv[1] if len(sys.argv) > 1 else '../site'
cfg = open('hosted_config.js').read()
SHIM = '''<script>
%s
</script>
<script>
// dijalankan di dalam Apps Script: parameter link diteruskan server, API lewat google.script.run
window.__SEARCH = <?!= search ?>;
// teks periode & tanggal tutup terbaru dari Pengaturan Dashboard (menimpa config.js)
(function (o) { var C = window.SURVEI_CONFIG = window.SURVEI_CONFIG || {}, T = C.TAMPILAN = C.TAMPILAN || {}; for (var k in o) if (o[k]) T[k] = o[k]; })(<?!= ovr ?>);
var __GSR = google.script.run;
function __gsFetch(url, o) {
  var b = JSON.parse(o.body);
  return new Promise(function (res, rej) {
    __GSR.withSuccessHandler(function (t) { res({ status: 200, text: function () { return Promise.resolve(t); } }); })
      .withFailureHandler(function (e) { rej(e); }).webApi(b.fn, b.args);
  });
}
</script>'''
for src, dst in [('semua/index.html', 'Web_v1.html'), ('fokus/index.html', 'Web_v2.html'), ('s/index.html', 'Web_s.html')]:
    h = open(os.path.join(SITE, src)).read()
    tag = '<script src="../config.js"></script>'
    assert h.count(tag) == 1 and h.count('fetch(API_URL,') == 1 and h.count('location.search') == 1, src
    assert '<?' not in h.replace('<?xml', ''), src + ' berisi "<?" (bentrok dengan template Apps Script)'
    h = h.replace(tag, SHIM % cfg.replace('</script', '<\\/script'))
    h = h.replace('fetch(API_URL,', '__gsFetch(API_URL,').replace('location.search', 'window.__SEARCH')
    h = h.replace('<head>', '<head>\n<base target="_top">', 1)
    open(os.path.join('survey_out', dst), 'w').write(h)
print('ok Web_v1/Web_v2/Web_s')
