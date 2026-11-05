// Uji keamanan API publik: kolom asing ditolak, rumus Sheets dinetralkan, tebakan 4 digit WA dibatasi, resi tersembunyi tanpa verifikasi, tanda kecurangan penukaran
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = '';
const api = (fn, args) => JSON.parse(ctx.webApi(fn, args));
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Tidak', S1: '25-34 tahun', S2: 'Wanita' };
// 1. kolom asing & rumus
let r = api('submitResponse', [{ sid: 'x1', variant: 'v1', answers: Object.assign({}, base, { Z2: '@ani', Z3: '081211110001', HACK_KOLOM: 'isi', 'A1': '=IMPORTXML("http://evil.test","//a")', 'B2': '+cmd' }), src: '=HYPERLINK("x")', ua: '@SUM(1)' }]);
const T = sheets['Jawaban - Semua Kategori'], H = T.d[0], row = T.d[1];
console.log('kolom HACK_KOLOM ada?', H.indexOf('HACK_KOLOM') >= 0, '| A1 =', row[H.indexOf('A1')], '| sumber =', row[H.indexOf('sumber')], '| ua =', row[H.indexOf('user_agent')]);
assert(H.indexOf('HACK_KOLOM') < 0); assert(/^'=/.test(row[H.indexOf('A1')])); assert(/^'=/.test(row[H.indexOf('sumber')])); assert(/^'@/.test(row[H.indexOf('user_agent')]));
// 2. tidak ada API publik untuk mengubah kupon / fungsi admin
r = api('adminKatalogStok', ['H001', 999]); console.log('panggil fungsi admin lewat API publik:', r.ok, r.error); assert.strictEqual(r.ok, false);
assert.throws(() => ctx.adminKatalogStok('H001', 999), /Akses ditolak/); assert.throws(() => ctx.adminTukarTag(2, true, ''), /Akses ditolak/); console.log('fungsi admin tanpa akun @mildigital.id: ditolak');
// 3. brute force 4 digit
ctx.submitResponse({ sid: 'b1', variant: 'v2', answers: Object.assign({}, base, { Z2: '@ani', Z3: '081211110001' }) });
let hits = 0; for (let i = 0; i < 8; i++) { r = api('penerimaInfo', ['@ani', String(1000 + i)]); if (/Terlalu banyak/.test(r.data.msg || '')) hits++; }
r = api('penerimaInfo', ['@ani', '0001']); console.log('setelah 8x salah, kode benar pun ditolak:', r.data.ok === false, '|', r.data.msg, '| terkunci di percobaan ke-', 8 - hits + 1);
assert.strictEqual(r.data.ok, false); assert(/Terlalu banyak/.test(r.data.msg));
r = api('verifyProfile', ['@ani', '0001']); console.log('profil lama juga terkunci:', JSON.stringify(r.data)); assert.strictEqual(r.data.ok, false);
// 4. resi tersembunyi tanpa verifikasi
ctx.CacheService.getScriptCache().remove('gagal4:ani');
global.__viewer = 'robert@mildigital.id';
const kat = ctx.adminKatalog().katalog; ctx.adminKatalogSave(kat.map((x, i) => Object.assign({}, x, i === 0 ? { kupon: 1 } : {})));
const P = { nama: 'Ani Lestari', hp: '081211110001', alamat: 'Jl. Merdeka No. 10, RT 01/RW 02, Babakan', kota: 'Kota Bandung', kodepos: '40115' };
r = ctx.tukarKupon('@ani', '0001', ctx.adminKatalog().katalog[0].id, P); assert(r.ok);
const t0 = ctx.adminKatalog().tukar[0]; ctx.adminTukarStatus(t0._row, 'Dikirim', '', null); ctx.adminTukarResi(t0._row, 'JX999888777', 'jnt', null);
global.__viewer = '';
const h = api('hubList', ['@ani']).data; console.log('hubList publik -> resi:', JSON.stringify(h.tukar[0].resi), 'adaResi:', h.tukar[0].adaResi, 'lacak:', JSON.stringify(h.tukar[0].kurir.lacak)); assert.strictEqual(h.tukar[0].resi, ''); assert(h.tukar[0].adaResi);
r = api('tukarSaya', ['@ani', '0001']).data; console.log('setelah verifikasi -> resi:', r.tukar[0].resi); assert.strictEqual(r.tukar[0].resi, 'JX999888777');
// 5. rumus di data penerima & tanda kecurangan
ctx.submitResponse({ sid: 'c1', variant: 'v1', answers: Object.assign({}, base, { Z2: '@ani2', Z3: '081299990002' }) });
r = ctx.tukarKupon('@ani2', '0002', ctx.katalog_()[0].id, Object.assign({}, P, { nama: '=HYPERLINK("http://evil")' })); assert(r.ok, r.msg);
global.__viewer = 'robert@mildigital.id';
const PH = sheets['Penukaran Hadiah'].d, nm = PH[2][ctx.TUKAR_COLS.indexOf('nama_penerima')]; console.log('nama penerima tersimpan:', nm); assert(/^'=/.test(nm));
const t2 = ctx.adminKatalog().tukar.find(x => x.instagram === '@ani2'); console.log('tanda cek:', JSON.stringify(t2.cek)); assert(t2.cek.some(x => /No\. HP/.test(x)) && t2.cek.some(x => /Alamat/.test(x)));
console.log('OK security_test');
