# Survei MIL Gift Club

Platform survei **Indonesia Online Shopper Journey 2026** dan survei-survei baru MIL Gift Club. Isinya:

- **Website survei** (Netlify): `survei-milgiftclub.netlify.app`
  - `/`: Semua Kategori
  - `/fokus/`: Fashion Wanita, Tas & Aksesori, Hijab
  - `/s/?id=…`: survei yang dibuat dari Dashboard
- **Apps Script survei**: API dan database, terpasang di Google Sheet.
- **Apps Script Dashboard**: khusus akun @mildigital.id.

## Cara kerja deploy otomatis

| Yang berubah | Yang terjadi setelah push ke `main` |
|---|---|
| `site/` | GitHub Actions meng-upload website ke Netlify (±1 menit), link tetap sama |
| `apps-script/` | GitHub Actions memasang kode ke Apps Script dan meng-update deployment **yang sama** (link tidak berubah) |

Tidak perlu lagi copy-paste kode atau klik *New version*.

Hal-hal berikut **tidak butuh deploy sama sekali** karena diatur langsung dari Dashboard:
- buka/tutup survei;
- target;
- aturan blokir;
- membuat survei baru.

## Struktur

```
site/                 website (hasil build, langsung ditayangkan Netlify)
apps-script/survei/   kode Apps Script survei (Code.gs, Index.html, Admin.html, Config.gs, appsscript.json)
apps-script/dashboard/ kode Apps Script Dashboard (isi sama, akses khusus domain)
apps-script/deployments.json  ID deployment yang di-update otomatis
generator/            sumber: daftar pertanyaan (questions.py), template, dan tes
scripts/build.sh      membangun ulang site/ dan apps-script/ dari generator/
```

## Mengubah sesuatu

1. Edit sumbernya di `generator/`:
   - pertanyaan: `questions.py`
   - tampilan survei: `survey_src/Index.html.tpl`
   - teks halaman awal/akhir: `hosted_config.js`
   - dashboard: `survey_src/Admin.html`
   - server: `survey_src/Code.gs.tpl`
2. Jalankan `./scripts/build.sh`.
3. Commit dan push ke `main`. Selesai.

Tes otomatis (opsional):

```
cd generator/tests
npm install
npx playwright install chromium
npm run test:survei
npm run test:dashboard
npm run test:builder
```

## Setup (sekali saja)

1. **Netlify**: buat token di https://app.netlify.com/user/applications#personal-access-tokens (klik *New access token*, beri nama `github`, pilih masa berlaku terpanjang). Simpan token itu sebagai secret `NETLIFY_AUTH_TOKEN` di Settings → Secrets and variables → Actions repo ini.
2. **Google**: login dengan akun @mildigital.id pemilik proyek Apps Script survei, lalu aktifkan *Google Apps Script API* di https://script.google.com/home/usersettings.
3. **Login Google (tanpa Codespaces):**
   1. Buka [link login Google ini](https://accounts.google.com/o/oauth2/v2/auth?client_id=1072944905499-vm2v2i5dvn0a0d2o4ca36i1vge8cvbn0.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A8888&response_type=code&access_type=offline&prompt=consent&hd=mildigital.id&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fscript.deployments+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fscript.projects+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fscript.webapp.deploy+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.metadata.readonly+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fservice.management+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Flogging.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform). Pilih akun @mildigital.id, lalu klik *Allow*.
   2. Browser akan menampilkan halaman localhost yang **gagal dimuat**. Itu normal. Salin seluruh alamatnya (`http://localhost:8888/?code=...`).
   3. Di repo ini buka **Actions** → *Login Google (setup Apps Script)* → **Run workflow**, tempel alamatnya, lalu klik **Run workflow**. Lakukan dalam 5 menit, karena kodenya cepat kedaluwarsa.
   4. Setelah centang hijau muncul, buka hasil run-nya. Link Dashboard ada di bagian *Summary*.
4. Buka link Dashboard, klik **Review permissions** → **Allow** (sekali saja).

(Alternatif: `bash scripts/setup-codespace.sh` di Codespaces, lalu simpan secret `CLASPRC_JSON`.)
