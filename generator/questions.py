# Questionnaire content. Each item: (id, topic, question, type, [attributes], routing, notes)
# Routing/notes may reference other items as {id}; resolved to question numbers at build time.
from categories import CATS
from products import PRODUCTS, PRICE_BANDS

HIGH = ['Fashion wanita', 'Tas & aksesori', 'Fashion muslim / modest']
FASHION_CATS = ['Fashion pria', 'Fashion wanita', 'Fashion muslim / modest', 'Sepatu & sandal', 'Tas & aksesori', 'Perhiasan']
ALL_CATS = [c[1] for c in CATS]

# Pertanyaan dengan urutan opsi diacak per responden. Opsi 'Lainnya', 'Tidak ...', 'Belum pernah ...',
# 'Saya tidak ...' dan opsi eksklusif tetap di akhir. Skala berurutan (usia, frekuensi, nominal, waktu) TIDAK diacak.
RANDOMIZE = ['S3', 'S4', 'A5', 'B2', 'AW1', 'AW3', 'AW5', 'AW6', 'AW7', 'CO2', 'CO4', 'FA2', 'AW5S', 'AW5R', 'AW5G', 'AW5T', 'AW5M',
             'PU1', 'PU2', 'PU5', 'PU7', 'OF2', 'OF3', 'OF4', 'LO1', 'LO2', 'LO4', 'RE2', 'RE3', 'QC1', 'D4', 'D5']
RANDOMIZE_ROWS = ['B4']

PROV = ['Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Sumatera Selatan',
        'Kepulauan Bangka Belitung', 'Bengkulu', 'Lampung', 'DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah',
        'DI Yogyakarta', 'Jawa Timur', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat',
        'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara',
        'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara', 'Maluku',
        'Maluku Utara', 'Papua', 'Papua Barat', 'Papua Barat Daya', 'Papua Selatan', 'Papua Tengah', 'Papua Pegunungan']

PLAT = ['Shopee', 'TikTok Shop', 'Tokopedia', 'Lazada', 'Blibli', 'Website / aplikasi resmi brand',
        'Instagram / WhatsApp (chat langsung dengan penjual)', 'Lainnya, sebutkan: ___']

T_OPEN = 'Pembuka & Persetujuan'
T_SCR = 'Screening'
T_PROF = 'Profil & Demografi'
T_PLAT = 'Lanskap Platform'
T_CAT = 'Penetrasi & Penugasan Kategori'
T_PROD = 'Funneling - Produk & Harga\n(Kategori terakhir dibeli)'
T_AW = 'Funneling - Awareness\n(Kategori terakhir dibeli)'
T_CO = 'Funneling - Consideration\n(Kategori terakhir dibeli)'
T_PU = 'Funneling - Purchase\n(Kategori terakhir dibeli)'
T_CH = 'Funneling - Channel Online & Offline\n(Kategori terakhir dibeli)'
T_LO = 'Funneling - Loyalty\n(Kategori terakhir dibeli)'
T_RE = 'Funneling - Recommendation\n(Kategori terakhir dibeli)'
T_GIFT = 'Blok Tambahan - Gifting\n(Kategori terakhir dibeli)'
T_QC = 'Quality Check'
T_PLREC = 'Recommendation - Platform'
T_TREN = 'Tren & Perilaku Baru'
T_CLOSE = 'Penutup & Data Giveaway'

LOOP = 'MODUL KATEGORI: tampil untuk kategori di {C1}. '

Q = [
 # ---------------- PEMBUKA ----------------
 ('O1', T_OPEN, 'Terima kasih telah berpartisipasi dalam survei tentang kebiasaan belanja online. Survei ini membutuhkan waktu ±7 menit. Jawaban Anda bersifat rahasia dan hanya digunakan untuk keperluan riset. Data kontak hanya digunakan untuk keperluan undian dan verifikasi pemenang. Apakah Anda bersedia mengikuti survei ini?',
  'SA', ['Ya, saya setuju dan bersedia mengikuti survei', 'Tidak bersedia'],
  "Jika 'Tidak bersedia' -> Screen out (survei selesai)",
  'Persetujuan pemrosesan data pribadi sesuai UU PDP. Tautan Kebijakan Privasi & Syarat Ketentuan giveaway wajib ditampilkan di halaman ini'),

 # ---------------- SCREENING ----------------
 ('Z2', T_OPEN, 'Tuliskan username Instagram Anda (untuk verifikasi keikutsertaan giveaway @milgift_club).', 'OA', ['@___'], 'Wajib diisi. Dicek ke data respons: jika username sudah pernah mengisi survei ini -> berhenti (screen out) dan diarahkan ke survei lainnya',
  'Verifikasi duplikasi & pengumuman pemenang. Syarat follow @milgift_club dicek saat undian'),
 ('PV', T_OPEN, 'Kamu sudah pernah mengisi survei MIL Gift Club sebelumnya. Supaya tidak perlu mengisi data diri lagi, masukkan 4 digit terakhir nomor WhatsApp yang kamu daftarkan.', 'OA', ['4 digit terakhir (opsional)'],
  "Tampilkan HANYA jika username {Z2} ditemukan di jawaban survei lain. Jika 4 digit cocok -> semua pertanyaan profil yang sudah pernah dijawab ({S0}-{S3}, {A1}, {A4M}-{A16}) terisi otomatis dan dilewati; hanya yang belum ada yang ditanyakan. Kosong / 3x salah -> isi profil seperti biasa",
  'Responden lama melewati profil dasar. Verifikasi 4 digit mencegah orang lain memakai username IG seseorang'),
 ('PR', T_OPEN, 'Data diri kamu terakhir diperbarui lebih dari 6 bulan lalu. Apakah data berikut masih sesuai?', 'SA',
  ['Ya, masih sesuai', 'Ada yang berubah, saya mau isi ulang'],
  "Tampilkan HANYA jika profil dari {PV} terakhir diperbarui > 6 bulan lalu. 'Isi ulang' -> semua pertanyaan profil ditanyakan lagi",
  'Menjaga data profil panel tetap mutakhir (status, pekerjaan, pengeluaran berubah dari waktu ke waktu)'),
 ('S0', T_SCR, 'Tahun berapa Anda lahir?', 'SA (dropdown)',
  [str(y) for y in range(2010, 1945, -1)] + ['1945 atau sebelumnya'],
  'Usia {S1} dihitung otomatis dari tahun lahir (tahun berjalan - tahun lahir). Usia < 18 -> Screen out. Jika usia hitungan = 18 -> tanyakan {S0B}',
  'Tahun lahir lebih akurat dari rentang usia dan tidak kedaluwarsa: usia selalu dihitung ulang setiap survei'),
 ('S0B', T_SCR, 'Apakah usia Anda saat ini sudah genap 18 tahun?', 'SA', ['Ya, sudah 18 tahun', 'Belum'],
  "Tampilkan HANYA jika tahun lahir {S0} = tahun berjalan - 18. Jika 'Belum' -> Screen out", 'Memastikan responden berusia 18+ (UU PDP & syarat giveaway)'),
 ('S1', T_SCR, 'Berapa usia Anda saat ini?', 'SA',
  ['Di bawah 18 tahun', '18-24 tahun', '25-34 tahun', '35-44 tahun', '45-54 tahun', '55 tahun ke atas'],
  "TIDAK DITANYAKAN: diturunkan otomatis dari {S0} / {S0B}. 'Di bawah 18 tahun' -> Screen out", 'Kuota usia: 18-24 (30%), 25-34 (35%), 35-44 (20%), 45+ (15%)'),
 ('S2', T_SCR, 'Apa jenis kelamin Anda?', 'SA', ['Pria', 'Wanita'], '-', 'Soft quota 50:50'),
 ('S3', T_SCR, 'Apakah Anda atau anggota keluarga inti Anda bekerja di salah satu bidang berikut?', 'MA',
  ['Agensi pemasaran / periklanan / digital marketing', 'Perusahaan riset pasar', 'Perusahaan e-commerce / marketplace', 'Tidak satu pun dari pilihan di atas (eksklusif)'],
  "Jika memilih salah satu dari 3 pilihan pertama -> Screen out", 'Mencegah bias responden yang memahami industri'),
 ('S4', T_SCR, 'Dalam 1 bulan terakhir, di aplikasi/kanal mana saja Anda pernah berbelanja online? (boleh pilih lebih dari satu)', 'MA',
  PLAT + ['Saya tidak berbelanja online dalam 1 bulan terakhir (eksklusif)'],
  "Jika TIDAK memilih Shopee, TikTok Shop, maupun Tokopedia -> Screen out",
  'Kriteria utama target responden. Periode 1 bulan menjaga akurasi ingatan dan memastikan responden pembelanja aktif. Jawaban dipakai sebagai piping untuk {B2}, {AW1}'),
 ('S5', T_SCR, 'Secara rata-rata, seberapa sering Anda berbelanja online dalam sebulan?', 'SA',
  ['Kurang dari 1 kali per bulan', '1-2 kali per bulan', '3-5 kali per bulan', '6-10 kali per bulan', 'Lebih dari 10 kali per bulan'],
  '-', 'Segmentasi intensitas belanja (light / medium / heavy shopper)'),

 # ---------------- PROFIL ----------------
 ('A1', T_PROF, 'Di kota/kabupaten mana Anda tinggal saat ini?', 'SA (cari kota)',
  ['Ketik untuk mencari dari 514 kabupaten/kota (Kepmendagri 2025)', 'Daftar lengkap di sheet "Daftar Kota"'], '-',
  'Provinsi, wilayah Jabodetabek, dan tipe wilayah (kota/kabupaten) diturunkan otomatis dari jawaban ini, sehingga tidak perlu ditanyakan. Dipakai untuk kuota wilayah (Jabodetabek 25% | Jawa lainnya 35% | Sumatera 20% | Kalimantan, Sulawesi & Indonesia Timur 20%) dan menguji H5'),
 ('A18', T_PROF, 'Apa jenis tempat tinggal Anda saat ini?', 'SA',
  ['Rumah tapak', 'Apartemen', 'Rumah susun', 'Kos / kamar sewa', 'Ruko / rukan', 'Asrama / mess', 'Lainnya'], '-', 'Jenis hunian (targeting properti, perabot, layanan antar)'),
 ('A19', T_PROF, 'Apa status tempat tinggal Anda tersebut?', 'SA',
  ['Milik sendiri (sudah lunas)', 'Milik sendiri (masih cicilan / KPR)', 'Milik orang tua / keluarga (tinggal bersama)', 'Sewa / kontrak (bulanan atau tahunan)', 'Rumah dinas / fasilitas kantor', 'Lainnya'],
  "Tidak ditanyakan jika {A18} = 'Kos / kamar sewa' (otomatis 'Sewa / kontrak')", 'Status kepemilikan hunian (proxy SES & tahap hidup)'),
 ('A4M', T_PROF, 'Apa status pernikahan Anda saat ini?', 'SA', ['Belum menikah', 'Menikah', 'Cerai / berpisah'], '-', 'Life stage (bagian 1)'),
 ('A4N', T_PROF, 'Berapa jumlah anak Anda?', 'SA', ['Belum / tidak memiliki anak', '1 anak', '2 anak', '3 anak', '4 anak atau lebih'],
  "Tampilkan jika {A4M} bukan 'Belum menikah'", 'Life stage (bagian 2)'),
 ('A4K', T_PROF, 'Berapa usia anak-anak Anda saat ini? (boleh pilih lebih dari satu)', 'MA',
  ['Di bawah 2 tahun (bayi)', '2-5 tahun (balita)', '6-12 tahun (usia SD)', '13-17 tahun (remaja)', '18 tahun ke atas'],
  "Tampilkan jika {A4N} = punya anak", 'Targeting kategori ibu & anak, sekolah, remaja'),
 ('A4', T_PROF, 'Manakah yang paling menggambarkan kondisi Anda saat ini?', 'SA',
  ['Pelajar / mahasiswa', 'Bekerja, belum menikah', 'Menikah, belum memiliki anak', 'Menikah, memiliki anak usia di bawah 12 tahun', 'Menikah, memiliki anak usia 12 tahun ke atas', 'Lainnya'],
  'TIDAK DITANYAKAN: diturunkan otomatis dari {A4M}, {A4N}, {A4K} dan {A5}', 'Life stage untuk segmentasi persona (kolom lama tetap terisi agar kuota & laporan tidak berubah)'),
 ('A5', T_PROF, 'Apa pekerjaan utama Anda saat ini?', 'SA',
  ['Pelajar / mahasiswa', 'Karyawan swasta', 'PNS / BUMN / TNI / Polri', 'Wiraswasta / pemilik usaha', 'Pekerja lepas / freelancer', 'Ibu rumah tangga', 'Tidak bekerja / pensiun', 'Lainnya'],
  '-', '-'),
 ('A6', T_PROF, 'Apa pendidikan terakhir Anda?', 'SA',
  ['SD / SMP', 'SMA / SMK sederajat', 'Diploma (D1-D3)', 'Sarjana (S1 / D4)', 'Pascasarjana (S2 / S3)'], '-', 'Komponen SES'),
 ('A7N', T_PROF, 'Termasuk Anda, berapa orang yang tinggal serumah dan berbagi pengeluaran rumah tangga yang sama?', 'SA',
  ['1 orang (hanya saya)', '2 orang', '3 orang', '4 orang', '5 orang', '6 orang', '7 orang atau lebih'], '-',
  'Pembagi untuk pengeluaran per kapita -> kelas ekonomi (BPS / Bank Dunia) & SES'),
 ('A7', T_PROF, 'Berapa total pengeluaran rumah tangga Anda per bulan (di luar cicilan rumah/kendaraan)?', 'SA',
  ['Di bawah Rp2.000.000', 'Rp2.000.000 - Rp3.000.000', 'Rp3.000.001 - Rp5.000.000', 'Rp5.000.001 - Rp7.500.000', 'Rp7.500.001 - Rp10.000.000', 'Rp10.000.001 - Rp15.000.000', 'Rp15.000.001 - Rp25.000.000', 'Rp25.000.001 - Rp40.000.000', 'Di atas Rp40.000.000'],
  '-', 'Proxy SES. Dibagi jumlah anggota rumah tangga ({A7N}) -> pengeluaran per kapita -> kelas_ekonomi (garis kemiskinan BPS x 1 / 1,5 / 3,5 / 17) & ses (A-E). Rentang lama tetap kompatibel (hanya pecahan baru di atas Rp15 juta)'),
 ('A8', T_PROF, 'Berapa rata-rata total belanja online pribadi Anda per bulan?', 'SA',
  ['Di bawah Rp100.000', 'Rp100.000 - Rp250.000', 'Rp250.001 - Rp500.000', 'Rp500.001 - Rp1.000.000', 'Rp1.000.001 - Rp2.000.000', 'Di atas Rp2.000.000'],
  '-', 'Share of wallet belanja online'),
 ('A9', T_PROF, 'Siapa yang biasanya memutuskan belanja kebutuhan rumah tangga di rumah Anda?', 'SA',
  ['Saya sendiri', 'Saya bersama pasangan / anggota keluarga lain', 'Orang lain, tetapi saya ikut memberi masukan', 'Orang lain, saya tidak terlibat'], '-', 'Peran pengambil keputusan belanja (gatekeeper)'),
 ('A10', T_PROF, 'Media sosial apa saja yang Anda buka setiap hari? (boleh pilih lebih dari satu)', 'MA',
  ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'X (Twitter)', 'Threads', 'Pinterest', 'LinkedIn', 'Lainnya', 'Tidak ada (eksklusif)'], '-', 'Media habit untuk perencanaan kanal'),
 ('A11', T_PROF, 'Berapa lama total waktu Anda bermain media sosial dalam sehari?', 'SA',
  ['Kurang dari 1 jam', '1-2 jam', '2-4 jam', '4-6 jam', 'Lebih dari 6 jam'], '-', 'Intensitas media sosial'),
 ('A12', T_PROF, 'Metode pembayaran apa saja yang Anda gunakan untuk belanja online dalam 3 bulan terakhir? (boleh pilih lebih dari satu)', 'MA',
  ['E-wallet (GoPay, OVO, DANA, ShopeePay, dll.)', 'QRIS', 'Transfer bank / virtual account', 'Kartu debit', 'Kartu kredit', 'Paylater / cicilan', 'Bayar di tempat (COD)', 'Bayar di gerai (Indomaret / Alfamart)', 'Lainnya'], '-', 'Kebiasaan pembayaran (menggantikan pertanyaan paylater terpisah)'),
 ('A13', T_PROF, 'Apa merek HP utama yang Anda gunakan sehari-hari?', 'SA',
  ['Samsung', 'iPhone', 'Xiaomi / Redmi / POCO', 'OPPO', 'vivo', 'realme', 'Huawei', 'Infinix', 'Tecno', 'itel', 'Lainnya, sebutkan: ___'],
  '-', 'Merek HP utama. Dianalisa sebagai segmen_hp (iPhone / Android atas / menengah / bawah) bersama {A13H}'),
 ('A13H', T_PROF, 'Berapa kisaran harga HP tersebut saat dibeli (harga baru)?', 'SA',
  ['Di bawah Rp1.500.000', 'Rp1.500.000 - Rp2.500.000', 'Rp2.500.001 - Rp4.000.000', 'Rp4.000.001 - Rp6.000.000', 'Rp6.000.001 - Rp10.000.000', 'Di atas Rp10.000.000'],
  "Tampilkan HANYA jika {A13} bukan 'iPhone'. Segmen: < Rp2,5 jt = Android bawah | Rp2,5-6 jt = Android menengah | > Rp6 jt = Android atas", 'Proxy SES & targeting iklan per segmen perangkat'),
 ('A14', T_PROF, 'Apa minat atau hobi utama Anda? (pilih maksimal 3)', 'MA (maks. 3)',
  ['Kuliner / wisata makanan', 'Traveling', 'Olahraga / fitness', 'Fashion & kecantikan', 'Gaming', 'Musik / konser', 'Film / series / drama', 'Membaca', 'Otomotif', 'Gadget & teknologi', 'Parenting / keluarga', 'Memasak / baking', 'Investasi / keuangan', 'Berkebun / tanaman', 'Hewan peliharaan', 'Seni & kerajinan tangan', 'K-pop / budaya Korea & Jepang', 'Lainnya'],
  '-', 'Segmentasi minat untuk brand & kreator'),
 ('A15', T_PROF, 'Apakah Anda mengenakan hijab dalam keseharian?', 'SA', ['Ya, setiap hari', 'Kadang-kadang', 'Tidak'],
  "Tampilkan HANYA jika {S2} = 'Wanita'", 'Targeting kategori fashion muslim / modest. Ada opsi tidak ingin menjawab'),
 ('A16', T_PROF, 'Kendaraan apa saja yang Anda miliki? (boleh pilih lebih dari satu)', 'MA', ['Mobil', 'Motor', 'Sepeda', 'Tidak memiliki kendaraan (eksklusif)'], '-', 'Proxy SES & targeting otomotif'),

 # ---------------- PLATFORM ----------------
 ('B2', T_PLAT, 'Dari aplikasi/kanal yang Anda gunakan untuk berbelanja, mana yang PALING SERING Anda gunakan?', 'SA',
  ['[Piping: pilihan yang dijawab di {S4}]'], 'Tampilkan HANYA jika {S4} berisi ≥2 pilihan. Jika hanya 1 -> otomatis terisi jawaban tersebut',
  'Platform utama. Kuota: minimal 300 pengguna utama Shopee & 300 pengguna utama Shop | Tokopedia (TikTok Shop + Tokopedia)'),
 ('B4', T_PLAT, 'Menurut Anda, pernyataan berikut paling sesuai untuk platform mana? (pilih satu platform per baris)', 'Matrix SA',
  ['Baris: Harganya paling murah | Produknya paling lengkap | Paling terpercaya / barang asli | Pengirimannya paling cepat | Paling menghibur | Paling banyak promo & voucher | Paling mudah digunakan | Paling cocok untuk menemukan produk baru',
   'Kolom: [Piping: marketplace yang dipakai di {S4}] | Tidak ada'],
  'Kolom hanya menampilkan marketplace yang dijawab di {S4} (Shopee, TikTok Shop, Tokopedia, Lazada, Blibli). Tampilkan HANYA jika ≥2 marketplace',
  'Persepsi platform hanya dinilai oleh penggunanya. Menguji H2 dan peran tiap platform dalam journey'),

 # ---------------- KATEGORI ----------------
 ('C1', T_CAT, 'Pada belanja online TERAKHIR Anda, produk dari kategori apa yang Anda beli?', 'SA',
  ALL_CATS + ['Kategori lain, sebutkan: ___'],
  'Opsi dikelompokkan per kelompok kategori. Jika memilih "Kategori lain" -> lewati modul funnel, lanjut ke {QC1}',
  'Menentukan 1 kategori untuk modul funnel (Awareness s.d. Recommendation). Pembelian terakhir dipilih agar ingatan responden paling akurat. Kategori High (Fashion wanita, Tas & aksesori, Fashion muslim / modest) dipantau kuotanya'),
 ('C2', T_CAT, 'Dalam 3 bulan terakhir, berapa kali Anda membeli produk [KATEGORI] secara online?', 'SA',
  ['1 kali (hanya pembelian terakhir ini)', '2-3 kali', '4-6 kali', 'Lebih dari 6 kali'],
  "Tampilkan HANYA jika {C1} ≠ 'Kategori lain'", 'Frekuensi pembelian kategori; dasar membaca loyalitas & repeat purchase'),

 # ---------------- AWARENESS ----------------
 ('PT1', T_PROD, 'Pada belanja online terakhir untuk kategori [KATEGORI], produk apa yang Anda beli? (pilih produk utamanya)', 'SA',
  ['[Piping: daftar produk sesuai kategori di {C1}; lihat sheet "Daftar Produk"]'],
  LOOP, 'Jenis produk spesifik yang dibeli terakhir. Dasar membaca harga per jenis produk (willingness to pay)'),
 ('PTB', T_PROD, 'Apa merek [jawaban {PT1}] yang Anda beli tersebut?', 'OA', ['Tulis merek (mis. nama brand / toko)'],
  LOOP + "Tulis 'tidak tahu' bila lupa / tanpa merek", 'Merek yang dibeli: pangsa merek per jenis produk (brand share). Hanya nama merek, bukan data pribadi'),
 ('PT2', T_PROD, 'Berapa harga [jawaban {PT1}] yang Anda beli, per item? (harga yang Anda bayar setelah diskon, di luar ongkir)', 'SA (dropdown)',
  PRICE_BANDS,
  LOOP, 'Harga riil per item untuk jenis produk di {PT1}: rentang Rp25.000 hingga Rp500.000, lalu rentang lebih lebar untuk produk bernilai tinggi. Disilangkan dengan SES ({A7}) untuk membaca willingness to pay per jenis produk'),
 ('AW1', T_AW, 'Ingat kembali pembelian [jawaban {PT1}] TERAKHIR Anda secara online. Di platform mana Anda membelinya?', 'SA',
  ['[Piping: pilihan yang dijawab di {S4}]'], LOOP, 'Seluruh pertanyaan funnel mengacu pada satu pembelian spesifik agar ingatan akurat (mengurangi recall bias)'),
 ('AW3', T_AW, 'Apa yang PERTAMA KALI membuat Anda ingin membeli produk tersebut?', 'SA',
  ['Kebutuhan rutin / stok habis', 'Melihat konten / tren / influencer di media sosial', 'Ada promo / diskon menarik', 'Momen tertentu (gajian, hari raya, ulang tahun, dll.)', 'Rekomendasi teman / keluarga', 'Produk lama rusak / perlu diganti', 'Lainnya, sebutkan: ___'],
  LOOP, 'Pemicu kebutuhan (need trigger)'),
 ('AW5', T_AW, 'Dari mana Anda PERTAMA KALI mengetahui produk/brand yang Anda beli tersebut?', 'SA',
  ['Video pendek di beranda / FYP (TikTok, Reels, dll.)', 'Live shopping', 'Konten kreator / affiliate', 'Hasil pencarian di aplikasi belanja', 'Pencarian di Google', 'Iklan di media sosial (Instagram, Facebook, YouTube)', 'Rekomendasi teman / keluarga', 'Grup WhatsApp / komunitas', 'Melihat langsung di toko fisik (mal, pasar, minimarket, butik)', 'Iklan TV / billboard / media cetak', 'Lainnya, sebutkan: ___'],
  LOOP, 'Sumber awareness utama per kategori, termasuk sumber offline (toko fisik, media konvensional). Menguji H1, H6 & Pertanyaan Riset 2'),
 ('AW5K', T_AW, 'Kira-kira kata kunci apa yang Anda ketik saat mencari produk tersebut?', 'OA', ['mis. "kaos oversize wanita", "serum jerawat"'],
  LOOP + "Tampilkan HANYA jika {AW5} = 'Pencarian di Google' / 'Hasil pencarian di aplikasi belanja'", 'Kata kunci pencarian: bahan riset SEO / keyword ads'),
 ('AW5S', T_AW, 'Di aplikasi mana Anda melihat konten / iklan tersebut?', 'SA', ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'Shopee (Video / Live)', 'Tokopedia (Play / Live)', 'Lainnya, sebutkan: ___'],
  LOOP + "Tampilkan HANYA jika {AW5} = video pendek / live shopping / konten kreator / iklan media sosial", 'Kanal sosial tempat awareness terjadi'),
 ('AW5C', T_AW, 'Masih ingat nama kreator / akun yang membagikannya? (opsional)', 'OA', ['Nama kreator / akun (opsional)'],
  LOOP + "Tampilkan HANYA jika {AW5} = video pendek / live shopping / konten kreator", 'Kreator yang efektif per kategori (opsional, boleh dikosongkan)'),
 ('AW5R', T_AW, 'Siapa yang merekomendasikan produk tersebut?', 'SA', ['Pasangan', 'Orang tua / saudara', 'Teman dekat', 'Rekan kerja / kuliah', 'Kenalan di komunitas', 'Lainnya, sebutkan: ___'],
  LOOP + "Tampilkan HANYA jika {AW5} = 'Rekomendasi teman / keluarga'", 'Sumber word of mouth'),
 ('AW5G', T_AW, 'Grup / komunitas seperti apa?', 'SA', ['Grup keluarga', 'Grup teman', 'Grup kantor / kampus', 'Grup orang tua murid / sekolah', 'Komunitas hobi / minat', 'Grup jastip / reseller', 'Lainnya, sebutkan: ___'],
  LOOP + "Tampilkan HANYA jika {AW5} = 'Grup WhatsApp / komunitas'", 'Jenis komunitas yang menyebarkan produk'),
 ('AW5T', T_AW, 'Di toko fisik seperti apa Anda melihatnya?', 'SA', ['Mal / pusat perbelanjaan', 'Pasar / pertokoan', 'Minimarket / supermarket', 'Butik / toko resmi brand', 'Pameran / bazar / pop-up', 'Lainnya, sebutkan: ___'],
  LOOP + "Tampilkan HANYA jika {AW5} = 'Melihat langsung di toko fisik'", 'Titik temu offline'),
 ('AW5M', T_AW, 'Lewat media apa?', 'SA', ['TV', 'Billboard / baliho', 'Iklan di transportasi umum / stasiun', 'Majalah / koran', 'Radio / podcast', 'Lainnya, sebutkan: ___'],
  LOOP + "Tampilkan HANYA jika {AW5} = 'Iklan TV / billboard / media cetak'", 'Media konvensional yang masih efektif'),
 ('AW6', T_AW, 'Konten seperti apa yang paling menarik perhatian Anda sampai ingin membeli produk tersebut? (pilih maksimal 3)', 'MA (maks. 3)',
  ['Cara pakai / demo produk', 'Try-on / OOTD / mix & match', 'Review jujur / perbandingan produk', 'Hasil sebelum-sesudah (before-after)', 'Unboxing / detail produk dari dekat', 'Tutorial / tips & inspirasi', 'Testimoni pembeli biasa', 'Live shopping dengan promo khusus', 'Rekomendasi kreator yang saya ikuti', 'Konten lucu / menghibur / storytelling', 'Tampilan visual yang estetik', 'Lainnya, sebutkan: ___'],
  LOOP + "Tampilkan jika {AW3} = 'Melihat konten / tren / influencer di media sosial' ATAU {AW5} = video pendek / live / kreator / iklan media sosial",
  'INSIGHT KONTEN (prioritas MIL): format konten yang memicu minat beli. Pilihan disesuaikan per kelompok kategori {C1} (lihat AW6_BY_GROUP); daftar ini = pilihan umum'),
 ('AW7', T_AW, 'Dari konten tersebut, apa yang ingin Anda pastikan tentang produknya? (pilih maksimal 3)', 'MA (maks. 3)',
  ['Ukuran / size & fit di badan', 'Bahan / tekstur / kualitas', 'Nyaman dipakai (gerah / panas, berat, gatal)', 'Warna & tampilan asli (bukan editan)', 'Hasil / efektivitas nyata', 'Cara pakai, fitur & fungsinya', 'Cocok untuk kondisi saya (kulit, bentuk tubuh, kebutuhan)', 'Keaslian produk & kepercayaan pada penjual', 'Perbandingan dengan produk lain', 'Harga & promo yang didapat', 'Inspirasi gaya / cara memadukan', 'Lainnya, sebutkan: ___', 'Tidak ada, saya hanya terhibur (eksklusif)'],
  LOOP + 'Tampilkan jika {AW6} dijawab', 'INSIGHT KONTEN: alasan di balik format konten (mis. cara pakai -> ingin lihat size / bahan / gerah atau tidak) untuk brief kreatif. Pilihan disesuaikan per kelompok kategori {C1} (lihat AW7_BY_GROUP); daftar ini = pilihan umum'),
 ('CO2', T_CO, 'Sebelum membeli produk tersebut, bagaimana cara Anda membandingkan pilihan yang ada?', 'SA',
  ['Antar toko dalam aplikasi yang sama', 'Antar aplikasi belanja yang berbeda', 'Antar toko dan antar aplikasi', 'Tidak sama sekali, langsung membeli'],
  LOOP, 'Pola perbandingan: dalam satu aplikasi vs lintas aplikasi. Menguji H2 (loyalitas platform menipis)'),
 ('CO4', T_CO, 'Apa yang PALING membuat Anda akhirnya memutuskan membeli produk tersebut? (pilih maksimal 3)', 'MA (maks. 3)',
  ['Kualitas produk / bahan terlihat bagus', 'Model / desain sesuai selera & tren', 'Fungsi / manfaat sesuai kebutuhan', 'Harga sesuai budget',
   'Dipakai / direkomendasikan idola atau figur favorit', 'Direkomendasikan kreator / host live', 'Banyak ulasan & rating bagus', 'Ulasan foto / video pembeli', 'Banyak yang beli / sedang viral', 'Merek terkenal / bergengsi', 'Merek lokal / sejalan dengan nilai saya',
   'Voucher / diskon', 'Gratis ongkir', 'Flash sale / stok terbatas', 'Bonus / bundling',
   'Toko resmi (Official Store / Mall)', 'Estimasi pengiriman cepat', 'Kebijakan retur / garansi', 'Pilihan pembayaran (COD, paylater)', 'Lainnya, sebutkan: ___'],
  LOOP + 'Urutan opsi diacak', 'Pendorong keputusan beli (gabungan dengan pertanyaan prioritas fashion lama): produk | social proof | penawaran | toko. Dianalisa per kelompok'),
 ('FA2', T_CO, 'Untuk [jawaban {PT1}], pernyataan mana yang PALING menggambarkan diri Anda?', 'SA',
  ['Saya rela membayar lebih untuk brand premium / bergengsi', "Saya rela membayar lebih untuk brand yang nilainya sejalan dengan saya (lokal, ramah lingkungan, syar'i, dll.)", 'Saya rela membayar lebih untuk kualitas, apa pun brand-nya', 'Saya rela membayar lebih untuk model yang sedang tren', 'Saya memilih harga paling terjangkau selama modelnya sesuai'],
  LOOP + 'Tampilkan HANYA jika kategori modul = kategori fashion (kategori fashion)',
  'Trade-off kesediaan membayar lebih (willingness to pay): premium vs values vs kualitas vs tren vs harga. Segmentasi pembeli fashion'),
 ('CO6', T_CO, 'Berapa lama waktu dari pertama kali melihat produk tersebut hingga Anda membelinya?', 'SA',
  ['Langsung saat itu juga', 'Di hari yang sama', 'Di minggu yang sama', 'Lebih dari 1 minggu'],
  LOOP, 'Lama pertimbangan; impulsif vs terencana'),
 ('CO7', T_CO, 'Sebelum membeli secara online, apakah Anda melihat atau mencoba produk tersebut langsung di toko fisik?', 'SA',
  ['Ya, saya melihat / mencoba di toko fisik, lalu membeli online', 'Tidak, saya langsung membeli online tanpa melihat di toko fisik'],
  LOOP, 'Showrooming: toko fisik sebagai tempat mencoba, transaksi terjadi online. Menguji H6'),

 # ---------------- PURCHASE ----------------
 ('PU1', T_PU, 'Mengapa Anda memilih membeli di [PLATFORM {AW1}] untuk pembelian ini? (pilih maksimal 3)', 'MA (maks. 3)',
  ['Harga paling murah di sana', 'Ada voucher / gratis ongkir', 'Produknya hanya tersedia di sana', 'Menemukan produknya di platform tersebut', 'Toko langganan saya ada di sana', 'Pengiriman lebih cepat', 'Lebih terpercaya', 'Kebiasaan / platform utama saya', 'Lainnya, sebutkan: ___'],
  LOOP, 'Peran platform per kategori (Pertanyaan Riset 5)'),
 ('PU2', T_PU, 'Pada momen apa pembelian tersebut Anda lakukan?', 'SA',
  ['Saat tanggal kembar (mis. 10.10, 11.11)', 'Setelah gajian', 'Saat flash sale', 'Saat menonton live shopping', 'Menjelang hari raya / musim tertentu', 'Tidak ada momen khusus, saat sedang butuh'],
  LOOP, 'Momen transaksi. Menguji H3'),
 ('PU4', T_PU, 'Berapa total nilai belanja (termasuk ongkir) pada pembelian tersebut?', 'SA',
  ['Di bawah Rp50.000', 'Rp50.000 - Rp100.000', 'Rp100.001 - Rp250.000', 'Rp250.001 - Rp500.000', 'Rp500.001 - Rp1.000.000', 'Di atas Rp1.000.000'],
  LOOP, 'Nilai transaksi per kategori'),
 ('PU5', T_PU, 'Apakah Anda menggunakan voucher atau promo pada pembelian tersebut?', 'SA',
  ['Ya, dan promo itulah alasan utama saya membeli saat itu', 'Ya, tetapi saya tetap akan membeli walau tanpa promo', 'Tidak menggunakan promo'],
  LOOP, 'Ketergantungan pada promo. Menguji H3'),
 ('PU6', T_PU, 'Dalam 3 bulan terakhir, apakah Anda pernah membatalkan checkout atau membiarkan [jawaban {PT1}] di keranjang tanpa membelinya?', 'SA',
  ['Sering', 'Kadang-kadang', 'Tidak pernah'], LOOP, 'Kebocoran funnel di tahap purchase'),
 ('PU7', T_PU, 'Apa alasan utama Anda tidak jadi membeli? (pilih maksimal 3)', 'MA (maks. 3)',
  ['Ongkos kirim terlalu mahal', 'Menemukan harga lebih murah di tempat lain', 'Menunggu promo / tanggal kembar', 'Hanya menyimpan untuk dibeli nanti', 'Ragu dengan kualitas / keaslian produk', 'Estimasi pengiriman terlalu lama', 'Metode pembayaran yang diinginkan tidak tersedia', 'Berubah pikiran / tidak jadi butuh', 'Lainnya, sebutkan: ___'],
  LOOP + "Tampilkan HANYA jika {PU6} = 'Sering' / 'Kadang-kadang'", 'Alasan batal checkout'),

 # ---------------- LOYALTY ----------------
 ('OF1', T_CH, 'Bagaimana riwayat pembelian Anda untuk produk tersebut (brand/produk yang sama)?', 'SA',
  ['Pertama kali beli di toko fisik, sekarang beralih ke online', 'Pertama kali beli di toko fisik, sekarang kadang online kadang di toko fisik', 'Pertama kali beli online, kadang juga beli di toko fisik', 'Selalu beli online sejak pertama kali', 'Ini pertama kali saya membeli produk tersebut'],
  LOOP + 'Opsi tidak diacak (urutan logis perjalanan channel)', 'Pola perpindahan channel offline -> online pada pembelian berulang. Menguji H6'),
 ('OF2', T_CH, 'Mengapa dulu Anda pertama kali membeli produk tersebut di toko fisik? (pilih maksimal 3)', 'MA (maks. 3)',
  ['Ingin melihat / mencoba langsung (ukuran, warna, bahan, aroma)', 'Kebetulan melihatnya saat berada di toko', 'Membutuhkannya saat itu juga', 'Ragu dengan keaslian / kualitas jika membeli online', 'Direkomendasikan pramuniaga / staf toko', 'Belum tahu produk tersebut dijual online', 'Sekalian jalan-jalan / berbelanja kebutuhan lain', 'Lainnya, sebutkan: ___'],
  LOOP + "Tampilkan HANYA jika {OF1} = 'Pertama kali beli di toko fisik...' (2 opsi pertama)", 'Peran toko fisik sebagai titik pembelian pertama (trial)'),
 ('OF3', T_CH, 'Apa yang membuat Anda kemudian membeli produk tersebut secara online? (pilih maksimal 3)', 'MA (maks. 3)',
  ['Harga lebih murah / banyak promo', 'Gratis ongkir', 'Lebih praktis, tidak perlu ke toko', 'Sudah yakin dengan produknya setelah mencoba langsung', 'Brand / toko yang sama tersedia di aplikasi (Official Store)', 'Pilihan varian lebih lengkap', 'Bisa membandingkan harga & ulasan', 'Melihat konten / live yang meyakinkan', 'Toko fisik jauh / tidak ada di kota saya', 'Stok di toko fisik sering kosong', 'Lainnya, sebutkan: ___'],
  LOOP + "Tampilkan HANYA jika {OF1} = 'Pertama kali beli di toko fisik...' (2 opsi pertama)", 'Pemicu peralihan offline -> online. Menguji H6'),
 ('OF4', T_CH, 'Dalam kondisi apa Anda masih memilih membeli produk tersebut di toko fisik? (pilih maksimal 3)', 'MA (maks. 3)',
  ['Membutuhkannya saat itu juga', 'Ingin mencoba varian / produk baru dulu', 'Sedang berada di dekat toko / sekalian jalan-jalan', 'Ada promo khusus di toko fisik', 'Ingin memastikan keaslian produk', 'Ingin pengalaman & pelayanan langsung', 'Lainnya, sebutkan: ___'],
  LOOP + "Tampilkan HANYA jika {OF1} = 'kadang online kadang di toko fisik' / 'kadang juga beli di toko fisik'", 'Peran toko fisik yang tetap bertahan pada pembeli hybrid'),
 ('LO1', T_LO, 'Ketika membeli ulang [jawaban {PT1}], apa yang paling Anda pertahankan?', 'SA',
  ['Brand yang sama', 'Toko / seller yang sama', 'Platform yang sama', 'Kreator / host live yang sama', 'Tidak ada, saya memilih yang paling murah / menarik saat itu', 'Belum pernah membeli ulang kategori ini'],
  LOOP, 'Objek loyalitas. Menguji H4 (loyalitas bergeser ke toko & kreator)'),
 ('LO2', T_LO, 'Hal apa yang membuat Anda kembali membeli dari [jawaban {LO1}] tersebut? (pilih maksimal 3)', 'MA (maks. 3)',
  ['Kualitas produk konsisten', 'Harga bersaing', 'Voucher khusus pelanggan / pengikut toko', 'Pengiriman cepat & aman', 'Pelayanan penjual baik', 'Poin / membership', 'Sudah cocok, malas mencoba yang lain', 'Lainnya, sebutkan: ___'],
  LOOP + "Tampilkan HANYA jika {LO1} = 4 pilihan pertama", 'Driver retensi'),
 ('LO4', T_LO, 'Apa yang paling mungkin membuat Anda berhenti membeli dari brand/toko langganan Anda? (pilih maksimal 3)', 'MA (maks. 3)',
  ['Harga lebih murah di tempat lain', 'Harga naik', 'Kualitas produk menurun', 'Produk tidak sesuai foto / deskripsi', 'Pernah dapat produk palsu / tidak original', 'Pengalaman buruk (pengiriman, pelayanan, retur)', 'Ongkir mahal / pengiriman lama', 'Penjual lambat merespons', 'Stok sering kosong', 'Ulasan buruk dari pembeli lain', 'Brand terkena isu negatif / kontroversi', 'Menemukan produk baru yang lebih menarik dari konten', 'Tidak ada lagi promo / voucher', 'Program member / poin tidak menarik lagi', 'Kebutuhan atau selera saya berubah', 'Lainnya, sebutkan: ___', 'Tidak ada, saya akan tetap setia (eksklusif)'],
  LOOP, 'Pemicu perpindahan (churn trigger)'),
 ('RE1', T_RE, 'Seberapa besar kemungkinan Anda merekomendasikan brand [jawaban {PT1}] yang terakhir Anda beli kepada teman atau keluarga?', 'NPS 0-10',
  ['0 = Sangat tidak mungkin ... 10 = Sangat mungkin'], LOOP, 'NPS brand per kategori'),
 ('RE2', T_RE, 'Setelah menerima produk tersebut, apa saja yang Anda lakukan? (boleh pilih lebih dari satu)', 'MA',
  ['Memberi rating bintang saja', 'Menulis ulasan teks', 'Mengunggah ulasan foto / video', 'Membagikan tautan produk ke teman / grup WhatsApp', 'Membuat konten tentang produk di media sosial', 'Mempromosikan produk sebagai affiliate', 'Mengikuti (follow) akun media sosial brand / toko tersebut', 'Mengikuti (follow) toko tersebut di aplikasi belanja', 'Mencari tahu lebih lanjut tentang brand tersebut (website, media sosial, berita)', 'Tidak melakukan apa-apa (eksklusif)'],
  LOOP, 'Bentuk advokasi, partisipasi UGC & keterikatan dengan brand (follow, cari tahu brand)'),
 ('RE3', T_RE, 'Apa yang mendorong Anda memberi ulasan atau membagikan produk tersebut? (boleh pilih lebih dari satu)', 'MA',
  ['Mendapat koin / cashback', 'Puas dengan produknya', 'Kecewa dengan produknya', 'Ingin membantu pembeli lain', 'Diminta oleh penjual', 'Mendapat komisi affiliate', 'Lainnya, sebutkan: ___'],
  LOOP + "Tampilkan HANYA jika {RE2} berisi salah satu opsi ulasan/berbagi (rating, ulasan teks, ulasan foto/video, bagikan tautan, buat konten, affiliate)", 'Pendorong advokasi'),

 # ---------------- QC ----------------
 ('QC1', T_QC, 'Untuk memastikan Anda membaca setiap pertanyaan dengan saksama, silakan pilih jawaban "Biru" pada pertanyaan ini.', 'SA',
  ['Merah', 'Hijau', 'Biru', 'Kuning'],
  "Jika jawaban ≠ 'Biru' -> tandai sebagai respons tidak valid (tidak diikutkan undian)", 'Attention check. Tampilkan setelah modul funnel kategori'),


 # ---------------- TREN ----------------
 ('D0', T_TREN, 'Secara umum, di luar belanja kebutuhan dapur harian, berapa porsi belanja Anda yang dilakukan secara online dibanding di toko fisik?', 'SA',
  ['Hampir semua online', 'Lebih banyak online', 'Seimbang online dan toko fisik', 'Lebih banyak di toko fisik', 'Hampir semua di toko fisik'], '-', 'Porsi channel belanja (online vs offline) untuk segmentasi & panel'),
 ('D1', T_TREN, 'Dalam 3 bulan terakhir, bagaimana pengalaman Anda dengan live shopping?', 'SA',
  ['Tidak pernah menonton live shopping', 'Pernah menonton, tetapi belum pernah membeli saat live', 'Pernah membeli saat live beberapa kali', 'Sering membeli saat live'],
  '-', 'Live commerce: jangkauan (menonton) & konversi (membeli) dalam satu pertanyaan (gabungan D1 + D2 versi lama)'),
 ('D4', T_TREN, 'Saat menonton live shopping, pada momen apa Anda biasanya MEMUTUSKAN untuk membeli?', 'SA',
  ['Saat host mengumumkan harga atau diskon khusus selama live', 'Saat ada flash sale / hitung mundur / stok terbatas', 'Saat ada voucher atau kode promo yang hanya berlaku di live', 'Saat host mendemonstrasikan atau mencoba produk secara langsung', 'Saat pertanyaan saya dijawab langsung oleh host', 'Saat melihat banyak penonton lain ikut membeli', 'Saat ada bonus pembelian (gratis ongkir, hadiah, bundling)', 'Saya sudah berniat membeli sebelum menonton live', 'Lainnya, sebutkan: ___'],
  "Tampilkan HANYA jika {D1} = 'Pernah membeli saat live beberapa kali' / 'Sering membeli saat live'", 'Momen pemicu keputusan beli di live shopping (decision trigger)'),

 ('D5', T_TREN, 'Iklan produk di media sosial yang mengarahkan ke aplikasi belanja (misalnya bertuliskan "Beli di Shopee" atau "Beli di Tokopedia") paling sering Anda lihat dalam bentuk apa? (pilih maksimal 3)', 'MA (maks. 3)',
  ['Instagram Story', 'Instagram Reels', 'Postingan di feed Instagram', 'Facebook (feed, Story, atau Reels)', 'Video iklan di TikTok (FYP)', 'YouTube / YouTube Shorts', 'Lainnya, sebutkan: ___', 'Saya tidak pernah melihat / memperhatikan iklan seperti ini (eksklusif)'],
  '-', 'Format iklan CPAS / collaborative ads yang paling sering dilihat. Masukan untuk pemilihan placement iklan'),

 # ---------------- PENUTUP ----------------
 ('Z1', T_CLOSE, 'Apakah Anda bersedia data profil Anda disimpan dan dihubungi kembali oleh MIL Gift Club untuk survei atau riset berikutnya (dengan kesempatan mendapatkan hadiah)?', 'SA',
  ['Ya, bersedia', 'Tidak'], '-', 'Persetujuan TERPISAH untuk panel riset MIL (database profil). Jika Ya -> profil disimpan/diperbarui di tab Panel. Wajib terpisah dari persetujuan {O1} sesuai UU PDP'),
 ('Z3', T_CLOSE, 'Tuliskan nomor HP / WhatsApp aktif Anda. Nomor ini digunakan untuk menghubungi Anda apabila terpilih secara acak sebagai pemenang hadiah.', 'OA', ['08___'], 'Wajib diisi; validasi format nomor',
  'Nomor HP menjadi ID unik: satu nomor = satu respons, dan kunci data di tab Panel. Data identitas pemenang (KTP/NPWP untuk PPh hadiah) diminta terpisah HANYA kepada pemenang'),
 ('Z5', T_CLOSE, 'Terima kasih! Jawaban Anda telah tercatat. Pemenang hadiah akan dipilih secara acak dan diumumkan melalui Instagram @milgift_club pada [tanggal]. Hanya respons yang lolos verifikasi kualitas yang diikutkan dalam pengundian.', 'Info', ['-'], '-', 'Halaman penutup'),

 # ---------------- SISTEM ----------------
 ('X1', 'Variabel Sistem', '[VARIABEL SISTEM - tidak ditampilkan] Data pendukung kontrol kualitas', 'Hidden',
  ['Durasi pengisian (detik)', 'Device ID / fingerprint', 'Sumber traffic (UTM: organik IG / iklan)', 'Kategori modul funnel ({C1})', 'Status attention check ({QC1})'],
  "Speeder: durasi < 1/3 median -> tidak valid", 'Dipakai pada tahap verifikasi sebelum undian'),
]


# ================= VARIAN v2: FASHION WANITA, TAS & AKSESORI, HIJAB (khusus wanita) =================
FOCUS = ['Fashion wanita', 'Tas & aksesori', 'Fashion muslim / modest']

def variant_v2():
    """Q untuk varian v2: screener wanita + screener 3 kategori; pilihan kategori terakhir hanya dari 3 kategori."""
    out = []
    for q in Q:
        qid = q[0]
        if qid == 'S2':
            out.append(('S2', T_SCR, 'Apa jenis kelamin Anda?', 'SA', ['Pria', 'Wanita'],
                        "Jika 'Pria' -> Screen out (survei v2 khusus wanita)", 'Varian v2: 100% responden wanita'))
            continue
        if qid == 'S5':
            out.append(('SC1', T_SCR, 'Dalam 1 bulan terakhir, apakah Anda pernah membeli produk dari kategori berikut secara online? (boleh pilih lebih dari satu)', 'MA',
                        FOCUS + ['Tidak membeli satu pun dari kategori di atas (eksklusif)'],
                        "Jika memilih 'Tidak membeli satu pun' -> Screen out",
                        'Screener varian v2: hanya pembeli 3 kategori utama. Jawaban dipakai sebagai pilihan di {C1}'))
            out.append(q)
            continue
        if qid == 'C1':
            out.append(('C1', T_CAT, 'Dari kategori tersebut, produk kategori mana yang PALING TERAKHIR Anda beli secara online?', 'SA',
                        ['[Piping: kategori yang dipilih di {SC1}]'],
                        'Tampilkan HANYA jika {SC1} berisi ≥2 kategori. Jika hanya 1 -> otomatis terisi',
                        'Menentukan kategori modul funnel (Awareness s.d. Recommendation) dari 3 kategori utama'))
            continue
        if qid in ('FA1', 'FA2'):
            out.append((qid, q[1], q[2], q[3], q[4], LOOP.strip(), q[6]))
            continue
        if qid == 'C2':
            out.append(('C2', T_CAT, q[2], q[3], q[4], '-', q[6]))
            continue
        out.append(q)
    return out

# ================= LABEL PENDEK (Cross Tab, laporan, API ATLAS) =================
LABELS = {
 'S0': 'Tahun lahir', 'S1': 'Usia', 'S2': 'Jenis kelamin', 'S3': 'Bekerja di industri terkait', 'S4': 'Platform belanja (1 bulan terakhir)', 'S5': 'Frekuensi belanja online',
 'SC1': 'Kategori fokus yang dibeli', 'A1': 'Kota', 'provinsi': 'Provinsi', 'wilayah': 'Wilayah', 'A18': 'Jenis tempat tinggal', 'A19': 'Status tempat tinggal',
 'A4M': 'Status pernikahan', 'A4N': 'Jumlah anak', 'A4K': 'Usia anak', 'A4': 'Life stage', 'A5': 'Pekerjaan', 'A6': 'Pendidikan terakhir',
 'A7N': 'Jumlah anggota rumah tangga', 'A7': 'Pengeluaran rumah tangga per bulan', 'A8': 'Belanja online pribadi per bulan', 'ses': 'SES', 'kelas_ekonomi': 'Kelas ekonomi',
 'A9': 'Pengambil keputusan belanja rumah tangga', 'A10': 'Media sosial harian', 'A11': 'Durasi media sosial per hari', 'A12': 'Metode pembayaran',
 'A13': 'Merek HP', 'A13H': 'Harga HP', 'segmen_hp': 'Segmen HP', 'generasi': 'Generasi', 'A14': 'Minat / hobi', 'A15': 'Mengenakan hijab', 'A16': 'Kendaraan yang dimiliki',
 'B2': 'Platform paling sering dipakai', 'B4': 'Platform paling sesuai', 'C1': 'Kategori belanja terakhir', 'kategori_1': 'Kategori yang dibahas',
 'C2': 'Frekuensi beli kategori (3 bulan)', 'PT1': 'Produk yang dibeli', 'PT2': 'Harga produk per item', 'AW1': 'Platform tempat membeli',
 'AW3': 'Pemicu ingin membeli', 'AW5': 'Sumber pertama tahu produk', 'AW6': 'Konten yang menarik perhatian', 'AW7': 'Yang ingin dipastikan dari konten', 'CO2': 'Cara membandingkan pilihan',
 'CO4': 'Pendorong keputusan membeli', 'PTB': 'Merek yang dibeli', 'AW5K': 'Kata kunci pencarian', 'AW5S': 'Aplikasi tempat melihat konten', 'AW5C': 'Kreator / akun yang diingat', 'AW5R': 'Yang merekomendasikan', 'AW5G': 'Jenis grup / komunitas', 'AW5T': 'Jenis toko fisik', 'AW5M': 'Media iklan konvensional', 'FA2': 'Sikap terhadap harga (fashion)', 'CO6': 'Jeda melihat hingga membeli',
 'CO7': 'Melihat/mencoba di toko fisik dulu', 'PU1': 'Alasan memilih platform', 'PU2': 'Momen pembelian', 'PU4': 'Total nilai belanja', 'PU5': 'Pemakaian voucher / promo',
 'PU6': 'Membatalkan checkout', 'PU7': 'Alasan tidak jadi membeli', 'OF1': 'Riwayat beli online vs toko fisik', 'OF2': 'Alasan dulu beli di toko fisik',
 'OF3': 'Alasan pindah beli online', 'OF4': 'Kondisi tetap beli di toko fisik', 'LO1': 'Yang dipertahankan saat beli ulang', 'LO2': 'Alasan kembali membeli',
 'LO4': 'Pemicu berhenti berlangganan', 'RE1': 'Kemungkinan merekomendasikan (NPS)', 'RE2': 'Tindakan setelah menerima produk', 'RE3': 'Pendorong memberi ulasan',
 'D0': 'Porsi belanja online vs toko fisik', 'D1': 'Pengalaman live shopping', 'D4': 'Momen memutuskan beli saat live', 'D5': 'Format iklan sosmed yang dilihat',
}

# ================= PILIHAN KONTEN (AW6) & YANG INGIN DIPASTIKAN (AW7) PER KELOMPOK KATEGORI =================
# Pilihan disesuaikan dengan kelompok kategori produk yang dibahas ({C1}); kelompok lain memakai pilihan umum di Q.
_AW6_TAIL = ['Review jujur / perbandingan produk', 'Testimoni pembeli biasa', 'Live shopping dengan promo khusus', 'Rekomendasi kreator yang saya ikuti', 'Konten lucu / menghibur / storytelling', 'Lainnya, sebutkan: ___']
_AW7_TAIL = ['Keaslian produk & kepercayaan pada penjual', 'Perbandingan dengan produk lain', 'Harga & promo yang didapat', 'Lainnya, sebutkan: ___', 'Tidak ada, saya hanya terhibur (eksklusif)']
AW6_BY_GROUP = {
 'Fashion & Aksesori': ['Try-on / OOTD di badan kreator', 'Mix & match / inspirasi gaya', 'Detail bahan & jahitan dari dekat', 'Perbandingan ukuran di beberapa bentuk badan', 'Tampilan visual yang estetik'],
 'Kecantikan & Perawatan': ['Cara pakai / tutorial', 'Swatch / tes warna di kulit', 'Hasil sebelum-sesudah (before-after)', 'Pemakaian beberapa hari / minggu (progress)', 'Penjelasan kandungan / ingredients'],
 'Kesehatan': ['Penjelasan manfaat & kandungan', 'Penjelasan dari ahli / tenaga kesehatan', 'Pengalaman pemakaian (sebelum-sesudah)', 'Cara pakai / dosis'],
 'Makanan & Minuman': ['Mukbang / taste test', 'Proses masak / penyajian', 'Resep / ide olahan', 'Unboxing / kemasan & porsi'],
 'Kebutuhan Rumah Tangga': ['Demo cara pakai & hasilnya', 'Before-after membersihkan', 'Tips & trik rumah tangga'],
 'Ibu & Anak': ['Demo cara pakai', 'Pengalaman orang tua lain', 'Penjelasan keamanan bahan', 'Anak sedang memakai / bermain'],
 'Rumah & Dekorasi': ['Room tour / inspirasi penataan', 'Demo pemakaian / perakitan', 'Detail bahan & ukuran dari dekat', 'Before-after makeover ruangan'],
 'Elektronik & Gadget': ['Unboxing & first impression', 'Review spesifikasi / uji performa', 'Tips & trik pemakaian'],
 'Leisure & Hobi': ['Demo pemakaian / gameplay', 'Unboxing / koleksi', 'Tips & tutorial', 'Dipakai langsung di lapangan / perjalanan'],
 'Gifting & Momen': ['Unboxing / reaksi penerima', 'Ide hadiah untuk momen tertentu', 'Detail isi & kemasan', 'Tampilan visual yang estetik'],
}
AW7_BY_GROUP = {
 'Fashion & Aksesori': ['Ukuran / size & fit di badan', 'Bahan / tekstur / ketebalan (menerawang atau tidak)', 'Nyaman dipakai (gerah / panas, gatal, berat)', 'Warna & tampilan asli (bukan editan)', 'Cocok dengan bentuk tubuh saya', 'Cara memadukan / inspirasi gaya', 'Kualitas jahitan & keawetan'],
 'Kecantikan & Perawatan': ['Cocok untuk jenis kulit / rambut saya', 'Hasil / efektivitas nyata', 'Warna / shade yang pas', 'Tekstur & rasa di kulit (lengket, berat, aroma)', 'Kandungan aman (BPOM, halal, bebas bahan tertentu)', 'Cara pakai & urutan pemakaian', 'Ketahanan (tahan lama, tidak transfer)'],
 'Kesehatan': ['Manfaat & efektivitas nyata', 'Kandungan & keamanan (BPOM, halal, efek samping)', 'Cocok untuk kondisi saya', 'Cara pakai / dosis', 'Kredibilitas yang merekomendasikan'],
 'Makanan & Minuman': ['Rasa (enak / sesuai selera)', 'Porsi & isi sebenarnya', 'Tekstur & kesegaran', 'Halal & keamanan pangan (BPOM / PIRT)', 'Kemasan aman saat dikirim', 'Cara penyajian / olahan'],
 'Kebutuhan Rumah Tangga': ['Hasil / efektivitas membersihkan', 'Aman untuk keluarga & permukaan', 'Aroma', 'Cara pakai & takaran', 'Isi / volume sebanding harga'],
 'Ibu & Anak': ['Keamanan bahan untuk anak', 'Ukuran / kesesuaian usia anak', 'Nyaman dipakai anak', 'Kemudahan dipakai orang tua', 'Daya tahan / keawetan'],
 'Rumah & Dekorasi': ['Ukuran & dimensi sesuai ruangan', 'Bahan, kualitas & kekuatan', 'Warna & tampilan asli di ruangan', 'Kemudahan pemasangan / perakitan', 'Fungsi & kepraktisan'],
 'Elektronik & Gadget': ['Spesifikasi & performa nyata', 'Daya tahan baterai / keawetan', 'Fitur & cara pakai', 'Garansi & layanan purna jual', 'Kompatibilitas dengan perangkat saya'],
 'Leisure & Hobi': ['Kualitas & daya tahan', 'Ukuran & kenyamanan dipakai', 'Fungsi saat dipakai sebenarnya', 'Keaslian / edisi koleksi', 'Mudah dipakai pemula'],
 'Gifting & Momen': ['Isi & tampilan asli (sesuai foto)', 'Kemasan aman & rapi saat sampai', 'Kesegaran / kondisi saat diterima', 'Cocok untuk penerima & momennya', 'Bisa dipersonalisasi / tambah kartu ucapan'],
}
AW6_BY_GROUP = {g: v + [x for x in _AW6_TAIL if x not in v] for g, v in AW6_BY_GROUP.items()}
AW7_BY_GROUP = {g: v + _AW7_TAIL for g, v in AW7_BY_GROUP.items()}
