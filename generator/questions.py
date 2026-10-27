# Questionnaire content. Each item: (id, topic, question, type, [attributes], routing, notes)
# Routing/notes may reference other items as {id}; resolved to question numbers at build time.
from categories import CATS
from products import PRODUCTS, PRICE_BANDS

HIGH = ['Fashion wanita', 'Tas & aksesori', 'Fashion muslim / modest']
FASHION_CATS = ['Fashion pria', 'Fashion wanita', 'Fashion muslim / modest', 'Sepatu & sandal', 'Tas & aksesori', 'Perhiasan']
ALL_CATS = [c[1] for c in CATS]

# Pertanyaan dengan urutan opsi diacak per responden. Opsi 'Lainnya', 'Tidak ...', 'Belum pernah ...',
# 'Saya tidak ...' dan opsi eksklusif tetap di akhir. Skala berurutan (usia, frekuensi, nominal, waktu) TIDAK diacak.
RANDOMIZE = ['S3', 'S4', 'A5', 'B2', 'B3', 'AW1', 'AW3', 'AW4', 'AW5', 'AW6', 'CO2', 'CO3', 'CO4', 'FA1', 'FA2', 'CO5',
             'PU1', 'PU2', 'PU3', 'PU5', 'PU7', 'OF2', 'OF3', 'OF4', 'LO1', 'LO2', 'LO4', 'LO5', 'RE2', 'RE3', 'QC1', 'D4', 'D5']
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
  "Tampilkan HANYA jika username {Z2} ditemukan di jawaban survei lain. Jika 4 digit cocok -> {S1}, {S2}, {S3}, {A1}, {A4}-{A7} terisi otomatis dan dilewati. Kosong / 3x salah -> isi profil seperti biasa",
  'Responden lama melewati profil dasar. Verifikasi 4 digit mencegah orang lain memakai username IG seseorang'),
 ('S1', T_SCR, 'Berapa usia Anda saat ini?', 'SA',
  ['Di bawah 18 tahun', '18-24 tahun', '25-34 tahun', '35-44 tahun', '45-54 tahun', '55 tahun ke atas'],
  "Jika 'Di bawah 18 tahun' -> Screen out", 'Kuota usia: 18-24 (30%), 25-34 (35%), 35-44 (20%), 45+ (15%)'),
 ('S2', T_SCR, 'Apa jenis kelamin Anda?', 'SA', ['Pria', 'Wanita'], '-', 'Soft quota 50:50'),
 ('S3', T_SCR, 'Apakah Anda atau anggota keluarga inti Anda bekerja di salah satu bidang berikut?', 'MA',
  ['Agensi pemasaran / periklanan / digital marketing', 'Perusahaan riset pasar', 'Perusahaan e-commerce / marketplace', 'Tidak satu pun dari pilihan di atas (eksklusif)'],
  "Jika memilih salah satu dari 3 pilihan pertama -> Screen out", 'Mencegah bias responden yang memahami industri'),
 ('S4', T_SCR, 'Dalam 1 bulan terakhir, di aplikasi/kanal mana saja Anda pernah berbelanja online? (boleh pilih lebih dari satu)', 'MA',
  PLAT + ['Saya tidak berbelanja online dalam 1 bulan terakhir (eksklusif)'],
  "Jika TIDAK memilih Shopee, TikTok Shop, maupun Tokopedia -> Screen out",
  'Kriteria utama target responden. Periode 1 bulan menjaga akurasi ingatan dan memastikan responden pembelanja aktif. Jawaban dipakai sebagai piping untuk {B2}, {AW1}, {CO3}'),
 ('S5', T_SCR, 'Secara rata-rata, seberapa sering Anda berbelanja online dalam sebulan?', 'SA',
  ['Kurang dari 1 kali per bulan', '1-2 kali per bulan', '3-5 kali per bulan', '6-10 kali per bulan', 'Lebih dari 10 kali per bulan'],
  '-', 'Segmentasi intensitas belanja (light / medium / heavy shopper)'),

 # ---------------- PROFIL ----------------
 ('A1', T_PROF, 'Di kota/kabupaten mana Anda tinggal saat ini?', 'SA (cari kota)',
  ['Ketik untuk mencari dari 514 kabupaten/kota (Kepmendagri 2025)', 'Daftar lengkap di sheet "Daftar Kota"'], '-',
  'Provinsi, wilayah Jabodetabek, dan tipe wilayah (kota/kabupaten) diturunkan otomatis dari jawaban ini, sehingga tidak perlu ditanyakan. Dipakai untuk kuota wilayah (Jabodetabek 25% | Jawa lainnya 35% | Sumatera 20% | Kalimantan, Sulawesi & Indonesia Timur 20%) dan menguji H5'),
 ('A4', T_PROF, 'Manakah yang paling menggambarkan kondisi Anda saat ini?', 'SA',
  ['Pelajar / mahasiswa', 'Bekerja, belum menikah', 'Menikah, belum memiliki anak', 'Menikah, memiliki anak usia di bawah 12 tahun', 'Menikah, memiliki anak usia 12 tahun ke atas', 'Lainnya'],
  '-', 'Life stage untuk segmentasi persona'),
 ('A5', T_PROF, 'Apa pekerjaan utama Anda saat ini?', 'SA',
  ['Pelajar / mahasiswa', 'Karyawan swasta', 'PNS / BUMN / TNI / Polri', 'Wiraswasta / pemilik usaha', 'Pekerja lepas / freelancer', 'Ibu rumah tangga', 'Tidak bekerja / pensiun', 'Lainnya'],
  '-', '-'),
 ('A6', T_PROF, 'Apa pendidikan terakhir Anda?', 'SA',
  ['SD / SMP', 'SMA / SMK sederajat', 'Diploma (D1-D3)', 'Sarjana (S1 / D4)', 'Pascasarjana (S2 / S3)'], '-', 'Komponen SES'),
 ('A7', T_PROF, 'Berapa total pengeluaran rumah tangga Anda per bulan (di luar cicilan rumah/kendaraan)?', 'SA',
  ['Di bawah Rp2.000.000', 'Rp2.000.000 - Rp3.000.000', 'Rp3.000.001 - Rp5.000.000', 'Rp5.000.001 - Rp7.500.000', 'Rp7.500.001 - Rp10.000.000', 'Rp10.000.001 - Rp15.000.000', 'Di atas Rp15.000.000'],
  '-', 'Proxy SES. Rentang perlu diselaraskan dengan klasifikasi SES yang dipakai MIL sebelum survei dibuka'),
 ('A8', T_PROF, 'Berapa rata-rata total belanja online pribadi Anda per bulan?', 'SA',
  ['Di bawah Rp100.000', 'Rp100.000 - Rp250.000', 'Rp250.001 - Rp500.000', 'Rp500.001 - Rp1.000.000', 'Rp1.000.001 - Rp2.000.000', 'Di atas Rp2.000.000'],
  '-', 'Share of wallet belanja online'),

 # ---------------- PLATFORM ----------------
 ('B2', T_PLAT, 'Dari aplikasi/kanal yang Anda gunakan untuk berbelanja, mana yang PALING SERING Anda gunakan?', 'SA',
  ['[Piping: pilihan yang dijawab di {S4}]'], 'Tampilkan HANYA jika {S4} berisi ≥2 pilihan. Jika hanya 1 -> otomatis terisi jawaban tersebut',
  'Platform utama. Kuota: minimal 300 pengguna utama Shopee & 300 pengguna utama Shop | Tokopedia (TikTok Shop + Tokopedia)'),
 ('B3', T_PLAT, 'Apa alasan utama Anda paling sering menggunakan [PLATFORM {B2}]? (pilih maksimal 3)', 'MA (maks. 3)',
  ['Harga paling murah', 'Banyak voucher / promo / gratis ongkir', 'Produk paling lengkap', 'Pengiriman cepat', 'Barang asli / terpercaya', 'Aplikasi mudah digunakan', 'Bisa sambil menonton konten / live', 'Metode pembayaran lengkap (COD, paylater)', 'Sudah terbiasa / punya banyak riwayat belanja', 'Lainnya, sebutkan: ___'],
  '-', 'Driver pemilihan platform (Pertanyaan Riset 5)'),
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
 ('PT2', T_PROD, 'Berapa harga [jawaban {PT1}] yang Anda beli, per item? (harga yang Anda bayar setelah diskon, di luar ongkir)', 'SA (dropdown)',
  PRICE_BANDS,
  LOOP, 'Harga riil per item untuk jenis produk di {PT1}: rentang Rp25.000 hingga Rp500.000, lalu rentang lebih lebar untuk produk bernilai tinggi. Disilangkan dengan SES ({A7}) untuk membaca willingness to pay per jenis produk'),
 ('AW1', T_AW, 'Ingat kembali pembelian [jawaban {PT1}] TERAKHIR Anda secara online. Di platform mana Anda membelinya?', 'SA',
  ['[Piping: pilihan yang dijawab di {S4}]'], LOOP, 'Seluruh pertanyaan funnel mengacu pada satu pembelian spesifik agar ingatan akurat (mengurangi recall bias)'),
 ('AW3', T_AW, 'Apa yang PERTAMA KALI membuat Anda ingin membeli produk tersebut?', 'SA',
  ['Kebutuhan rutin / stok habis', 'Melihat konten atau tren yang sedang viral', 'Ada promo / diskon menarik', 'Momen tertentu (gajian, hari raya, ulang tahun, dll.)', 'Rekomendasi teman / keluarga', 'Produk lama rusak / perlu diganti', 'Lainnya, sebutkan: ___'],
  LOOP, 'Pemicu kebutuhan (need trigger)'),
 ('AW4', T_AW, 'Manakah yang paling menggambarkan bagaimana Anda menemukan produk tersebut?', 'SA',
  ['Saya memang sedang mencari produk itu, lalu mencarinya (search)', 'Saya tidak sedang mencari, tetapi melihatnya lalu tertarik (discovery)', 'Tidak ingat'],
  LOOP, 'Rasio discovery vs search per kategori. Menguji H1'),
 ('AW5', T_AW, 'Dari mana Anda PERTAMA KALI mengetahui produk/brand yang Anda beli tersebut?', 'SA',
  ['Video pendek di beranda / FYP (TikTok, Reels, dll.)', 'Live shopping', 'Konten kreator / affiliate', 'Hasil pencarian di aplikasi belanja', 'Pencarian di Google', 'Iklan di media sosial (Instagram, Facebook, YouTube)', 'Rekomendasi teman / keluarga', 'Grup WhatsApp / komunitas', 'Melihat langsung di toko fisik (mal, pasar, minimarket, butik)', 'Iklan TV / billboard / media cetak', 'Lainnya, sebutkan: ___'],
  LOOP, 'Sumber awareness utama per kategori, termasuk sumber offline (toko fisik, media konvensional). Menguji H1, H6 & Pertanyaan Riset 2'),
 ('AW6', T_AW, 'Konten seperti apa yang membuat Anda tertarik pada produk tersebut? (pilih maksimal 3)', 'MA (maks. 3)',
  ['Review jujur / perbandingan produk', 'Demo / cara pemakaian', 'Hasil sebelum-sesudah (before-after)', 'Unboxing', 'Promo khusus saat live', 'Konten lucu / menghibur', 'Kreator yang saya ikuti dan percayai', 'Tampilan visual yang estetik', 'Lainnya, sebutkan: ___'],
  LOOP + "Tampilkan HANYA jika {AW5} = video pendek / live / kreator / iklan media sosial",
  'Format konten yang paling efektif per kategori'),

 # ---------------- CONSIDERATION ----------------
 ('CO2', T_CO, 'Sebelum membeli produk tersebut, bagaimana cara Anda membandingkan pilihan yang ada?', 'SA',
  ['Antar toko dalam aplikasi yang sama', 'Antar aplikasi belanja yang berbeda', 'Antar toko dan antar aplikasi', 'Tidak sama sekali, langsung membeli'],
  LOOP, 'Pola perbandingan: dalam satu aplikasi vs lintas aplikasi. Menguji H2 (loyalitas platform menipis)'),
 ('CO1', T_CO, 'Berapa banyak pilihan produk atau toko yang Anda bandingkan?', 'SA',
  ['2-3 pilihan', '4-5 pilihan', 'Lebih dari 5 pilihan'], LOOP + "Tampilkan HANYA jika {CO2} ≠ 'Tidak sama sekali, langsung membeli'", 'Ukuran consideration set'),
 ('CO3', T_CO, 'Di aplikasi mana saja Anda membandingkan harganya?', 'MA',
  ['[Piping: pilihan yang dijawab di {S4}, kecuali platform di {AW1}]'], LOOP + "Tampilkan HANYA jika {CO2} = 'Antar aplikasi belanja yang berbeda' / 'Antar toko dan antar aplikasi'",
  'Pola perbandingan lintas platform'),
 ('CO4', T_CO, 'Faktor apa yang PALING menentukan keputusan Anda memilih produk tersebut? (pilih maksimal 3)', 'MA (maks. 3)',
  ['Harga', 'Voucher / diskon', 'Gratis ongkir', 'Rating bintang', 'Ulasan foto / video pembeli', 'Jumlah produk terjual', 'Toko resmi (Official Store / Mall)', 'Estimasi waktu pengiriman', 'Rekomendasi kreator / host live', 'Kebijakan retur / garansi', 'Pilihan pembayaran (COD, paylater)', 'Brand yang sudah saya kenal'],
  LOOP + 'Urutan opsi diacak', 'Peringkat faktor keputusan. Opsi MaxDiff dapat dipakai bila platform survei mendukung (lebih akurat, +1-2 menit)'),
 ('FA1', T_CO, 'Saat memilih [jawaban {PT1}], hal apa yang PALING penting bagi Anda? (pilih maksimal 3)', 'MA (maks. 3)',
  ['Kualitas bahan & pengerjaan', 'Harga sesuai budget', 'Model mengikuti tren terbaru', 'Mencerminkan gaya & kepribadian saya', 'Nyaman dipakai', 'Awet / tahan lama', 'Brand premium / bergengsi', "Sesuai prinsip atau keyakinan saya (mis. syar'i / menutup aurat)", 'Ramah lingkungan / berkelanjutan', 'Brand lokal / mendukung produk dalam negeri', 'Brand punya cerita & nilai yang sejalan dengan saya', 'Dipakai atau direkomendasikan figur yang saya ikuti', 'Mudah dipadupadankan / cocok untuk banyak acara', 'Lainnya, sebutkan: ___'],
  LOOP + 'Tampilkan HANYA jika kategori modul = kategori fashion (' + ', '.join(FASHION_CATS) + ')',
  'Pendorong pilihan fashion: fungsional (kualitas, nyaman, awet, harga) vs status (premium, tren) vs nilai/values (keyakinan, lingkungan, lokal, brand story) vs ekspresi diri'),
 ('FA2', T_CO, 'Untuk [jawaban {PT1}], pernyataan mana yang PALING menggambarkan diri Anda?', 'SA',
  ['Saya rela membayar lebih untuk brand premium / bergengsi', "Saya rela membayar lebih untuk brand yang nilainya sejalan dengan saya (lokal, ramah lingkungan, syar'i, dll.)", 'Saya rela membayar lebih untuk kualitas, apa pun brand-nya', 'Saya rela membayar lebih untuk model yang sedang tren', 'Saya memilih harga paling terjangkau selama modelnya sesuai'],
  LOOP + 'Tampilkan HANYA jika kategori modul = kategori fashion (sama dengan {FA1})',
  'Trade-off kesediaan membayar lebih (willingness to pay): premium vs values vs kualitas vs tren vs harga. Segmentasi pembeli fashion'),
 ('CO5', T_CO, 'Sumber informasi mana yang PALING Anda percayai saat menimbang produk tersebut?', 'SA',
  ['Ulasan pembeli lain', 'Kreator / influencer', 'Host live shopping', 'Teman / keluarga', 'Deskripsi & foto di halaman toko', 'Pramuniaga / staf di toko fisik', 'Lainnya, sebutkan: ___'],
  LOOP, 'Sumber tepercaya (trust anchor)'),
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
 ('PU3', T_PU, 'Metode pembayaran apa yang Anda gunakan?', 'SA',
  ['E-wallet (GoPay, OVO, DANA, ShopeePay, dll.)', 'Transfer bank / virtual account', 'Bayar di tempat (COD)', 'Paylater / cicilan', 'Kartu kredit / debit', 'Bayar di minimarket', 'Lainnya'],
  LOOP, 'Menguji H5 (COD di luar Jawa)'),
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
 ('LO3', T_LO, 'Jika produk yang biasa Anda beli dijual lebih murah di toko lain, berapa selisih harga yang membuat Anda pindah?', 'SA',
  ['Saya pindah walau selisihnya kecil (kurang dari 5%)', 'Selisih 5-10%', 'Selisih 10-20%', 'Selisih lebih dari 20%', 'Saya tidak akan pindah'],
  LOOP + "Tampilkan contoh nominal berdasarkan {PU4} (mis. 5% dari Rp100.000 = Rp5.000)", 'Toleransi selisih harga sebelum berpindah'),
 ('LO4', T_LO, 'Apa yang paling mungkin membuat Anda berhenti membeli dari brand/toko langganan Anda? (pilih maksimal 3)', 'MA (maks. 3)',
  ['Harga lebih murah di tempat lain', 'Kualitas produk menurun', 'Pengalaman buruk (pengiriman, pelayanan, retur)', 'Stok sering kosong', 'Menemukan produk baru yang lebih menarik dari konten', 'Tidak ada lagi promo / voucher', 'Lainnya, sebutkan: ___'],
  LOOP, 'Pemicu perpindahan (churn trigger)'),
 ('LO5', T_LO, 'Program apa saja yang pernah membuat Anda membeli lagi [jawaban {PT1}]? (boleh pilih lebih dari satu)', 'MA',
  ['Voucher khusus pengikut toko (follow toko)', 'Membership / voucher member', 'Koin / cashback', 'Pesan / chat dari penjual', 'Notifikasi promo di aplikasi', 'Program poin dari brand', 'Tidak ada (eksklusif)'],
  LOOP, 'Efektivitas program retensi'),

 # ---------------- RECOMMENDATION ----------------
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
 ('D1', T_TREN, 'Seberapa sering Anda menonton live shopping dalam sebulan terakhir?', 'SA',
  ['Tidak pernah', '1-2 kali', '3-5 kali', 'Lebih dari 5 kali'], '-', 'Live commerce'),
 ('D2', T_TREN, 'Dalam 3 bulan terakhir, apakah Anda pernah membeli produk saat menonton live shopping?', 'SA',
  ['Ya, sering', 'Ya, beberapa kali', 'Tidak pernah'], "Tampilkan HANYA jika {D1} ≠ 'Tidak pernah'", 'Konversi live'),
 ('D4', T_TREN, 'Saat menonton live shopping, pada momen apa Anda biasanya MEMUTUSKAN untuk membeli?', 'SA',
  ['Saat host mengumumkan harga atau diskon khusus selama live', 'Saat ada flash sale / hitung mundur / stok terbatas', 'Saat ada voucher atau kode promo yang hanya berlaku di live', 'Saat host mendemonstrasikan atau mencoba produk secara langsung', 'Saat pertanyaan saya dijawab langsung oleh host', 'Saat melihat banyak penonton lain ikut membeli', 'Saat ada bonus pembelian (gratis ongkir, hadiah, bundling)', 'Saya sudah berniat membeli sebelum menonton live', 'Lainnya, sebutkan: ___'],
  "Tampilkan HANYA jika {D2} = 'Ya, sering' / 'Ya, beberapa kali'", 'Momen pemicu keputusan beli di live shopping (decision trigger)'),
 ('D3', T_TREN, 'Apakah Anda pernah menggunakan paylater untuk belanja online dalam 3 bulan terakhir?', 'SA',
  ['Ya, sering', 'Ya, sesekali', 'Tidak pernah, tetapi tahu fiturnya', 'Tidak tahu fitur paylater'], '-', 'Adopsi paylater'),

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
