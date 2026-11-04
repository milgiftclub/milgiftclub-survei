// Uji: data penerima tersimpan, kupon hangus 6 bulan (FIFO), batas kirim 10 hari kerja, link konten tag -> bonus kupon, rekap saldo
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Tidak', S1: '25-34 tahun', S2: 'Wanita' };
ctx.adminSaveSettings({ KUPON_V1: 3, KUPON_V2: 2 }); ctx.SET_MEMO_ = null;
ctx.submitResponse({ sid: 'b1', variant: 'v1', answers: Object.assign({}, base, { Z2: '@budi', Z3: '081299990011' }) });
ctx.submitResponse({ sid: 'b2', variant: 'v2', answers: Object.assign({}, base, { Z2: '@budi', Z3: '081299990011' }) });
// jawaban v1 dibuat "8 bulan lalu" -> 3 kupon hangus
const T1 = sheets['Jawaban - Semua Kategori']; const old = new Date(Date.now() - 240 * 864e5); T1.d[T1.d.length - 1][0] = old;
ctx.MEMO_ = null;
let h = ctx.hubList('@budi'); console.log('saldo awal:', JSON.stringify(h.saldo)); assert.strictEqual(h.saldo.hangus, 3); assert.strictEqual(h.saldo.sisa, 2); assert(h.saldo.segera && h.saldo.segera.n === 2);
// ledger FIFO murni
const L = ctx.kuponLedger_([{ ts: 0, n: 3 }, { ts: Date.now() - 864e5, n: 2 }], [{ ts: Date.now() - 1000, n: 1 }]); console.log('ledger:', JSON.stringify(L)); assert.strictEqual(L.hangus, 3); assert.strictEqual(L.sisa, 1);
const L2 = ctx.kuponLedger_([{ ts: Date.now() - 200 * 864e5, n: 3 }, { ts: Date.now() - 864e5, n: 2 }], [{ ts: Date.now() - 190 * 864e5, n: 2 }]); console.log('ledger2:', JSON.stringify(L2)); assert.strictEqual(L2.hangus, 1); assert.strictEqual(L2.sisa, 2);
// penerimaInfo
let pi = ctx.penerimaInfo('@budi', '0000'); assert.strictEqual(pi.ok, false);
pi = ctx.penerimaInfo('@budi', '0011'); console.log('info:', JSON.stringify(pi)); assert.strictEqual(pi.tersimpan, null);
const k = ctx.adminKatalog().katalog; ctx.adminKatalogSave(k.map((x, i) => Object.assign({}, x, i === 0 ? { kupon: 1 } : {})));
const it = ctx.adminKatalog().katalog[0];
let r = ctx.tukarKupon('@budi', '0011', it.id, { nama: 'B', hp: '0812', alamat: 'x', kota: 'y', kodepos: '1' }); console.log('validasi:', r.msg); assert.strictEqual(r.ok, false);
r = ctx.tukarKupon('@budi', '0011', it.id, { nama: 'Budi Santoso', hp: '0812-9999-0011', alamat: 'Jl. Dago No. 5, RT 02/RW 04, Lebakgede, Coblong', kota: 'Kota Bandung', kodepos: '40132' });
console.log('tukar 1:', JSON.stringify(r)); assert.strictEqual(r.ok, true); assert.strictEqual(r.sisa, 1);
pi = ctx.penerimaInfo('@budi', '0011'); console.log('tersimpan:', JSON.stringify(pi.tersimpan)); assert(pi.tersimpan && /^Bud/.test(pi.tersimpan.nama) && pi.tersimpan.alamat.indexOf('Coblong') < 0);
r = ctx.tukarKupon('@budi', '0011', it.id, 'tersimpan'); console.log('tukar 2 (data tersimpan):', r.ok, r.sisa); assert.strictEqual(r.ok, true); assert.strictEqual(r.sisa, 0);
r = ctx.tukarKupon('@budi', '0011', it.id, 'tersimpan'); assert.strictEqual(r.ok, false); console.log('habis:', r.msg);
const P = sheets['Data Penerima'].d; console.log('Data Penerima baris:', P.length - 1, P[1].slice(0, 7).join(' | ')); assert.strictEqual(P.length, 2);
// batas kirim = 10 hari kerja (tidak jatuh di Sabtu/Minggu)
const A = ctx.adminKatalog(); const t0 = A.tukar[0]; console.log('batas kirim:', t0.batas, '| penerima:', t0.nama_penerima, t0.hp_penerima, t0.kota, t0.kode_pos); const bd = new Date(sheets['Penukaran Hadiah'].d[1][ctx.TUKAR_COLS.indexOf('batas_kirim')]); assert([0, 6].indexOf(new Date(bd.getTime() + 7 * 3600e3).getUTCDay()) < 0);
const span = (bd - new Date(sheets['Penukaran Hadiah'].d[1][0])) / 864e5; assert(span >= 12 && span <= 16, 'rentang ' + span);
// kirim -> konten tag -> bonus
ctx.adminTukarStatus(t0._row, 'Dikirim', '', 'JNE123');
r = ctx.kirimTagLink('@budi', '0011', t0.id_penukaran, 'bukan link'); assert.strictEqual(r.ok, false);
r = ctx.kirimTagLink('@budi', '0011', t0.id_penukaran, 'https://www.instagram.com/p/ABC123/'); assert.strictEqual(r.ok, true);
let row = ctx.adminKatalog().tukar.find(x => x.id_penukaran === t0.id_penukaran); console.log('setelah kirim link:', row.status, row.no_resi, row.tag_status, row.tag_link);
assert.strictEqual(row.tag_status, 'Menunggu cek'); assert.strictEqual(row.no_resi, 'JNE123');
ctx.adminTukarTag(row._row, true, ''); h = ctx.hubList('@budi'); console.log('saldo setelah bonus:', JSON.stringify(h.saldo)); assert.strictEqual(h.saldo.sisa, 1); assert.strictEqual(h.saldo.bonus, 1);
console.log('riwayat hub:', JSON.stringify(h.tukar.map(t => [t.hadiah, t.status, t.batas, t.resi, t.tagStatus, t.bonus])));
const rk = ctx.adminKuponRekap(); console.log('rekap:', JSON.stringify(rk.rows)); assert.strictEqual(rk.rows[0].sisa, 1); assert.strictEqual(rk.rows[0].hangus, 3);
assert(sheets['Saldo Kupon'] && sheets['Saldo Kupon'].d.length === 2);
console.log('OK kupon_tukar2_test');
