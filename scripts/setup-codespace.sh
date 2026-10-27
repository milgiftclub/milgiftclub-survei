#!/usr/bin/env bash
# SETUP SEKALI SAJA. Jalankan di GitHub Codespaces (tombol Code > Codespaces > Create codespace on main):
#     bash scripts/setup-codespace.sh
# Login harus memakai akun Google @mildigital.id yang memiliki proyek Apps Script survei.
set -euo pipefail
cd "$(dirname "$0")/.."
echo "== 1/5 Memasang clasp =="
npm install -g @google/clasp@2.4.2 >/dev/null 2>&1
echo
echo "== 2/5 Login Google =="
echo "Pastikan dulu Google Apps Script API sudah ON di: https://script.google.com/home/usersettings"
node scripts/google-login.js
echo
echo "== 3/5 Membuat proyek Dashboard (khusus @mildigital.id) =="
cd apps-script/dashboard
if [ ! -f .clasp.json ]; then
  cp appsscript.json /tmp/manifest.json   # clasp create menimpa manifest; dikembalikan setelahnya
  clasp create --type standalone --title "MIL Gift Club - Dashboard" --rootDir . >/dev/null
  cp /tmp/manifest.json appsscript.json
fi
clasp push --force
DEP=$(jq -r .dashboard ../deployments.json)
if [ -z "$DEP" ] || [ "$DEP" = "null" ]; then
  OUT=$(clasp deploy --description "Dashboard")
  DEP=$(echo "$OUT" | grep -o 'AKfy[A-Za-z0-9_-]*' | head -1)
  jq --arg d "$DEP" '.dashboard = $d' ../deployments.json > /tmp/d.json && mv /tmp/d.json ../deployments.json
fi
cd ../..
echo
echo "== 4/5 Menyimpan ke GitHub =="
git add apps-script/dashboard/.clasp.json apps-script/deployments.json
git -c user.name="setup" -c user.email="setup@milgiftclub" commit -m "Setup proyek Dashboard Apps Script" || true
git push || echo "(push gagal: jalankan 'git push' sekali lagi)"
echo
echo "== 5/5 Langkah terakhir =="
echo "a) Salin teks di antara garis di bawah ini, lalu buka:"
echo "   https://github.com/$(git remote get-url origin | sed -E 's#.*github.com[:/]##; s#\.git$##')/settings/secrets/actions/new"
echo "   Name: CLASPRC_JSON  |  Secret: tempel teksnya  |  Add secret"
echo "------------------------------------------------------------"
cat ~/.clasprc.json; echo
echo "------------------------------------------------------------"
echo "   (Teks ini seperti kata sandi. Jangan dikirim ke chat atau orang lain.)"
echo
echo "b) Link Dashboard baru (simpan sebagai bookmark):"
echo "   https://script.google.com/a/macros/mildigital.id/s/$DEP/exec"
echo
echo "c) Buka https://script.google.com, buka proyek 'MIL Gift Club - Dashboard',"
echo "   pilih fungsi izinkanAkses lalu klik Run > Allow. Lakukan juga di proyek survei."
echo
echo "d) Di GitHub buka tab Actions > Deploy Apps Script > Run workflow, untuk deploy pertama."
echo
echo "Setelah itu, Codespace boleh ditutup (Stop) — tidak perlu dibuka lagi."
