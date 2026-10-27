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
| `site/` | Netlify otomatis menayangkan versi baru (±1 menit) |
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

1. **Netlify**: buka project *survei-milgiftclub* → Site configuration → Build & deploy → Link repository → GitHub → pilih repo ini. Isi *Publish directory* `site`, dan kosongkan *Build command*.
2. **Google**: login dengan akun @mildigital.id pemilik proyek Apps Script survei, lalu aktifkan *Google Apps Script API* di https://script.google.com/home/usersettings.
3. **Codespaces**: di GitHub klik Code → Codespaces → Create codespace on main, lalu jalankan:
   ```
   bash scripts/setup-codespace.sh
   ```
   Skrip ini akan:
   - login Google;
   - membuat proyek Dashboard;
   - menyimpan ID-nya;
   - menampilkan teks untuk secret `CLASPRC_JSON`;
   - menampilkan link Dashboard baru.
4. Tambahkan secret `CLASPRC_JSON` di Settings → Secrets and variables → Actions.
5. Buka Actions → *Deploy Apps Script* → **Run workflow**.
6. Kalau web app menampilkan "Authorization is required", buka proyeknya di script.google.com, pilih fungsi `izinkanAkses`, lalu klik Run → Allow.
