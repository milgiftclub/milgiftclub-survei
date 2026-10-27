# Jenis produk per kategori (pertanyaan PT1) dan rentang harga per item (PT2).
L = 'Lainnya, sebutkan: ___'

PRODUCTS = {
 'Fashion pria': ['Kaos', 'Kemeja kasual', 'Kemeja kerja / formal', 'Polo shirt', 'Celana panjang (chino / bahan)', 'Celana jeans', 'Celana pendek', 'Jaket / hoodie / outerwear', 'Pakaian olahraga', 'Pakaian dalam / kaos kaki', L],
 'Fashion wanita': ['Kaos / atasan kasual', 'Blouse / kemeja kerja', 'Dress', 'Rok', 'Celana panjang', 'Celana jeans', 'Cardigan / blazer / outerwear', 'Setelan (one set)', 'Pakaian tidur', 'Pakaian dalam', 'Pakaian olahraga', L],
 'Fashion muslim / modest': ['Kerudung / hijab segi empat', 'Pashmina', 'Hijab instan / bergo', 'Inner / ciput', 'Gamis', 'Abaya', 'Tunik / atasan muslim', 'Setelan muslim', 'Mukena', 'Baju koko', 'Sarung', L],
 'Fashion anak & bayi': ['Baju bayi (jumper / romper)', 'Kaos / atasan anak', 'Dress anak', 'Celana anak', 'Setelan anak', 'Baju tidur anak', 'Baju muslim anak', L],
 'Sepatu & sandal': ['Sneakers', 'Sepatu olahraga / lari', 'Sepatu formal / kerja', 'Flat shoes / loafers', 'Heels', 'Sandal', 'Sandal jepit / slop', 'Sepatu anak', L],
 'Tas & aksesori': ['Tas selempang / sling bag', 'Tote bag', 'Tas tangan / handbag', 'Ransel', 'Dompet', 'Jam tangan', 'Kacamata', 'Topi', 'Ikat pinggang', 'Aksesori rambut', L],
 'Perhiasan': ['Kalung', 'Gelang', 'Cincin', 'Anting', 'Bros', L],
 'Skincare': ['Facial wash', 'Toner', 'Serum / essence', 'Moisturizer', 'Sunscreen', 'Masker wajah', 'Obat jerawat / spot treatment', 'Paket skincare', L],
 'Makeup': ['Foundation / cushion', 'Bedak', 'Lipstik / lip tint', 'Maskara / eyeliner', 'Eyeshadow', 'Blush on', 'Produk alis', 'Primer / setting spray', L],
 'Body care & bath': ['Sabun mandi / body wash', 'Body lotion', 'Deodoran', 'Body scrub', 'Hand cream', L],
 'Hair care': ['Sampo', 'Kondisioner', 'Hair mask / serum / vitamin rambut', 'Pewarna rambut', 'Alat styling (catok, hair dryer)', L],
 'Parfum': ['Parfum (EDP)', 'Eau de toilette / body mist', 'Parfum isi ulang / decant', L],
 'Grooming pria': ['Pomade / styling rambut', 'Alat cukur', 'Facial wash pria', 'Perawatan jenggot', L],
 'Suplemen & vitamin': ['Vitamin C / daya tahan tubuh', 'Multivitamin', 'Kolagen / suplemen kecantikan', 'Protein / whey', 'Herbal / jamu', L],
 'Alat & produk kesehatan': ['Masker medis', 'Termometer / tensimeter', 'Obat bebas', 'Alat tes (kehamilan, gula darah)', 'Perlengkapan P3K', L],
 'Camilan & makanan ringan': ['Keripik', 'Kue / biskuit', 'Cokelat / permen', 'Makanan instan', 'Frozen food', L],
 'Oleh-oleh & makanan khas daerah': ['Kue khas daerah', 'Sambal / bumbu khas', 'Keripik / kerupuk khas', 'Kopi / teh daerah', L],
 'Minuman': ['Kopi', 'Teh', 'Susu', 'Minuman kemasan siap minum', 'Minuman serbuk / sachet', L],
 'Bahan makanan & groceries': ['Beras', 'Minyak goreng', 'Bumbu dapur', 'Telur / daging / sayur segar', 'Mi instan', L],
 'Produk kebersihan rumah': ['Deterjen', 'Pembersih lantai', 'Sabun cuci piring', 'Tisu', 'Pewangi pakaian', L],
 'Perlengkapan bayi': ['Popok', 'Susu formula', 'Botol susu / dot', 'Tisu basah', 'Perlengkapan mandi bayi', L],
 'Mainan anak': ['Mainan edukasi', 'Boneka', 'Mainan rakitan (balok susun, dll.)', 'Kendaraan mainan', 'Mainan outdoor', L],
 'Home decor': ['Lampu hias', 'Pajangan / dekorasi dinding', 'Tanaman artifisial', 'Karpet / keset', 'Gorden', L],
 'Furnitur': ['Rak / lemari', 'Meja', 'Kursi', 'Kasur', 'Sofa', L],
 'Peralatan dapur & makan': ['Panci / wajan', 'Pisau / talenan', 'Piring / mangkuk / gelas', 'Wadah penyimpanan', 'Botol minum / tumbler', L],
 'Tekstil rumah': ['Sprei / bed cover', 'Bantal / guling', 'Handuk', 'Selimut', L],
 'HP & aksesori': ['HP / smartphone', 'Casing / pelindung layar', 'Charger / kabel', 'Power bank', L],
 'Laptop & komputer': ['Laptop', 'Mouse / keyboard', 'Monitor', 'Komponen / penyimpanan (SSD, RAM)', L],
 'Audio, wearable & gadget': ['Earphone / TWS', 'Headphone', 'Speaker', 'Smartwatch', L],
 'Elektronik rumah tangga': ['Kipas angin', 'Rice cooker', 'Blender / mixer', 'Setrika', 'Vacuum cleaner', L],
 'Olahraga & outdoor': ['Peralatan gym / fitness', 'Raket / bola', 'Perlengkapan sepeda', 'Perlengkapan camping / hiking', L],
 'Hobi & koleksi': ['Alat lukis / kerajinan', 'Action figure / barang koleksi', 'Alat musik', L],
 'Buku & alat tulis': ['Buku', 'Alat tulis', 'Buku catatan / planner', L],
 'Gaming': ['Voucher / top up game', 'Aksesori gaming', 'Konsol', 'Game (fisik / digital)', L],
 'Perlengkapan travel': ['Koper', 'Tas travel', 'Organizer / pouch', 'Aksesori perjalanan', L],
 'Bunga & tanaman': ['Buket bunga', 'Tanaman hidup', 'Bibit / benih', 'Pot / media tanam', L],
 'Hampers & parsel': ['Hampers makanan', 'Hampers kecantikan', 'Parsel hari raya', L],
 'Kado personalisasi': ['Mug / tumbler custom', 'Pakaian custom', 'Bingkai / foto custom', 'Aksesori ukir nama', L],
 'Hewan peliharaan': ['Makanan hewan', 'Pasir / kebersihan', 'Aksesori / mainan hewan', 'Vitamin / obat hewan', L],
 'Otomotif': ['Aksesori motor', 'Aksesori mobil', 'Oli / perawatan', 'Helm', L],
}

def rp(n): return 'Rp' + f'{n:,}'.replace(',', '.')
PRICE_BANDS = ['Di bawah ' + rp(10000), rp(10000) + ' – ' + rp(50000)]
lo = 50000
while lo < 500000:
    PRICE_BANDS.append(rp(lo + 1) + ' – ' + rp(lo + 25000)); lo += 25000
PRICE_BANDS += [rp(500001) + ' – ' + rp(750000), rp(750001) + ' – ' + rp(1000000), rp(1000001) + ' – ' + rp(2000000),
                rp(2000001) + ' – ' + rp(5000000), 'Di atas ' + rp(5000000)]
