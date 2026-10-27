#!/usr/bin/env bash
# Membangun ulang semua file dari generator:
#   site/                   -> website survei (Netlify)
#   apps-script/survei/     -> kode Apps Script survei (terpasang di Google Sheet)
#   apps-script/dashboard/  -> kode Apps Script Dashboard (proyek terpisah, khusus @mildigital.id)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/generator"
python3 build_survey.py
python3 build_hosted.py "$ROOT/site"
for p in survei dashboard; do
  cp survey_out/Code.gs survey_out/Index.html survey_out/Admin.html "$ROOT/apps-script/$p/"
done
echo "Selesai. Cek perubahan dengan: git status"
