// Uji server: penggabungan profil lintas survei, penanda 6 bulan, dan turunan life stage (A4).
const { makeEnv } = require('./gsmock');
const assert = require('assert');
const { ctx } = makeEnv(); ctx.setup();
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', Z2: '@rina', Z3: '081277778888', QC1: 'Biru', Z1: 'Ya, bersedia' };
const sub = (sid, variant, a, extra) => ctx.submitResponse(Object.assign({ sid, variant, answers: Object.assign({}, base, a) }, extra || {}));
// survei 1: profil lama (format lama, tanpa tahun lahir / status)
sub('s1', 'v1', { S1: '25-34 tahun', S2: 'Wanita', S3: ['Tidak satu pun dari pilihan di atas'], A1: 'Kota Bandung', A4: 'Bekerja, belum menikah', A5: 'Karyawan swasta', A6: 'Sarjana (S1 / D4)', A7: 'Rp5.000.001 - Rp7.500.000' });
let r = ctx.verifyProfile('@rina', '8888');
assert(r.ok && r.profile.A5 === 'Karyawan swasta' && !r.profile.S0, 'profil lama terbaca');
assert(r.stale === false, 'baru diisi -> belum kedaluwarsa');
// survei 2 (prefilled, menjawab pertanyaan profil yang baru)
sub('s2', 'v2', { S1: '25-34 tahun', S2: 'Wanita', A1: 'Kota Bandung', A5: 'Karyawan swasta', S0: '1994', A4M: 'Menikah', A4N: '2 anak', A4K: ['2-5 tahun (balita)', '6-12 tahun (usia SD)'], A10: ['Instagram', 'TikTok'], A15: 'Kadang-kadang' }, { prefilled: true });
r = ctx.verifyProfile('@rina', '8888');
assert.strictEqual(r.profile.S0, '1994');
assert.strictEqual(JSON.stringify(r.profile.A4K), JSON.stringify(['2-5 tahun (balita)', '6-12 tahun (usia SD)']));
assert.strictEqual(JSON.stringify(r.profile.A10), JSON.stringify(['Instagram', 'TikTok']));
assert.strictEqual(r.profile.A4, 'Menikah, memiliki anak usia di bawah 12 tahun', 'A4 diturunkan');
assert.strictEqual(r.profile.A7, 'Rp5.000.001 - Rp7.500.000', 'kolom lama tetap terbawa');
// kedaluwarsa: mundurkan tanggal profil 7 bulan
const rows = ctx.readAll_().filter(x => x.ig_normal === 'rina');
const old = new Date(Date.now() - 210 * 864e5);
['Jawaban - Semua Kategori', 'Jawaban - Fashion Tas Hijab'].forEach(n => {
  const s = ctx.ss_().getSheetByName(n), h = s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0];
  const ct = h.indexOf('timestamp') + 1, cp = h.indexOf('profil_diperbarui') + 1;
  for (let i = 2; i <= s.getLastRow(); i++) { s.getRange(i, ct).setValue(old); if (cp) s.getRange(i, cp).setValue(s.getRange(i, cp).getValue() ? old : ''); }
});
if (ctx.CacheService) try { ctx.CacheService.getScriptCache().removeAll && ctx.CacheService.getScriptCache().removeAll([]); } catch (e) {}
r = ctx.verifyProfile('@rina', '8888');
assert.strictEqual(r.stale, true, 'profil > 6 bulan -> stale');
console.log('OK profile_test', rows.length, r.updated);
// SES dari pengeluaran per kapita
const S = (A7, A7N) => ctx.deriveSes_({ A7, A7N });
let x = S('Rp5.000.001 - Rp7.500.000', '4 orang'); assert.strictEqual(x.kelas, 'Menuju kelas menengah'); assert.strictEqual(x.perKapita, 1562500);
x = S('Rp10.000.001 - Rp15.000.000', '2 orang'); assert.strictEqual(x.kelas, 'Kelas menengah'); assert(/^B/.test(x.ses), x.ses);
x = S('Di atas Rp40.000.000', '1 orang (hanya saya)'); assert.strictEqual(x.kelas, 'Kelas atas'); assert(/^A/.test(x.ses));
x = S('Di bawah Rp2.000.000', '5 orang'); assert.strictEqual(x.kelas, 'Miskin'); assert.strictEqual(S('Rp3.000.001 - Rp5.000.000', '5 orang').kelas, 'Rentan miskin'); assert.strictEqual(S('', '2 orang'), null);
sub('s3', 'v1', { Z2: '@sesa', Z3: '081233334444', S1: '25-34 tahun', S2: 'Pria', A18: 'Kos / kamar sewa', A7N: '1 orang (hanya saya)', A7: 'Rp3.000.001 - Rp5.000.000' });
const row = ctx.readAll_().find(r => r.ig_normal === 'sesa');
assert.strictEqual(row.A19, 'Sewa / kontrak (bulanan atau tahunan)'); assert.strictEqual(row.kelas_ekonomi, 'Kelas menengah'); assert(/^C1/.test(row.ses), row.ses);
console.log('OK ses', row.pengeluaran_per_kapita, row.ses);
