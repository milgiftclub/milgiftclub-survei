# Logo MIL Gift Club + logo MIL, disisipkan sebagai data URI (halaman Apps Script tidak bisa memuat file gambar lokal).
import base64, os
_D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'logo')
def _uri(f): return 'data:image/webp;base64,' + base64.b64encode(open(os.path.join(_D, f), 'rb').read()).decode()
GC, MIL = _uri('gift-club.webp'), _uri('mil-mark.webp')
# halaman responden (header tengah)
LOGO = ('<div class="logo" style="display:flex;align-items:center;justify-content:center;gap:14px">'
        '<img src="' + GC + '" alt="MIL Gift Club" style="height:46px;width:auto;display:block">'
        '<span style="width:1.5px;height:30px;background:rgba(60,30,20,.18);display:block"></span>'
        '<img src="' + MIL + '" alt="MIL" style="height:26px;width:auto;display:block"></div>')
# Dashboard (sidebar kiri)
LOGO_ADMIN = ('<div class="logo"><img src="' + GC + '" alt="MIL Gift Club" style="height:42px;width:auto;display:block">'
              '<span class="sep"></span><img src="' + MIL + '" alt="MIL" style="height:24px;width:auto;display:block"></div>')
def put(html): return html.replace('__LOGO_ADMIN__', LOGO_ADMIN).replace('__LOGO__', LOGO)
