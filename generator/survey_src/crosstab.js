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
