/**
 * MIL Gift Club — Survei Kebiasaan Belanja Online
 * Backend Google Apps Script (container-bound ke Google Sheet).
 *
 * Langkah awal: jalankan menu "MIL Survey > 1. Setup awal" sekali dari Google Sheet.
 * Lihat Panduan Deploy untuk detail.
 */

// ====== KONFIGURASI (boleh diubah) ======
var CONFIG = {
  TARGET_PER_CAT: 300,          // target respons valid per kategori High
  MIN_PER_CAT: 200,             // batas minimum per kategori
  ANNOUNCE_DATE: '4 Januari 2027',  // tanggal pengumuman pemenang
  PERIODE_LABEL: 'Survei MIL Gift Club · Periode 1 2026', // label di halaman pertama
  PERIODE_GIVEAWAY: 'Hingga 31 Desember 2026',  // tampil sebagai "Periode Giveaway" (kosong = tidak ditampilkan)
  HADIAH_UTAMA: 'Apple AirPods 4',            // hadiah utama di halaman pertama
  HADIAH: [                                   // hadiah lainnya (satu baris per hadiah)
    'Voucher MAP Rp500.000 untuk 3 pemenang',
    'Saldo GoPay Rp50.000 untuk 5 pemenang'
  ],
  PESAN_PENUTUP: 'Isi survei lainnya (link di bio) untuk memperbesar kesempatan kamu menang!', // kotak kuning di halaman terima kasih
  IG_HANDLE: '@milgiftclub',                  // akun Instagram giveaway (dipakai di semua teks survei)
  LANGKAH_PENUTUP: [                          // petunjuk di halaman terima kasih (langkah 1 = isi survei, otomatis)
    'Follow Instagram @milgiftclub',
    '❤️ Like postingan giveaway ini',
    'Tag 3 teman kamu di kolom komentar',
    'Share postingan ini ke Instagram Story kamu dan tag @milgiftclub',
    'Nantikan pengumuman pemenangnya!'
  ],  PRIVACY_URL: '',              // tautan Kebijakan Privasi (wajib diisi sebelum survei dibuka)
  TNC_URL: 'https://milgiftclub.github.io/milgiftclub-survei/sk/',  // tautan Syarat & Ketentuan giveaway (halaman /sk/)
  TARGET_V1: 1200,              // target respons valid survei v1 (semua kategori)
  TARGET_V2: 600,               // target respons valid survei v2 (Fashion Wanita, Tas & Aksesori, Hijab)
  SURVEY_OPEN: true,            // ubah ke false untuk menutup survei
  EMAIL_BUKA_AKSES: 'milgiftclub@gmail.com', // email untuk permohonan buka akses (ditampilkan ke peserta yang diblokir)
  BATAS_PELANGGARAN: 2,         // pelanggaran ke-N (setelah dibuka) -> suspend
  SUSPEND_BULAN: 6,             // lama suspend (bulan)
  FUNNEL_ALL_CATEGORIES: true,  // true: semua responden menjawab modul funnel untuk kategori belanja terakhirnya; false: hanya kategori High
  SURVEY_NAME: 'Online Shopper Journey 2026' // nama survei ini, dicatat di riwayat panel
};

// ====== DATA (dihasilkan dari draft kuesioner) ======
var CATEGORIES = [["Fashion & Aksesori", "Fashion pria", "Low"], ["Fashion & Aksesori", "Fashion wanita", "High"], ["Fashion & Aksesori", "Fashion muslim / modest", "High"], ["Fashion & Aksesori", "Fashion anak & bayi", "Low"], ["Fashion & Aksesori", "Sepatu & sandal", "Low"], ["Fashion & Aksesori", "Tas & aksesori", "High"], ["Fashion & Aksesori", "Perhiasan", "Low"], ["Kecantikan & Perawatan", "Skincare", "Low"], ["Kecantikan & Perawatan", "Makeup", "Low"], ["Kecantikan & Perawatan", "Body care & bath", "Low"], ["Kecantikan & Perawatan", "Hair care", "Low"], ["Kecantikan & Perawatan", "Parfum", "Low"], ["Kecantikan & Perawatan", "Grooming pria", "Low"], ["Kesehatan", "Suplemen & vitamin", "Low"], ["Kesehatan", "Alat & produk kesehatan", "Low"], ["Makanan & Minuman", "Camilan & makanan ringan", "Low"], ["Makanan & Minuman", "Oleh-oleh & makanan khas daerah", "Low"], ["Makanan & Minuman", "Minuman", "Low"], ["Makanan & Minuman", "Bahan makanan & groceries", "Low"], ["Kebutuhan Rumah Tangga", "Produk kebersihan rumah", "Low"], ["Ibu & Anak", "Perlengkapan bayi", "Low"], ["Ibu & Anak", "Mainan anak", "Low"], ["Rumah & Dekorasi", "Home decor", "Low"], ["Rumah & Dekorasi", "Furnitur", "Low"], ["Rumah & Dekorasi", "Peralatan dapur & makan", "Low"], ["Rumah & Dekorasi", "Tekstil rumah", "Low"], ["Elektronik & Gadget", "HP & aksesori", "Low"], ["Elektronik & Gadget", "Laptop & komputer", "Low"], ["Elektronik & Gadget", "Audio, wearable & gadget", "Low"], ["Elektronik & Gadget", "Elektronik rumah tangga", "Low"], ["Leisure & Hobi", "Olahraga & outdoor", "Low"], ["Leisure & Hobi", "Hobi & koleksi", "Low"], ["Leisure & Hobi", "Buku & alat tulis", "Low"], ["Leisure & Hobi", "Gaming", "Low"], ["Leisure & Hobi", "Perlengkapan travel", "Low"], ["Gifting & Momen", "Bunga & tanaman", "Low"], ["Gifting & Momen", "Hampers & parsel", "Low"], ["Gifting & Momen", "Kado personalisasi", "Low"], ["Lainnya", "Hewan peliharaan", "Low"], ["Lainnya", "Otomotif", "Low"]];   // [kelompok, kategori, prioritas]
var DICTIONARY = [["O1", 1, "Pembuka & Persetujuan", "Terima kasih telah berpartisipasi dalam survei tentang kebiasaan belanja online. Survei ini membutuhkan waktu ±7 menit. Jawaban Anda bersifat rahasia dan hanya digunakan untuk keperluan riset. Data kontak hanya digunakan untuk keperluan undian dan verifikasi pemenang. Apakah Anda bersedia mengikuti survei ini?"], ["Z2", 2, "Pembuka & Persetujuan", "Tuliskan username Instagram Anda (untuk verifikasi keikutsertaan giveaway @milgift_club)."], ["PV", 3, "Pembuka & Persetujuan", "Kamu sudah pernah mengisi survei MIL Gift Club sebelumnya. Supaya tidak perlu mengisi data diri lagi, masukkan 4 digit terakhir nomor WhatsApp yang kamu daftarkan."], ["PR", 4, "Pembuka & Persetujuan", "Data diri kamu terakhir diperbarui lebih dari 6 bulan lalu. Apakah data berikut masih sesuai?"], ["S0", 5, "Screening", "Tahun berapa Anda lahir?"], ["S0B", 6, "Screening", "Apakah usia Anda saat ini sudah genap 18 tahun?"], ["S1", 7, "Screening", "Berapa usia Anda saat ini?"], ["S2", 8, "Screening", "Apa jenis kelamin Anda?"], ["S3", 9, "Screening", "Apakah Anda atau anggota keluarga inti Anda bekerja di salah satu bidang berikut?"], ["S4", 10, "Screening", "Dalam 1 bulan terakhir, di aplikasi/kanal mana saja Anda pernah berbelanja online? (boleh pilih lebih dari satu)"], ["S5", 11, "Screening", "Secara rata-rata, seberapa sering Anda berbelanja online dalam sebulan?"], ["A1", 12, "Profil & Demografi", "Di kota/kabupaten mana Anda tinggal saat ini?"], ["A18", 13, "Profil & Demografi", "Apa jenis tempat tinggal Anda saat ini?"], ["A19", 14, "Profil & Demografi", "Apa status tempat tinggal Anda tersebut?"], ["A4M", 15, "Profil & Demografi", "Apa status pernikahan Anda saat ini?"], ["A4N", 16, "Profil & Demografi", "Berapa jumlah anak Anda?"], ["A4K", 17, "Profil & Demografi", "Berapa usia anak-anak Anda saat ini? (boleh pilih lebih dari satu)"], ["A4", 18, "Profil & Demografi", "Manakah yang paling menggambarkan kondisi Anda saat ini?"], ["A5", 19, "Profil & Demografi", "Apa pekerjaan utama Anda saat ini?"], ["A6", 20, "Profil & Demografi", "Apa pendidikan terakhir Anda?"], ["A7N", 21, "Profil & Demografi", "Termasuk Anda, berapa orang yang tinggal serumah dan berbagi pengeluaran rumah tangga yang sama?"], ["A7", 22, "Profil & Demografi", "Berapa total pengeluaran rumah tangga Anda per bulan (di luar cicilan rumah/kendaraan)?"], ["A8", 23, "Profil & Demografi", "Berapa rata-rata total belanja online pribadi Anda per bulan?"], ["A9", 24, "Profil & Demografi", "Siapa yang biasanya memutuskan belanja kebutuhan rumah tangga di rumah Anda?"], ["A10", 25, "Profil & Demografi", "Media sosial apa saja yang Anda buka setiap hari? (boleh pilih lebih dari satu)"], ["A11", 26, "Profil & Demografi", "Berapa lama total waktu Anda bermain media sosial dalam sehari?"], ["A12", 27, "Profil & Demografi", "Metode pembayaran apa saja yang Anda gunakan untuk belanja online dalam 3 bulan terakhir? (boleh pilih lebih dari satu)"], ["A13", 28, "Profil & Demografi", "Apa merek HP utama yang Anda gunakan sehari-hari?"], ["A13H", 29, "Profil & Demografi", "Berapa kisaran harga HP tersebut saat dibeli (harga baru)?"], ["A14", 30, "Profil & Demografi", "Apa minat atau hobi utama Anda? (pilih maksimal 3)"], ["A15", 31, "Profil & Demografi", "Apakah Anda mengenakan hijab dalam keseharian?"], ["A16", 32, "Profil & Demografi", "Kendaraan apa saja yang Anda miliki? (boleh pilih lebih dari satu)"], ["B2", 33, "Lanskap Platform", "Dari aplikasi/kanal yang Anda gunakan untuk berbelanja, mana yang PALING SERING Anda gunakan?"], ["B4", 34, "Lanskap Platform", "Menurut Anda, pernyataan berikut paling sesuai untuk platform mana? (pilih satu platform per baris)"], ["C1", 35, "Penetrasi & Penugasan Kategori", "Pada belanja online TERAKHIR Anda, produk dari kategori apa yang Anda beli?"], ["C2", 36, "Penetrasi & Penugasan Kategori", "Dalam 3 bulan terakhir, berapa kali Anda membeli produk [KATEGORI] secara online?"], ["PT1", 37, "Funneling - Produk & Harga", "Pada belanja online terakhir untuk kategori [KATEGORI], produk apa yang Anda beli? (pilih produk utamanya)"], ["PTB", 38, "Funneling - Produk & Harga", "Apa merek [jawaban Q37] yang Anda beli tersebut?"], ["PT2", 39, "Funneling - Produk & Harga", "Berapa harga [jawaban Q37] yang Anda beli, per item? (harga yang Anda bayar setelah diskon, di luar ongkir)"], ["AW1", 40, "Funneling - Awareness", "Ingat kembali pembelian [jawaban Q37] TERAKHIR Anda secara online. Di platform mana Anda membelinya?"], ["AW3", 41, "Funneling - Awareness", "Apa yang PERTAMA KALI membuat Anda ingin membeli produk tersebut?"], ["AW5", 42, "Funneling - Awareness", "Dari mana Anda PERTAMA KALI mengetahui produk/brand yang Anda beli tersebut?"], ["AW5K", 43, "Funneling - Awareness", "Kira-kira kata kunci apa yang Anda ketik saat mencari produk tersebut?"], ["AW5S", 44, "Funneling - Awareness", "Di aplikasi mana Anda melihat konten / iklan tersebut?"], ["AW5C", 45, "Funneling - Awareness", "Masih ingat nama kreator / akun yang membagikannya? (opsional)"], ["AW5R", 46, "Funneling - Awareness", "Siapa yang merekomendasikan produk tersebut?"], ["AW5G", 47, "Funneling - Awareness", "Grup / komunitas seperti apa?"], ["AW5T", 48, "Funneling - Awareness", "Di toko fisik seperti apa Anda melihatnya?"], ["AW5M", 49, "Funneling - Awareness", "Lewat media apa?"], ["AW6", 50, "Funneling - Awareness", "Konten seperti apa yang paling menarik perhatian Anda sampai ingin membeli produk tersebut? (pilih maksimal 3)"], ["AW7", 51, "Funneling - Awareness", "Dari konten tersebut, apa yang ingin Anda pastikan tentang produknya? (pilih maksimal 3)"], ["CO2", 52, "Funneling - Consideration", "Sebelum membeli produk tersebut, bagaimana cara Anda membandingkan pilihan yang ada?"], ["CO4", 53, "Funneling - Consideration", "Apa yang PALING membuat Anda akhirnya memutuskan membeli produk tersebut? (pilih maksimal 3)"], ["FA2", 54, "Funneling - Consideration", "Untuk [jawaban Q37], pernyataan mana yang PALING menggambarkan diri Anda?"], ["CO6", 55, "Funneling - Consideration", "Berapa lama waktu dari pertama kali melihat produk tersebut hingga Anda membelinya?"], ["CO7", 56, "Funneling - Consideration", "Sebelum membeli secara online, apakah Anda melihat atau mencoba produk tersebut langsung di toko fisik?"], ["PU1", 57, "Funneling - Purchase", "Mengapa Anda memilih membeli di [PLATFORM Q40] untuk pembelian ini? (pilih maksimal 3)"], ["PU2", 58, "Funneling - Purchase", "Pada momen apa pembelian tersebut Anda lakukan?"], ["PU4", 59, "Funneling - Purchase", "Berapa total nilai belanja (termasuk ongkir) pada pembelian tersebut?"], ["PU5", 60, "Funneling - Purchase", "Apakah Anda menggunakan voucher atau promo pada pembelian tersebut?"], ["PU6", 61, "Funneling - Purchase", "Dalam 3 bulan terakhir, apakah Anda pernah membatalkan checkout atau membiarkan [jawaban Q37] di keranjang tanpa membelinya?"], ["PU7", 62, "Funneling - Purchase", "Apa alasan utama Anda tidak jadi membeli? (pilih maksimal 3)"], ["OF1", 63, "Funneling - Channel Online & Offline", "Bagaimana riwayat pembelian Anda untuk produk tersebut (brand/produk yang sama)?"], ["OF2", 64, "Funneling - Channel Online & Offline", "Mengapa dulu Anda pertama kali membeli produk tersebut di toko fisik? (pilih maksimal 3)"], ["OF3", 65, "Funneling - Channel Online & Offline", "Apa yang membuat Anda kemudian membeli produk tersebut secara online? (pilih maksimal 3)"], ["OF4", 66, "Funneling - Channel Online & Offline", "Dalam kondisi apa Anda masih memilih membeli produk tersebut di toko fisik? (pilih maksimal 3)"], ["LO1", 67, "Funneling - Loyalty", "Ketika membeli ulang [jawaban Q37], apa yang paling Anda pertahankan?"], ["LO2", 68, "Funneling - Loyalty", "Hal apa yang membuat Anda kembali membeli dari [jawaban Q67] tersebut? (pilih maksimal 3)"], ["LO4", 69, "Funneling - Loyalty", "Apa yang paling mungkin membuat Anda berhenti membeli dari brand/toko langganan Anda? (pilih maksimal 3)"], ["RE1", 70, "Funneling - Recommendation", "Seberapa besar kemungkinan Anda merekomendasikan brand [jawaban Q37] yang terakhir Anda beli kepada teman atau keluarga?"], ["RE2", 71, "Funneling - Recommendation", "Setelah menerima produk tersebut, apa saja yang Anda lakukan? (boleh pilih lebih dari satu)"], ["RE3", 72, "Funneling - Recommendation", "Apa yang mendorong Anda memberi ulasan atau membagikan produk tersebut? (boleh pilih lebih dari satu)"], ["QC1", 73, "Quality Check", "Untuk memastikan Anda membaca setiap pertanyaan dengan saksama, silakan pilih jawaban \"Biru\" pada pertanyaan ini."], ["D0", 74, "Tren & Perilaku Baru", "Secara umum, di luar belanja kebutuhan dapur harian, berapa porsi belanja Anda yang dilakukan secara online dibanding di toko fisik?"], ["D1", 75, "Tren & Perilaku Baru", "Dalam 3 bulan terakhir, bagaimana pengalaman Anda dengan live shopping?"], ["D4", 76, "Tren & Perilaku Baru", "Saat menonton live shopping, pada momen apa Anda biasanya MEMUTUSKAN untuk membeli?"], ["D5", 77, "Tren & Perilaku Baru", "Iklan produk di media sosial yang mengarahkan ke aplikasi belanja (misalnya bertuliskan \"Beli di Shopee\" atau \"Beli di Tokopedia\") paling sering Anda lihat dalam bentuk apa? (pilih maksimal 3)"], ["Z1", 78, "Penutup & Data Giveaway", "Apakah Anda bersedia data profil Anda disimpan dan dihubungi kembali oleh MIL Gift Club untuk survei atau riset berikutnya (dengan kesempatan mendapatkan hadiah)?"], ["Z3", 79, "Penutup & Data Giveaway", "Tuliskan nomor HP / WhatsApp aktif Anda. Nomor ini digunakan untuk menghubungi Anda apabila terpilih secara acak sebagai pemenang hadiah."], ["SC1", "v2:11", "Screening (v2)", "Dalam 1 bulan terakhir, apakah Anda pernah membeli produk dari kategori fokus (Fashion wanita, Tas & aksesori, Fashion muslim / modest) secara online?"]];
var QTYPES = {"O1": "sa", "Z2": "oa", "PV": "oa", "PR": "sa", "S0": "dropdown", "S0B": "sa", "S1": "sa", "S2": "sa", "S3": "ma", "S4": "ma", "S5": "sa", "A1": "city", "A18": "sa", "A19": "sa", "A4M": "sa", "A4N": "sa", "A4K": "ma", "A4": "sa", "A5": "sa", "A6": "sa", "A7N": "sa", "A7": "sa", "A8": "sa", "A9": "sa", "A10": "ma", "A11": "sa", "A12": "ma", "A13": "sa", "A13H": "sa", "A14": "ma", "A15": "sa", "A16": "ma", "B2": "sa", "B4": "matrix_sa", "C1": "sa", "C2": "sa", "PT1": "sa", "PTB": "oa", "PT2": "dropdown", "AW1": "sa", "AW3": "sa", "AW5": "sa", "AW5K": "oa", "AW5S": "sa", "AW5C": "oa", "AW5R": "sa", "AW5G": "sa", "AW5T": "sa", "AW5M": "sa", "AW6": "ma", "AW7": "ma", "CO2": "sa", "CO4": "ma", "FA2": "sa", "CO6": "sa", "CO7": "sa", "PU1": "ma", "PU2": "sa", "PU4": "sa", "PU5": "sa", "PU6": "sa", "PU7": "ma", "OF1": "sa", "OF2": "ma", "OF3": "ma", "OF4": "ma", "LO1": "sa", "LO2": "ma", "LO4": "ma", "RE1": "nps", "RE2": "ma", "RE3": "ma", "QC1": "sa", "D0": "sa", "D1": "sa", "D4": "sa", "D5": "ma", "Z1": "sa", "Z3": "oa", "Z5": "info", "SC1": "ma"};       // tipe pertanyaan (sa/ma/...) untuk filter Panel
var QOPTS = {"O1": ["Ya, saya setuju dan bersedia mengikuti survei", "Tidak bersedia"], "PR": ["Ya, masih sesuai", "Ada yang berubah, saya mau isi ulang"], "S0": ["2010", "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000", "1999", "1998", "1997", "1996", "1995", "1994", "1993", "1992", "1991", "1990", "1989", "1988", "1987", "1986", "1985", "1984", "1983", "1982", "1981", "1980", "1979", "1978", "1977", "1976", "1975", "1974", "1973", "1972", "1971", "1970", "1969", "1968", "1967", "1966", "1965", "1964", "1963", "1962", "1961", "1960", "1959", "1958", "1957", "1956", "1955", "1954", "1953", "1952", "1951", "1950", "1949", "1948", "1947", "1946", "1945 atau sebelumnya"], "S0B": ["Ya, sudah 18 tahun", "Belum"], "S1": ["Di bawah 18 tahun", "18-24 tahun", "25-34 tahun", "35-44 tahun", "45-54 tahun", "55 tahun ke atas"], "S2": ["Pria", "Wanita"], "S3": ["Agensi pemasaran / periklanan / digital marketing", "Perusahaan riset pasar", "Perusahaan e-commerce / marketplace", "Tidak satu pun dari pilihan di atas"], "S4": ["Shopee", "TikTok Shop", "Tokopedia", "Lazada", "Blibli", "Website / aplikasi resmi brand", "Instagram / WhatsApp (chat langsung dengan penjual)", "Lainnya", "Saya tidak berbelanja online dalam 1 bulan terakhir"], "S5": ["Kurang dari 1 kali per bulan", "1-2 kali per bulan", "3-5 kali per bulan", "6-10 kali per bulan", "Lebih dari 10 kali per bulan"], "A18": ["Rumah tapak", "Apartemen", "Rumah susun", "Kos / kamar sewa", "Ruko / rukan", "Asrama / mess", "Lainnya"], "A19": ["Milik sendiri (sudah lunas)", "Milik sendiri (masih cicilan / KPR)", "Milik orang tua / keluarga (tinggal bersama)", "Sewa / kontrak (bulanan atau tahunan)", "Rumah dinas / fasilitas kantor", "Lainnya"], "A4M": ["Belum menikah", "Menikah", "Cerai / berpisah"], "A4N": ["Belum / tidak memiliki anak", "1 anak", "2 anak", "3 anak", "4 anak atau lebih"], "A4K": ["Di bawah 2 tahun (bayi)", "2-5 tahun (balita)", "6-12 tahun (usia SD)", "13-17 tahun (remaja)", "18 tahun ke atas"], "A4": ["Pelajar / mahasiswa", "Bekerja, belum menikah", "Menikah, belum memiliki anak", "Menikah, memiliki anak usia di bawah 12 tahun", "Menikah, memiliki anak usia 12 tahun ke atas", "Lainnya"], "A5": ["Pelajar / mahasiswa", "Karyawan swasta", "PNS / BUMN / TNI / Polri", "Wiraswasta / pemilik usaha", "Pekerja lepas / freelancer", "Ibu rumah tangga", "Tidak bekerja / pensiun", "Lainnya"], "A6": ["SD / SMP", "SMA / SMK sederajat", "Diploma (D1-D3)", "Sarjana (S1 / D4)", "Pascasarjana (S2 / S3)"], "A7N": ["1 orang (hanya saya)", "2 orang", "3 orang", "4 orang", "5 orang", "6 orang", "7 orang atau lebih"], "A7": ["Di bawah Rp2.000.000", "Rp2.000.000 - Rp3.000.000", "Rp3.000.001 - Rp5.000.000", "Rp5.000.001 - Rp7.500.000", "Rp7.500.001 - Rp10.000.000", "Rp10.000.001 - Rp15.000.000", "Rp15.000.001 - Rp25.000.000", "Rp25.000.001 - Rp40.000.000", "Di atas Rp40.000.000"], "A8": ["Di bawah Rp100.000", "Rp100.000 - Rp250.000", "Rp250.001 - Rp500.000", "Rp500.001 - Rp1.000.000", "Rp1.000.001 - Rp2.000.000", "Di atas Rp2.000.000"], "A9": ["Saya sendiri", "Saya bersama pasangan / anggota keluarga lain", "Orang lain, tetapi saya ikut memberi masukan", "Orang lain, saya tidak terlibat"], "A10": ["Instagram", "TikTok", "YouTube", "Facebook", "X (Twitter)", "Threads", "Pinterest", "LinkedIn", "Lainnya", "Tidak ada"], "A11": ["Kurang dari 1 jam", "1-2 jam", "2-4 jam", "4-6 jam", "Lebih dari 6 jam"], "A12": ["E-wallet (GoPay, OVO, DANA, ShopeePay, dll.)", "QRIS", "Transfer bank / virtual account", "Kartu debit", "Kartu kredit", "Paylater / cicilan", "Bayar di tempat (COD)", "Bayar di gerai (Indomaret / Alfamart)", "Lainnya"], "A13": ["Samsung", "iPhone", "Xiaomi / Redmi / POCO", "OPPO", "vivo", "realme", "Huawei", "Infinix", "Tecno", "itel", "Lainnya"], "A13H": ["Di bawah Rp1.500.000", "Rp1.500.000 - Rp2.500.000", "Rp2.500.001 - Rp4.000.000", "Rp4.000.001 - Rp6.000.000", "Rp6.000.001 - Rp10.000.000", "Di atas Rp10.000.000"], "A14": ["Kuliner / wisata makanan", "Traveling", "Olahraga / fitness", "Fashion & kecantikan", "Gaming", "Musik / konser", "Film / series / drama", "Membaca", "Otomotif", "Gadget & teknologi", "Parenting / keluarga", "Memasak / baking", "Investasi / keuangan", "Berkebun / tanaman", "Hewan peliharaan", "Seni & kerajinan tangan", "K-pop / budaya Korea & Jepang", "Lainnya"], "A15": ["Ya, setiap hari", "Kadang-kadang", "Tidak"], "A16": ["Mobil", "Motor", "Sepeda", "Tidak memiliki kendaraan"], "B4": ["Tidak ada"], "C1": ["Fashion pria", "Fashion wanita", "Fashion muslim / modest", "Fashion anak & bayi", "Sepatu & sandal", "Tas & aksesori", "Perhiasan", "Skincare", "Makeup", "Body care & bath", "Hair care", "Parfum", "Grooming pria", "Suplemen & vitamin", "Alat & produk kesehatan", "Camilan & makanan ringan", "Oleh-oleh & makanan khas daerah", "Minuman", "Bahan makanan & groceries", "Produk kebersihan rumah", "Perlengkapan bayi", "Mainan anak", "Home decor", "Furnitur", "Peralatan dapur & makan", "Tekstil rumah", "HP & aksesori", "Laptop & komputer", "Audio, wearable & gadget", "Elektronik rumah tangga", "Olahraga & outdoor", "Hobi & koleksi", "Buku & alat tulis", "Gaming", "Perlengkapan travel", "Bunga & tanaman", "Hampers & parsel", "Kado personalisasi", "Hewan peliharaan", "Otomotif", "Kategori lain"], "C2": ["1 kali (hanya pembelian terakhir ini)", "2-3 kali", "4-6 kali", "Lebih dari 6 kali"], "PT2": ["Di bawah Rp10.000", "Rp10.000 – Rp50.000", "Rp50.001 – Rp75.000", "Rp75.001 – Rp100.000", "Rp100.001 – Rp125.000", "Rp125.001 – Rp150.000", "Rp150.001 – Rp175.000", "Rp175.001 – Rp200.000", "Rp200.001 – Rp225.000", "Rp225.001 – Rp250.000", "Rp250.001 – Rp275.000", "Rp275.001 – Rp300.000", "Rp300.001 – Rp325.000", "Rp325.001 – Rp350.000", "Rp350.001 – Rp375.000", "Rp375.001 – Rp400.000", "Rp400.001 – Rp425.000", "Rp425.001 – Rp450.000", "Rp450.001 – Rp475.000", "Rp475.001 – Rp500.000", "Rp500.001 – Rp750.000", "Rp750.001 – Rp1.000.000", "Rp1.000.001 – Rp2.000.000", "Rp2.000.001 – Rp5.000.000", "Di atas Rp5.000.000"], "AW3": ["Kebutuhan rutin / stok habis", "Melihat konten / tren / influencer di media sosial", "Ada promo / diskon menarik", "Momen tertentu (gajian, hari raya, ulang tahun, dll.)", "Rekomendasi teman / keluarga", "Produk lama rusak / perlu diganti", "Lainnya"], "AW5": ["Video pendek di beranda / FYP (TikTok, Reels, dll.)", "Live shopping", "Konten kreator / affiliate", "Hasil pencarian di aplikasi belanja", "Pencarian di Google", "Iklan di media sosial (Instagram, Facebook, YouTube)", "Rekomendasi teman / keluarga", "Grup WhatsApp / komunitas", "Melihat langsung di toko fisik (mal, pasar, minimarket, butik)", "Iklan TV / billboard / media cetak", "Lainnya"], "AW5S": ["TikTok", "Instagram", "YouTube", "Facebook", "Shopee (Video / Live)", "Tokopedia (Play / Live)", "Lainnya"], "AW5R": ["Pasangan", "Orang tua / saudara", "Teman dekat", "Rekan kerja / kuliah", "Kenalan di komunitas", "Lainnya"], "AW5G": ["Grup keluarga", "Grup teman", "Grup kantor / kampus", "Grup orang tua murid / sekolah", "Komunitas hobi / minat", "Grup jastip / reseller", "Lainnya"], "AW5T": ["Mal / pusat perbelanjaan", "Pasar / pertokoan", "Minimarket / supermarket", "Butik / toko resmi brand", "Pameran / bazar / pop-up", "Lainnya"], "AW5M": ["TV", "Billboard / baliho", "Iklan di transportasi umum / stasiun", "Majalah / koran", "Radio / podcast", "Lainnya"], "AW6": ["Cara pakai / demo produk", "Try-on / OOTD / mix & match", "Review jujur / perbandingan produk", "Hasil sebelum-sesudah (before-after)", "Unboxing / detail produk dari dekat", "Tutorial / tips & inspirasi", "Testimoni pembeli biasa", "Live shopping dengan promo khusus", "Rekomendasi kreator yang saya ikuti", "Konten lucu / menghibur / storytelling", "Tampilan visual yang estetik", "Try-on / OOTD di badan kreator", "Mix & match / inspirasi gaya", "Detail bahan & jahitan dari dekat", "Perbandingan ukuran di beberapa bentuk badan", "Cara pakai / tutorial", "Swatch / tes warna di kulit", "Pemakaian beberapa hari / minggu (progress)", "Penjelasan kandungan / ingredients", "Penjelasan manfaat & kandungan", "Penjelasan dari ahli / tenaga kesehatan", "Pengalaman pemakaian (sebelum-sesudah)", "Cara pakai / dosis", "Mukbang / taste test", "Proses masak / penyajian", "Resep / ide olahan", "Unboxing / kemasan & porsi", "Demo cara pakai & hasilnya", "Before-after membersihkan", "Tips & trik rumah tangga", "Demo cara pakai", "Pengalaman orang tua lain", "Penjelasan keamanan bahan", "Anak sedang memakai / bermain", "Room tour / inspirasi penataan", "Demo pemakaian / perakitan", "Detail bahan & ukuran dari dekat", "Before-after makeover ruangan", "Unboxing & first impression", "Review spesifikasi / uji performa", "Tips & trik pemakaian", "Demo pemakaian / gameplay", "Unboxing / koleksi", "Tips & tutorial", "Dipakai langsung di lapangan / perjalanan", "Unboxing / reaksi penerima", "Ide hadiah untuk momen tertentu", "Detail isi & kemasan", "Lainnya"], "AW7": ["Ukuran / size & fit di badan", "Bahan / tekstur / kualitas", "Nyaman dipakai (gerah / panas, berat, gatal)", "Warna & tampilan asli (bukan editan)", "Hasil / efektivitas nyata", "Cara pakai, fitur & fungsinya", "Cocok untuk kondisi saya (kulit, bentuk tubuh, kebutuhan)", "Keaslian produk & kepercayaan pada penjual", "Perbandingan dengan produk lain", "Harga & promo yang didapat", "Inspirasi gaya / cara memadukan", "Bahan / tekstur / ketebalan (menerawang atau tidak)", "Nyaman dipakai (gerah / panas, gatal, berat)", "Cocok dengan bentuk tubuh saya", "Cara memadukan / inspirasi gaya", "Kualitas jahitan & keawetan", "Cocok untuk jenis kulit / rambut saya", "Warna / shade yang pas", "Tekstur & rasa di kulit (lengket, berat, aroma)", "Kandungan aman (BPOM, halal, bebas bahan tertentu)", "Cara pakai & urutan pemakaian", "Ketahanan (tahan lama, tidak transfer)", "Manfaat & efektivitas nyata", "Kandungan & keamanan (BPOM, halal, efek samping)", "Cocok untuk kondisi saya", "Cara pakai / dosis", "Kredibilitas yang merekomendasikan", "Rasa (enak / sesuai selera)", "Porsi & isi sebenarnya", "Tekstur & kesegaran", "Halal & keamanan pangan (BPOM / PIRT)", "Kemasan aman saat dikirim", "Cara penyajian / olahan", "Hasil / efektivitas membersihkan", "Aman untuk keluarga & permukaan", "Aroma", "Cara pakai & takaran", "Isi / volume sebanding harga", "Keamanan bahan untuk anak", "Ukuran / kesesuaian usia anak", "Nyaman dipakai anak", "Kemudahan dipakai orang tua", "Daya tahan / keawetan", "Ukuran & dimensi sesuai ruangan", "Bahan, kualitas & kekuatan", "Warna & tampilan asli di ruangan", "Kemudahan pemasangan / perakitan", "Fungsi & kepraktisan", "Spesifikasi & performa nyata", "Daya tahan baterai / keawetan", "Fitur & cara pakai", "Garansi & layanan purna jual", "Kompatibilitas dengan perangkat saya", "Kualitas & daya tahan", "Ukuran & kenyamanan dipakai", "Fungsi saat dipakai sebenarnya", "Keaslian / edisi koleksi", "Mudah dipakai pemula", "Isi & tampilan asli (sesuai foto)", "Kemasan aman & rapi saat sampai", "Kesegaran / kondisi saat diterima", "Cocok untuk penerima & momennya", "Bisa dipersonalisasi / tambah kartu ucapan", "Lainnya", "Tidak ada, saya hanya terhibur"], "CO2": ["Antar toko dalam aplikasi yang sama", "Antar aplikasi belanja yang berbeda", "Antar toko dan antar aplikasi", "Tidak sama sekali, langsung membeli"], "CO4": ["Kualitas produk / bahan terlihat bagus", "Model / desain sesuai selera & tren", "Fungsi / manfaat sesuai kebutuhan", "Harga sesuai budget", "Dipakai / direkomendasikan idola atau figur favorit", "Direkomendasikan kreator / host live", "Banyak ulasan & rating bagus", "Ulasan foto / video pembeli", "Banyak yang beli / sedang viral", "Merek terkenal / bergengsi", "Merek lokal / sejalan dengan nilai saya", "Voucher / diskon", "Gratis ongkir", "Flash sale / stok terbatas", "Bonus / bundling", "Toko resmi (Official Store / Mall)", "Estimasi pengiriman cepat", "Kebijakan retur / garansi", "Pilihan pembayaran (COD, paylater)", "Lainnya"], "FA2": ["Saya rela membayar lebih untuk brand premium / bergengsi", "Saya rela membayar lebih untuk brand yang nilainya sejalan dengan saya (lokal, ramah lingkungan, syar'i, dll.)", "Saya rela membayar lebih untuk kualitas, apa pun brand-nya", "Saya rela membayar lebih untuk model yang sedang tren", "Saya memilih harga paling terjangkau selama modelnya sesuai"], "CO6": ["Langsung saat itu juga", "Di hari yang sama", "Di minggu yang sama", "Lebih dari 1 minggu"], "CO7": ["Ya, saya melihat / mencoba di toko fisik, lalu membeli online", "Tidak, saya langsung membeli online tanpa melihat di toko fisik"], "PU1": ["Harga paling murah di sana", "Ada voucher / gratis ongkir", "Produknya hanya tersedia di sana", "Menemukan produknya di platform tersebut", "Toko langganan saya ada di sana", "Pengiriman lebih cepat", "Lebih terpercaya", "Kebiasaan / platform utama saya", "Lainnya"], "PU2": ["Saat tanggal kembar (mis. 10.10, 11.11)", "Setelah gajian", "Saat flash sale", "Saat menonton live shopping", "Menjelang hari raya / musim tertentu", "Tidak ada momen khusus, saat sedang butuh"], "PU4": ["Di bawah Rp50.000", "Rp50.000 - Rp100.000", "Rp100.001 - Rp250.000", "Rp250.001 - Rp500.000", "Rp500.001 - Rp1.000.000", "Di atas Rp1.000.000"], "PU5": ["Ya, dan promo itulah alasan utama saya membeli saat itu", "Ya, tetapi saya tetap akan membeli walau tanpa promo", "Tidak menggunakan promo"], "PU6": ["Sering", "Kadang-kadang", "Tidak pernah"], "PU7": ["Ongkos kirim terlalu mahal", "Menemukan harga lebih murah di tempat lain", "Menunggu promo / tanggal kembar", "Hanya menyimpan untuk dibeli nanti", "Ragu dengan kualitas / keaslian produk", "Estimasi pengiriman terlalu lama", "Metode pembayaran yang diinginkan tidak tersedia", "Berubah pikiran / tidak jadi butuh", "Lainnya"], "OF1": ["Pertama kali beli di toko fisik, sekarang beralih ke online", "Pertama kali beli di toko fisik, sekarang kadang online kadang di toko fisik", "Pertama kali beli online, kadang juga beli di toko fisik", "Selalu beli online sejak pertama kali", "Ini pertama kali saya membeli produk tersebut"], "OF2": ["Ingin melihat / mencoba langsung (ukuran, warna, bahan, aroma)", "Kebetulan melihatnya saat berada di toko", "Membutuhkannya saat itu juga", "Ragu dengan keaslian / kualitas jika membeli online", "Direkomendasikan pramuniaga / staf toko", "Belum tahu produk tersebut dijual online", "Sekalian jalan-jalan / berbelanja kebutuhan lain", "Lainnya"], "OF3": ["Harga lebih murah / banyak promo", "Gratis ongkir", "Lebih praktis, tidak perlu ke toko", "Sudah yakin dengan produknya setelah mencoba langsung", "Brand / toko yang sama tersedia di aplikasi (Official Store)", "Pilihan varian lebih lengkap", "Bisa membandingkan harga & ulasan", "Melihat konten / live yang meyakinkan", "Toko fisik jauh / tidak ada di kota saya", "Stok di toko fisik sering kosong", "Lainnya"], "OF4": ["Membutuhkannya saat itu juga", "Ingin mencoba varian / produk baru dulu", "Sedang berada di dekat toko / sekalian jalan-jalan", "Ada promo khusus di toko fisik", "Ingin memastikan keaslian produk", "Ingin pengalaman & pelayanan langsung", "Lainnya"], "LO1": ["Brand yang sama", "Toko / seller yang sama", "Platform yang sama", "Kreator / host live yang sama", "Tidak ada, saya memilih yang paling murah / menarik saat itu", "Belum pernah membeli ulang kategori ini"], "LO2": ["Kualitas produk konsisten", "Harga bersaing", "Voucher khusus pelanggan / pengikut toko", "Pengiriman cepat & aman", "Pelayanan penjual baik", "Poin / membership", "Sudah cocok, malas mencoba yang lain", "Lainnya"], "LO4": ["Harga lebih murah di tempat lain", "Harga naik", "Kualitas produk menurun", "Produk tidak sesuai foto / deskripsi", "Pernah dapat produk palsu / tidak original", "Pengalaman buruk (pengiriman, pelayanan, retur)", "Ongkir mahal / pengiriman lama", "Penjual lambat merespons", "Stok sering kosong", "Ulasan buruk dari pembeli lain", "Brand terkena isu negatif / kontroversi", "Menemukan produk baru yang lebih menarik dari konten", "Tidak ada lagi promo / voucher", "Program member / poin tidak menarik lagi", "Kebutuhan atau selera saya berubah", "Lainnya", "Tidak ada, saya akan tetap setia"], "RE2": ["Memberi rating bintang saja", "Menulis ulasan teks", "Mengunggah ulasan foto / video", "Membagikan tautan produk ke teman / grup WhatsApp", "Membuat konten tentang produk di media sosial", "Mempromosikan produk sebagai affiliate", "Mengikuti (follow) akun media sosial brand / toko tersebut", "Mengikuti (follow) toko tersebut di aplikasi belanja", "Mencari tahu lebih lanjut tentang brand tersebut (website, media sosial, berita)", "Tidak melakukan apa-apa"], "RE3": ["Mendapat koin / cashback", "Puas dengan produknya", "Kecewa dengan produknya", "Ingin membantu pembeli lain", "Diminta oleh penjual", "Mendapat komisi affiliate", "Lainnya"], "QC1": ["Merah", "Hijau", "Biru", "Kuning"], "D0": ["Hampir semua online", "Lebih banyak online", "Seimbang online dan toko fisik", "Lebih banyak di toko fisik", "Hampir semua di toko fisik"], "D1": ["Tidak pernah menonton live shopping", "Pernah menonton, tetapi belum pernah membeli saat live", "Pernah membeli saat live beberapa kali", "Sering membeli saat live"], "D4": ["Saat host mengumumkan harga atau diskon khusus selama live", "Saat ada flash sale / hitung mundur / stok terbatas", "Saat ada voucher atau kode promo yang hanya berlaku di live", "Saat host mendemonstrasikan atau mencoba produk secara langsung", "Saat pertanyaan saya dijawab langsung oleh host", "Saat melihat banyak penonton lain ikut membeli", "Saat ada bonus pembelian (gratis ongkir, hadiah, bundling)", "Saya sudah berniat membeli sebelum menonton live", "Lainnya"], "D5": ["Instagram Story", "Instagram Reels", "Postingan di feed Instagram", "Facebook (feed, Story, atau Reels)", "Video iklan di TikTok (FYP)", "YouTube / YouTube Shorts", "Lainnya", "Saya tidak pernah melihat / memperhatikan iklan seperti ini"], "Z1": ["Ya, bersedia", "Tidak"], "SC1": ["Fashion wanita", "Tas & aksesori", "Fashion muslim / modest", "Tidak membeli satu pun dari kategori di atas"]};         // urutan pilihan jawaban per pertanyaan (untuk laporan)   // [id, no, topik, pertanyaan]

var SH = { SET: 'Pengaturan', WIN: 'Pemenang', KAT: 'Kategori', RESP: 'Responses', RESP1: 'Jawaban - Semua Kategori', RESP2: 'Jawaban - Fashion Tas Hijab', BLOK: 'Daftar Blokir', SCR: 'Screenout', REKAP: 'Rekap', DICT: 'Kamus Kolom', UNDIAN: 'Eligible Undian', PANEL: 'Panel', CARI: 'Cari Panel', HASIL: 'Hasil Pencarian', SURV: 'Daftar Survei' };

// Kolom profil panel: [nama kolom, sumber jawaban]. Kolom baru dapat ditambahkan di akhir.
var PANEL_COLS = [
  ['panel_id', null], ['nomor_hp', null], ['instagram', 'Z2'], ['tgl_bergabung', null], ['update_terakhir', null],
  ['jumlah_survei', null], ['riwayat_survei', null], ['sumber_pertama', null], ['status_kualitas_terakhir', null],
  ['usia', 'S1'], ['jenis_kelamin', 'S2'], ['kota', 'A1'], ['provinsi', 'provinsi'], ['jabodetabek', 'jabodetabek'], ['tipe_wilayah', 'tipe_wilayah'],
  ['life_stage', 'A4'], ['pekerjaan', 'A5'], ['pendidikan', 'A6'], ['pengeluaran_rumah_tangga', 'A7'],
  ['belanja_online_per_bulan', 'A8'], ['frekuensi_belanja_online', 'S5'], ['platform_dipakai_1bln', 'S4'],
  ['platform_utama', 'B2'], ['kategori_terakhir_dibeli', 'C1'], ['frekuensi_beli_kategori_3bln', 'C2'],
  ['metode_bayar_terakhir', 'L1_PU3'], ['frekuensi_live_shopping', 'D1_lama'], ['penggunaan_paylater', 'D3'], ['momen_beli_live_shopping', 'D4'], ['prioritas_pilih_fashion', 'L1_FA1'], ['sikap_harga_fashion', 'L1_FA2'], ['format_iklan_sosmed_dilihat', 'D5'], ['produk_terakhir_dibeli', 'L1_PT1'], ['harga_produk_terakhir', 'L1_PT2'],
  ['porsi_belanja_online_offline', 'D0'], ['kategori_fokus_dibeli_1bln', 'SC1'], ['riwayat_channel_kategori', 'L1_OF1'], ['sumber_tahu_produk', 'L1_AW5'],
  ['tahun_lahir', 'S0'], ['status_pernikahan', 'A4M'], ['jumlah_anak', 'A4N'], ['usia_anak', 'A4K'], ['peran_belanja_rumah_tangga', 'A9'],
  ['media_sosial_harian', 'A10'], ['durasi_media_sosial', 'A11'], ['metode_pembayaran', 'A12'], ['jenis_hp', 'A13'], ['minat_hobi', 'A14'],
  ['hijab', 'A15'], ['kendaraan', 'A16'], ['profil_diperbarui', 'profil_diperbarui'], ['jenis_tempat_tinggal', 'A18'], ['status_tempat_tinggal', 'A19'], ['jumlah_anggota_rumah_tangga', 'A7N'], ['harga_hp', 'A13H'], ['segmen_hp', 'segmen_hp'], ['generasi', 'generasi'], ['pengeluaran_per_kapita', 'pengeluaran_per_kapita'], ['kelas_ekonomi', 'kelas_ekonomi'], ['ses', 'ses'], ['pengalaman_live_shopping', 'D1']
];
var BLOK_COLS = ['instagram', 'nomor_wa', 'jumlah_pelanggaran', 'pelanggaran_terakhir', 'alasan_terakhir', 'status', 'jumlah_dibuka', 'tanggal_dibuka_terakhir', 'suspend_sampai', 'keterangan', 'buka_akses (centang)', 'sesi_tercatat'];
var WIN_COLS = ['waktu_undian', 'survei', 'hadiah', 'instagram', 'nomor_wa', 'session_id', 'diundi_oleh', 'status', 'catatan', 'periode'];
var PROFILE_KEYS = ['S0', 'S1', 'S2', 'S3', 'A1', 'provinsi', 'tipe_wilayah', 'jabodetabek', 'A18', 'A19', 'A4M', 'A4N', 'A4K', 'A4', 'A5', 'A6', 'A7N', 'A7', 'A8',
  'A9', 'A10', 'A11', 'A12', 'A13', 'A13H', 'A14', 'A15', 'A16'];
var PROFILE_MULTI = ['S3', 'A4K', 'A10', 'A12', 'A14', 'A16'];   // jawaban pilihan ganda (disimpan "a | b")
var PROFILE_REFRESH_DAYS = 183;   // profil > 6 bulan -> responden diminta konfirmasi / isi ulang
function respTab_(variant) {
  if (variant === 'v2') return SH.RESP2;
  var c = variant && variant !== 'v1' ? customById_(variant) : null;
  return c ? c.tab : SH.RESP1;
}
var META = ['timestamp', 'survei', 'periode_giveaway', 'varian', 'versi_kuesioner', 'session_id', 'status', 'durasi_detik', 'kategori_1', 'kategori_2', 'attention_check', 'wa_normal', 'ig_normal', 'profil_dari_survei_sebelumnya', 'profil_diperbarui', 'sumber', 'device_fp', 'user_agent'];

// Link survei publik (deployment Apps Script proyek survei; dari apps-script/deployments.json)
var SURVEY_URL = 'https://script.google.com/macros/s/AKfycbzfKRzS_qZhPjaH9CrXr-l-afFfX-7QCerSDxc5aIDemYNpuHWA5xWVmaMwxGQUZ9IaoQ/exec';
// Website survei (GitHub Pages, folder site/) -> link yang dibagikan ke responden. Link Apps Script di atas tetap berfungsi sebagai cadangan.
var WEB_URL = 'https://milgiftclub.github.io/milgiftclub-survei/';

// ====== PENGATURAN (tab "Pengaturan", diubah dari Dashboard) ======
var SET_DEFAULTS = [
  ['SURVEY_OPEN_V1', true, 'Survei Semua Kategori dibuka (TRUE) / ditutup (FALSE)'],
  ['SURVEY_OPEN_V2', true, 'Survei Fashion Wanita, Tas & Aksesori, Hijab dibuka / ditutup'],
  ['TARGET_V1', 1200, 'Target respons valid survei Semua Kategori'],
  ['TARGET_V2', 600, 'Target respons valid survei Fashion Wanita, Tas & Aksesori, Hijab'],
  ['TARGET_PER_CAT', 300, 'Target respons valid per kategori High (survei Semua Kategori)'],
  ['BATAS_PELANGGARAN', 2, 'Pelanggaran ke-N (setelah dibuka) = suspend'],
  ['SUSPEND_BULAN', 6, 'Lama suspend (bulan)'],
  ['EMAIL_BUKA_AKSES', 'milgiftclub@gmail.com', 'Email permohonan buka akses (ditampilkan ke peserta yang diblokir)'],
  ['ADMIN_DOMAIN', 'mildigital.id', 'Domain email yang boleh membuka Dashboard'],
  ['ADMIN_EMAIL_TAMBAHAN', '', 'Email lain yang boleh membuka Dashboard (pisahkan dengan koma)'],
  ['LINK_V1', WEB_URL, 'Link survei Semua Kategori'],
  ['LINK_V2', WEB_URL + 'fokus/', 'Link survei Fashion Wanita, Tas & Aksesori, Hijab'],
  ['API_KEY', '', 'Kunci API untuk ATLAS (buat dari Dashboard > API)'],
  ['LINK_SURVEI_BARU', WEB_URL + 's/?id=', 'Awal link survei yang dibuat dari Dashboard (diikuti ID survei)'],
  ['ANTHROPIC_API_KEY', '', 'Kunci API Claude (console.anthropic.com) untuk fitur "Minta AI" di Buat Survei. Kosong = fitur AI mati'],
  ['AI_MODEL', 'claude-sonnet-5-5', 'Model Claude yang dipakai untuk menyusun survei'],
  ['TUTUP_V1', '2026-12-31T23:59', 'Survei Semua Kategori tutup otomatis pada tanggal & jam ini (WIB). Kosong = tanpa batas waktu'],
  ['TUTUP_V2', '2026-12-31T23:59', 'Survei Fashion Wanita, Tas & Aksesori, Hijab tutup otomatis pada tanggal & jam ini (WIB)'],
  ['PERIODE_KE', 1, 'Periode giveaway survei utama (angka)'],
  ['PERIODE_TAHUN', 2026, 'Tahun periode giveaway survei utama'],
  ['PERIODE_LIST', '[{"ke":1,"tahun":2026,"mulai":"2026-10-01","selesai":"2026-12-31","umumkan":"2027-01-04"}]', 'Daftar periode giveaway (diatur dari menu Periode Giveaway)'],
  ['RONDE_SURVEI', '{}', 'Riwayat refresh survei per survei (diatur dari halaman survei di Dashboard)'],
  ['IG_POST_GIVEAWAY', '', 'Link postingan giveaway Instagram (pisahkan dengan koma bila lebih dari satu). Komentar & tag di postingan ini dicek otomatis'],
  ['IG_MIN_TAG', 3, 'Jumlah teman minimal yang harus di-tag di komentar'],
  ['SYARAT_KOMENTAR_WAJIB', false, 'TRUE = hanya yang sudah komentar + tag teman yang ikut diundi (aktifkan setelah Instagram tersambung)'],
  ['GARIS_KEMISKINAN', 669235, 'Garis kemiskinan nasional BPS (Rp/kapita/bulan) untuk menghitung kelas ekonomi & SES. Maret 2026 = 669235; perbarui tiap rilis BPS']
];

// ---- tanggal tutup & periode giveaway ----
var BULAN_ = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
/** '2026-12-31T23:59' (WIB) / Date -> Date; kosong / tidak valid -> null */
function closeAt_(v) {
  if (!v) return null;
  if (Object.prototype.toString.call(v) === '[object Date]') return isNaN(v) ? null : v;
  var m = String(v).trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{1,2})[:.](\d{2}))?/);
  if (!m) return null;
  var d = new Date(m[1] + '-' + m[2] + '-' + m[3] + 'T' + ('0' + (m[4] || '23')).slice(-2) + ':' + (m[5] || '59') + ':00+07:00');
  return isNaN(d) ? null : d;
}
function closed_(v) { var d = closeAt_(v); return !!d && new Date() > d; }
/** '31 Desember 2026' (+ ', 17.00 WIB' bila jamnya bukan 23.59) */
function fmtTutup_(v) {
  var d = closeAt_(v); if (!d) return '';
  var w = new Date(d.getTime() + 7 * 3600e3), hh = w.getUTCHours(), mm = w.getUTCMinutes();
  return w.getUTCDate() + ' ' + BULAN_[w.getUTCMonth()] + ' ' + w.getUTCFullYear() + (hh === 23 && mm === 59 ? '' : ', ' + ('0' + hh).slice(-2) + '.' + ('0' + mm).slice(-2) + ' WIB');
}
function tutupText_(v) { var t = fmtTutup_(v); return t ? 'Hingga ' + t : ''; }
function periodeText_(ke, th) { ke = Number(ke) || 0; th = Number(th) || 0; return ke ? 'Periode ' + ke + (th ? ' ' + th : '') : (th ? 'Periode ' + th : ''); }
function tglPanjang_(ymd) { var a = String(ymd || '').split('-'); return a.length === 3 ? Number(a[2]) + ' ' + BULAN_[Number(a[1]) - 1] + ' ' + a[0] : ''; }
/** periode yang sedang aktif (menu Periode Giveaway) */
function activePeriodObj_() { var lb = periodeText_(set_('PERIODE_KE'), set_('PERIODE_TAHUN')); return periods_().filter(function (p) { return p.label === lb; })[0] || null; }
/** "Hingga …": tanggal selesai periode aktif, atau tanggal tutup survei bila lebih awal */
function hinggaText_(tutupVal) {
  var ap = activePeriodObj_(), d1 = closeAt_(tutupVal), d2 = ap && ap.selesai ? periodRange_(ap).t : null;
  if (d1 && (!d2 || d1 < d2)) return tutupText_(tutupVal);
  return d2 ? 'Hingga ' + tglPanjang_(ap.selesai) : '';
}
function announceText_() { var ap = activePeriodObj_(); return ap && ap.umumkan ? tglPanjang_(ap.umumkan) : CONFIG.ANNOUNCE_DATE; }
/** label & teks periode survei utama (v1/v2), dari menu Periode Giveaway */
function mainPeriode_(variant) {
  var p = periodeText_(set_('PERIODE_KE'), set_('PERIODE_TAHUN')), t = hinggaText_(set_(variant === 'v2' ? 'TUTUP_V2' : 'TUTUP_V1'));
  return { label: p ? 'Survei MIL Gift Club · ' + p : CONFIG.PERIODE_LABEL, periode: t || CONFIG.PERIODE_GIVEAWAY, announce: announceText_(), periodeKe: Number(set_('PERIODE_KE')) || 1, tahun: Number(set_('PERIODE_TAHUN')) || new Date().getFullYear() };
}
/** label & teks periode survei buatan Dashboard */
function customPeriode_(c) {
  // survei MIL Gift Club: periode sama dengan survei utama (Pengaturan); survei brand klien: tanpa periode
  var sc = c.schema || {}, client = !!(sc.brand && sc.brand.mode === 'client');
  if (client) return { label: '', periode: tutupText_(sc.tutup) || sc.periode || '' };
  return { label: mainPeriode_('v1').label, periode: hinggaText_(sc.tutup) || sc.periode || '', announce: announceText_() };
}
var SET_MEMO_ = null;
/** nilai tanggal untuk input datetime-local di Dashboard */
function inputDate_(v) { var d = closeAt_(v); if (!d) return ''; var w = new Date(d.getTime() + 7 * 3600e3); return w.toISOString().slice(0, 16); }
function settings_() {
  if (SET_MEMO_) return SET_MEMO_;
  var o = {}; SET_DEFAULTS.forEach(function (d) { o[d[0]] = d[1]; });
  try {
    var s = sheet_(SH.SET);
    if (s && s.getLastRow() > 1) s.getRange(2, 1, s.getLastRow() - 1, 2).getValues().forEach(function (r) { if (r[0]) o[r[0]] = r[1]; });
  } catch (e) {}
  SET_MEMO_ = o; return o;
}
function set_(k) {
  var v = settings_()[k];
  // link lama (Netlify / Apps Script) -> otomatis diarahkan ke website GitHub Pages
  if (/^LINK_(V1|V2|SURVEI_BARU)$/.test(k) && /netlify\.app|script\.google\.com\/macros/.test(String(v || ''))) v = SET_DEFAULTS.filter(function (d) { return d[0] === k; })[0][1];
  return v;
}
function num_(k) { return Number(set_(k)) || 0; }
function bool_(v) { return typeof v === 'string' ? !/^(false|tidak|no|0|tutup)$/i.test(v.trim()) : v !== false && v !== 0; }

// ====== WEB APP ======
// true / 'true' / 'ya' = dibuka; false / 'false' / 'tidak' = ditutup (toleran salah ketik tanda kutip / huruf besar)
function isOpen_(variant) {
  if (!bool_(CONFIG.SURVEY_OPEN)) return false;
  if (variant && variant !== 'v1' && variant !== 'v2') { var c = customById_(variant); return !!c && c.status === 'Dibuka' && !closed_(c.schema.tutup); }
  if (variant) return bool_(set_(variant === 'v2' ? 'SURVEY_OPEN_V2' : 'SURVEY_OPEN_V1')) && !closed_(set_(variant === 'v2' ? 'TUTUP_V2' : 'TUTUP_V1'));
  return true;
}

function publicConfig_(variant, src) {
  return {
    open: isOpen_(String(variant || '').toLowerCase() === 'v2' ? 'v2' : 'v1'),
    announce: announceText_(),
    privacy: CONFIG.PRIVACY_URL,
    tnc: CONFIG.TNC_URL,
    src: src || 'langsung',
    variant: String(variant || '').toLowerCase() === 'v2' ? 'v2' : 'v1',
    funnelAll: CONFIG.FUNNEL_ALL_CATEGORIES,
    high: highList_(),
    periodeLabel: mainPeriode_(variant).label || '',
    periode: mainPeriode_(variant).periode || '',
    hadiahUtama: CONFIG.HADIAH_UTAMA || '',
    hadiah: CONFIG.HADIAH || [],
    ig: CONFIG.IG_HANDLE || '',
    langkah: CONFIG.LANGKAH_PENUTUP || [],
    pesanPenutup: CONFIG.PESAN_PENUTUP || '',
    minTag: num_('IG_MIN_TAG') || 3, emailAkses: set_('EMAIL_BUKA_AKSES') || '', suspendBulan: num_('SUSPEND_BULAN') || 6
  };
}

// Tampilan lama (link script.google.com/.../exec) — tetap berfungsi
function doGet(e) {
  var prm = (e && e.parameter) || {};
  if (prm.api) return apiGet_(prm);
  // Dashboard: ?page=admin, /exec/admin, atau otomatis bila yang membuka adalah tim MIL
  // (Google kadang membuang ?page=admin saat pindah akun/login, jadi jangan bergantung pada parameter saja)
  var path = String((e && e.pathInfo) || '').toLowerCase();
  if (prm.page === 'admin' || path === 'admin') return adminPage_();
  if (prm.page !== 'survei' && !prm.survei && !prm.id && isAdmin_()) return adminPage_();
  // halaman survei = versi website (Web_*.html), disajikan langsung dari link Apps Script
  var sv = String(prm.survei || '').toLowerCase(), cid = prm.id || (sv && sv !== 'v1' && sv !== 'v2' ? prm.survei : '');
  var file = cid ? 'Web_s' : sv === 'v2' ? 'Web_v2' : 'Web_v1', q = (e && e.queryString) || '';
  if (cid && !prm.id) q += '&id=' + encodeURIComponent(cid);
  var t;
  try { t = HtmlService.createTemplateFromFile(file); }
  catch (err) { t = HtmlService.createTemplateFromFile('Index'); t.cfgJson = JSON.stringify(publicConfig_(prm.survei, prm.src || prm.utm_source)); }
  t.search = JSON.stringify(q ? '?' + q : '').replace(/</g, '\\u003c');
  var mp = cid ? null : mainPeriode_(sv === 'v2' ? 'v2' : 'v1');
  t.ovr = JSON.stringify(mp ? { PERIODE_LABEL: mp.label, PERIODE_GIVEAWAY: mp.periode, PENGUMUMAN_PEMENANG: mp.announce } : {}).replace(/</g, '\\u003c');
  var c = cid ? customById_(cid) : null;
  return t.evaluate()
    .setTitle(c ? c.name : 'Survei Belanja Online — MIL Gift Club')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Dipanggil halaman survei (Web_*.html) lewat google.script.run; isi sama dengan doPost. */
function webApi(fn, args) { return doPost({ postData: { contents: JSON.stringify({ fn: fn, args: args || [] }) } }).getContent(); }

// API untuk tampilan yang di-hosting di luar Google (Netlify, dll.)
function doPost(e) {
  var out;
  try {
    var req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var a = req.args || [];
    var data;
    if (req.fn === 'config') data = publicConfig_(a[0], a[1]);
    else if (req.fn === 'assignCategories') data = assignCategories(a[0], a[1]);
    else if (req.fn === 'logScreenout') data = logScreenout(a[0]);
    else if (req.fn === 'submitResponse') data = submitResponse(a[0]);
    else if (req.fn === 'checkIg') data = checkIg(a[0], a[1]);
    else if (req.fn === 'lookupIg') data = lookupIg(a[0], a[1]);
    else if (req.fn === 'verifyProfile') data = verifyProfile(a[0], a[1]);
    else if (req.fn === 'getSurvey') data = getSurvey(a[0], a[1]);
    else if (req.fn === 'giveawayStatus') data = giveawayStatus(a[0]);
    else throw new Error('Fungsi tidak dikenal: ' + req.fn);
    out = { ok: true, data: data };
  } catch (err) {
    out = { ok: false, error: String((err && err.message) || err) };
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function ss_() {
  // SHEET_ID_FIXED (file Config.gs) dipakai proyek Dashboard yang berdiri sendiri; proyek survei memakai Sheet tempat script terpasang
  var id = (typeof SHEET_ID_FIXED !== 'undefined' && SHEET_ID_FIXED) || PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  return id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
}
function sheet_(name) { return ss_().getSheetByName(name); }

// ====== MENU ======
function onOpen() {
  SpreadsheetApp.getUi().createMenu('MIL Survey')
    .addItem('1. Setup awal', 'setup')
    .addItem('2. Perbarui rekap kuota', 'updateRekap')
    .addItem('3. Tandai speeder (jalankan sebelum undian)', 'markSpeeders')
    .addItem('4. Buat daftar peserta undian', 'buildEligibleList')
    .addSeparator()
    .addItem('5. Cari responden panel', 'searchPanel')
    .addSeparator()
    .addItem('6. Perbarui Daftar Blokir', 'refreshBlok')
    .addItem('7. Impor data dari Sheet survei lain', 'importFromSheet')
    .addSeparator()
    .addItem('8. Buka Dashboard', 'openDashboard')
    .addToUi();
}

function setup() {
  setupCore_(SpreadsheetApp.getActiveSpreadsheet());
  installTriggers_();
  SpreadsheetApp.getUi().alert('Setup selesai. Tab jawaban, Daftar Blokir, dan pembaruan otomatis tiap jam sudah aktif.');
}

// Pembaruan otomatis tiap jam: tandai speeder, perbarui Daftar Blokir & Rekap
function installTriggers_() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'autoHourly') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('autoHourly').timeBased().everyHours(1).create();
}
function autoHourly() {
  markSpeeders(true);
  refreshBlok(true);
  updateRekap();
}

// Membuat tab yang dibutuhkan bila belum ada (dipanggil otomatis juga oleh web app)
function ensureSetup_() {
  var ss = ss_();
  if (ss.getSheetByName(SH.SET) && ss.getSheetByName(SH.WIN) && ss.getSheetByName(SH.RESP1) && ss.getSheetByName(SH.RESP2) && ss.getSheetByName(SH.BLOK) && ss.getSheetByName(SH.KAT) && ss.getSheetByName(SH.SCR) && ss.getSheetByName(SH.PANEL)) return;
  setupCore_(ss);
}

function setupCore_(ss) {
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', ss.getId());
  var k = ss.getSheetByName(SH.KAT);
  if (!k) {
    k = ss.insertSheet(SH.KAT);
    var rows = [['Kelompok', 'Kategori', 'Prioritas', 'Ditugaskan', 'Selesai valid']];
    CATEGORIES.forEach(function (c) { rows.push([c[0], c[1], c[2], 0, 0]); });
    k.getRange(1, 1, rows.length, 5).setValues(rows);
    k.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#FFFF00');
    k.setFrozenRows(1);
    k.getRange(2, 3, CATEGORIES.length, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['High', 'Low']).build());
  }
  // tab "Responses" lama (survei semua kategori) diganti nama menjadi tab jawaban survei semua kategori
  var old = ss.getSheetByName(SH.RESP);
  if (old && !ss.getSheetByName(SH.RESP1)) old.setName(SH.RESP1);
  [[SH.WIN, WIN_COLS], [SH.RESP1, META], [SH.RESP2, META], [SH.BLOK, BLOK_COLS], [SH.SCR, ['timestamp', 'session_id', 'alasan', 'S1', 'S2', 'S3', 'S4', 'sumber', 'varian']]].forEach(function (p) {
    var s = ss.getSheetByName(p[0]);
    if (!s) {
      s = ss.insertSheet(p[0]);
      s.getRange(1, 1, 1, p[1].length).setValues([p[1]]).setFontWeight('bold').setBackground('#FFFF00');
      s.setFrozenRows(1);
    }
  });
  var d = ss.getSheetByName(SH.DICT), dsig = 'kamus:' + DICTIONARY.map(function (r) { return r[0]; }).join(',');
  if (!d || d.getRange(1, 1).getNote() !== dsig) {   // dibuat ulang otomatis saat daftar pertanyaan berubah
    if (d) d.clear(); else d = ss.insertSheet(SH.DICT);
    var dr = [['Kolom', 'No', 'Topik', 'Pertanyaan']].concat(DICTIONARY);
    dr.push(['L1_xxx', '', 'Modul kategori', 'Jawaban modul funnel untuk kategori_1 (kategori terakhir dibeli)']);
    dr.push(['xxx_lainnya', '', '', 'Isian teks untuk opsi "Lainnya"']);
    dr.push(['xxx: baris', '', '', 'Jawaban pertanyaan matrix per baris']);
    d.getRange(1, 1, dr.length, 4).setValues(dr);
    d.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#FFFF00');
    d.getRange(1, 1).setNote(dsig);
  }
  if (!ss.getSheetByName(SH.REKAP)) ss.insertSheet(SH.REKAP);
  var pn = ss.getSheetByName(SH.PANEL);
  if (!pn) {
    pn = ss.insertSheet(SH.PANEL);
    var ph = PANEL_COLS.map(function (c) { return c[0]; });
    pn.getRange(1, 1, 1, ph.length).setValues([ph]).setFontWeight('bold').setBackground('#FFFF00');
    pn.setFrozenRows(1);
  }
  setupCari_(ss);
  var st = ss.getSheetByName(SH.SET);
  if (!st) {
    st = ss.insertSheet(SH.SET, 0);
    var sr = [['Pengaturan', 'Nilai', 'Keterangan']].concat(SET_DEFAULTS.map(function (d) { return [d[0], d[0] === 'API_KEY' ? Utilities.getUuid().replace(/-/g, '') : d[1], d[2]]; }));
    st.getRange(1, 1, sr.length, 3).setValues(sr);
    st.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#FFFF00');
    st.setColumnWidth(1, 220); st.setColumnWidth(2, 320); st.setColumnWidth(3, 420);
  }
  var def = ss.getSheetByName('Sheet1') || ss.getSheetByName('Sheet 1');
  if (def && ss.getSheets().length > 1 && def.getLastRow() === 0) ss.deleteSheet(def);
}

// ====== API UNTUK HALAMAN SURVEI ======

/** Mengembalikan kategori berprioritas High dari pilihan responden (urutan sesuai tab Kategori). */
function filterHigh(selected) {
  var s = sheet_(SH.KAT);
  var n = s.getLastRow() - 1;
  if (n < 1) return [];
  var sel = {};
  (selected || []).forEach(function (x) { sel[x] = true; });
  return s.getRange(2, 1, n, 3).getValues().filter(function (r) { return r[2] === 'High' && sel[r[1]]; }).map(function (r) { return r[1]; });
}

/** Mencatat kategori modul funnel responden (1 kategori: yang paling terakhir dibeli). */
/* (fungsi lama, tetap kompatibel) Menugaskan maks. 2 kategori High dari pilihan responden (least-fill). */
function assignCategories(selected, sid) {
  ensureSetup_();
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var s = sheet_(SH.KAT);
    var n = s.getLastRow() - 1;
    if (n < 1) return [];
    var data = s.getRange(2, 1, n, 5).getValues();
    var sel = {};
    (selected || []).forEach(function (x) { sel[x] = true; });
    var cand = [];
    data.forEach(function (r, i) {
      if ((CONFIG.FUNNEL_ALL_CATEGORIES || r[2] === 'High') && sel[r[1]]) cand.push({ i: i, name: r[1], asg: Number(r[3]) || 0, done: Number(r[4]) || 0, rnd: Math.random() });
    });
    cand.sort(function (a, b) { return (a.done - b.done) || (a.asg - b.asg) || (a.rnd - b.rnd); });
    var pick = cand.slice(0, 1);
    pick.forEach(function (p) { s.getRange(p.i + 2, 4).setValue(p.asg + 1); });
    return pick.map(function (p) { return p.name; });
  } finally {
    lock.releaseLock();
  }
}

function logScreenout(p) {
  ensureSetup_();
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var a = p.answers || {};
    sheet_(SH.SCR).appendRow([new Date(), p.sid || '', p.reason || '', j_(a.S1), j_(a.S2), j_(a.S3), j_(a.S4), p.src || '', varianLabel_(p.variant)]);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function submitResponse(p) {
  ensureSetup_();
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var cs = p.variant && p.variant !== 'v1' && p.variant !== 'v2' ? customById_(p.variant) : null;
    if (p.variant && p.variant !== 'v1' && p.variant !== 'v2' && !cs) throw new Error('Survei tidak ditemukan: ' + p.variant);
    if (cs) ensureCustomTab_(cs);
    var sname = cs ? cs.name : CONFIG.SURVEY_NAME;
    var s = sheet_(respTab_(p.variant));
    var a = p.answers || {};
    var wa = normWa_(a.Z3), ig = normIg_(a.Z2);
    var header = s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0];
    var col = {};
    header.forEach(function (h, i) { col[h] = i; });

    // cek duplikat sesi / WA / IG (dalam survei yang sama = tab yang sama)
    var dup = false, last = s.getLastRow();
    if (last > 1) {
      var ids = s.getRange(2, col.session_id + 1, last - 1, 1).getValues();
      for (var x = 0; x < ids.length; x++) if (ids[x][0] === p.sid) return { ok: true, dup: true };
      var w = s.getRange(2, col.wa_normal + 1, last - 1, 1).getValues();
      var g = s.getRange(2, col.ig_normal + 1, last - 1, 1).getValues();
      var sv = s.getRange(2, col.survei + 1, last - 1, 1).getValues();
      var rs = rondeStart_(cs ? cs.id : p.variant === 'v2' ? 'v2' : 'v1'), tsv = rs ? s.getRange(2, col.timestamp + 1, last - 1, 1).getValues() : null;
      for (var y = 0; y < w.length; y++) {
        if (sv[y][0] !== sname) continue;
        if (rs && new Date(tsv[y][0]) < rs) continue;   // jawaban ronde sebelum refresh tidak dihitung duplikat
        if ((wa && String(w[y][0]) === wa) || (ig && String(g[y][0]) === ig)) { dup = true; break; }
      }
    }
    var attention = cs && cs.schema.attention === false ? true : a.QC1 === 'Biru';
    var acc = accessStatus_(ig, wa);
    var status = !isOpen_(cs ? cs.id : p.variant === 'v2' ? 'v2' : 'v1') ? 'Masuk setelah survei ditutup'
      : acc.state !== 'ok' ? 'Diblokir (riwayat asal-asalan)'
      : !attention ? 'Tidak valid - attention check'
      : dup ? 'Duplikat' : 'Valid';

    if (a.A4M) a.A4 = deriveA4_(a);
    if (a.A18 === 'Kos / kamar sewa' && !a.A19) a.A19 = 'Sewa / kontrak (bulanan atau tahunan)';
    var ses = deriveSes_(a); if (ses) { a.pengeluaran_per_kapita = ses.perKapita; a.kelas_ekonomi = ses.kelas; a.ses = ses.ses; }
    var hp = segmenHp_(a); if (hp) a.segmen_hp = hp;
    var gen = generasi_(a.S0); if (gen) a.generasi = gen;
    var flat = flatten_(a);
    var row = {
      timestamp: new Date(), survei: sname, varian: varianLabel_(p.variant), versi_kuesioner: p.ver || '', session_id: p.sid, status: status, durasi_detik: p.durasi || '',
      kategori_1: (p.cats || [])[0] || '', kategori_2: (p.cats || [])[1] || '',
      attention_check: attention ? 'Lulus' : 'Gagal', wa_normal: wa, ig_normal: ig, profil_dari_survei_sebelumnya: p.prefilled ? 'Ya' : '', periode_giveaway: activePeriode_(cs), profil_diperbarui: (!p.prefilled || p.profOk) && a.S1 ? new Date() : '',
      sumber: p.src || '', device_fp: p.fp || '', user_agent: (p.ua || '').slice(0, 300)
    };
    Object.keys(flat).forEach(function (k) { row[k] = flat[k]; });

    var add = Object.keys(row).filter(function (k) { return !(k in col); });
    if (add.length) {
      s.getRange(1, header.length + 1, 1, add.length).setValues([add]).setFontWeight('bold').setBackground('#FFFF00');
      add.forEach(function (k, i) { col[k] = header.length + i; });
      header = header.concat(add);
    }
    var out = header.map(function (h) { return h in row ? row[h] : ''; });
    s.appendRow(out);

    if (status === 'Valid') bumpDone_(p.cats || [], 1);
    if (status === 'Tidak valid - attention check') addViolation_(ig, wa, 'Gagal pertanyaan cek (attention check)', p.sid);
    if (row.profil_diperbarui) a.profil_diperbarui = row.profil_diperbarui;
    if (a.Z1 === 'Ya, bersedia' && status === 'Valid' && wa) upsertPanel_(a, wa, ig, status, p.src, sname, rondeNow_(cs ? cs.id : p.variant === 'v2' ? 'v2' : 'v1'));
    if (cs && status === 'Valid') autoCloseCustom_(cs, s, col);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

// ====== BACA TAB JAWABAN ======
function respTabs_() { return [[SH.RESP1, 'v1'], [SH.RESP2, 'v2']].concat(customSurveys_().filter(function (c) { return c.status !== 'Draf'; }).map(function (c) { return [c.tab, c.id]; })); }
/** Semua baris dari kedua tab jawaban sebagai objek {kolom: nilai}, plus _tab, _row. */
// ====== RONDE / REFRESH SURVEI ======
// Refresh = survei dibuka ulang untuk responden yang sudah pernah mengisi (kondisi bisa berubah).
// Ronde jawaban ditentukan dari waktu masuk dibanding tanggal refresh; data lama tetap tersimpan.
function rondeAll_() { try { return JSON.parse(String(set_('RONDE_SURVEI') || '{}')) || {}; } catch (e) { return {}; } }
function rondeList_(v) { return (rondeAll_()[v] || []).slice().sort(function (a, b) { return a.ke - b.ke; }); }
function rondeOf_(list, ts) { var d = new Date(ts), n = 1; list.forEach(function (x) { if (d >= new Date(x.tgl)) n = x.ke; }); return n; }
function rondeNow_(v) { var l = rondeList_(v); return l.length ? l[l.length - 1].ke : 1; }
function rondeStart_(v) { var l = rondeList_(v); return l.length ? new Date(l[l.length - 1].tgl) : null; }
function rondeInfo_(v) {
  var l = rondeList_(v), last = l[l.length - 1];
  return { ronde: last ? last.ke : 1, sejak: last ? fmt_(new Date(last.tgl)) : '', oleh: last ? last.oleh : '', catatan: last ? last.catatan || '' : '',
    riwayat: l.map(function (x) { return { ke: x.ke, tgl: fmt_(new Date(x.tgl)), oleh: x.oleh, catatan: x.catatan || '' }; }) };
}
function adminSurveyRefresh(v, catatan) {
  var who = requireAdmin_(), all = rondeAll_(), l = (all[v] || []).slice();
  var ke = (l.length ? l[l.length - 1].ke : 1) + 1;
  l.push({ ke: ke, tgl: new Date().toISOString(), oleh: who, catatan: String(catatan || '').slice(0, 200) });
  all[v] = l; adminSaveSettings({ RONDE_SURVEI: JSON.stringify(all) }); SET_MEMO_ = null;
  return rondeInfo_(v);
}
function adminSurveyRefreshUndo(v) {
  requireAdmin_(); var all = rondeAll_(), l = (all[v] || []).slice();
  if (!l.length) throw new Error('Survei ini belum pernah direfresh.');
  l.pop(); all[v] = l; adminSaveSettings({ RONDE_SURVEI: JSON.stringify(all) }); SET_MEMO_ = null;
  return rondeInfo_(v);
}
function readAll_() {
  var out = [], RA = rondeAll_();
  respTabs_().forEach(function (t) {
    var s = sheet_(t[0]); if (!s || s.getLastRow() < 2) return;
    var h = s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0], rl = (RA[t[1]] || []).slice().sort(function (a, b) { return a.ke - b.ke; });
    s.getRange(2, 1, s.getLastRow() - 1, h.length).getValues().forEach(function (r, i) {
      var o = { _tab: t[0], _v: t[1], _row: i + 2 };
      h.forEach(function (name, j) { o[name] = r[j]; });
      o.ronde = rl.length ? rondeOf_(rl, o.timestamp) : 1;
      out.push(o);
    });
  });
  return out;
}

// ====== ALAT ANALIS ======
/** Menandai respons dengan durasi < 1/3 median (per survei) sebagai speeder, lalu mencatat pelanggarannya. */
function markSpeeders(silent) {
  var msg = [];
  respTabs_().forEach(function (t) {
    var s = sheet_(t[0]); if (!s) return;
    var last = s.getLastRow(); if (last < 2) return;
    var h = s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0];
    var cS = h.indexOf('status'), cD = h.indexOf('durasi_detik'), c1 = h.indexOf('kategori_1'), c2 = h.indexOf('kategori_2');
    var v = s.getRange(2, 1, last - 1, h.length).getValues();
    var durs = v.filter(function (r) { return r[cS] === 'Valid'; }).map(function (r) { return Number(r[cD]) || 0; }).sort(function (a, b) { return a - b; });
    if (durs.length < 10) return; // median belum stabil
    var med = durs[Math.floor(durs.length / 2)], cut = med / 3, n = 0;
    v.forEach(function (r, i) {
      if (r[cS] === 'Valid' && (Number(r[cD]) || 0) < cut) {
        s.getRange(i + 2, cS + 1).setValue('Tidak valid - speeder');
        setPanelStatus_(r[h.indexOf('wa_normal')], 'Tidak valid - speeder');
        bumpDone_([r[c1], r[c2]].filter(String), -1);
        addViolation_(r[h.indexOf('ig_normal')], r[h.indexOf('wa_normal')], 'Mengisi terlalu cepat (speeder)', r[h.indexOf('session_id')]);
        n++;
      }
    });
    msg.push(t[0] + ': median ' + Math.round(med) + ' detik, ' + n + ' speeder baru (< ' + Math.round(cut) + ' detik)');
  });
  if (silent !== true) try { SpreadsheetApp.getUi().alert(msg.join('\n') || 'Belum cukup data (minimal 10 respons valid per survei).'); } catch (e) {}
}

function buildEligibleList() {
  var ss = ss_(), out = [['No', 'Survei', 'Session ID', 'Instagram', 'WhatsApp', 'Timestamp']];
  readAll_().forEach(function (r) {
    if (r.status === 'Valid') out.push([out.length, varianLabel_(r._v), r.session_id, r.Z2, r.Z3, r.timestamp]);
  });
  var u = ss.getSheetByName(SH.UNDIAN) || ss.insertSheet(SH.UNDIAN);
  u.clear();
  u.getRange(1, 1, out.length, 6).setValues(out);
  u.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#FFFF00');
  try { SpreadsheetApp.getUi().alert((out.length - 1) + ' peserta eligible. Pengundian dilakukan sesuai ketentuan izin undian.'); } catch (e) {}
}

function updateRekap() {
  var ss = ss_();
  var valid = readAll_().filter(function (r) { return r.status === 'Valid'; });
  var JAWA = ['DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur'];
  var SUM = ['Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Sumatera Selatan', 'Kepulauan Bangka Belitung', 'Bengkulu', 'Lampung'];
  var region = function (r) {
    if (r.jabodetabek === 'Ya') return 'Jabodetabek';
    if (JAWA.indexOf(r.provinsi) >= 0) return 'Jawa lainnya';
    if (SUM.indexOf(r.provinsi) >= 0) return 'Sumatera';
    return 'Kalimantan, Sulawesi & Indonesia Timur';
  };
  var plat = function (r) {
    var p = r.B2;
    return (p === 'TikTok Shop' || p === 'Tokopedia') ? 'Shop | Tokopedia' : p === 'Shopee' ? 'Shopee' : 'Lainnya';
  };
  var out = [['Rekap kuota — diperbarui ' + new Date(), '', '', ''], ['', '', '', '']];
  [['v1', num_('TARGET_V1')], ['v2', num_('TARGET_V2')]].forEach(function (V) {
    var rows = valid.filter(function (r) { return r._v === V[0]; }), target = V[1];
    var blocks = [
      ['Usia', function (r) { return r.S1; }, { '18-24 tahun': 0.30, '25-34 tahun': 0.35, '35-44 tahun': 0.20, '45-54 tahun': 0.075, '55 tahun ke atas': 0.075 }],
      ['Wilayah', region, { 'Jabodetabek': 0.25, 'Jawa lainnya': 0.35, 'Sumatera': 0.20, 'Kalimantan, Sulawesi & Indonesia Timur': 0.20 }],
      ['Platform utama', plat, { 'Shopee': null, 'Shop | Tokopedia': null, 'Lainnya': null }]
    ];
    if (V[0] === 'v1') blocks.splice(1, 0, ['Jenis kelamin', function (r) { return r.S2; }, { 'Pria': 0.5, 'Wanita': 0.5 }]);
    out.push(['SURVEI ' + varianLabel_(V[0]).toUpperCase(), '', '', '']);
    out.push(['Total respons valid', rows.length, target, Math.round(rows.length / target * 100) + '%']);
    out.push(['', '', '', '']);
    blocks.forEach(function (b) {
      out.push([b[0], 'Valid', 'Target', '% tercapai']);
      Object.keys(b[2]).forEach(function (key) {
        var n = rows.filter(function (r) { return b[1](r) === key; }).length;
        var t = b[2][key] === null ? (key === 'Lainnya' ? '' : Math.round(target / 4)) : Math.round(target * b[2][key]);
        out.push([key, n, t, t ? Math.round(n / t * 100) + '%' : '']);
      });
      out.push(['', '', '', '']);
    });
    out.push(['Kategori High (modul funnel)', 'Valid', 'Target', '% tercapai']);
    var hl = highList_(), tc = V[0] === 'v2' ? Math.round(target / Math.max(hl.length, 1)) : num_('TARGET_PER_CAT');
    hl.forEach(function (cat) {
      var n = rows.filter(function (r) { return r.kategori_1 === cat; }).length;
      out.push([cat, n, tc, Math.round(n / tc * 100) + '%']);
    });
    out.push(['', '', '', '']); out.push(['', '', '', '']);
  });
  var rk = ss.getSheetByName(SH.REKAP) || ss.insertSheet(SH.REKAP);
  rk.clear();
  rk.getRange(1, 1, out.length, 4).setValues(out);
  rk.setColumnWidth(1, 300);
}

// ====== CEK USERNAME, PROFIL, BLOKIR ======
/** Dipanggil setelah responden mengisi username IG di awal survei. */
function lookupIg(ig, variant) {
  ensureSetup_();
  var n = normIg_(ig); if (!n) return { state: 'ok', known: false };
  var acc = accessStatus_(n, '');
  if (acc.state !== 'ok') return { state: acc.state, until: acc.until || '', email: set_('EMAIL_BUKA_AKSES') };
  var tab = respTab_(variant || 'v1');
  var rows = readAll_();
  var rs = rondeStart_(variant && variant !== 'v1' && variant !== 'v2' ? variant : String(variant || '').toLowerCase() === 'v2' ? 'v2' : 'v1');
  if (rows.some(function (r) { return r._tab === tab && String(r.ig_normal) === n && (!rs || new Date(r.timestamp) >= rs); })) return { state: 'sudah_isi' };
  return { state: 'ok', known: !!profileRow_(rows, n) };
}
function checkIg(ig, variant) { var r = lookupIg(ig, variant); return { exists: r.state === 'sudah_isi' }; }

/** Life stage lama (A4) diturunkan dari status pernikahan, jumlah & usia anak, dan pekerjaan. */
function deriveA4_(a) {
  if (!a.A4M) return a.A4 || '';
  var kids = Array.isArray(a.A4K) ? a.A4K : String(a.A4K || '').split(' | ').filter(String);
  if (/^Pelajar/.test(a.A5 || '')) return 'Pelajar / mahasiswa';
  if (a.A4M === 'Belum menikah') return 'Bekerja, belum menikah';
  if (!a.A4N || /^Belum/.test(a.A4N)) return 'Menikah, belum memiliki anak';
  if (kids.some(function (k) { return /^(Di bawah 2|2-5|6-12)/.test(k); })) return 'Menikah, memiliki anak usia di bawah 12 tahun';
  return 'Menikah, memiliki anak usia 12 tahun ke atas';
}
// ---- Kelas ekonomi & SES dari pengeluaran rumah tangga per kapita ----
// Kelas ekonomi mengikuti BPS / Bank Dunia (Aspiring Indonesia, 2019): kelipatan garis kemiskinan (GK) per kapita.
//   Miskin < 1x GK | Rentan miskin 1-1,5x | Menuju kelas menengah 1,5-3,5x | Kelas menengah 3,5-17x | Kelas atas > 17x
// SES (A+ s.d. E) = konvensi MIL: kelas menengah dibelah di 7,5x GK (B / C1), kelas atas dibelah di 34x GK (A+ / A).
var SES_KELAS = ['Miskin', 'Rentan miskin', 'Menuju kelas menengah', 'Kelas menengah', 'Kelas atas'];
var SES_HURUF = ['E', 'D', 'C2', 'C1', 'B', 'A', 'A+'];
var SES_KET = { 'A+': 'kelas atas teratas (> 34x GK)', A: 'kelas atas (17-34x GK)', B: 'menengah atas (7,5-17x GK)', C1: 'kelas menengah (3,5-7,5x GK)', C2: 'menuju kelas menengah (1,5-3,5x GK)', D: 'rentan miskin (1-1,5x GK)', E: 'miskin (< 1x GK)' };
var A7_TENGAH = [1500000, 2500000, 4000000, 6250000, 8750000, 12500000, 20000000, 32500000, 50000000];   // titik tengah tiap rentang A7
function deriveSes_(a) {
  var o = (QOPTS.A7 || []), i = o.indexOf(a.A7), n = parseInt(String(a.A7N || ''), 10);
  if (i < 0 || !n) return null;
  var pk = A7_TENGAH[i] / n, gk = num_('GARIS_KEMISKINAN') || 669235, r = pk / gk;
  var k = r < 1 ? 0 : r < 1.5 ? 1 : r < 3.5 ? 2 : r < 17 ? 3 : 4;
  var h = k === 4 ? (r >= 34 ? 6 : 5) : k === 3 ? (r >= 7.5 ? 4 : 3) : k;
  return { perKapita: Math.round(pk), kelas: SES_KELAS[k], ses: SES_HURUF[h] };
}
/** segmen HP: iPhone / Android atas / menengah / bawah (dari merek + kisaran harga) */
var HP_SEGMEN = ['iPhone', 'Android atas', 'Android menengah', 'Android bawah'];
function segmenHp_(a) {
  if (!a.A13) return '';
  if (a.A13 === 'iPhone') return 'iPhone';
  var o = QOPTS.A13H || [], i = o.indexOf(a.A13H);
  if (i < 0) return '';
  return i <= 1 ? 'Android bawah' : i <= 3 ? 'Android menengah' : 'Android atas';
}
/** generasi dari tahun lahir */
var GENERASI = ['Gen Z (1997-2012)', 'Milenial (1981-1996)', 'Gen X (1965-1980)', 'Baby Boomer (1946-1964)', 'Pra-Boomer (≤1945)'];
function generasi_(y) {
  var n = parseInt(String(y || ''), 10); if (!n) return /sebelum/.test(String(y || '')) ? GENERASI[4] : '';
  return n >= 1997 ? GENERASI[0] : n >= 1981 ? GENERASI[1] : n >= 1965 ? GENERASI[2] : n >= 1946 ? GENERASI[3] : GENERASI[4];
}
function profileRows_(rows, ig) {
  return rows.filter(function (r) {
    return String(r.ig_normal) === ig && r.S1 && r.wa_normal && !/^(Tidak valid|Diblokir)/.test(String(r.status));
  }).sort(function (a, b) { return new Date(a.timestamp) - new Date(b.timestamp); });
}
function profileRow_(rows, ig) {
  var best = null;
  rows.forEach(function (r) {
    if (String(r.ig_normal) !== ig || !r.S1 || !r.wa_normal) return;
    if (/^(Tidak valid|Diblokir)/.test(String(r.status))) return;
    if (!best || new Date(r.timestamp) > new Date(best.timestamp)) best = r;
  });
  return best;
}

/** Mengembalikan profil dasar bila 4 digit terakhir nomor WA cocok. */
function verifyProfile(ig, last4) {
  var n = normIg_(ig), d = String(last4 || '').replace(/\D/g, '');
  if (!n || d.length !== 4) return { ok: false };
  var list = profileRows_(readAll_(), n), r = list[list.length - 1];
  if (!r || String(r.wa_normal).slice(-4) !== d) return { ok: false };
  // gabungkan: tiap kolom profil diambil dari jawaban terbaru yang terisi
  var prof = {}, upd = 0;
  list.forEach(function (x) {
    PROFILE_KEYS.forEach(function (k) {
      if (x[k] === '' || x[k] == null) return;
      prof[k] = PROFILE_MULTI.indexOf(k) >= 0 ? String(x[k]).split(' | ') : String(x[k]);
    });
    var t = x.profil_diperbarui ? new Date(x.profil_diperbarui) : x.profil_dari_survei_sebelumnya !== 'Ya' ? new Date(x.timestamp) : null;
    if (t && !isNaN(t) && t.getTime() > upd) upd = t.getTime();
  });
  var stale = !upd || (Date.now() - upd) > PROFILE_REFRESH_DAYS * 864e5;
  return { ok: true, profile: prof, updated: upd ? fmt_(new Date(upd)) : '', stale: stale };
}

// ---- Daftar Blokir ----
function blokData_() {
  var s = sheet_(SH.BLOK);
  var h = s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0];
  var v = s.getLastRow() > 1 ? s.getRange(2, 1, s.getLastRow() - 1, h.length).getValues() : [];
  return { s: s, h: h, v: v, c: function (n) { return h.indexOf(n); } };
}
function addMonths_(d, m) { var x = new Date(d); x.setMonth(x.getMonth() + m); return x; }
function fmt_(d) { return d ? Utilities.formatDate(new Date(d), 'Asia/Jakarta', 'd MMM yyyy') : ''; }
function keterangan_(st, until, dibuka) {
  var now = new Date();
  if (st === 'Diblokir') return 'BELUM bisa ikut survei. Bisa dibuka jika peserta mengirim email ke ' + set_('EMAIL_BUKA_AKSES') + ' (centang kolom "buka_akses"). Pelanggaran berikutnya = suspend ' + num_('SUSPEND_BULAN') + ' bulan.';
  if (st === 'Dibuka') return 'SUDAH dibuka (' + dibuka + 'x). Jika mengisi asal-asalan lagi = suspend ' + num_('SUSPEND_BULAN') + ' bulan otomatis.';
  if (st === 'Suspend') {
    var left = Math.ceil((new Date(until) - now) / 864e5);
    return left > 0 ? 'Suspend sampai ' + fmt_(until) + ' — BELUM bisa dibuka (sisa ' + left + ' hari).' : 'Suspend selesai ' + fmt_(until) + ' — SUDAH bisa dibuka.';
  }
  if (st === 'Aktif kembali') return 'Suspend selesai ' + fmt_(until) + ' — akses SUDAH dibuka otomatis. Pelanggaran berikutnya = suspend lagi.';
  return '';
}
/** Status akses responden: ok / diblokir / suspend. Suspend yang sudah lewat otomatis dibuka. */
function accessStatus_(ig, wa) {
  var b = blokData_(), c = b.c, now = new Date();
  for (var i = 0; i < b.v.length; i++) {
    var r = b.v[i];
    var hit = (ig && String(r[c('instagram')]).replace(/^@/, '') === ig) || (wa && String(r[c('nomor_wa')]).replace(/^'/, '') === wa);
    if (!hit) continue;
    var st = r[c('status')];
    if (st === 'Diblokir') return { state: 'diblokir' };
    if (st === 'Suspend') {
      if (new Date(r[c('suspend_sampai')]) > now) return { state: 'suspend', until: fmt_(r[c('suspend_sampai')]) };
      b.s.getRange(i + 2, c('status') + 1).setValue('Aktif kembali');
      b.s.getRange(i + 2, c('keterangan') + 1).setValue(keterangan_('Aktif kembali', r[c('suspend_sampai')]));
    }
  }
  return { state: 'ok' };
}
/** Mencatat pelanggaran (isi asal-asalan). Pelanggaran ke-1 = diblokir; ke-BATAS = suspend. */
function addViolation_(ig, wa, reason, sid) {
  ig = normIg_(ig); wa = normWa_(wa);
  if (!ig && !wa) return;
  var b = blokData_(), c = b.c, now = new Date(), idx = -1;
  for (var i = 0; i < b.v.length; i++) {
    var r = b.v[i];
    if ((ig && String(r[c('instagram')]).replace(/^@/, '') === ig) || (wa && String(r[c('nomor_wa')]).replace(/^'/, '') === wa)) { idx = i; break; }
  }
  if (idx < 0) {
    var row = BLOK_COLS.map(function () { return ''; });
    row[c('instagram')] = ig ? '@' + ig : ''; row[c('nomor_wa')] = wa ? "'" + wa : '';
    row[c('jumlah_pelanggaran')] = 1; row[c('pelanggaran_terakhir')] = now; row[c('alasan_terakhir')] = reason;
    row[c('status')] = 'Diblokir'; row[c('jumlah_dibuka')] = 0; row[c('keterangan')] = keterangan_('Diblokir');
    row[c('buka_akses (centang)')] = false; row[c('sesi_tercatat')] = sid || '';
    b.s.appendRow(row);
    b.s.getRange(b.s.getLastRow(), c('buka_akses (centang)') + 1).insertCheckboxes();
    return;
  }
  var r0 = b.v[idx], sesi = String(r0[c('sesi_tercatat')] || '');
  if (sid && sesi.split(' | ').indexOf(sid) >= 0) return; // pelanggaran dari sesi ini sudah tercatat
  var cnt = (Number(r0[c('jumlah_pelanggaran')]) || 0) + 1, st, until = '';
  if (cnt >= num_('BATAS_PELANGGARAN')) { st = 'Suspend'; until = addMonths_(now, num_('SUSPEND_BULAN')); }
  else st = 'Diblokir';
  var upd = r0.slice();
  upd[c('jumlah_pelanggaran')] = cnt; upd[c('pelanggaran_terakhir')] = now; upd[c('alasan_terakhir')] = reason;
  upd[c('status')] = st; upd[c('suspend_sampai')] = until || r0[c('suspend_sampai')];
  upd[c('keterangan')] = keterangan_(st, until, r0[c('jumlah_dibuka')]);
  upd[c('buka_akses (centang)')] = false;
  upd[c('sesi_tercatat')] = sesi ? sesi + ' | ' + (sid || '') : (sid || '');
  if (!upd[c('nomor_wa')] && wa) upd[c('nomor_wa')] = "'" + wa;
  if (!upd[c('instagram')] && ig) upd[c('instagram')] = '@' + ig;
  b.s.getRange(idx + 2, 1, 1, upd.length).setValues([upd]);
}
/** Memperbarui keterangan & membuka otomatis suspend yang sudah selesai (juga jalan tiap jam). */
function refreshBlok(silent) {
  var b = blokData_(), c = b.c, now = new Date(), opened = 0;
  b.v.forEach(function (r, i) {
    var st = r[c('status')], until = r[c('suspend_sampai')];
    if (st === 'Suspend' && until && new Date(until) <= now) { st = 'Aktif kembali'; b.s.getRange(i + 2, c('status') + 1).setValue(st); opened++; }
    b.s.getRange(i + 2, c('keterangan') + 1).setValue(keterangan_(st, until, r[c('jumlah_dibuka')]));
  });
  if (silent !== true) try { SpreadsheetApp.getUi().alert('Daftar Blokir diperbarui. ' + opened + ' akun selesai masa suspend dan dibuka otomatis.'); } catch (e) {}
}
/** Centang kolom "buka_akses" di tab Daftar Blokir -> akses dibuka otomatis (bila aturan mengizinkan). */
function onEdit(e) {
  try {
    var sh = e.range.getSheet(); if (sh.getName() !== SH.BLOK || e.range.getRow() < 2) return;
    var b = blokData_(), c = b.c;
    if (e.range.getColumn() !== c('buka_akses (centang)') + 1 || e.value !== 'TRUE') return;
    var row = e.range.getRow(), r = b.v[row - 2], st = r[c('status')];
    var cell = function (n) { return b.s.getRange(row, c(n) + 1); };
    if (st === 'Diblokir') {
      var n = (Number(r[c('jumlah_dibuka')]) || 0) + 1;
      cell('status').setValue('Dibuka'); cell('jumlah_dibuka').setValue(n); cell('tanggal_dibuka_terakhir').setValue(new Date());
      cell('keterangan').setValue(keterangan_('Dibuka', '', n));
    } else if (st === 'Suspend' && new Date(r[c('suspend_sampai')]) > new Date()) {
      cell('keterangan').setValue(keterangan_('Suspend', r[c('suspend_sampai')]) + ' Tidak bisa dibuka manual sebelum masa suspend selesai.');
    }
    e.range.setValue(false);
  } catch (err) {}
}

// ====== IMPOR DATA DARI SHEET LAIN ======
/** Menyalin data survei Fashion dari Sheet terpisah (versi lama) ke Sheet ini. */
function importFromSheet() {
  var ui = SpreadsheetApp.getUi();
  var res = ui.prompt('Impor data survei', 'Tempel link Google Sheet survei Fashion Wanita, Tas & Aksesori, Hijab (yang lama):', ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  var m = /\/d\/([a-zA-Z0-9_-]+)/.exec(res.getResponseText()) || [null, res.getResponseText().trim()];
  var msg = importCore_(m[1]);
  ui.alert(msg);
}
function importCore_(srcId) {
  ensureSetup_();
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty('IMPORTED_' + srcId)) return 'Sheet ini sudah pernah diimpor. Impor dibatalkan supaya data tidak dobel.';
  var src = SpreadsheetApp.openById(srcId), me = ss_();
  var sr = src.getSheetByName(SH.RESP) || src.getSheetByName(SH.RESP2);
  var nResp = 0, nScr = 0, nPanel = 0;
  if (sr && sr.getLastRow() > 1) {
    var sh = sr.getRange(1, 1, 1, sr.getLastColumn()).getValues()[0];
    var data = sr.getRange(2, 1, sr.getLastRow() - 1, sh.length).getValues();
    var t = me.getSheetByName(SH.RESP2), th = t.getRange(1, 1, 1, t.getLastColumn()).getValues()[0];
    var add = sh.filter(function (h) { return th.indexOf(h) < 0; });
    if (add.length) { t.getRange(1, th.length + 1, 1, add.length).setValues([add]).setFontWeight('bold').setBackground('#FFFF00'); th = th.concat(add); }
    var rows = data.map(function (r) { return th.map(function (h) { var i = sh.indexOf(h); return i >= 0 ? r[i] : ''; }); });
    t.getRange(t.getLastRow() + 1, 1, rows.length, th.length).setValues(rows); nResp = rows.length;
  }
  var ssr = src.getSheetByName(SH.SCR);
  if (ssr && ssr.getLastRow() > 1) {
    var sd = ssr.getRange(2, 1, ssr.getLastRow() - 1, ssr.getLastColumn()).getValues();
    var ts = me.getSheetByName(SH.SCR);
    ts.getRange(ts.getLastRow() + 1, 1, sd.length, sd[0].length).setValues(sd); nScr = sd.length;
  }
  var sp = src.getSheetByName(SH.PANEL);
  if (sp && sp.getLastRow() > 1) {
    var ph = sp.getRange(1, 1, 1, sp.getLastColumn()).getValues()[0];
    var pd = sp.getRange(2, 1, sp.getLastRow() - 1, ph.length).getValues();
    var tp = me.getSheetByName(SH.PANEL), tph = tp.getRange(1, 1, 1, tp.getLastColumn()).getValues()[0];
    var existing = tp.getLastRow() > 1 ? tp.getRange(2, tph.indexOf('nomor_hp') + 1, tp.getLastRow() - 1, 1).getValues().map(function (x) { return String(x[0]); }) : [];
    pd.forEach(function (r) {
      var hp = String(r[ph.indexOf('nomor_hp')]);
      if (!hp || existing.indexOf(hp) >= 0) return;
      var row = tph.map(function (h) { var i = ph.indexOf(h); return h === 'panel_id' ? 'P' + ('00000' + tp.getLastRow()).slice(-5) : (i >= 0 ? r[i] : ''); });
      tp.appendRow(row); existing.push(hp); nPanel++;
    });
  }
  recountKategori_();
  props.setProperty('IMPORTED_' + srcId, String(new Date()));
  updateRekap();
  return 'Impor selesai: ' + nResp + ' jawaban ke tab "' + SH.RESP2 + '", ' + nScr + ' baris Screenout, ' + nPanel + ' anggota panel baru. Rekap & kuota kategori sudah dihitung ulang.';
}
function recountKategori_() {
  var k = sheet_(SH.KAT), n = k.getLastRow() - 1; if (n < 1) return;
  var names = k.getRange(2, 2, n, 1).getValues(), asg = k.getRange(2, 4, n, 1).getValues(), cnt = {};
  readAll_().forEach(function (r) { if (r.status === 'Valid' && r.kategori_1) cnt[r.kategori_1] = (cnt[r.kategori_1] || 0) + 1; });
  var done = names.map(function (x) { return [cnt[x[0]] || 0]; });
  k.getRange(2, 5, n, 1).setValues(done);
  k.getRange(2, 4, n, 1).setValues(asg.map(function (a, i) { return [Math.max(Number(a[0]) || 0, done[i][0])]; }));
}

// ====== PANEL PROFIL ======
function upsertPanel_(a, wa, ig, status, src, sname) {
  sname = sname || CONFIG.SURVEY_NAME;
  if (arguments.length > 6 && arguments[6] > 1) sname += ' (ronde ' + arguments[6] + ')';
  var s = sheet_(SH.PANEL);
  var h = s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0];
  // tambahkan kolom panel baru (dari revisi kuesioner) bila belum ada
  var missing = PANEL_COLS.map(function (c) { return c[0]; }).filter(function (n) { return h.indexOf(n) < 0; });
  if (missing.length) { s.getRange(1, h.length + 1, 1, missing.length).setValues([missing]).setFontWeight('bold'); h = h.concat(missing); }
  var cHp = h.indexOf('nomor_hp'), last = s.getLastRow(), rowIdx = -1, old = null;
  if (last > 1) {
    var hp = s.getRange(2, cHp + 1, last - 1, 1).getValues();
    for (var i = 0; i < hp.length; i++) if (String(hp[i][0]) === wa) { rowIdx = i + 2; break; }
    if (rowIdx > 0) old = s.getRange(rowIdx, 1, 1, h.length).getValues()[0];
  }
  var now = new Date(), get = function (n) { return old ? old[h.indexOf(n)] : ''; };
  var hist = String(get('riwayat_survei') || '');
  var already = hist.split(' | ').indexOf(sname) >= 0;
  var row = h.map(function (name, i) {
    var def = PANEL_COLS.filter(function (c) { return c[0] === name; })[0];
    var src_ = def ? def[1] : null;
    if (name === 'panel_id') return old ? old[i] : 'P' + ('00000' + (last)).slice(-5);
    if (name === 'nomor_hp') return wa;
    if (name === 'tgl_bergabung') return old ? old[i] : now;
    if (name === 'update_terakhir') return now;
    if (name === 'jumlah_survei') return (Number(get('jumlah_survei')) || 0) + (already ? 0 : 1);
    if (name === 'riwayat_survei') return already ? hist : (hist ? hist + ' | ' : '') + sname;
    if (name === 'sumber_pertama') return old ? old[i] : (src || '');
    if (name === 'status_kualitas_terakhir') return status;
    if (name === 'instagram') return ig ? '@' + ig : (old ? old[i] : '');
    if (src_ && a[src_] != null && a[src_] !== '') return j_(a[src_]);
    return old ? old[i] : '';
  });
  if (rowIdx > 0) s.getRange(rowIdx, 1, 1, row.length).setValues([row]);
  else s.appendRow(row);
}

function setPanelStatus_(wa, st) {
  var s = sheet_(SH.PANEL); if (!s || s.getLastRow() < 2 || !wa) return;
  var h = s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0];
  var hp = s.getRange(2, h.indexOf('nomor_hp') + 1, s.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < hp.length; i++) if (String(hp[i][0]) === String(wa)) s.getRange(i + 2, h.indexOf('status_kualitas_terakhir') + 1).setValue(st);
}

var OPS = ['sama dengan', 'tidak sama dengan', 'mengandung', 'tidak mengandung'];
function setupCari_(ss) {
  var c = ss.getSheetByName(SH.CARI);
  if (c) return;
  c = ss.insertSheet(SH.CARI);
  var rows = [['CARI RESPONDEN PANEL', '', ''],
    ['Isi kriteria di bawah (boleh lebih dari satu baris; semua kriteria harus terpenuhi). Lalu jalankan menu MIL Survey > 5. Cari responden panel.', '', ''],
    ['', '', ''], ['Kolom profil', 'Kondisi', 'Nilai'],
    ['jenis_kelamin', 'sama dengan', 'Wanita'], ['kategori_terakhir_dibeli', 'sama dengan', 'Fashion wanita']];
  for (var i = 0; i < 8; i++) rows.push(['', '', '']);
  c.getRange(1, 1, rows.length, 3).setValues(rows);
  c.getRange(1, 1).setFontWeight('bold');
  c.getRange(4, 1, 1, 3).setFontWeight('bold').setBackground('#FFFF00');
  var cols = PANEL_COLS.map(function (x) { return x[0]; });
  c.getRange(5, 1, 10, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(cols).build());
  c.getRange(5, 2, 10, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(OPS).build());
  c.setColumnWidth(1, 240); c.setColumnWidth(2, 160); c.setColumnWidth(3, 260);
}

/** Menyaring tab Panel berdasarkan kriteria di tab Cari Panel; hasil ke tab Hasil Pencarian. */
function searchPanel() {
  var ss = ss_(), p = sheet_(SH.PANEL), c = sheet_(SH.CARI);
  var h = p.getRange(1, 1, 1, p.getLastColumn()).getValues()[0];
  var data = p.getLastRow() > 1 ? p.getRange(2, 1, p.getLastRow() - 1, h.length).getValues() : [];
  var crit = c.getRange(5, 1, 10, 3).getValues().filter(function (r) { return r[0] && r[1] && String(r[2]) !== ''; });
  var low = function (x) { return String(x == null ? '' : x).toLowerCase().trim(); };
  var res = data.filter(function (r) {
    if (String(r[h.indexOf('status_kualitas_terakhir')]).indexOf('Tidak valid') === 0) return false;
    return crit.every(function (k) {
      var i = h.indexOf(k[0]); if (i < 0) return false;
      var v = low(r[i]), n = low(k[2]);
      if (k[1] === 'sama dengan') return v === n;
      if (k[1] === 'tidak sama dengan') return v !== n;
      if (k[1] === 'mengandung') return v.indexOf(n) >= 0;
      if (k[1] === 'tidak mengandung') return v.indexOf(n) < 0;
      return true;
    });
  });
  var o = ss.getSheetByName(SH.HASIL) || ss.insertSheet(SH.HASIL);
  o.clear();
  var desc = crit.map(function (k) { return k[0] + ' ' + k[1] + ' "' + k[2] + '"'; }).join('; ') || '(tanpa kriteria)';
  o.getRange(1, 1, 1, 2).setValues([['Kriteria: ' + desc, res.length + ' responden ditemukan']]);
  o.getRange(3, 1, 1, h.length).setValues([h]).setFontWeight('bold').setBackground('#FFFF00');
  if (res.length) o.getRange(4, 1, res.length, h.length).setValues(res);
  try { SpreadsheetApp.getUi().alert(res.length + ' responden panel memenuhi kriteria. Lihat tab "Hasil Pencarian".'); } catch (e) {}
}

function varianLabel_(v) { if (v && v !== 'v1' && v !== 'v2') { var c = customById_(v); return v + ' · ' + (c ? c.name : ''); } return v === 'v2' ? 'v2 · Fashion Wanita, Tas & Aksesori, Hijab' : 'v1 · Semua kategori'; }

function highList_() {
  try {
    var s = sheet_(SH.KAT); if (!s || s.getLastRow() < 2) return [];
    return s.getRange(2, 1, s.getLastRow() - 1, 3).getValues().filter(function (r) { return r[2] === 'High'; }).map(function (r) { return r[1]; });
  } catch (e) { return []; }
}

// ====== UTIL ======
function bumpDone_(cats, d) {
  var k = sheet_(SH.KAT), n = k.getLastRow() - 1;
  if (n < 1) return;
  var names = k.getRange(2, 2, n, 1).getValues();
  cats.forEach(function (c) {
    for (var i = 0; i < names.length; i++) if (names[i][0] === c) {
      var cell = k.getRange(i + 2, 5);
      cell.setValue(Math.max(0, (Number(cell.getValue()) || 0) + d));
    }
  });
}
function j_(v) { return Array.isArray(v) ? v.join(' | ') : (v == null ? '' : v); }
function flatten_(a) {
  var o = {};
  Object.keys(a).forEach(function (k) {
    var v = a[k];
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.keys(v).forEach(function (r) { o[k + ': ' + r] = j_(v[r]); });
    } else o[k] = j_(v);
  });
  return o;
}
function normWa_(x) {
  var d = String(x || '').replace(/\D/g, '');
  if (d.indexOf('62') === 0) d = '0' + d.slice(2);
  return d;
}
function normIg_(x) { return String(x || '').trim().toLowerCase().replace(/^@/, ''); }

// =====================================================================
// ====== DASHBOARD ADMIN (login akun Google @mildigital.id) ======
// =====================================================================
function viewer_() { try { return String(Session.getActiveUser().getEmail() || '').toLowerCase(); } catch (e) { return ''; } }
function isAdmin_(email) {
  email = email || viewer_(); if (!email) return false;
  var dom = String(set_('ADMIN_DOMAIN') || '').toLowerCase().replace(/^@/, '');
  var extra = String(set_('ADMIN_EMAIL_TAMBAHAN') || '').toLowerCase().split(/[,\s]+/).filter(String);
  return (dom && email.slice(-(dom.length + 1)) === '@' + dom) || extra.indexOf(email) >= 0;
}
function requireAdmin_() { if (!isAdmin_()) throw new Error('Akses ditolak. Masuk dengan akun @' + set_('ADMIN_DOMAIN') + '.'); return viewer_(); }

function adminPage_() {
  var email = viewer_();
  if (!isAdmin_(email)) {
    return HtmlService.createHtmlOutput('<div style="font-family:sans-serif;max-width:480px;margin:80px auto;text-align:center"><h2>Akses ditolak</h2><p>Dashboard MIL Gift Club hanya bisa dibuka dengan akun Google <b>@' + set_('ADMIN_DOMAIN') + '</b>.</p><p style="color:#888">Akun saat ini: ' + (email || 'tidak terdeteksi') + '</p></div>').setTitle('Dashboard MIL Gift Club');
  }
  var t = HtmlService.createTemplateFromFile('Admin');
  t.userEmail = email;
  return t.evaluate().setTitle('Dashboard MIL Gift Club').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
function openDashboard() {
  var html = HtmlService.createHtmlOutput('<p style="font-family:sans-serif">Buka Dashboard lewat link deployment <b>Dashboard</b> (akses: MIL Digital) dengan tambahan <code>?page=admin</code> di akhir link. Lihat panduan.</p>').setWidth(420).setHeight(140);
  SpreadsheetApp.getUi().showModalDialog(html, 'Dashboard MIL Gift Club');
}

function iso_(v) { return v instanceof Date ? Utilities.formatDate(v, 'Asia/Jakarta', "yyyy-MM-dd HH:mm") : v; }
function day_(v) { var d = v instanceof Date ? v : new Date(v); return isNaN(d) ? '' : Utilities.formatDate(d, 'Asia/Jakarta', 'yyyy-MM-dd'); }
function surveyList_() {
  return [['v1', 'Semua Kategori'], ['v2', 'Fashion Wanita, Tas & Aksesori, Hijab']].map(function (x) {
    var o = isOpen_(x[0]);
    var tk = x[0] === 'v2' ? 'TUTUP_V2' : 'TUTUP_V1';
    return { v: x[0], name: x[1], ronde: rondeNow_(x[0]), rondeInfo: rondeInfo_(x[0]), open: o, status: o ? 'Dibuka' : 'Ditutup', target: num_(x[0] === 'v2' ? 'TARGET_V2' : 'TARGET_V1'), link: set_(x[0] === 'v2' ? 'LINK_V2' : 'LINK_V1'), tab: respTab_(x[0]),
      tutup: inputDate_(set_(tk)), tutupText: fmtTutup_(set_(tk)), tutupLewat: closed_(set_(tk)), switchOn: bool_(set_(x[0] === 'v2' ? 'SURVEY_OPEN_V2' : 'SURVEY_OPEN_V1')) };
  }).concat(customSurveys_().filter(function (c) { return c.status !== 'Diarsipkan'; }).map(function (c) {
    var lewat = closed_(c.schema.tutup);
    return { v: c.id, name: c.name, ronde: rondeNow_(c.id), rondeInfo: rondeInfo_(c.id), open: c.status === 'Dibuka' && !lewat, status: c.status === 'Dibuka' && lewat ? 'Ditutup' : c.status, target: c.target, link: customLink_(c.id), tab: c.tab, custom: true, profile: c.schema.profile !== false,
      tutupText: fmtTutup_(c.schema.tutup), tutupLewat: lewat };
  }));
}

/** Ringkasan untuk halaman utama dashboard. */
function summaryData_(per) {
  var rows = rowsInPeriod_(readAll_(), per), today = day_(new Date()), out = { generatedAt: iso_(new Date()), surveys: [], daily: {}, quota: {}, sources: {}, screenout: {}, blok: {}, panel: 0, winners: 0 };
  var JAWA = ['DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur'];
  var SUM = ['Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Sumatera Selatan', 'Kepulauan Bangka Belitung', 'Bengkulu', 'Lampung'];
  var region = function (r) { return r.jabodetabek === 'Ya' ? 'Jabodetabek' : JAWA.indexOf(r.provinsi) >= 0 ? 'Jawa lainnya' : SUM.indexOf(r.provinsi) >= 0 ? 'Sumatera' : 'Kalimantan, Sulawesi & Indonesia Timur'; };
  var days = []; for (var i = 29; i >= 0; i--) days.push(day_(new Date(Date.now() - i * 864e5)));
  out.daily.dates = days;
  var whoA = function (r) { return String(r.wa_normal || '') || ('ig:' + String(r.ig_normal || '')); }, pa = {}, pv = {};
  rows.forEach(function (r) { pa[whoA(r)] = 1; if (r.status === 'Valid') pv[whoA(r)] = 1; });
  out.people = Object.keys(pa).length; out.peopleValid = Object.keys(pv).length;
  surveyList_().forEach(function (S) {
    var mine = rows.filter(function (r) { return r._v === S.v; }), valid = mine.filter(function (r) { return r.status === 'Valid'; });
    var cnt = function (f) { return mine.filter(f).length; };
    S.total = mine.length; S.valid = valid.length;
    var who = function (r) { return String(r.wa_normal || '') || ('ig:' + String(r.ig_normal || '')) || r.session_id; }, uniq = function (a) { var o = {}; a.forEach(function (r) { o[who(r)] = 1; }); return Object.keys(o).length; };
    S.people = uniq(mine); S.peopleValid = uniq(valid);   // orang unik (per nomor WA)
    S.invalid = cnt(function (r) { return /^(Tidak valid|Diblokir)/.test(String(r.status)); });
    S.dup = cnt(function (r) { return r.status === 'Duplikat'; });
    S.today = cnt(function (r) { return day_(r.timestamp) === today; });
    S.prefilled = cnt(function (r) { return r.profil_dari_survei_sebelumnya === 'Ya'; });
    var durs = valid.map(function (r) { return Number(r.durasi_detik) || 0; }).filter(Boolean).sort(function (a, b) { return a - b; });
    S.medianMin = durs.length ? Math.round(durs[Math.floor(durs.length / 2)] / 6) / 10 : 0;
    out.surveys.push(S);
    out.daily[S.v] = days.map(function (d) { return valid.filter(function (r) { return day_(r.timestamp) === d; }).length; });
    var T = S.target || 0, q = [];
    var block = function (name, f, plan) { q.push({ name: name, items: Object.keys(plan).map(function (k) { return { key: k, n: valid.filter(function (r) { return f(r) === k; }).length, target: plan[k] == null ? null : Math.round(T * plan[k]) }; }) }); };
    if (S.custom) {
      if (S.profile) {
        block('Usia', function (r) { return r.S1; }, { '18-24 tahun': null, '25-34 tahun': null, '35-44 tahun': null, '45-54 tahun': null, '55 tahun ke atas': null });
        block('Jenis kelamin', function (r) { return r.S2; }, { 'Pria': null, 'Wanita': null });
        block('Wilayah', region, { 'Jabodetabek': null, 'Jawa lainnya': null, 'Sumatera': null, 'Kalimantan, Sulawesi & Indonesia Timur': null });
      }
      var cq = (customById_(S.v).schema.questions || []).filter(function (x) { return /^(single|dropdown|scale)$/.test(x.type); }).slice(0, 12);
      cq.forEach(function (x) {
        var cnt = {}; valid.forEach(function (r) { var k = r[x.id]; if (k !== '' && k != null) cnt[k] = (cnt[k] || 0) + 1; });
        q.push({ name: x.id + ' · ' + x.text, items: Object.keys(cnt).sort(function (a, b) { return cnt[b] - cnt[a]; }).slice(0, 8).map(function (k) { return { key: k, n: cnt[k], target: null }; }) });
      });
      out.quota[S.v] = q; return;
    }
    block('Usia', function (r) { return r.S1; }, { '18-24 tahun': 0.30, '25-34 tahun': 0.35, '35-44 tahun': 0.20, '45-54 tahun': 0.075, '55 tahun ke atas': 0.075 });
    if (S.v === 'v1') block('Jenis kelamin', function (r) { return r.S2; }, { 'Pria': 0.5, 'Wanita': 0.5 });
    block('Wilayah', region, { 'Jabodetabek': 0.25, 'Jawa lainnya': 0.35, 'Sumatera': 0.20, 'Kalimantan, Sulawesi & Indonesia Timur': 0.20 });
    var hl = highList_(), tc = S.v === 'v2' ? Math.round(T / Math.max(hl.length, 1)) : num_('TARGET_PER_CAT');
    q.push({ name: 'Kategori High', items: hl.map(function (c) { return { key: c, n: valid.filter(function (r) { return r.kategori_1 === c; }).length, target: tc }; }) });
    if (S.v === 'v1') {
      var top = {}; valid.forEach(function (r) { if (r.kategori_1) top[r.kategori_1] = (top[r.kategori_1] || 0) + 1; });
      q.push({ name: 'Kategori terbanyak (semua)', items: Object.keys(top).sort(function (a, b) { return top[b] - top[a]; }).slice(0, 10).map(function (k) { return { key: k, n: top[k], target: null }; }) });
    }
    out.quota[S.v] = q;
  });
  rows.forEach(function (r) { var k = r.sumber || 'langsung'; out.sources[k] = (out.sources[k] || 0) + 1; });
  var sc = sheet_(SH.SCR);
  if (sc && sc.getLastRow() > 1) sc.getRange(2, 3, sc.getLastRow() - 1, 1).getValues().forEach(function (r) { var k = String(r[0] || '-'); out.screenout[k] = (out.screenout[k] || 0) + 1; });
  var b = blokData_(); b.v.forEach(function (r) { var k = r[b.c('status')]; out.blok[k] = (out.blok[k] || 0) + 1; });
  var p = sheet_(SH.PANEL); out.panel = p ? Math.max(0, p.getLastRow() - 1) : 0;
  var w = sheet_(SH.WIN); out.winners = w ? Math.max(0, w.getLastRow() - 1) : 0;
  return out;
}
function adminSummary(per) { requireAdmin_(); if (per == null) per = activePeriode_(null); var d = summaryData_(per); d.periode = per; d.periods = periods_().map(function (p) { return p.label; }); d.activePeriod = activePeriode_(null); return d; }

var LIST_COLS = ['timestamp', 'status', 'Z2', 'Z3', 'S1', 'S2', 'A1', 'kategori_1', 'L1_PT1', 'L1_PT2', 'durasi_detik', 'sumber', 'profil_dari_survei_sebelumnya', 'session_id'];
/** Daftar jawaban satu survei (kolom ringkas). */
function adminResponses(v) {
  requireAdmin_();
  var all = v === 'all';
  var rows = readAll_().filter(function (r) { return all || r._v === v; }), cols = LIST_COLS, labels = {};
  if (all) rows.sort(function (a, b) { return new Date(a.timestamp) - new Date(b.timestamp); });
  rows.reverse();
  var c = v !== 'v1' && v !== 'v2' ? customById_(v) : null;
  if (c) {
    var qs = (c.schema.questions || []).slice(0, 4);
    cols = ['timestamp', 'status', 'Z2', 'Z3', 'S1', 'S2', 'A1'].concat(qs.map(function (x) { return x.id; })).concat(['durasi_detik', 'sumber', 'profil_dari_survei_sebelumnya', 'session_id']);
    qs.forEach(function (x) { labels[x.id] = x.id + ' ' + String(x.text).slice(0, 28); });
  }
  var names = {}; surveyList_().forEach(function (x) { names[x.v] = x.name; });
  return { cols: cols, labels: labels, rows: rows.map(function (r) { return cols.map(function (c) { return iso_(r[c] == null ? '' : r[c]); }); }),
    src: rows.map(function (r) { return [r._v, (names[r._v] || r.survei || r._v) + (r.ronde > 1 ? ' · ronde ' + r.ronde : '')]; }) };
}
/** Hapus jawaban. o = { v: id survei | 'all', mode: 'one'|'all'|'date'|'filter', sid, from, to (yyyy-mm-dd), col, val, cek: true = hanya hitung } */
function adminDeleteResponses(o) {
  var who = requireAdmin_(); o = o || {};
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    var rows = readAll_().filter(function (r) { return o.v === 'all' || r._v === o.v; });
    var f = new Date(String(o.from || '') + 'T00:00:00+07:00'), t = new Date(String(o.to || '') + 'T23:59:59+07:00');
    if (o.mode === 'one') rows = rows.filter(function (r) { return r.session_id === o.sid && (!o.sv || r._v === o.sv); });
    else if (o.mode === 'date') rows = rows.filter(function (r) { var d = new Date(r.timestamp); return (isNaN(f) || d >= f) && (isNaN(t) || d <= t); });
    else if (o.mode === 'filter') rows = rows.filter(function (r) { return String(iso_(r[o.col] == null ? '' : r[o.col])) === String(o.val); });
    else if (o.mode !== 'all') throw new Error('Pilih cara menghapus');
    if (o.cek) return { n: rows.length };
    var byTab = {}; rows.forEach(function (r) { (byTab[r._tab] = byTab[r._tab] || []).push(r._row); });
    var stamp = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyyMMdd-HHmm'), n = 0;
    Object.keys(byTab).forEach(function (tab) {
      var s = sheet_(tab); if (!s) return;
      var lc = s.getLastColumn(), nums = byTab[tab].sort(function (a, b) { return b - a; });
      // cadangan: baris yang dihapus disalin ke tab tersembunyi "Arsip hapus - <tab>"
      var an = ('Arsip hapus - ' + tab).slice(0, 95), a = ss_().getSheetByName(an);
      if (!a) { a = ss_().insertSheet(an); a.getRange(1, 1, 1, lc + 2).setValues([['dihapus_pada', 'dihapus_oleh'].concat(s.getRange(1, 1, 1, lc).getValues()[0])]); try { a.hideSheet(); } catch (e) {} }
      var keep = nums.map(function (r) { return [stamp, who].concat(s.getRange(r, 1, 1, lc).getValues()[0]); });
      a.getRange(a.getLastRow() + 1, 1, keep.length, lc + 2).setValues(keep);
      nums.forEach(function (r) { if (s.getLastRow() > 2) s.deleteRow(r); else s.getRange(r, 1, 1, lc).clearContent(); n++; });
    });
    CUSTOM_MEMO_ = null;
    try { updateRekap(); } catch (e) {}
    return { n: n };
  } finally { lock.releaseLock(); }
}
function dictMap_() { var m = {}; DICTIONARY.forEach(function (d) { m[d[0]] = d; }); return m; }
/** Semua jawaban satu responden, lengkap dengan teks pertanyaan. */
function adminResponseDetail(v, sid) {
  requireAdmin_();
  var r = readAll_().filter(function (x) { return x._v === v && x.session_id === sid; })[0];
  if (!r) return null;
  var dm = dictMap_(), skip = { _tab: 1, _v: 1, _row: 1 }, out = [];
  var cu = v !== 'v1' && v !== 'v2' ? customById_(v) : null;
  if (cu) (cu.schema.questions || []).forEach(function (x) { dm[x.id] = [x.id, '', 'Pertanyaan survei', x.text]; });
  Object.keys(r).forEach(function (k) {
    if (skip[k] || r[k] === '' || r[k] == null) return;
    var base = k.replace(/^L\d_/, '').replace(/(_lainnya|: .*)$/, ''), d = dm[base];
    out.push({ key: k, q: d ? d[3] : '', topic: d ? d[2] : (META.indexOf(k) >= 0 ? 'Data sistem' : ''), val: String(iso_(r[k])) });
  });
  return { sid: sid, status: r.status, items: out };
}
/** Mengubah status satu jawaban (mis. menandai asal-asalan secara manual). */
function adminSetStatus(v, sid, status, violation) {
  var who = requireAdmin_();
  var s = sheet_(respTab_(v)), h = s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0];
  var ids = s.getRange(2, h.indexOf('session_id') + 1, s.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (ids[i][0] === sid) {
    var row = s.getRange(i + 2, 1, 1, h.length).getValues()[0], prev = row[h.indexOf('status')];
    s.getRange(i + 2, h.indexOf('status') + 1).setValue(status);
    var cats = [row[h.indexOf('kategori_1')]].filter(String);
    if (prev === 'Valid' && status !== 'Valid') bumpDone_(cats, -1);
    if (prev !== 'Valid' && status === 'Valid') bumpDone_(cats, 1);
    if (violation) addViolation_(row[h.indexOf('ig_normal')], row[h.indexOf('wa_normal')], 'Ditandai manual oleh ' + who, sid);
    return { ok: true };
  }
  throw new Error('Jawaban tidak ditemukan');
}

/** Panel: daftar kolom & pencarian. */
/** Kolom Panel untuk filter: label, tipe (sa = pilih satu, ma = pilihan ganda, num = angka, text) dan pilihan jawaban (+ jumlah responden). */
var PANEL_SKIP = ['panel_id', 'nomor_hp', 'tgl_bergabung', 'update_terakhir', 'profil_diperbarui'];
var PANEL_NUM = ['jumlah_survei', 'pengeluaran_per_kapita'];
function panelColumns_() {
  var p = sheet_(SH.PANEL), h = p && p.getLastColumn() ? p.getRange(1, 1, 1, p.getLastColumn()).getValues()[0] : [];
  var data = p && p.getLastRow() > 1 ? p.getRange(2, 1, p.getLastRow() - 1, h.length).getValues() : [];
  var meta = reportMeta_('v1');
  return PANEL_COLS.filter(function (c) { return PANEL_SKIP.indexOf(c[0]) < 0; }).map(function (c) {
    var col = c[0], src = String(c[1] || ''), id = src.replace(/^L\d_/, ''), m = meta[id] || {}, ci = h.indexOf(col);
    var type = col === 'instagram' ? 'text' : PANEL_NUM.indexOf(col) >= 0 ? 'num' : (QTYPES[id] === 'ma' || col === 'riwayat_survei') ? 'ma' : 'sa';
    var cnt = {}, seen = [];
    if (ci >= 0 && type !== 'text' && type !== 'num') data.forEach(function (r) {
      var v = String(r[ci] == null ? '' : r[ci]).trim(); if (!v) return;
      (type === 'ma' ? v.split(' | ') : [v]).forEach(function (x) { x = x.trim(); if (!x) return; if (!cnt[x]) { cnt[x] = 0; seen.push(x); } cnt[x]++; });
    });
    var opts = (m.opts || []).slice();
    seen.sort(function (a, b) { return cnt[b] - cnt[a]; }).forEach(function (x) { if (opts.indexOf(x) < 0 && opts.length < 400) opts.push(x); });
    var lab = CT_LABELS[id] || col.replace(/_/g, ' ');
    return { col: col, label: lab.charAt(0).toUpperCase() + lab.slice(1), type: type, opts: type === 'text' || type === 'num' ? [] : opts.map(function (o) { return [o, cnt[o] || 0]; }) };
  });
}
function adminPanelColumns() { requireAdmin_(); return panelColumns_(); }
function adminPanelSearch(crit) {
  requireAdmin_();
  var p = sheet_(SH.PANEL), h = p.getRange(1, 1, 1, p.getLastColumn()).getValues()[0];
  var data = p.getLastRow() > 1 ? p.getRange(2, 1, p.getLastRow() - 1, h.length).getValues() : [];
  var low = function (x) { return String(x == null ? '' : x).toLowerCase().trim(); };
  var res = data.filter(function (r) {
    if (String(r[h.indexOf('status_kualitas_terakhir')]).indexOf('Tidak valid') === 0) return false;
    return (crit || []).every(function (k) {
      if (!k.col || k.val === '' || k.val == null || (Array.isArray(k.val) && !k.val.length)) return true;
      var i = h.indexOf(k.col); if (i < 0) return false;
      var v = low(r[i]), n = low(k.val), vs = v.split(' | ').map(function (x) { return x.trim(); }), want = (Array.isArray(k.val) ? k.val : [k.val]).map(low);
      if (k.op === 'adalah') return want.indexOf(v) >= 0;
      if (k.op === 'bukan') return want.indexOf(v) < 0;
      if (k.op === 'memilih salah satu') return want.some(function (x) { return vs.indexOf(x) >= 0; });
      if (k.op === 'memilih semua') return want.every(function (x) { return vs.indexOf(x) >= 0; });
      if (k.op === 'tidak memilih') return !want.some(function (x) { return vs.indexOf(x) >= 0; });
      if (k.op === 'minimal' || k.op === 'maksimal') { var a = parseFloat(String(r[i]).replace(/[^\d.,-]/g, '').replace(',', '.')), b = parseFloat(k.val); if (isNaN(a) || isNaN(b)) return false; return k.op === 'minimal' ? a >= b : a <= b; }
      return k.op === 'sama dengan' ? v === n : k.op === 'tidak sama dengan' ? v !== n : k.op === 'mengandung' ? v.indexOf(n) >= 0 : k.op === 'tidak mengandung' ? v.indexOf(n) < 0 : true;
    });
  });
  return { cols: h, rows: res.map(function (r) { return r.map(iso_); }) };
}

/** Daftar Blokir. */
function adminBlokList() {
  requireAdmin_(); refreshBlok(true);
  var b = blokData_();
  return { cols: b.h, rows: b.v.map(function (r) { return r.map(iso_); }) };
}
function adminBlokOpen(rowNo) {
  var who = requireAdmin_(), b = blokData_(), c = b.c, r = b.v[rowNo - 2];
  if (!r) throw new Error('Baris tidak ditemukan');
  var cell = function (n) { return b.s.getRange(rowNo, c(n) + 1); };
  if (r[c('status')] === 'Diblokir') {
    var n = (Number(r[c('jumlah_dibuka')]) || 0) + 1;
    cell('status').setValue('Dibuka'); cell('jumlah_dibuka').setValue(n); cell('tanggal_dibuka_terakhir').setValue(new Date());
    cell('keterangan').setValue(keterangan_('Dibuka', '', n) + ' (dibuka oleh ' + who + ')');
    return { ok: true, msg: 'Akses dibuka.' };
  }
  if (r[c('status')] === 'Suspend' && new Date(r[c('suspend_sampai')]) > new Date()) return { ok: false, msg: 'Masih masa suspend sampai ' + fmt_(r[c('suspend_sampai')]) + '. Tidak bisa dibuka manual.' };
  return { ok: false, msg: 'Akun ini tidak sedang diblokir.' };
}
function adminBlokAdd(ig, wa, reason) { var who = requireAdmin_(); addViolation_(ig, wa, (reason || 'Ditambahkan manual') + ' (oleh ' + who + ')', 'manual-' + Date.now()); return { ok: true }; }

/** Undian. */
/** Periode giveaway aktif saat jawaban masuk: survei MIL Gift Club = periode di Pengaturan; survei brand klien = tanpa periode. */
function activePeriode_(cs) {
  if (cs && cs.schema && cs.schema.brand && cs.schema.brand.mode === 'client') return '';
  return periodeText_(set_('PERIODE_KE'), set_('PERIODE_TAHUN'));
}
// ---- Periode giveaway: diatur di menu Periode Giveaway (rentang tanggal). Jawaban masuk periode sesuai TANGGAL masuknya. ----
function periods_() {
  var l = []; try { l = JSON.parse(String(set_('PERIODE_LIST') || '[]')); } catch (e) {}
  return (l || []).filter(function (p) { return p && p.ke; }).map(function (p) { return { ke: Number(p.ke), tahun: Number(p.tahun), mulai: String(p.mulai || ''), selesai: String(p.selesai || ''), umumkan: String(p.umumkan || ''), label: periodeText_(p.ke, p.tahun) }; })
    .sort(function (a, b) { return (b.tahun - a.tahun) || (b.ke - a.ke); });
}
function periodRange_(p) { return { f: new Date(p.mulai + 'T00:00:00+07:00'), t: new Date(p.selesai + 'T23:59:59+07:00') }; }
function periodeOf_(r) {
  var c = r._v !== 'v1' && r._v !== 'v2' ? customById_(r._v) : null;
  if (c && c.schema && c.schema.brand && c.schema.brand.mode === 'client') return '';   // survei brand klien tidak ikut periode
  var d = new Date(r.timestamp), ps = periods_();
  for (var i = 0; i < ps.length; i++) { var g = periodRange_(ps[i]); if (d >= g.f && d <= g.t) return ps[i].label; }
  return r.periode_giveaway ? String(r.periode_giveaway) : '';
}
/** Rentang waktu Laporan / Cross Tab / API: { periode: 'Periode 1 2026' } atau { dari: 'yyyy-mm-dd', sampai: 'yyyy-mm-dd' } (WIB). Kosong = semua waktu. */
function timeRange_(rg) {
  rg = rg || {};
  if (rg.periode) { var p = periods_().filter(function (x) { return x.label === rg.periode; })[0]; if (!p) throw new Error(rg.periode + ' tidak ditemukan di menu Periode Giveaway.'); var g = periodRange_(p); return { f: g.f, t: g.t, label: p.label + ' (' + tglID_(p.mulai) + ' – ' + tglID_(p.selesai) + ')' }; }
  var D = /^\d{4}-\d{2}-\d{2}$/, f = D.test(rg.dari || '') ? new Date(rg.dari + 'T00:00:00+07:00') : null, t = D.test(rg.sampai || '') ? new Date(rg.sampai + 'T23:59:59+07:00') : null;
  if (f && t && t < f) throw new Error('Tanggal "sampai" tidak boleh sebelum tanggal "dari".');
  if (!f && !t) return null;
  return { f: f, t: t, label: (f ? tglID_(rg.dari) : 'awal') + ' – ' + (t ? tglID_(rg.sampai) : 'sekarang') };
}
function tglID_(ymd) { var B = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'], a = String(ymd).split('-'); return Number(a[2]) + ' ' + B[Number(a[1]) - 1] + ' ' + a[0]; }
function inRange_(rows, rg) {
  var g = timeRange_(rg); if (!g) return rows;
  return rows.filter(function (r) { var d = new Date(r.timestamp); return (!g.f || d >= g.f) && (!g.t || d <= g.t); });
}
function rowsInPeriod_(rows, per) { return per ? rows.filter(function (r) { return periodeOf_(r) === per; }) : rows; }
/** Menu Periode Giveaway */
function adminPeriods() {
  requireAdmin_();
  var cnt = {}; readAll_().forEach(function (r) { if (r.status === 'Valid') { var p = periodeOf_(r); cnt[p] = (cnt[p] || 0) + 1; } });
  var act = activePeriode_(null);
  return { active: act, list: periods_().map(function (p) { p.valid = cnt[p.label] || 0; p.aktif = p.label === act; return p; }) };
}
function adminPeriodSave(list, activeLabel) {
  requireAdmin_();
  var D = /^\d{4}-\d{2}-\d{2}$/, seen = {};
  var clean = (list || []).map(function (p) {
    var x = { ke: Number(p.ke), tahun: Number(p.tahun), mulai: String(p.mulai || ''), selesai: String(p.selesai || ''), umumkan: String(p.umumkan || '') }, lb = periodeText_(x.ke, x.tahun);
    if (x.umumkan && !D.test(x.umumkan)) throw new Error(lb + ': tanggal pengumuman pemenang tidak valid.');
    if (x.umumkan && x.umumkan < x.selesai) throw new Error(lb + ': tanggal pengumuman pemenang sebaiknya setelah periode selesai.');
    if (!(x.ke >= 1) || !(x.tahun >= 2000) || !D.test(x.mulai) || !D.test(x.selesai)) throw new Error('Lengkapi periode ke-, tahun, dan tanggal (' + lb + ').');
    if (x.selesai < x.mulai) throw new Error(lb + ': tanggal selesai sebelum tanggal mulai.');
    if (seen[lb]) throw new Error(lb + ' tercantum dua kali.'); seen[lb] = 1;
    return x;
  });
  clean.sort(function (a, b) { return a.mulai < b.mulai ? -1 : 1; });
  for (var i = 1; i < clean.length; i++) if (clean[i].mulai <= clean[i - 1].selesai) throw new Error('Tanggal ' + periodeText_(clean[i - 1].ke, clean[i - 1].tahun) + ' dan ' + periodeText_(clean[i].ke, clean[i].tahun) + ' bertumpuk.');
  var o = { PERIODE_LIST: JSON.stringify(clean) };
  var a = clean.filter(function (p) { return periodeText_(p.ke, p.tahun) === activeLabel; })[0];
  if (a) { o.PERIODE_KE = a.ke; o.PERIODE_TAHUN = a.tahun; }
  adminSaveSettings(o); SET_MEMO_ = null;
  return adminPeriods();
}
function winSheet_() {
  var w = sheet_(SH.WIN); if (!w) return null;
  var h = w.getRange(1, 1, 1, Math.max(1, w.getLastColumn())).getValues()[0];
  if (h.indexOf('periode') < 0) w.getRange(1, h.length + 1).setValue('periode').setFontWeight('bold');
  return w;
}
/** Peserta eligible + rincian penyaringan. v = survei | 'all', per = periode ('' = semua periode) */
function eligibleInfo_(v, per) {
  var won = {}, w = winSheet_();
  if (w && w.getLastRow() > 1) w.getRange(2, 1, w.getLastRow() - 1, WIN_COLS.length).getValues().forEach(function (r) {
    if (String(r[7]).indexOf('Gugur') !== 0) won[String(r[4]).replace(/^'/, '') + '|' + String(r[9] || '')] = 1;   // 1 nomor WA = 1 kali menang per periode
  });
  var tags = bool_(set_('SYARAT_KOMENTAR_WAJIB')) ? igTags_() : null, minTag = num_('IG_MIN_TAG') || 3;
  var st = { jawaban: 0, valid: 0, orang: 0, diblokir: 0, sudahMenang: 0, kurangKomentar: 0, eligible: 0, kupon: 0 }, seen = {}, out = []; var allP = {}, valP = {};
  readAll_().forEach(function (r) {
    if (v !== 'all' && r._v !== v) return;
    if (per && periodeOf_(r) !== per) return;
    st.jawaban++; allP[String(r.wa_normal || r.ig_normal)] = 1; if (r.status === 'Valid') valP[String(r.wa_normal || r.ig_normal)] = 1;
    if (r.status !== 'Valid') return; st.valid++;
    var k = String(r.wa_normal); if (!k) return;
    if (seen[k]) { if (seen[k] !== 'x' && !seen[k]._sv[r._v]) { seen[k]._sv[r._v] = 1; seen[k].kupon++; } return; }   // 1 survei valid = 1 kupon (per periode, walau survei direfresh)
    seen[k] = 'x'; st.orang++;
    if (accessStatus_(String(r.ig_normal), k).state !== 'ok') { st.diblokir++; return; }
    if (won[k + '|' + (per || periodeOf_(r))]) { st.sudahMenang++; return; }
    if (tags && (tags[String(r.ig_normal).toLowerCase()] || 0) < minTag) { st.kurangKomentar++; return; }   // wajib komentar + tag teman
    var o = {}; for (var f in r) o[f] = r[f]; o.kupon = 1; o._sv = {}; o._sv[r._v] = 1; seen[k] = o;
    st.eligible++; out.push(o);
  });
  out.forEach(function (o) { st.kupon += o.kupon; });
  st.orangTotal = Object.keys(allP).length; st.orangValid = Object.keys(valP).length;
  return { rows: out, stats: st, wajibKomentar: !!tags };
}
function eligible_(v, per) { return eligibleInfo_(v, per).rows; }
function periodeList_() {
  var o = {}, cur = activePeriode_(null); if (cur) o[cur] = 1;
  periods_().forEach(function (p) { o[p.label] = 1; });
  return Object.keys(o).sort(function (a, b) { var x = a.match(/(\d+)\s+(\d{4})/) || [0, 0, 0], y = b.match(/(\d+)\s+(\d{4})/) || [0, 0, 0]; return (y[2] - x[2]) || (y[1] - x[1]); });
}
function adminEligible(v, per) {
  requireAdmin_();
  if (per == null) per = activePeriode_(null);
  var e = eligibleInfo_(v, per);
  return { count: e.rows.length, stats: e.stats, wajibKomentar: e.wajibKomentar, periode: per, periods: periodeList_(), current: activePeriode_(null),
    rows: e.rows.slice(0, 500).map(function (r) { return [varianLabel_(r._v), r.Z2, r.Z3, iso_(r.timestamp), r.kupon]; }) };
}
function adminDraw(v, prize, count, per) {
  var who = requireAdmin_(), lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    if (per == null) per = activePeriode_(null);
    var pool = eligible_(v, per), picked = [];
    count = Math.max(1, Math.min(Number(count) || 1, pool.length));
    var nPool = pool.length, nKupon = pool.reduce(function (a, r) { return a + r.kupon; }, 0);
    // undian berbobot: peluang sebanding jumlah kupon (1 survei valid = 1 kupon); 1 orang maksimal 1 kali menang
    for (var i = 0; i < count; i++) {
      var tot = pool.reduce(function (a, r) { return a + r.kupon; }, 0), x = Math.random() * tot, j = 0;
      while (j < pool.length - 1 && (x -= pool[j].kupon) >= 0) j++;
      picked.push(pool.splice(j, 1)[0]);
    }
    var w = sheet_(SH.WIN), now = new Date();
    picked.forEach(function (r) { w.appendRow([now, varianLabel_(r._v), prize, r.Z2, "'" + r.wa_normal, r.session_id, who, 'Menang', 'Dari ' + nPool + ' peserta eligible (' + nKupon + ' kupon); pemenang punya ' + r.kupon + ' kupon', per || periodeOf_(r)]); });
    return picked.map(function (r) { return { survei: varianLabel_(r._v), ig: r.Z2, wa: r.wa_normal, sid: r.session_id, kupon: r.kupon }; });
  } finally { lock.releaseLock(); }
}
function adminWinners() {
  requireAdmin_(); var w = sheet_(SH.WIN);
  return { cols: WIN_COLS, rows: w && w.getLastRow() > 1 ? w.getRange(2, 1, w.getLastRow() - 1, WIN_COLS.length).getValues().map(function (r) { return r.map(iso_); }) : [] };
}
function adminWinnerVoid(rowNo, reason) {
  var who = requireAdmin_(), w = sheet_(SH.WIN);
  w.getRange(rowNo, 8).setValue('Gugur'); w.getRange(rowNo, 9).setValue((reason || '') + ' (oleh ' + who + ')');
  return { ok: true };
}

/** Survei & pengaturan. */
function adminSettings() {
  requireAdmin_(); SET_MEMO_ = null;
  var s = settings_();
  return { surveys: surveyList_(), list: SET_DEFAULTS.map(function (d) { return { key: d[0], val: String(s[d[0]] == null ? '' : s[d[0]]), note: d[2] }; }), execUrl: ScriptApp.getService().getUrl() };
}
function adminSaveSettings(obj) {
  var who = requireAdmin_(), s = sheet_(SH.SET);
  var keys = s.getRange(2, 1, s.getLastRow() - 1, 1).getValues().map(function (r) { return r[0]; });
  Object.keys(obj || {}).forEach(function (k) {
    if (k === 'ADMIN_DOMAIN' && !String(obj[k]).trim()) return; // jangan sampai semua admin terkunci
    var i = keys.indexOf(k), v = obj[k];
    if (i < 0) { s.appendRow([k, '', '']); keys.push(k); i = keys.length - 1; }
    var cell = s.getRange(i + 2, 2);
    if (/^TUTUP_/.test(k)) cell.setNumberFormat('@').setValue(String(v || '')); else cell.setValue(v);
  });
  SET_MEMO_ = null;
  return adminSettings();
}
function adminRegenKey() { requireAdmin_(); var k = Utilities.getUuid().replace(/-/g, ''); adminSaveSettings({ API_KEY: k }); return k; }
function adminRunTask(name) {
  requireAdmin_();
  if (name === 'speeder') markSpeeders(true);
  if (name === 'blok') refreshBlok(true);
  if (name === 'rekap') updateRekap();
  return { ok: true };
}

// ====== CROSS TAB (Dashboard & API ATLAS) ======
// ====== CROSS TAB & INSIGHT OTOMATIS (dipakai bersama: Code.gs untuk API ATLAS, Admin.html untuk Dashboard) ======
// Format data: qs[i] = { id, text, sect, multi, cats: [...] }; data[r][i] = daftar indeks jawaban responden r untuk pertanyaan i.
var CT_LIB = {
  /** Satu tabel silang. o: { mode: 'col'|'row'|'count', hideEmpty: true, sort: 'orig'|'desc', rows: [indeks responden] } */
  table: function (qs, data, ri, ci, o) {
    o = o || {};
    var mode = o.mode || 'col', rq = qs[ri], cq = qs[ci];
    var R = o.rows ? o.rows.map(function (i) { return data[i]; }) : data;
    var nr = rq.cats.length, nc = cq.cats.length, totN = 0, colN = [], tn = [], rb = [], cnt = [], a, b, r, x, y;
    for (a = 0; a < nc; a++) colN.push(0);
    for (a = 0; a < nr; a++) { tn.push(0); rb.push(0); cnt.push(colN.slice()); }
    for (x = 0; x < R.length; x++) {
      r = R[x]; var rv = r[ri], cv = r[ci];
      if (!rv.length) continue;
      totN++;
      for (b = 0; b < cv.length; b++) colN[cv[b]]++;
      for (a = 0; a < rv.length; a++) { tn[rv[a]]++; if (cv.length) rb[rv[a]]++; for (y = 0; y < cv.length; y++) cnt[rv[a]][cv[y]]++; }
    }
    var cols = cq.cats.map(function (name, k) { return { name: name, k: k, n: colN[k] }; });
    if (o.hideEmpty !== false) cols = cols.filter(function (c) { return c.n; });
    var lines = rq.cats.map(function (name, k) {
      var line = { name: name, k: k, rowBase: tn[k], tot: { n: tn[k], v: mode === 'count' ? tn[k] : mode === 'row' ? 100 : CT_LIB.pct(tn[k], totN) }, cells: [] };
      cols.forEach(function (c) {
        var n = cnt[k][c.k];
        var v = mode === 'count' ? n : mode === 'row' ? CT_LIB.pct(n, rb[k]) : CT_LIB.pct(n, c.n);
        // uji beda proporsi: kelompok kolom vs responden lainnya (z, 95%)
        var p1 = c.n ? n / c.n : 0, n2 = totN - c.n, p2 = n2 > 0 ? (tn[k] - n) / n2 : 0, pp = totN ? tn[k] / totN : 0;
        var se = Math.sqrt(pp * (1 - pp) * (1 / Math.max(1, c.n) + 1 / Math.max(1, n2)));
        var z = se > 0 && n2 > 0 ? (p1 - p2) / se : 0;
        var d = c.n && totN ? (p1 - tn[k] / totN) * 100 : 0;
        line.cells.push({ n: n, v: v, d: Math.round(d * 10) / 10, z: Math.round(z * 100) / 100, sig: Math.abs(z) >= 1.96 && c.n >= 10 });
      });
      return line;
    });
    if (o.sort === 'desc') lines.sort(function (a, b) { return b.tot.n - a.tot.n; });
    return { row: { id: rq.id, text: rq.text, multi: !!rq.multi }, col: { id: cq.id, text: cq.text, multi: !!cq.multi }, mode: mode, base: totN,
      cols: cols.map(function (c) { return { name: c.name, n: c.n, small: c.n < 10 }; }), lines: lines };
  },
  pct: function (a, b) { return b ? Math.round(a / b * 1000) / 10 : null; },
  /** Temuan otomatis: kelompok (banner) yang jawabannya berbeda nyata dari rata-rata. o: { banners: [id], minBase, max, rows } */
  insights: function (qs, data, o) {
    o = o || {};
    var idx = {}; qs.forEach(function (q, i) { idx[q.id] = i; });
    var R = o.rows ? o.rows.map(function (i) { return data[i]; }) : data, N = R.length;
    var minBase = o.minBase || (N >= 300 ? 30 : N >= 100 ? 20 : 10), max = o.max || 8;
    var banners = (o.banners || []).map(function (id) { return idx[id]; }).filter(function (i) { return i != null && qs[i].cats.length >= 2 && qs[i].cats.length <= 12; });
    // yang dicari: perbedaan jawaban PERTANYAAN UTAMA antar kelompok profil (bukan profil vs profil, mis. SES vs pengeluaran)
    var skipSect = o.skipSect || /^(Profil|Screening|Tentang kamu)/i;
    var targets = qs.map(function (q, i) { return i; }).filter(function (i) { return banners.indexOf(i) < 0 && qs[i].cats.length >= 2 && qs[i].cats.length <= 30 && !skipSect.test(qs[i].sect || '') && qs[i].group !== 'PROFIL RESPONDEN' && (!o.skip || o.skip.indexOf(qs[i].id) < 0); });
    var found = [];
    targets.forEach(function (ti) {
      banners.forEach(function (bi) {
        var t = CT_LIB.table(qs, data, ti, bi, { mode: 'col', rows: o.rows });
        if (t.base < minBase * 2) return;
        t.lines.forEach(function (l) {
          if (l.tot.v == null || l.tot.v < 5) return;   // jawaban yang sangat jarang dipilih dilewati
          l.cells.forEach(function (c, j) {
            var col = t.cols[j];
            if (col.n < minBase || !c.sig || Math.abs(c.d) < 10) return;
            found.push({ score: Math.abs(c.d) * Math.sqrt(col.n), row: qs[ti].id, col: qs[bi].id, rowText: qs[ti].text, colText: qs[bi].text, segment: col.name, answer: l.name,
              pct: c.v, avg: l.tot.v, diff: c.d, n: col.n, z: c.z, multi: !!qs[ti].multi });
          });
        });
      });
    });
    found.sort(function (a, b) { return b.score - a.score; });
    var out = [], perRow = {}, perCol = {};
    for (var i = 0; i < found.length && out.length < max; i++) {
      var f = found[i];
      if (perRow[f.row] || (perCol[f.col] || 0) >= Math.ceil(max / 3)) continue;
      perRow[f.row] = 1; perCol[f.col] = (perCol[f.col] || 0) + 1;
      f.title = f.rowText + ': ' + f.segment + (f.diff > 0 ? ' lebih banyak' : ' lebih sedikit') + ' memilih "' + f.answer + '"';
      f.text = f.pct + '% dari ' + f.segment + ' (n=' + f.n + ') memilih "' + f.answer + '" untuk ' + f.rowText + ', dibanding ' + f.avg + '% rata-rata semua responden — selisih ' + (f.diff > 0 ? '+' : '') + f.diff + ' poin (signifikan, 95%).';
      out.push(f);
    }
    return out;
  }
};

var CT_LABELS = {"S0": "Tahun lahir", "S1": "Usia", "S2": "Jenis kelamin", "S3": "Bekerja di industri terkait", "S4": "Platform belanja (1 bulan terakhir)", "S5": "Frekuensi belanja online", "SC1": "Kategori fokus yang dibeli", "A1": "Kota", "provinsi": "Provinsi", "wilayah": "Wilayah", "A18": "Jenis tempat tinggal", "A19": "Status tempat tinggal", "A4M": "Status pernikahan", "A4N": "Jumlah anak", "A4K": "Usia anak", "A4": "Life stage", "A5": "Pekerjaan", "A6": "Pendidikan terakhir", "A7N": "Jumlah anggota rumah tangga", "A7": "Pengeluaran rumah tangga per bulan", "A8": "Belanja online pribadi per bulan", "ses": "SES", "kelas_ekonomi": "Kelas ekonomi", "A9": "Pengambil keputusan belanja rumah tangga", "A10": "Media sosial harian", "A11": "Durasi media sosial per hari", "A12": "Metode pembayaran", "A13": "Merek HP", "A13H": "Harga HP", "segmen_hp": "Segmen HP", "generasi": "Generasi", "A14": "Minat / hobi", "A15": "Mengenakan hijab", "A16": "Kendaraan yang dimiliki", "B2": "Platform paling sering dipakai", "B4": "Platform paling sesuai", "C1": "Kategori belanja terakhir", "kategori_1": "Kategori yang dibahas", "C2": "Frekuensi beli kategori (3 bulan)", "PT1": "Produk yang dibeli", "PT2": "Harga produk per item", "AW1": "Platform tempat membeli", "AW3": "Pemicu ingin membeli", "AW5": "Sumber pertama tahu produk", "AW6": "Konten yang menarik perhatian", "AW7": "Yang ingin dipastikan dari konten", "CO2": "Cara membandingkan pilihan", "CO4": "Pendorong keputusan membeli", "PTB": "Merek yang dibeli", "AW5K": "Kata kunci pencarian", "AW5S": "Aplikasi tempat melihat konten", "AW5C": "Kreator / akun yang diingat", "AW5R": "Yang merekomendasikan", "AW5G": "Jenis grup / komunitas", "AW5T": "Jenis toko fisik", "AW5M": "Media iklan konvensional", "FA2": "Sikap terhadap harga (fashion)", "CO6": "Jeda melihat hingga membeli", "CO7": "Melihat/mencoba di toko fisik dulu", "PU1": "Alasan memilih platform", "PU2": "Momen pembelian", "PU4": "Total nilai belanja", "PU5": "Pemakaian voucher / promo", "PU6": "Membatalkan checkout", "PU7": "Alasan tidak jadi membeli", "OF1": "Riwayat beli online vs toko fisik", "OF2": "Alasan dulu beli di toko fisik", "OF3": "Alasan pindah beli online", "OF4": "Kondisi tetap beli di toko fisik", "LO1": "Yang dipertahankan saat beli ulang", "LO2": "Alasan kembali membeli", "LO4": "Pemicu berhenti berlangganan", "RE1": "Kemungkinan merekomendasikan (NPS)", "RE2": "Tindakan setelah menerima produk", "RE3": "Pendorong memberi ulasan", "D0": "Porsi belanja online vs toko fisik", "D1": "Pengalaman live shopping", "D4": "Momen memutuskan beli saat live", "D5": "Format iklan sosmed yang dilihat"};   // label pendek per pertanyaan (questions.py)
var CT_BANNERS = ['S1', 'generasi', 'S2', 'ses', 'kelas_ekonomi', 'wilayah', 'A4', 'A5', 'A18', 'segmen_hp', 'A6', 'S5', 'D0'];
var CT_SKIP = ['O1', 'Z1', 'QC1', 'PR', 'S0B', 'PV', 'A1', 'provinsi', 'tipe_wilayah', 'jabodetabek', 'kategori_ditugaskan', 'kategori_2', 'pengeluaran_per_kapita', 'profil_diperbarui', 'S0'];
function wilayah_(r) {
  var JAWA = ['DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur'], SUM = ['Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Sumatera Selatan', 'Kepulauan Bangka Belitung', 'Bengkulu', 'Lampung'];
  if (!r.provinsi) return '';
  return r.jabodetabek === 'Ya' ? 'Jabodetabek' : JAWA.indexOf(r.provinsi) >= 0 ? 'Jawa lainnya' : SUM.indexOf(r.provinsi) >= 0 ? 'Sumatera' : 'Kalimantan, Sulawesi & Indonesia Timur';
}
/** Kelompok pertanyaan untuk daftar pilihan Cross Tab: [judul kelompok, sub-topik] */
var CT_GROUPS = ['PROFIL RESPONDEN', 'KEBIASAAN BELANJA ONLINE', 'KATEGORI & PRODUK TERAKHIR', 'PERJALANAN BELANJA (FUNNEL)', 'PERTANYAAN SURVEI', 'LAINNYA'];
function ctGroup_(id, topic, custom) {
  var b = id.replace(/^L\d_/, '').split(': ')[0], t = String(topic || '');
  if (/^(S4|S5|SC1)$/.test(b)) return [CT_GROUPS[1], ''];
  if (/^(Screening|Profil|Tentang)/i.test(t) || /^(wilayah|ses|kelas_ekonomi|segmen_hp|generasi)$/.test(b)) return [CT_GROUPS[0], ''];
  if (/^Lanskap|^Tren/i.test(t)) return [CT_GROUPS[1], t.replace(/^Tren & Perilaku Baru$/, 'Tren & perilaku baru').replace(/^Lanskap Platform$/, 'Platform belanja')];
  if (/^(Penetrasi|Funneling - Produk|Belanja terakhir)/i.test(t) || b === 'kategori_1') return [CT_GROUPS[2], ''];
  if (/^Funneling - /i.test(t)) return [CT_GROUPS[3], t.replace(/^Funneling - /i, '')];
  if (custom) return [CT_GROUPS[4], ''];
  return [CT_GROUPS[5], t];
}
/** Data ringkas untuk cross tab: hanya pertanyaan pilihan (tanpa teks bebas & data pribadi). Daftar pertanyaan tetap muncul walau belum ada jawaban. */
function ctData_(v, status, rg) {
  var c = v !== 'v1' && v !== 'v2' ? customById_(v) : null;
  var rows = inRange_(readAll_().filter(function (r) { return r._v === v && (status === 'all' || r.status === 'Valid'); }), rg);
  rows.forEach(function (r) { r.wilayah = wilayah_(r); if (!r.generasi) r.generasi = generasi_(r.S0); if (!r.segmen_hp) r.segmen_hp = segmenHp_(r); });
  var s = sheet_(respTab_(v)), header = s && s.getLastColumn() ? s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0] : [];
  var meta = reportMeta_(v), base = function (col) { return col.replace(/^L\d_/, ''); };
  meta.wilayah = { text: 'Wilayah (otomatis dari kota)', topic: 'Profil', opts: ['Jabodetabek', 'Jawa lainnya', 'Sumatera', 'Kalimantan, Sulawesi & Indonesia Timur'] };
  meta.kategori_1 = meta.kategori_1 || { text: 'Kategori yang dibahas', topic: 'Belanja terakhir' };
  var ok = function (col) { return col && (META.indexOf(col) < 0 || col === 'kategori_1') && !/_lainnya$/.test(col) && CT_SKIP.indexOf(base(col).split(': ')[0]) < 0 && ['Z2', 'Z3'].indexOf(col) < 0; };
  var cols = header.filter(ok);
  // pertanyaan yang belum punya kolom (belum ada jawaban) tetap dimasukkan dari kuesioner
  var prof = !c || c.schema.profile !== false;
  var known = c ? (prof ? ['S1', 'S2', 'S3', 'A18', 'A19', 'A4M', 'A4N', 'A4K', 'A4', 'A5', 'A6', 'A7N', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A13H', 'A14', 'A15', 'A16'] : []).concat((c.schema.questions || []).map(function (q) { return q.id; }))
    : DICTIONARY.map(function (d) { return d[0]; });
  if (prof) known = known.concat(['ses', 'kelas_ekonomi', 'segmen_hp', 'generasi']);
  var bases = cols.map(function (x) { return base(x).split(': ')[0]; });
  known.forEach(function (id) { if (ok(id) && bases.indexOf(id) < 0 && meta[id] && meta[id].opts && meta[id].opts.length && !/per baris/i.test(meta[id].text || '')) { cols.push(id); bases.push(id); } });
  if (prof && cols.indexOf('wilayah') < 0) cols.push('wilayah');
  var qs = [], data = rows.map(function () { return []; });
  cols.forEach(function (col) {
    var mx = col.match(/^(.+?): (.+)$/), id = mx ? mx[1] : col, m = meta[base(id)] || {};
    var vals = rows.map(function (r) { var x = r[col]; return x === '' || x == null ? [] : String(x).split(' | '); });
    var seen = {}, nAns = 0; vals.forEach(function (a) { if (a.length) nAns++; a.forEach(function (x) { seen[x] = (seen[x] || 0) + 1; }); });
    var keys = Object.keys(seen), opts = (m.opts || []).slice();
    if (!nAns && !opts.length) return;
    if (!opts.length && keys.length > 25) return;                 // teks bebas / angka bebas -> tidak bisa di-cross tab
    var cats = opts.slice();
    keys.sort(function (a, b) { return seen[b] - seen[a]; }).forEach(function (k) { if (cats.indexOf(k) < 0) cats.push(k); });
    if (cats.length > 40) cats = cats.slice(0, 40);
    var multi = vals.some(function (a) { return a.length > 1; }) || m.type === 'multi' || /\(boleh pilih|maksimal \d/i.test(m.text || '');
    var g = ctGroup_(col, m.topic, !!c && !/^(S\d|A\d|ses|kelas|wilayah|segmen_hp|generasi)/.test(base(id)));
    var full = String(m.text || id), lab = CT_LABELS[base(id)] || (c && ctCustomLabel_(c, base(id))) || ctShort_(full);
    qs.push({ id: col, text: lab + (mx ? ' — ' + mx[2] : ''), full: full + (mx ? ' — ' + mx[2] : ''), sect: m.topic || 'Lainnya', group: g[0], sub: g[1], multi: multi, cats: cats, _vals: vals });
  });
  // urutkan per kelompok (profil dulu), urutan kuesioner tetap di dalam kelompok
  var PO = ['S1', 'generasi', 'S2', 'wilayah', 'A18', 'A19', 'A4M', 'A4N', 'A4K', 'A4', 'A5', 'A6', 'A7N', 'A7', 'ses', 'kelas_ekonomi', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A13H', 'segmen_hp', 'A14', 'A15', 'A16', 'S3'];
  qs.forEach(function (q, i) { var p = PO.indexOf(q.id); q._o = CT_GROUPS.indexOf(q.group) * 1000 + (q.group === CT_GROUPS[0] && p >= 0 ? p : 100 + i); });
  qs.sort(function (a, b) { return a._o - b._o; });
  qs.forEach(function (q, qi) { q.no = qi + 1; q._vals.forEach(function (a, i) { data[i][qi] = a.map(function (x) { return q.cats.indexOf(x); }).filter(function (k) { return k >= 0; }); }); delete q._vals; delete q._o; });
  var ts = rows.map(function (r) { return new Date(r.timestamp).getTime(); }).filter(function (x) { return !isNaN(x); }).sort();
  return { qs: qs, data: data, meta: { n: rows.length, first: ts.length ? fmt_(new Date(ts[0])) : '', last: ts.length ? fmt_(new Date(ts[ts.length - 1])) : '', status: status === 'all' ? 'Semua jawaban' : 'Hanya jawaban valid' },
    banners: CT_BANNERS.filter(function (b) { return qs.some(function (q) { return q.id === b; }); }) };
}
/** label pendek survei buatan Dashboard: kolom "label" bila diisi, selain itu teks pertanyaan dipendekkan */
function ctCustomLabel_(c, id) { var q = (c.schema.questions || []).filter(function (x) { return x.id === id; })[0]; return q && q.label ? String(q.label) : ''; }
function ctShort_(t) {
  t = String(t || '').replace(/\s*\((boleh|pilih|maks)[^)]*\)\s*/gi, ' ').replace(/[?.]+\s*$/, '').trim();
  return t.length > 60 ? t.slice(0, 57).replace(/\s+\S*$/, '') + '…' : t;
}
function adminCrosstab(v, status, rg) { requireAdmin_(); var d = ctData_(v, status, rg), g = timeRange_(rg); d.meta.range = g ? g.label : 'Semua waktu'; return d; }
function ctIdx_(d, id) { for (var i = 0; i < d.qs.length; i++) if (d.qs[i].id === id) return i; throw new Error('Pertanyaan tidak ditemukan: ' + id + '. Lihat daftar di ?api=questions'); }

// ====== INSTAGRAM: CEK KOMENTAR & TAG DI POSTINGAN GIVEAWAY ======
// Token Meta disimpan di Script Properties proyek Dashboard (tidak di Sheet). Hasil sinkron ditulis ke tab "Komentar IG".
var IGC_TAB = 'Komentar IG', IGC_COLS = ['username', 'jumlah_tag', 'teman_ditag', 'komentar', 'waktu', 'postingan', 'comment_id'];
var IG_API = 'https://graph.facebook.com/v21.0/';
function igProps_() { return PropertiesService.getScriptProperties(); }
function igGet_(path, params, token) {
  var q = Object.keys(params || {}).map(function (k) { return k + '=' + encodeURIComponent(params[k]); }).join('&');
  var url = /^https:/.test(path) ? path : IG_API + path + '?' + q + (q ? '&' : '') + 'access_token=' + encodeURIComponent(token || igProps_().getProperty('IG_PAGE_TOKEN') || '');
  var r = UrlFetchApp.fetch(url, { muteHttpExceptions: true }), j = JSON.parse(r.getContentText() || '{}');
  if (j.error) throw new Error('Instagram: ' + (j.error.message || 'gagal') + (j.error.code === 190 ? ' (token kedaluwarsa / tidak valid, sambungkan ulang)' : ''));
  return j;
}
/** Simpan token dari Meta, cari Page & akun Instagram bisnis yang tersambung. */
function adminIgConnect(token) {
  requireAdmin_(); token = String(token || '').trim();
  if (!token) throw new Error('Tempel token dari Meta dulu.');
  var pages = igGet_('me/accounts', { fields: 'name,access_token,instagram_business_account{id,username}' }, token).data || [];
  var pg = pages.filter(function (p) { return p.instagram_business_account; })[0];
  if (!pg) throw new Error('Tidak ada Facebook Page dengan akun Instagram profesional yang tersambung pada token ini. Pastikan izin pages_show_list & instagram_basic dicentang.');
  var pr = igProps_();
  pr.setProperty('IG_PAGE_TOKEN', pg.access_token); pr.setProperty('IG_USER_ID', pg.instagram_business_account.id);
  pr.setProperty('IG_USERNAME', pg.instagram_business_account.username || ''); pr.setProperty('IG_PAGE_NAME', pg.name || '');
  return adminIgStatus();
}
function adminIgStatus() {
  requireAdmin_(); var pr = igProps_(), s = sheet_(IGC_TAB);
  var auto = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === 'igSyncAuto'; });
  return { connected: !!pr.getProperty('IG_PAGE_TOKEN'), username: pr.getProperty('IG_USERNAME') || '', page: pr.getProperty('IG_PAGE_NAME') || '', lastSync: pr.getProperty('IG_LAST_SYNC') || '',
    lastMsg: pr.getProperty('IG_LAST_MSG') || '', comments: s ? Math.max(0, s.getLastRow() - 1) : 0, posts: String(set_('IG_POST_GIVEAWAY') || ''), auto: auto, minTag: num_('IG_MIN_TAG') || 3, wajib: bool_(set_('SYARAT_KOMENTAR_WAJIB')) };
}
function adminIgDisconnect() { requireAdmin_(); var pr = igProps_(); ['IG_PAGE_TOKEN', 'IG_USER_ID', 'IG_USERNAME', 'IG_PAGE_NAME'].forEach(function (k) { pr.deleteProperty(k); }); return adminIgStatus(); }
function shortcode_(u) { var m = String(u || '').match(/instagram\.com\/(?:[^\/]+\/)?(?:p|reel|tv)\/([A-Za-z0-9_-]+)/); return m ? m[1] : ''; }
/** Ambil semua komentar (dan balasan) di postingan giveaway, hitung jumlah teman yang di-tag. */
function igSync_() {
  var pr = igProps_(), ig = pr.getProperty('IG_USER_ID'); if (!ig) throw new Error('Instagram belum tersambung.');
  var codes = String(set_('IG_POST_GIVEAWAY') || '').split(/[\s,]+/).map(shortcode_).filter(String);
  if (!codes.length) throw new Error('Isi link postingan giveaway dulu.');
  var media = {}, page = igGet_(ig + '/media', { fields: 'id,permalink,shortcode', limit: 50 }), guard = 0;
  while (page && guard++ < 10) {
    (page.data || []).forEach(function (m) { var c = m.shortcode || shortcode_(m.permalink); if (codes.indexOf(c) >= 0) media[c] = m; });
    if (codes.every(function (c) { return media[c]; }) || !(page.paging && page.paging.next)) break;
    page = igGet_(page.paging.next);
  }
  var own = String(pr.getProperty('IG_USERNAME') || '').toLowerCase(), rows = [];
  var add = function (c, code) {
    var u = String(c.username || '').toLowerCase(), tags = {};
    (String(c.text || '').match(/@([A-Za-z0-9._]+)/g) || []).forEach(function (t) { t = t.slice(1).toLowerCase().replace(/\.$/, ''); if (t && t !== u && t !== own) tags[t] = 1; });
    rows.push([u, Object.keys(tags).length, Object.keys(tags).map(function (t) { return '@' + t; }).join(' '), String(c.text || '').slice(0, 300), c.timestamp ? new Date(c.timestamp) : '', code, c.id]);
  };
  Object.keys(media).forEach(function (code) {
    var pg = igGet_(media[code].id + '/comments', { fields: 'id,username,text,timestamp,replies{id,username,text,timestamp}', limit: 50 }), g = 0;
    while (pg && g++ < 200) {
      (pg.data || []).forEach(function (c) { add(c, code); ((c.replies && c.replies.data) || []).forEach(function (r) { add(r, code); }); });
      if (!(pg.paging && pg.paging.next)) break;
      pg = igGet_(pg.paging.next);
    }
  });
  var ss = ss_(), s = ss.getSheetByName(IGC_TAB) || ss.insertSheet(IGC_TAB);
  s.clear(); s.getRange(1, 1, 1, IGC_COLS.length).setValues([IGC_COLS]).setFontWeight('bold');
  if (rows.length) s.getRange(2, 1, rows.length, IGC_COLS.length).setValues(rows);
  var missing = codes.filter(function (c) { return !media[c]; });
  var msg = rows.length + ' komentar dari ' + Object.keys(media).length + ' postingan' + (missing.length ? '. Postingan tidak ditemukan di akun ini: ' + missing.join(', ') : '');
  pr.setProperty('IG_LAST_SYNC', Utilities.formatDate(new Date(), 'Asia/Jakarta', 'd MMM yyyy HH:mm')); pr.setProperty('IG_LAST_MSG', msg);
  return msg;
}
function adminIgSync() { requireAdmin_(); igSync_(); return adminIgStatus(); }
function igSyncAuto() { try { igSync_(); } catch (e) { igProps_().setProperty('IG_LAST_MSG', 'Gagal: ' + e.message); } }
function adminIgAuto(on) {
  requireAdmin_();
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'igSyncAuto') ScriptApp.deleteTrigger(t); });
  if (on) ScriptApp.newTrigger('igSyncAuto').timeBased().everyHours(1).create();
  return adminIgStatus();
}
/** komentar terbaik per username: { username: jumlah_tag } */
function igTags_() {
  // teman yang di-tag dihitung unik dari SEMUA komentar orang yang sama (boleh dipecah ke beberapa komentar)
  var s = sheet_(IGC_TAB), set = {}, o = {}; if (!s || s.getLastRow() < 2) return null;
  s.getRange(2, 1, s.getLastRow() - 1, 3).getValues().forEach(function (r) {
    var u = String(r[0]).toLowerCase(); if (!u) return; set[u] = set[u] || {};
    String(r[2] || '').split(/\s+/).filter(String).forEach(function (t) { set[u][t.toLowerCase()] = 1; });
  });
  Object.keys(set).forEach(function (u) { o[u] = Object.keys(set[u]).length; });
  return o;
}
/** Halaman "Cek status giveaway": apa saja syarat yang sudah / belum dipenuhi. */
function giveawayStatus(ig) {
  ensureSetup_();
  var n = normIg_(ig); if (!n) return { ok: false, msg: 'Tulis username Instagram kamu.' };
  var acc = accessStatus_(n, '');
  var rows = readAll_().filter(function (r) { return String(r.ig_normal) === n; });
  var why = function (st) {
    st = String(st || '');
    if (st === 'Valid') return '';
    if (/attention/.test(st)) return 'Jawaban tidak lolos pengecekan perhatian (salah menjawab pertanyaan "pilih Biru").';
    if (/speeder/.test(st)) return 'Survei diisi terlalu cepat sehingga dianggap tidak valid.';
    if (/manual/.test(st)) return 'Jawaban dinilai asal-asalan oleh tim.';
    if (/Duplikat/.test(st)) return 'Kamu sudah mengisi survei ini sebelumnya (di ronde yang sama); hanya jawaban pertama yang dihitung.';
    if (/setelah survei ditutup/.test(st)) return 'Jawaban masuk setelah survei ditutup.';
    if (/Diblokir/.test(st)) return 'Akun sedang diblokir karena riwayat jawaban asal-asalan.';
    return st;
  };
  var names = {}; surveyList_().forEach(function (x) { names[x.v] = x.name; });
  var surveys = rows.map(function (r) { return { name: names[r._v] || r.survei || '', valid: r.status === 'Valid', status: r.status, reason: why(r.status), time: iso_(r.timestamp) }; });
  var tags = igTags_(), min = num_('IG_MIN_TAG') || 3, t = tags ? tags[n] : null;
  var komentar = tags == null ? { state: 'manual', min: min } : t == null ? { state: 'belum', min: min } : t >= min ? { state: 'ok', n: t, min: min } : { state: 'kurang', n: t, min: min };
  var surveyOk = surveys.some(function (x) { return x.valid; }) && acc.state === 'ok';
  // kupon periode aktif: 1 survei valid = 1 kupon
  var per = activePeriode_(null), done = {};
  var kp = {};
  rows.forEach(function (r, i) {
    var k = r.status === 'Valid' && periodeOf_(r) === per && !kp[r._v]; if (k) kp[r._v] = 1;   // 1 kupon per survei per periode
    surveys[i].kupon = k; if (r.ronde > 1) surveys[i].name += ' (ronde ' + r.ronde + ')';
    if (r.ronde === rondeNow_(r._v)) done[r._v] = 1;
  });
  var kupon = acc.state === 'ok' ? Object.keys(kp).length : 0;
  var lain = surveyList_().filter(function (x) {
    if (!x.open || done[x.v]) return false;
    var c = x.custom ? customById_(x.v) : null;
    return !(c && c.schema && (c.schema.giveaway === false || (c.schema.brand && c.schema.brand.mode === 'client')));
  }).map(function (x) { return { name: x.name + (x.ronde > 1 ? ' (ronde ' + x.ronde + ')' : ''), link: x.link, kupon: !kp[x.v] }; });
  return { ok: true, ig: '@' + n, blocked: acc.state !== 'ok' ? { state: acc.state, until: acc.until ? fmt_(acc.until) : '', email: set_('EMAIL_BUKA_AKSES') } : null,
    surveys: surveys, surveyOk: surveyOk, komentar: komentar, periode: mainPeriode_('v1').label, kupon: kupon, periodeAktif: per, surveiLain: lain, posts: String(set_('IG_POST_GIVEAWAY') || '').split(/[\s,]+/).filter(String),
    eligible: surveyOk && (komentar.state === 'ok' || komentar.state === 'manual') };
}

// ====== HAPUS DATA (mis. data uji coba) ======
// Baris dihapus dari tab; salinannya disimpan dulu di tab tersembunyi "Arsip ..." (bisa dikembalikan manual).
// Definisi survei (pertanyaan, link) TIDAK ikut terhapus.
function arsip_(s, stamp) {
  var last = s.getLastRow(), lc = s.getLastColumn();
  if (last < 2 || !lc) return 0;
  var ss = ss_(), nm = ('Arsip ' + stamp + ' ' + s.getName()).slice(0, 95), n = nm, k = 2;
  while (ss.getSheetByName(n)) n = nm + ' (' + (k++) + ')';
  var a = ss.insertSheet(n);
  a.getRange(1, 1, last, lc).setValues(s.getRange(1, 1, last, lc).getValues());
  try { a.hideSheet(); } catch (e) {}
  return last - 1;
}
/** hapus semua baris data (header tetap); rows = daftar nomor baris tertentu (opsional) */
function hapusBaris_(s, rows) {
  var last = s.getLastRow(); if (last < 2) return 0;
  if (rows) { rows.sort(function (a, b) { return b - a; }).forEach(function (r) { if (s.getLastRow() > 2) s.deleteRow(r); else s.getRange(r, 1, 1, s.getLastColumn()).clearContent(); }); return rows.length; }
  if (last > 2) s.deleteRows(3, last - 2);   // sisakan 1 baris agar tidak menghapus semua baris (dilarang Sheets)
  s.getRange(2, 1, 1, Math.max(1, s.getLastColumn())).clearContent();
  return last - 1;
}
/** Hapus data. opt = { surveys: ['v1','v2',id...] | 'all', screenout, panel, blok, undian, arsip (default true), konfirmasi: 'HAPUS' } */
function adminDeleteData(opt) {
  var who = requireAdmin_(); opt = opt || {};
  if (String(opt.konfirmasi || '').trim().toUpperCase() !== 'HAPUS') throw new Error('Ketik HAPUS untuk konfirmasi.');
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    var stamp = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyyMMdd-HHmm'), keep = opt.arsip !== false, out = { surveys: [], lain: [], arsip: keep };
    var all = surveyList_().map(function (s) { return s.v; });
    var pick = opt.surveys === 'all' ? all : (opt.surveys || []).filter(function (v) { return all.indexOf(v) >= 0; });
    var labels = [];
    pick.forEach(function (v) {
      var tab = respTab_(v), s = sheet_(tab), n = 0;
      if (s) { if (keep) arsip_(s, stamp); n = hapusBaris_(s); }
      labels.push(varianLabel_(v));
      out.surveys.push({ v: v, tab: tab, rows: n });
    });
    // kuota kategori (survei utama) direset bila survei utama dihapus
    if (pick.indexOf('v1') >= 0 || pick.indexOf('v2') >= 0) {
      var k = sheet_(SH.KAT); if (k && k.getLastRow() > 1) { var z = []; for (var i = 2; i <= k.getLastRow(); i++) z.push([0, 0]); k.getRange(2, 4, z.length, 2).setValues(z); }
    }
    var scr = sheet_(SH.SCR);
    if (opt.screenout && scr && scr.getLastRow() > 1) {
      if (keep) arsip_(scr, stamp);
      var n2;
      if (opt.surveys === 'all') n2 = hapusBaris_(scr);
      else { var v9 = scr.getRange(2, 9, scr.getLastRow() - 1, 1).getValues(), rr = []; v9.forEach(function (r, i) { if (labels.indexOf(String(r[0])) >= 0) rr.push(i + 2); }); n2 = hapusBaris_(scr, rr); }
      out.lain.push({ tab: SH.SCR, rows: n2 });
    }
    [[opt.panel, SH.PANEL], [opt.blok, SH.BLOK], [opt.undian, SH.WIN], [opt.undian, SH.UNDIAN]].forEach(function (x) {
      var s = x[0] && sheet_(x[1]); if (!s || s.getLastRow() < 2) return;
      if (keep) arsip_(s, stamp);
      out.lain.push({ tab: x[1], rows: hapusBaris_(s) });
    });
    CUSTOM_MEMO_ = null; SET_MEMO_ = null;
    try { if (pick.length) updateRekap(); } catch (e) {}
    out.oleh = who; out.waktu = stamp;
    return out;
  } finally { lock.releaseLock(); }
}

// =====================================================================
// ====== API UNTUK DASHBOARD LAIN (ATLAS) ======
// GET <link web app>?api=summary&key=KUNCI   (juga: daily, quota, responses)
// =====================================================================
var API_HIDE = ['Z2', 'Z3', 'PV', 'wa_normal', 'ig_normal', 'device_fp', 'user_agent', '_tab', '_row'];
function apiGet_(p) {
  var out;
  try {
    var key = String(set_('API_KEY') || '');
    if (!key || p.key !== key) throw new Error('Kunci API tidak valid');
    var d = summaryData_(), v = p.survei || 'all';
    if (p.api === 'summary' && p.periode) d = summaryData_(p.periode);
    if (p.api === 'summary') out = { generatedAt: d.generatedAt, surveys: d.surveys.map(function (s) { return { id: s.v, name: s.name, open: s.open, target: s.target, total: s.total, valid: s.valid, invalid: s.invalid, duplicate: s.dup, today: s.today, median_minutes: s.medianMin }; }), screenout: d.screenout, blocked: d.blok, panel_members: d.panel, sources: d.sources };
    else if (p.api === 'daily') out = d.daily;
    else if (p.api === 'quota') out = v === 'all' ? d.quota : d.quota[v];
    else if (p.api === 'responses') {
      var since = p.since ? new Date(p.since) : null, st = p.status || 'Valid';
      out = readAll_().filter(function (r) { return (v === 'all' || r._v === v) && (st === 'all' || r.status === st) && (!since || new Date(r.timestamp) >= since); })
        .map(function (r) { var o = {}; Object.keys(r).forEach(function (k) { if (API_HIDE.indexOf(k) < 0) o[k] = iso_(r[k]); }); o.survei_id = r._v; return o; });
    } else if (p.api === 'questions' || p.api === 'crosstab' || p.api === 'insights') {
      if (v === 'all') throw new Error('Isi parameter survei, mis. &survei=v1');
      var cd = ctData_(v, p.status === 'all' ? 'all' : 'Valid', { periode: p.periode, dari: p.dari, sampai: p.sampai });
      if (p.api === 'questions') out = { n: cd.meta.n, banners: cd.banners, questions: cd.qs.map(function (q) { return { id: q.id, text: q.text, section: q.sect, multi: q.multi, answers: q.cats }; }) };
      else if (p.api === 'crosstab') out = CT_LIB.table(cd.qs, cd.data, ctIdx_(cd, p.row), ctIdx_(cd, p.col || 'S1'), { mode: p.mode || 'col', sort: p.sort });
      else out = { n: cd.meta.n, insights: CT_LIB.insights(cd.qs, cd.data, { banners: p.banners ? String(p.banners).split(',') : cd.banners, max: Number(p.max) || 8 }) };
    } else throw new Error('Endpoint tidak dikenal. Gunakan: summary, daily, quota, responses, questions, crosstab, insights');
    out = { ok: true, data: out };
  } catch (e) { out = { ok: false, error: String(e.message || e) }; }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
/** Semua kolom satu survei untuk diunduh (CSV) dari Dashboard. */
function adminExport(v) {
  requireAdmin_();
  if (v === 'all') {   // semua survei: gabungan kolom, ditambah kolom survei asal
    var rs = readAll_(), cols = ['survei'];
    rs.forEach(function (r) { Object.keys(r).forEach(function (k) { if (k.charAt(0) !== '_' && cols.indexOf(k) < 0) cols.push(k); }); });
    return { cols: cols, rows: rs.map(function (r) { return cols.map(function (k) { return iso_(r[k] == null ? '' : r[k]); }); }) };
  }
  var s = sheet_(respTab_(v)); if (!s || s.getLastRow() < 1) return { cols: [], rows: [] };
  var h = s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0];
  var rows = s.getLastRow() > 1 ? s.getRange(2, 1, s.getLastRow() - 1, h.length).getValues().map(function (r) { return r.map(iso_); }) : [];
  return { cols: h, rows: rows };
}


// =====================================================================
// ====== SURVEI BARU (dibuat dari Dashboard) ======
// Disimpan di tab "Daftar Survei": satu baris per survei, rancangan pertanyaan (JSON) di kolom schema.
// =====================================================================
var SURV_COLS = ['id', 'nama', 'status', 'target', 'tab_jawaban', 'dibuat_oleh', 'dibuat', 'diubah_oleh', 'diubah', 'schema'];
var CUSTOM_MEMO_ = null, SCHEMA_CHUNK = 45000;
function survSheet_() {
  var s = sheet_(SH.SURV);
  if (!s) {
    s = ss_().insertSheet(SH.SURV);
    s.getRange(1, 1, 1, SURV_COLS.length).setValues([SURV_COLS]).setFontWeight('bold').setBackground('#FFFF00');
    s.setFrozenRows(1);
  }
  return s;
}
function customSurveys_() {
  if (CUSTOM_MEMO_) return CUSTOM_MEMO_;
  var out = [];
  try {
    var s = sheet_(SH.SURV);
    if (s && s.getLastRow() > 1) s.getRange(2, 1, s.getLastRow() - 1, s.getLastColumn()).getValues().forEach(function (r, i) {
      if (!r[0]) return;
      var js = r.slice(9).join(''), sch = {};
      try { sch = JSON.parse(js || '{}'); } catch (e) {}
      out.push({ id: String(r[0]), name: String(r[1]), status: String(r[2] || 'Draf'), target: Number(r[3]) || 0, tab: String(r[4] || ''), row: i + 2, schema: sch, by: r[5], created: r[6], editedBy: r[7], edited: r[8] });
    });
  } catch (e) {}
  CUSTOM_MEMO_ = out; return out;
}
function customById_(id) { id = String(id || ''); return customSurveys_().filter(function (c) { return c.id === id; })[0] || null; }
function customLink_(id) { return String(set_('LINK_SURVEI_BARU') || '') + id; }
function slug_(x) { return String(x || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30) || 'survei'; }
function tabName_(name, id) {
  var base = ('Jawaban - ' + String(name).replace(/[\[\]\*\?\/\\:]/g, ' ')).replace(/\s+/g, ' ').trim().slice(0, 90);
  var ss = ss_(), n = base;
  if (ss.getSheetByName(n)) n = (base.slice(0, 80) + ' (' + id + ')').slice(0, 99);
  return n;
}
function ensureCustomTab_(c) {
  if (c.tab && sheet_(c.tab)) return c.tab;
  var tab = c.tab || tabName_(c.name, c.id), s = sheet_(tab);
  if (!s) {
    s = ss_().insertSheet(tab);
    s.getRange(1, 1, 1, META.length).setValues([META]).setFontWeight('bold').setBackground('#FFFF00');
    s.setFrozenRows(1);
  }
  if (c.tab !== tab) { survSheet_().getRange(c.row, 5).setValue(tab); c.tab = tab; }
  return tab;
}
function writeCustom_(row, rec) {
  var s = survSheet_(), js = JSON.stringify(rec.schema), parts = [];
  for (var i = 0; i < js.length; i += SCHEMA_CHUNK) parts.push(js.slice(i, i + SCHEMA_CHUNK));
  var vals = [rec.id, rec.name, rec.status, rec.target, rec.tab || '', rec.by || '', rec.created || '', rec.editedBy || '', rec.edited || ''].concat(parts);
  var width = Math.max(s.getLastColumn(), vals.length);
  while (vals.length < width) vals.push('');
  if (s.getMaxColumns() < width) s.insertColumnsAfter(s.getMaxColumns(), width - s.getMaxColumns());
  if (row) s.getRange(row, 1, 1, width).setValues([vals]); else s.appendRow(vals);
  CUSTOM_MEMO_ = null;
}
function setCustomStatus_(id, status) {
  var c = customById_(id); if (!c) throw new Error('Survei tidak ditemukan');
  if (status === 'Dibuka') ensureCustomTab_(c);
  survSheet_().getRange(c.row, 3).setValue(status);
  CUSTOM_MEMO_ = null;
}
function autoCloseCustom_(c, s, col) {
  if (c.schema.autoClose === false || !c.target) return;
  var last = s.getLastRow(); if (last < 2) return;
  var n = s.getRange(2, col.status + 1, last - 1, 1).getValues().filter(function (r) { return r[0] === 'Valid'; }).length;
  if (n >= c.target) setCustomStatus_(c.id, 'Ditutup');
}

/** Dipanggil halaman survei (Netlify /s/?id=...). preview=true: draf boleh dibuka untuk dicoba. */
function getSurvey(id, preview) {
  var c = customById_(id);
  if (!c || c.status === 'Diarsipkan') throw new Error('Survei tidak ditemukan');
  var br = c.schema.brand && c.schema.brand.mode === 'client' ? JSON.parse(JSON.stringify(c.schema.brand)) : null;
  if (br && br.logo) br.logoData = imageData_([br.logo])[br.logo] || '';
  var sch = JSON.parse(JSON.stringify(c.schema)), cp = customPeriode_(c);
  sch.periode = cp.periode; sch.periodeLabel = cp.label; if (cp.announce) sch.announce = cp.announce;
  sch.skInfo = { minTag: num_('IG_MIN_TAG') || 3, emailAkses: set_('EMAIL_BUKA_AKSES') || '', suspendBulan: num_('SUSPEND_BULAN') || 6 };
  return { id: c.id, name: c.name, status: c.status, open: preview ? true : isOpen_(c.id), preview: !!preview, schema: sch, brand: br, tutupLewat: closed_(c.schema.tutup),
    giveaway: { periodeLabel: mainPeriode_('v1').label, hadiahUtama: CONFIG.HADIAH_UTAMA, hadiah: CONFIG.HADIAH, periode: mainPeriode_('v1').periode, announce: announceText_(), ig: CONFIG.IG_HANDLE, langkah: CONFIG.LANGKAH_PENUTUP, pesanPenutup: CONFIG.PESAN_PENUTUP } };
}

// ---- fungsi Dashboard (Buat survei) ----
function adminBuilderList() {
  requireAdmin_(); CUSTOM_MEMO_ = null;
  var rows = readAll_();
  return customSurveys_().map(function (c) {
    var mine = rows.filter(function (r) { return r._v === c.id; });
    return { id: c.id, name: c.name, status: c.status, target: c.target, link: customLink_(c.id), questions: (c.schema.questions || []).length, total: mine.length, valid: mine.filter(function (r) { return r.status === 'Valid'; }).length, edited: iso_(c.edited), editedBy: c.editedBy };
  });
}
function adminBuilderGet(id) {
  requireAdmin_(); CUSTOM_MEMO_ = null;
  var c = customById_(id); if (!c) throw new Error('Survei tidak ditemukan');
  var n = 0; try { var s = sheet_(c.tab); n = s ? Math.max(0, s.getLastRow() - 1) : 0; } catch (e) {}
  return { id: c.id, status: c.status, link: customLink_(c.id), responses: n, schema: c.schema };
}
function adminBuilderDefaults() {
  requireAdmin_();
  var mp = mainPeriode_('v1');
  return { giveaway: { periodeLabel: mp.label, periodeKe: mp.periodeKe, tahun: mp.tahun, tutup: inputDate_(set_('TUTUP_V1')), hadiahUtama: CONFIG.HADIAH_UTAMA, hadiah: CONFIG.HADIAH || [], periode: mp.periode, announce: mp.announce, ig: CONFIG.IG_HANDLE, langkah: CONFIG.LANGKAH_PENUTUP || [] }, ai: !!String(set_('ANTHROPIC_API_KEY') || '').trim(), linkBase: String(set_('LINK_SURVEI_BARU') || '') };
}
/** Simpan rancangan. publish=true -> status Dibuka & tab jawaban dibuat. */
function adminBuilderSave(sch, publish) {
  var who = requireAdmin_(), lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    CUSTOM_MEMO_ = null;
    sch = sch || {};
    var name = String(sch.name || '').trim(); if (!name) throw new Error('Nama survei wajib diisi');
    var qs = sch.questions || []; if (!qs.length) throw new Error('Survei belum punya pertanyaan');
    var seen = {};
    qs.forEach(function (q, i) {
      if (!String(q.text || '').trim()) throw new Error('Pertanyaan nomor ' + (i + 1) + ' masih kosong');
      if (!q.id || seen[q.id] || /^(O1|Z1|Z2|Z3|PV|QC1|S1|S2|S3|A[0-9]+)$/.test(q.id)) q.id = 'Q' + (i + 1);
      while (seen[q.id]) q.id = q.id + 'x';
      seen[q.id] = 1;
      if (/^(single|multi|dropdown)$/.test(q.type) && !(q.options || []).filter(function (o) { return String(o.t || '').trim(); }).length) throw new Error('Pertanyaan nomor ' + (i + 1) + ' belum punya pilihan jawaban');
    });
    var c = sch.id ? customById_(sch.id) : null, now = new Date();
    var rec;
    if (c) {
      rec = { id: c.id, name: name, status: publish ? 'Dibuka' : c.status, target: Number(sch.target) || 0, tab: c.tab, by: c.by, created: c.created, editedBy: who, edited: now, schema: sch };
    } else {
      var id = slug_(sch.slug || name), base = id, k = 2;
      while (id === 'v1' || id === 'v2' || customById_(id)) id = base.slice(0, 26) + '-' + (k++);
      rec = { id: id, name: name, status: publish ? 'Dibuka' : 'Draf', target: Number(sch.target) || 0, tab: '', by: who, created: now, editedBy: who, edited: now, schema: sch };
    }
    rec.schema.id = rec.id; rec.schema.name = name;
    writeCustom_(c ? c.row : 0, rec);
    var saved = customById_(rec.id);
    if (rec.status === 'Dibuka') ensureCustomTab_(saved);
    return { id: rec.id, status: rec.status, link: customLink_(rec.id) };
  } finally { lock.releaseLock(); }
}
function adminBuilderStatus(id, status) {
  requireAdmin_();
  if (['Dibuka', 'Ditutup', 'Draf', 'Diarsipkan'].indexOf(status) < 0) throw new Error('Status tidak dikenal');
  setCustomStatus_(id, status); return { ok: true };
}
function adminBuilderDelete(id) {
  requireAdmin_(); CUSTOM_MEMO_ = null;
  var c = customById_(id); if (!c) throw new Error('Survei tidak ditemukan');
  var s = c.tab ? sheet_(c.tab) : null;
  if (s && s.getLastRow() > 1) { setCustomStatus_(id, 'Diarsipkan'); return { ok: true, archived: true }; }
  if (s) ss_().deleteSheet(s);
  survSheet_().deleteRow(c.row); CUSTOM_MEMO_ = null;
  return { ok: true, archived: false };
}

/** Menyusun pertanyaan dengan Claude. mode 'brief' = dari tujuan riset, 'parse' = merapikan daftar pertanyaan yang ditempel. */
function adminAi(text, mode, n) {
  requireAdmin_();
  var key = String(set_('ANTHROPIC_API_KEY') || '').trim();
  if (!key) throw new Error('Fitur AI belum aktif. Isi ANTHROPIC_API_KEY di Survei & Pengaturan > Pengaturan lain.');
  var fmt = 'Balas HANYA dengan JSON valid (tanpa teks lain, tanpa ```), format:\n' +
    '{"name":"nama survei singkat","intro":"1-2 kalimat pembuka untuk responden","estimasi":angka_menit,"questions":[{"text":"teks pertanyaan","type":"single|multi|dropdown|text|longtext|number|scale","options":[{"t":"pilihan","other":false,"exclusive":false,"screen":false}],"max":0,"random":false,"scale":{"min":1,"max":5,"minLabel":"Sangat tidak setuju","maxLabel":"Sangat setuju"},"showIf":null,"hint":""}]}\n' +
    'Aturan: single = pilih satu; multi = boleh lebih dari satu (max = batas jumlah pilihan, 0 = bebas); dropdown = pilih satu dari daftar panjang; text = isian singkat; longtext = isian panjang; number = angka; scale = skala (pakai field scale). ' +
    '"other": true untuk pilihan "Lainnya" yang perlu diisi teks. "exclusive": true untuk pilihan seperti "Tidak satu pun" pada multi. "screen": true bila responden yang memilih pilihan itu TIDAK LOLOS (survei berhenti). "random": true bila urutan pilihan sebaiknya diacak. ' +
    '"showIf": null, atau {"q": nomor_pertanyaan_sebelumnya (mulai 1), "op": "is" | "isnot" | "has", "val": "teks pilihan persis"} bila pertanyaan hanya muncul untuk jawaban tertentu. ' +
    'JANGAN buat pertanyaan usia, jenis kelamin, kota, pekerjaan, pendidikan, pengeluaran, username Instagram, nomor WhatsApp, persetujuan ikut survei, atau attention check, karena sudah otomatis ditambahkan sistem. Gunakan Bahasa Indonesia baku dengan sapaan "Anda".';
  var prompt = mode === 'parse'
    ? 'Ubah daftar pertanyaan kuesioner berikut menjadi JSON survei. Pertahankan teks, urutan, dan pilihan jawaban selengkap mungkin (rapikan ejaan seperlunya). Tentukan tipe dari konteks. Lewati pertanyaan yang termasuk daftar "JANGAN" di bawah.\n\n' + fmt + '\n\nKUESIONER:\n' + text
    : 'Anda adalah peneliti riset pasar senior di MIL Digital (konsultan digital marketing Indonesia) yang menyusun survei online untuk komunitas giveaway MIL Gift Club (responden: pembelanja online Indonesia). Susun survei berdasarkan brief berikut. Buat sekitar ' + (Number(n) || 15) + ' pertanyaan, alur dari umum ke spesifik, pilihan jawaban lengkap dan saling eksklusif, kalimat netral (tidak menggiring), dan cocok diisi di HP.\n\n' + fmt + '\n\nBRIEF:\n' + text;
  var res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post', contentType: 'application/json', muteHttpExceptions: true,
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    payload: JSON.stringify({ model: String(set_('AI_MODEL') || 'claude-sonnet-5-5'), max_tokens: 16000, messages: [{ role: 'user', content: prompt }] })
  });
  var code = res.getResponseCode(), body = res.getContentText();
  if (code !== 200) {
    var msg = body; try { msg = JSON.parse(body).error.message; } catch (e) {}
    throw new Error('AI gagal (' + code + '): ' + String(msg).slice(0, 300));
  }
  var txt = (JSON.parse(body).content || []).map(function (b) { return b.text || ''; }).join('');
  var a = txt.indexOf('{'), b = txt.lastIndexOf('}');
  if (a < 0 || b < a) throw new Error('Jawaban AI tidak bisa dibaca. Coba lagi.');
  return JSON.parse(txt.slice(a, b + 1));
}

/** Jalankan sekali dari editor Apps Script bila muncul "Authorization is required" setelah deploy otomatis. */
function izinkanAkses() {
  var n = ss_().getSheets().length;
  ScriptApp.getProjectTriggers();
  try { UrlFetchApp.fetch('https://www.google.com', { muteHttpExceptions: true }); } catch (e) {}
  Logger.log('Akses diizinkan. Sheet: ' + ss_().getName() + ' (' + n + ' tab). Akun: ' + Session.getActiveUser().getEmail());
}

// ---- Foto hadiah (untuk gambar IG). Disimpan di tab "Gambar Hadiah", dipotong per sel. ----
var IMG_TAB = 'Gambar Hadiah';
function adminImageSave(dataUrl) {
  var who = requireAdmin_();
  dataUrl = String(dataUrl || '');
  if (!/^data:image\/(png|jpeg|webp);base64,/.test(dataUrl)) throw new Error('Format gambar tidak dikenali');
  if (dataUrl.length > 1500000) throw new Error('Gambar terlalu besar. Pakai gambar yang lebih kecil.');
  var s = sheet_(IMG_TAB);
  if (!s) { s = ss_().insertSheet(IMG_TAB); s.getRange(1, 1, 1, 4).setValues([['id', 'dibuat', 'oleh', 'data (bersambung ke kolom kanan)']]).setFontWeight('bold').setBackground('#FFFF00'); s.setFrozenRows(1); }
  var id = 'img' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36), parts = [];
  for (var i = 0; i < dataUrl.length; i += SCHEMA_CHUNK) parts.push(dataUrl.slice(i, i + SCHEMA_CHUNK));
  s.appendRow([id, new Date(), who].concat(parts));
  return id;
}
function adminImageGet(ids) { requireAdmin_(); return imageData_(ids); }
function imageData_(ids) {
  var s = sheet_(IMG_TAB), out = {}; ids = ids || [];
  if (!s || s.getLastRow() < 2 || !ids.length) return out;
  s.getRange(2, 1, s.getLastRow() - 1, s.getLastColumn()).getValues().forEach(function (r) { if (ids.indexOf(String(r[0])) >= 0) out[r[0]] = r.slice(3).join(''); });
  return out;
}


// =====================================================================
// ====== LAPORAN (grafik per pertanyaan) ======
// =====================================================================
var REPORT_SKIP = ['O1', 'Z2', 'Z3', 'PV', 'QC1', 'Z1', 'tipe_wilayah', 'jabodetabek', 'kategori_ditugaskan', 'A1', 'pengeluaran_per_kapita', 'profil_diperbarui', 'PR', 'S0B'];
function reportMeta_(v) {
  var meta = {}, c = v !== 'v1' && v !== 'v2' ? customById_(v) : null;
  DICTIONARY.forEach(function (d) { meta[d[0]] = { text: d[3], topic: d[2], opts: QOPTS[d[0]] || null }; });
  if (c) (c.schema.questions || []).forEach(function (q) {
    var o = (q.options || []).map(function (x) { return x.t; }).filter(String);
    if (q.type === 'scale') { o = []; var sc = q.scale || {}; for (var n = Number(sc.min == null ? 1 : sc.min); n <= Number(sc.max || 5); n++) o.push(String(n)); }
    meta[q.id] = { text: q.text, topic: c.name, opts: o.length ? o : null, type: q.type };
  });
  meta.provinsi = { text: 'Provinsi (otomatis dari kota)', topic: 'Profil' };
  meta.kelas_ekonomi = { text: 'Kelas ekonomi (otomatis: pengeluaran per kapita vs garis kemiskinan BPS)', topic: 'Profil', opts: SES_KELAS };
  meta.ses = { text: 'SES (otomatis dari pengeluaran per kapita)', topic: 'Profil', opts: SES_HURUF.slice().reverse() };
  meta.segmen_hp = { text: 'Segmen HP (otomatis dari merek & harga HP)', topic: 'Profil', opts: HP_SEGMEN };
  meta.generasi = { text: 'Generasi (otomatis dari tahun lahir)', topic: 'Profil', opts: GENERASI };
  meta.kategori_1 = { text: 'Kategori yang dibahas di modul belanja', topic: 'Belanja terakhir' };
  return meta;
}
/** Ringkasan semua pertanyaan satu survei, siap digambar sebagai grafik. opt: {status:'Valid'|'all', col, val} */
function adminReport(v, opt) { requireAdmin_(); return adminReportCore_(v, opt); }
function adminReportCore_(v, opt) {
  opt = opt || {};
  var all = inRange_(readAll_().filter(function (r) { return r._v === v; }), opt.range), g = timeRange_(opt.range);
  var rows = all.filter(function (r) { return opt.status === 'all' || r.status === 'Valid'; });
  var has = function (val, x) { return String(val == null ? '' : val).split(' | ').indexOf(String(x)) >= 0; };
  if (opt.col && opt.val) rows = rows.filter(function (r) { return has(r[opt.col], opt.val); });
  var s = sheet_(respTab_(v)), header = s && s.getLastColumn() ? s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0] : [];
  var meta = reportMeta_(v), out = [], groups = {}, filterable = [];
  var base = function (col) { return col.replace(/^L\d_/, ''); };
  header.forEach(function (col) {
    if (!col || META.indexOf(col) >= 0 || /_lainnya$/.test(col) || REPORT_SKIP.indexOf(base(col).split(': ')[0]) >= 0) return;
    var mx = col.match(/^(.+?): (.+)$/);
    if (mx) { var g = groups[mx[1]]; if (!g) { g = groups[mx[1]] = { id: mx[1], kind: 'matrix', rows: [] }; out.push(g); } g.rows.push({ label: mx[2], col: col }); return; }
    out.push({ id: col, kind: '?' });
  });
  var natural = function (a, b) { var na = parseFloat(String(a).replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.')), nb = parseFloat(String(b).replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.')); return (isNaN(na) || isNaN(nb)) ? 0 : na - nb; };
  var res = out.map(function (q) {
    var m = meta[base(q.id)] || {}, loop = /^L\d_/.test(q.id) ? ' (modul kategori)' : '';
    var gp = ctGroup_(q.id, m.topic, v !== 'v1' && v !== 'v2' && !/^(S\d|A\d|ses|kelas|wilayah|segmen_hp|generasi)/.test(base(q.id)));   // tahap: profil / kebiasaan / funnel (awareness, dll.)
    var item = { id: q.id, text: (m.text || q.id) + loop, topic: gp[0] + (gp[1] ? ' · ' + gp[1] : ''), total: rows.length };
    if (q.kind === 'matrix') {
      var colsSet = {};
      item.kind = 'matrix';
      item.rows = q.rows.map(function (rw) {
        var cnt = {}, n = 0;
        rows.forEach(function (r) { var val = r[rw.col]; if (val === '' || val == null) return; n++; String(val).split(' | ').forEach(function (x) { cnt[x] = (cnt[x] || 0) + 1; colsSet[x] = 1; }); });
        return { label: rw.label, n: n, counts: cnt };
      }).filter(function (r) { return r.n; });
      var order = (m.opts || []).filter(function (x) { return colsSet[x]; });
      Object.keys(colsSet).forEach(function (x) { if (order.indexOf(x) < 0) order.push(x); });
      item.cols = order; item.answered = item.rows.length ? Math.max.apply(null, item.rows.map(function (r) { return r.n; })) : 0;
      return item;
    }
    var vals = rows.map(function (r) { return r[q.id]; }).filter(function (x) { return x !== '' && x != null; });
    item.answered = vals.length; item.skipped = rows.length - vals.length;
    var multi = vals.some(function (x) { return String(x).indexOf(' | ') >= 0; }) || (m.type === 'multi');
    var nums = vals.filter(function (x) { return String(x).trim() !== '' && !isNaN(Number(x)); });
    var distinct = {}; vals.forEach(function (x) { distinct[x] = 1; }); var nd = Object.keys(distinct).length;
    var others = rows.map(function (r) { return r[q.id + '_lainnya']; }).filter(function (x) { return x; });
    if (others.length) item.others = others.slice(-15).reverse();
    if (!multi && vals.length && nums.length === vals.length && (nd > 12 || m.type === 'number') && !(m.opts)) {
      var a = nums.map(Number).sort(function (x, y) { return x - y; }), sum = a.reduce(function (p, x) { return p + x; }, 0);
      item.kind = 'number'; item.stats = { mean: Math.round(sum / a.length * 100) / 100, median: a[Math.floor(a.length / 2)], min: a[0], max: a[a.length - 1] };
      var lo = a[0], hi = a[a.length - 1], bins = 8, w = (hi - lo) / bins || 1, hist = [];
      for (var b = 0; b < bins; b++) hist.push([String(Math.round(lo + b * w)) + '–' + String(Math.round(lo + (b + 1) * w)), 0]);
      a.forEach(function (x) { hist[Math.min(bins - 1, Math.floor((x - lo) / w))][1]++; });
      item.items = hist; return item;
    }
    if (!multi && !m.opts && nd > 40 && nd / Math.max(1, vals.length) > 0.4) { item.kind = 'text'; item.samples = vals.slice(-40).reverse().map(String); return item; }
    var cnt = {};
    vals.forEach(function (x) { (multi ? String(x).split(' | ') : [String(x)]).forEach(function (y) { cnt[y] = (cnt[y] || 0) + 1; }); });
    var keys = Object.keys(cnt), ord = (m.opts || []).filter(function (x) { return cnt[x] != null; });
    var isScale = !multi && nums.length === vals.length && nd <= 12;
    keys.forEach(function (k) { if (ord.indexOf(k) < 0) ord.push(k); });
    if (!(m.opts && m.opts.length)) ord.sort(isScale ? natural : function (a, b) { return cnt[b] - cnt[a]; });
    item.kind = multi ? 'multi' : 'single';
    item.items = ord.map(function (k) { return [k, cnt[k]]; });
    if (isScale && nums.length) item.stats = { mean: Math.round(nums.reduce(function (p, x) { return p + Number(x); }, 0) / nums.length * 100) / 100 };
    if (!multi && ord.length >= 2 && ord.length <= 20) filterable.push({ col: q.id, text: item.text, values: ord });
    return item;
  }).filter(function (q) { return q.answered || (q.rows && q.rows.length); });
  var durs = rows.map(function (r) { return Number(r.durasi_detik) || 0; }).filter(Boolean).sort(function (a, b) { return a - b; });
  return { range: g ? g.label : 'Semua waktu', survey: (surveyList_().filter(function (x) { return x.v === v; })[0] || {}).name, total: rows.length, all: all.length,
    medianMin: durs.length ? Math.round(durs[Math.floor(durs.length / 2)] / 6) / 10 : 0, generatedAt: iso_(new Date()), questions: res, filterable: filterable };
}

// =====================================================================
// ====== DATABASE RESPONDEN (1 orang = 1 baris, gabungan semua survei) ======
// Kunci orang: nomor WA (bila ada), selain itu username IG.
// =====================================================================
var PEOPLE_PROFILE = ['S0', 'generasi', 'S1', 'S2', 'segmen_hp', 'A1', 'provinsi', 'A18', 'A19', 'kelas_ekonomi', 'ses', 'A7N', 'A4M', 'A4N', 'A4K', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A16'];
function personKey_(r) { var w = String(r.wa_normal || '').replace(/^'/, ''), g = String(r.ig_normal || ''); return w ? 'wa:' + w : g ? 'ig:' + g : ''; }
function peopleIndex_() {
  var rows = readAll_(), byKey = {}, igToKey = {}, names = {};
  surveyList_().forEach(function (s) { names[s.v] = s.name; });
  rows.forEach(function (r) { var w = String(r.wa_normal || '').replace(/^'/, ''), g = String(r.ig_normal || ''); if (w && g) igToKey[g] = 'wa:' + w; });
  rows.forEach(function (r) {
    var k = personKey_(r); if (!k) return;
    if (k.indexOf('ig:') === 0 && igToKey[k.slice(3)]) k = igToKey[k.slice(3)];   // satukan IG yang pernah tercatat dengan WA
    var p = byKey[k] || (byKey[k] = { key: k, ig: '', wa: '', rows: [] });
    p.rows.push(r);
    if (r.ig_normal) p.ig = '@' + r.ig_normal; if (r.wa_normal) p.wa = String(r.wa_normal).replace(/^'/, '');
  });
  Object.keys(byKey).forEach(function (k) {
    var p = byKey[k];
    p.rows.sort(function (a, b) { return new Date(a.timestamp) - new Date(b.timestamp); });
    p.profile = {}; PEOPLE_PROFILE.forEach(function (c) { p.rows.forEach(function (r) { if (r[c] !== '' && r[c] != null && !/^(Tidak valid|Diblokir)/.test(String(r.status))) p.profile[c] = String(r[c]); }); });
    p.surveys = p.rows.map(function (r) { return { v: r._v, name: names[r._v] || r._v, status: r.status, time: iso_(r.timestamp), sid: r.session_id }; });
    var last = p.rows[p.rows.length - 1];
    p.last = iso_(last.timestamp); p.first = iso_(p.rows[0].timestamp);
    p.valid = p.rows.filter(function (r) { return r.status === 'Valid'; }).length;
    var z1 = p.rows.filter(function (r) { return r.Z1; }).pop(); p.contact = z1 ? z1.Z1 === 'Ya, bersedia' : false;
  });
  return { people: byKey, names: names };
}
function answerCols_() {   // kolom jawaban pilihan (untuk saringan "jawaban di survei X")
  var out = [], meta = {};
  surveyList_().forEach(function (s) {
    var rep; try { rep = adminReportCore_(s.v, { status: 'all' }); } catch (e) { return; }
    rep.questions.forEach(function (q) { if ((q.kind === 'single' || q.kind === 'multi') && q.items && q.items.length >= 2 && q.items.length <= 40) out.push({ v: s.v, survey: s.name, col: q.id, text: q.text, values: q.items.map(function (x) { return x[0]; }) }); });
  });
  return out;
}
/** Daftar orang unik + saringan. f: {q, minSurveys, survey, contact, gender, age, prov, aCol:{v,col}, aVal} */
function adminPeople(f) {
  requireAdmin_(); f = f || {};
  var idx = peopleIndex_(), b = blokData_(), blk = {}, won = {}, w = sheet_(SH.WIN);
  b.v.forEach(function (r) { var st = r[b.c('status')]; if (/Diblokir|Suspend/.test(st)) { var ig = String(r[b.c('instagram')]).replace(/^@/, ''), wa = String(r[b.c('nomor_wa')]).replace(/^'/, ''); if (ig) blk['ig:' + ig] = st; if (wa) blk['wa:' + wa] = st; } });
  if (w && w.getLastRow() > 1) w.getRange(2, 1, w.getLastRow() - 1, WIN_COLS.length).getValues().forEach(function (r) { if (String(r[7]).indexOf('Gugur') !== 0) { var k = 'wa:' + String(r[4]).replace(/^'/, ''); won[k] = (won[k] || 0) + 1; } });
  var q = String(f.q || '').toLowerCase().trim(), has = function (val, x) { return String(val == null ? '' : val).split(' | ').indexOf(String(x)) >= 0; };
  var list = Object.keys(idx.people).map(function (k) { return idx.people[k]; }).filter(function (p) {
    if (q && (p.ig + ' ' + p.wa + ' ' + (p.profile.A1 || '') + ' ' + (p.profile.provinsi || '')).toLowerCase().indexOf(q) < 0) return false;
    if (f.minSurveys && p.surveys.length < Number(f.minSurveys)) return false;
    if (f.survey && !p.surveys.some(function (s) { return s.v === f.survey; })) return false;
    if (f.contact && !p.contact) return false;
    if (f.gender && p.profile.S2 !== f.gender) return false;
    if (f.age && p.profile.S1 !== f.age) return false;
    if (f.prov && p.profile.provinsi !== f.prov) return false;
    if (f.ses && p.profile.ses !== f.ses) return false;
    if (f.valid && !p.valid) return false;
    if (f.aCol && f.aVal && !p.rows.some(function (r) { return r._v === f.aCol.v && has(r[f.aCol.col], f.aVal); })) return false;
    return true;
  }).map(function (p) {
    var st = blk[p.key] || (p.ig ? blk['ig:' + p.ig.slice(1)] : '') || '';
    return { key: p.key, ig: p.ig, wa: p.wa, profile: p.profile, surveys: p.surveys.map(function (s) { return { v: s.v, name: s.name, status: s.status, time: s.time }; }), n: p.surveys.length, valid: p.valid, last: p.last, first: p.first, contact: p.contact, blok: st, wins: won[p.key] || 0 };
  }).sort(function (a, b) { return b.n - a.n || (b.last > a.last ? 1 : -1); });
  var all = Object.keys(idx.people).map(function (k) { return idx.people[k]; });
  var opts = function (c) { var o = {}; all.forEach(function (p) { if (p.profile[c]) o[p.profile[c]] = 1; }); return Object.keys(o).sort(); };
  return {
    total: all.length, multi: all.filter(function (p) { return p.surveys.length >= 2; }).length, contact: all.filter(function (p) { return p.contact; }).length,
    avg: all.length ? Math.round(all.reduce(function (s, p) { return s + p.surveys.length; }, 0) / all.length * 10) / 10 : 0,
    list: list.slice(0, 2000), count: list.length, surveys: surveyList_().map(function (s) { return { v: s.v, name: s.name }; }),
    options: { S1: opts('S1'), S2: opts('S2'), provinsi: opts('provinsi'), ses: SES_HURUF.slice().reverse() }, answerCols: f.withCols ? answerCols_() : null
  };
}
/** Semua jawaban satu orang, dikelompokkan per survei. */
function adminPerson(key) {
  requireAdmin_();
  var idx = peopleIndex_(), p = idx.people[key]; if (!p) throw new Error('Responden tidak ditemukan');
  var dm = dictMap_(), skip = { _tab: 1, _v: 1, _row: 1 }, hide = ['user_agent', 'device_fp', 'wa_normal', 'ig_normal', 'survei', 'varian', 'versi_kuesioner', 'kategori_ditugaskan', 'QC1', 'Z2', 'Z3', 'PV', 'O1'];
  return { key: key, ig: p.ig, wa: p.wa, profile: p.profile, contact: p.contact, first: p.first, last: p.last,
    surveys: p.rows.map(function (r) {
      var cu = r._v !== 'v1' && r._v !== 'v2' ? customById_(r._v) : null, dd = JSON.parse(JSON.stringify(dm));
      if (cu) (cu.schema.questions || []).forEach(function (x) { dd[x.id] = [x.id, '', '', x.text]; });
      var items = [];
      Object.keys(r).forEach(function (k) {
        if (skip[k] || hide.indexOf(k) >= 0 || r[k] === '' || r[k] == null || META.indexOf(k) >= 0 && ['durasi_detik', 'sumber', 'profil_dari_survei_sebelumnya', 'kategori_1'].indexOf(k) < 0) return;
        var base = k.replace(/^L\d_/, '').replace(/(_lainnya|: .*)$/, ''), d = dd[base];
        items.push({ key: k, q: d ? d[3] : '', val: String(iso_(r[k])) });
      });
      return { v: r._v, name: idx.names[r._v] || r._v, status: r.status, time: iso_(r.timestamp), sid: r.session_id, items: items };
    }) };
}
/** CSV lebar: 1 orang = 1 baris; kolom jawaban diberi awalan ID survei (mis. v1:S4). */
function adminPeopleExport(f) {
  requireAdmin_();
  var keys = (adminPeople(f).list || []).map(function (x) { return x.key; }), idx = peopleIndex_(), cols = [], seen = {};
  keys.forEach(function (k) { idx.people[k].rows.forEach(function (r) { Object.keys(r).forEach(function (c) { if (c.charAt(0) === '_' || META.indexOf(c) >= 0 || PEOPLE_PROFILE.indexOf(c) >= 0 || /^(Z2|Z3|PV|QC1)$/.test(c)) return; var h = r._v + ':' + c; if (!seen[h]) { seen[h] = 1; cols.push([r._v, c, h]); } }); }); });
  var head = ['instagram', 'whatsapp', 'jumlah_survei', 'jumlah_valid', 'pertama', 'terakhir', 'bersedia_dihubungi', 'survei_diikuti'].concat(PEOPLE_PROFILE).concat(cols.map(function (c) { return c[2]; }));
  var rows = keys.map(function (k) {
    var p = idx.people[k], last = {};
    p.rows.forEach(function (r) { last[r._v] = r; });
    return [p.ig, p.wa, p.rows.length, p.valid, p.first, p.last, p.contact ? 'Ya' : 'Tidak', p.rows.map(function (r) { return idx.names[r._v] || r._v; }).join(' | ')]
      .concat(PEOPLE_PROFILE.map(function (c) { return p.profile[c] || ''; }))
      .concat(cols.map(function (c) { var r = last[c[0]]; return r && r[c[1]] != null ? String(iso_(r[c[1]])) : ''; }));
  });
  return { cols: head, rows: rows };
}
