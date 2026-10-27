#!/usr/bin/env bash
# Membangun ulang semua file dari generator:
#   site/                   -> website survei (Netlify; versi yang sama juga disajikan link Apps Script: Web_*.html)
#   apps-script/survei/     -> kode Apps Script survei (terpasang di Google Sheet)
#   apps-script/dashboard/  -> kode Apps Script Dashboard (proyek terpisah, khusus @mildigital.id)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/generator"
# site/config.js boleh diedit langsung di GitHub (teks tampilan survei) -> jadi sumber utama
[ -f "$ROOT/site/config.js" ] && cp "$ROOT/site/config.js" hosted_config.js
python3 build_survey.py
python3 build_hosted.py "$ROOT/site"
python3 build_appsweb.py "$ROOT/site"
for p in survei dashboard; do
  cp survey_out/Code.gs survey_out/Index.html survey_out/Admin.html survey_out/Web_v1.html survey_out/Web_v2.html survey_out/Web_s.html "$ROOT/apps-script/$p/"
done
echo "Selesai. Cek perubahan dengan: git status"
