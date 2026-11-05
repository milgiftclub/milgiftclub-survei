// Uji verifikasi DM Instagram: penukaran pertama tertahan + kode; admin cocokkan -> lanjut; tolak -> kupon & stok kembali; setelah terverifikasi tidak ditanya lagi
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Tidak', S1: '25-34 tahun', S2: 'Wanita' };
ctx.adminSaveSettings({ KUPON_V1: 3, KUPON_V2: 3 }); ctx.SET_MEMO_ = null;
for (const [ig, wa] of [['@ani', '081211110001'], ['@budi', '081299990002']]) { ctx.submitResponse({ sid: ig + '1', variant: 'v1', answers: Object.assign({}, base, { Z2: ig, Z3: wa }) }); ctx.submitResponse({ sid: ig + '2', variant: 'v2', answers: Object.assign({}, base, { Z2: ig, Z3: wa }) }); }
const kk = ctx.adminKatalog().katalog; ctx.adminKatalogSave(kk.map((x, i) => Object.assign({}, x, i === 0 ? { kupon: 2 } : {}))); const it = ctx.adminKatalog().katalog[0], st0 = it.stok;
const P = { nama: 'Ani Lestari', hp: '081211110001', alamat: 'Jl. Merdeka No. 10, RT 01/RW 02, Babakan', kota: 'Kota Bandung', kodepos: '40115' };
let info = ctx.penerimaInfo('@ani', '0001'); console.log('perlu verifikasi:', info.perluVerifikasi); assert(info.perluVerifikasi);
let r = ctx.tukarKupon('@ani', '0001', it.id, P); console.log('tukar 1:', JSON.stringify(r.verifikasi)); assert(r.ok && r.verifikasi && /^MGC-\d{4}$/.test(r.verifikasi.kode) && /ig\.me\/m\/milgiftclub/.test(r.verifikasi.dm));
const r2 = ctx.tukarKupon('@ani', '0001', it.id, 'tersimpan'); assert.strictEqual(r2.verifikasi.kode, r.verifikasi.kode, 'kode sama');
let A = ctx.adminKatalog(); console.log('status:', A.tukar.filter(x => x.instagram === '@ani').map(x => x.status).join(', ')); assert(A.tukar.filter(x => x.instagram === '@ani').every(x => x.status === 'Menunggu verifikasi'));
let h = ctx.hubList('@ani'); console.log('riwayat hub kode:', h.tukar.map(t => t.verKode).join(',')); assert(h.tukar.every(t => t.verKode === r.verifikasi.kode)); assert.strictEqual(h.saldo.sisa, 2, 'kupon tertahan terpakai');
const V = ctx.adminVerList(); console.log('daftar verifikasi:', JSON.stringify(V.list.map(v => [v.ig, v.kode, v.status, v.hadiah]))); assert.strictEqual(V.list.length, 1);
let d = ctx.adminVerSet(V.list[0].row, true, ''); A = d.katalog; console.log('setelah cocok:', A.tukar.filter(x => x.instagram === '@ani').map(x => x.status + '/' + x.batas).join(', ')); assert(A.tukar.filter(x => x.instagram === '@ani').every(x => x.status === 'Menunggu' && x.batas));
r = ctx.tukarKupon('@ani', '0001', it.id, 'tersimpan'); console.log('tukar ke-3 (terverifikasi):', r.ok, r.verifikasi); assert(r.ok && !r.verifikasi);
assert.strictEqual(ctx.penerimaInfo('@ani', '0001').perluVerifikasi, false);
// tolak
r = ctx.tukarKupon('@budi', '0002', it.id, Object.assign({}, P, { nama: 'Budi', hp: '081299990002' })); assert(r.verifikasi);
const vb = ctx.adminVerList().list.find(v => v.ig === '@budi'); d = ctx.adminVerSet(vb.row, false, 'akun pengirim berbeda');
const tb = d.katalog.tukar.find(x => x.instagram === '@budi'); console.log('budi ditolak:', tb.status, '|', tb.catatan); assert.strictEqual(tb.status, 'Ditolak');
h = ctx.hubList('@budi'); assert.strictEqual(h.saldo.sisa, 6, 'kupon kembali'); console.log('stok:', st0, '->', ctx.adminKatalog().katalog[0].stok, '(3 terpakai ani)'); assert.strictEqual(ctx.adminKatalog().katalog[0].stok, st0 - 3);
r = ctx.tukarKupon('@budi', '0002', it.id, 'tersimpan'); console.log('budi coba lagi -> kode baru:', r.verifikasi.kode, '!=', vb.kode); assert(r.verifikasi);
console.log('OK ver_test');
