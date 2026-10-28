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
  /** Insight panel: sebaran jawaban anggota (seg[i] = true) vs semua responden, per kelompok pertanyaan. */
  panelInsight: function (cd, seg, critSrc) {
    var nSeg = 0; for (var s0 = 0; s0 < seg.length; s0++) if (seg[s0]) nSeg++;
    var groups = [], gi = {}, top = [];
    cd.qs.forEach(function (q, qi) {
      var nc = q.cats.length, cs = [], ca = [], bs = 0, ba = 0, k, ri, a, j;
      for (k = 0; k < nc; k++) { cs.push(0); ca.push(0); }
      for (ri = 0; ri < cd.data.length; ri++) { a = cd.data[ri][qi]; if (!a || !a.length) continue; ba++; if (seg[ri]) bs++; for (j = 0; j < a.length; j++) { ca[a[j]]++; if (seg[ri]) cs[a[j]]++; } }
      if (!bs) return;
      var isCrit = !!critSrc[q.id.replace(/^[^/]*\//, '').replace(/^L\d_/, '').split(': ')[0]];
      var items = q.cats.map(function (cat, x) {
        var pS = cs[x] / bs, pA = ca[x] / ba, nR = ba - bs, pR = nR ? (ca[x] - cs[x]) / nR : 0, pp = ca[x] / ba;
        var se = Math.sqrt(pp * (1 - pp) * (1 / bs + 1 / Math.max(1, nR))), z = se > 0 && nR > 0 ? (pS - pR) / se : 0;
        return { cat: cat, n: cs[x], pSeg: Math.round(pS * 1000) / 10, pAll: Math.round(pA * 1000) / 10, diff: Math.round((pS - pA) * 1000) / 10, sig: Math.abs(z) >= 1.96 && bs >= 10 };
      }).filter(function (it) { return it.n > 0 || it.pAll >= 5; });
      items.sort(function (a, b) { return b.pSeg - a.pSeg; });
      var it = { id: q.id, label: q.survei ? q.text.replace(' (' + q.survei + ')', '') : q.text, survei: q.survei || '', full: q.full, multi: q.multi, base: bs, kriteria: isCrit, items: items.slice(0, 6), more: Math.max(0, items.length - 6) };
      if (!isCrit) items.forEach(function (c) { if (c.sig && Math.abs(c.diff) >= 10 && (c.pSeg >= 10 || c.pAll >= 10)) top.push({ label: q.text, group: q.group, cat: c.cat, pSeg: c.pSeg, pAll: c.pAll, diff: c.diff }); });
      if (gi[q.group] == null) { gi[q.group] = groups.length; groups.push({ name: q.group, qs: [] }); }
      groups[gi[q.group]].qs.push(it);
    });
    top.sort(function (a, b) { return Math.abs(b.diff) - Math.abs(a.diff); });
    var seen = {}; top = top.filter(function (t) { if (seen[t.label]) return false; seen[t.label] = 1; return true; }).slice(0, 8);
    return { nSeg: nSeg, nAll: cd.meta.n, groups: groups, top: top };
  },
  /** p-value uji chi-square (fungsi gamma tak lengkap teregularisasi). */
  chiP: function (x, df) {
    if (x <= 0 || df <= 0) return 1;
    var a = df / 2, xx = x / 2, gln = function (z) { var c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5], y = z, t = z + 5.5; t -= (z + 0.5) * Math.log(t); var s = 1.000000000190015; for (var j = 0; j < 6; j++) s += c[j] / ++y; return -t + Math.log(2.5066282746310005 * s / z); };
    if (xx < a + 1) { var ap = a, sum = 1 / a, del = sum; for (var n = 0; n < 300; n++) { ap++; del *= xx / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-10) break; } return Math.max(0, 1 - sum * Math.exp(-xx + a * Math.log(xx) - gln(a))); }
    var b = xx + 1 - a, cc = 1e300, d = 1 / b, h = d;
    for (var i = 1; i < 300; i++) { var an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; cc = b + an / cc; if (Math.abs(cc) < 1e-300) cc = 1e-300; d = 1 / d; var dl = d * cc; h *= dl; if (Math.abs(dl - 1) < 1e-10) break; }
    return Math.min(1, Math.exp(-xx + a * Math.log(xx) - gln(a)) * h);
  },
  /** Kekuatan hubungan dua pertanyaan (Cramér's V + chi-square). Kelompok banner kecil (< minBase) diabaikan. */
  assoc: function (qs, data, ti, bi, o) {
    o = o || {}; var minBase = o.minBase || 30, R = o.rows ? o.rows.map(function (i) { return data[i]; }) : data;
    var t = qs[ti], b = qs[bi], nb = b.cats.length, nt = t.cats.length, bn = [], tab = [], k, j, r;
    for (k = 0; k < nb; k++) { bn.push(0); var row = []; for (j = 0; j < nt; j++) row.push(0); tab.push(row); }
    var tot = 0, tn = [];
    for (j = 0; j < nt; j++) tn.push(0);
    for (r = 0; r < R.length; r++) { var bv = R[r][bi], tv = R[r][ti]; if (!bv || bv.length !== 1 || !tv || !tv.length) continue; bn[bv[0]]++; tot++; for (j = 0; j < tv.length; j++) { tab[bv[0]][tv[j]]++; tn[tv[j]]++; } }
    var keep = []; for (k = 0; k < nb; k++) if (bn[k] >= minBase) keep.push(k);
    if (keep.length < 2) return null;
    var N = keep.reduce(function (s, x) { return s + bn[x]; }, 0), best = null;
    var test = function (cols) {   // cols: daftar kolom jawaban; multi -> satu kolom (dipilih vs tidak)
      var chi = 0, df;
      if (!t.multi) {
        var colN = cols.map(function (j) { return keep.reduce(function (s, x) { return s + tab[x][j]; }, 0); }), use = cols.filter(function (j, i) { return colN[i] > 0; });
        if (use.length < 2) return null; var cn = use.map(function (j) { return keep.reduce(function (s, x) { return s + tab[x][j]; }, 0); });
        keep.forEach(function (x) { use.forEach(function (j, i) { var e = bn[x] * cn[i] / N; if (e > 0) chi += Math.pow(tab[x][j] - e, 2) / e; }); });
        df = (keep.length - 1) * (use.length - 1); return { chi: chi, df: df, v: Math.sqrt(chi / (N * Math.min(keep.length - 1, use.length - 1))), p: CT_LIB.chiP(chi, df) };
      }
      var j0 = cols[0], yes = keep.reduce(function (s, x) { return s + tab[x][j0]; }, 0); if (!yes || yes === N) return null;
      keep.forEach(function (x) { var e1 = bn[x] * yes / N, e0 = bn[x] - e1; chi += Math.pow(tab[x][j0] - e1, 2) / e1 + Math.pow(bn[x] - tab[x][j0] - e0, 2) / e0; });
      df = keep.length - 1; return { chi: chi, df: df, v: Math.sqrt(chi / N), p: CT_LIB.chiP(chi, df) };
    };
    if (!t.multi) { var all = []; for (j = 0; j < nt; j++) all.push(j); best = test(all); }
    else for (j = 0; j < nt; j++) { var x2 = test([j]); if (x2 && x2.p < 0.01 / nt && (!best || x2.v > best.v)) best = x2; }
    if (!best) return null;
    // arah: kelompok banner yang paling menonjol pada jawaban tertentu
    var lean = [], SKIP = /^(Lainnya|Tidak ada|Tidak tahu|Tidak satu|Saya tidak|Belum pernah)/i;
    keep.forEach(function (x) {
      var bestA = null;
      for (j = 0; j < nt; j++) {
        if (SKIP.test(t.cats[j])) continue;
        var pAll = tn[j] / tot, pC = tab[x][j] / bn[x], nR = tot - bn[x], pR = nR ? (tn[j] - tab[x][j]) / nR : 0, pp = pAll;
        if (pAll < 0.05) continue;
        var se = Math.sqrt(pp * (1 - pp) * (1 / bn[x] + 1 / Math.max(1, nR))), z = se > 0 ? (pC - pR) / se : 0, d = pC - pAll;
        if (z >= 2.58 && d >= 0.06 && (!bestA || d > bestA.d)) bestA = { cat: t.cats[j], d: d };
      }
      if (bestA) lean.push({ grp: b.cats[x], ans: bestA.cat, d: bestA.d, n: bn[x] });
    });
    lean.sort(function (a, b) { return b.d - a.d; });
    return { v: best.v, p: best.p, n: N, lean: lean };
  },
  /** Ringkasan untuk eksekutif: hubungan antar pertanyaan (tanpa angka), dikelompokkan per topik + kesimpulan lintas temuan. */
  story: function (qs, data, o) {
    o = o || {};
    var idx = {}; qs.forEach(function (q, i) { idx[q.id] = i; });
    var DUP = { generasi: 'S1', kelas_ekonomi: 'ses' };   // banner kembar: cukup satu
    var banners = (o.banners || []).filter(function (id) { return !DUP[id] || (o.banners.indexOf(DUP[id]) < 0); }).map(function (id) { return idx[id]; })
      .filter(function (i) { return i != null && qs[i].cats.length >= 2 && qs[i].cats.length <= 12; });
    var isProf = function (q) { return q.group === 'PROFIL RESPONDEN' || /^(Profil|Screening|Tentang)/i.test(q.sect || ''); };
    var N = (o.rows || data).length, minBase = N >= 3000 ? 60 : N >= 500 ? 30 : 15, minV = o.minV || 0.08;
    var found = [];
    qs.forEach(function (q, ti) {
      if (banners.indexOf(ti) >= 0 || isProf(q) || q.cats.length < 2 || q.cats.length > 40) return;
      banners.forEach(function (bi) {
        var a = CT_LIB.assoc(qs, data, ti, bi, { minBase: minBase, rows: o.rows });
        if (!a || a.p > 0.001 || a.v < minV || !a.lean.length) return;
        found.push({ ti: ti, bi: bi, v: a.v, lean: a.lean, row: q.id, col: qs[bi].id });
      });
    });
    var lab = function (i) { return qs[i].text; }, bare = function (i, t) { return qs[i].survei ? String(t).replace(' (' + qs[i].survei + ')', '') : t; };
    var list = function (a) { return a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]; };
    var gname = function (bi, g) { return String(g).length <= 3 ? lab(bi) + ' ' + g : g; };
    var kuat = function (v) { return v >= 0.25 ? 'kuat' : v >= 0.15 ? 'cukup jelas' : 'ada'; };
    var sentence = function (f) {
      var L = f.lean.slice(0, 3), what = f.fam && f.aspek.length > 1 ? 'penilaian <b>' + f.fam + '</b> (' + list(f.aspek.slice(0, 4)) + (f.aspek.length > 4 ? ', dll.' : '') + ')' : '<b>' + lab(f.ti) + '</b>';
      var s = (f.v >= 0.15 ? 'Ada kaitan ' + kuat(f.v) + ' antara ' : 'Ada kaitan antara ') + '<b>' + lab(f.bi) + '</b> dan ' + what + '. ';
      var seen = {}; L = L.filter(function (x) { if (seen[x.ans]) return false; seen[x.ans] = 1; return true; });
      if (L.length === 1) s += gname(f.bi, L[0].grp) + ' cenderung lebih memilih “' + L[0].ans + '” dibanding kelompok lain.';
      else s += L.map(function (x, i) { return (i === 0 ? '' : i === L.length - 1 ? ', sedangkan ' : ', ') + gname(f.bi, x.grp) + (i === 0 ? ' cenderung memilih “' : ' lebih condong ke “') + x.ans + '”'; }).join('') + '.';
      return s;
    };
    // baris matriks dari pertanyaan yang sama (mis. "Platform paling sesuai — …") digabung jadi satu temuan
    found.sort(function (a, b) { return b.v - a.v; });
    var fam = {}, merged = [];
    found.forEach(function (f) {
      var t = lab(f.ti), base = String(qs[f.ti].id).split(': ')[0], m = t.indexOf(' — ') > 0 ? t.slice(0, t.indexOf(' — ')) : null;
      if (!m) { merged.push(f); return; }
      var k = base + '|' + f.bi, x = fam[k];
      if (!x) { x = fam[k] = { ti: f.ti, bi: f.bi, v: f.v, lean: f.lean, row: f.row, col: f.col, fam: m, aspek: [] }; merged.push(x); }
      var asp = bare(f.ti, t.slice(t.indexOf(' — ') + 3)).toLowerCase(); if (x.aspek.indexOf(asp) < 0) x.aspek.push(asp);
    });
    found = merged;
    var G = {}, order = [], perQ = {};
    found.forEach(function (f) {
      var g = qs[f.ti].group || qs[f.ti].sect || 'LAINNYA';
      if ((perQ[f.ti] = (perQ[f.ti] || 0) + 1) > 1) { (G[g] && G[g].extra.push(f)); return; }
      if (!G[g]) { G[g] = { name: g, poin: [], extra: [], by: {} }; order.push(g); }
      G[g].poin.push({ text: sentence(f), row: f.row, col: f.col, kuat: kuat(f.v) });
    });
    found.forEach(function (f) { var g = qs[f.ti].group || qs[f.ti].sect || 'LAINNYA'; if (G[g]) { var b = G[g].by[f.bi] || (G[g].by[f.bi] = { n: 0, w: 0, t: [] }); b.n++; b.w += f.v; var nm = bare(f.ti, f.fam || lab(f.ti)); if (b.t.indexOf(nm) < 0) b.t.push(nm); } });
    var ORD = ['KEBIASAAN BELANJA ONLINE', 'KATEGORI & PRODUK TERAKHIR', 'PERJALANAN BELANJA (FUNNEL)'];
    order.sort(function (a, b) { var x = ORD.indexOf(a), y = ORD.indexOf(b); return (x < 0 ? 9 : x) - (y < 0 ? 9 : y); });
    var groups = order.map(function (g) {
      var by = Object.keys(G[g].by).map(function (k) { return { bi: +k, n: G[g].by[k].n, w: G[g].by[k].w, t: G[g].by[k].t }; }).sort(function (a, b) { return b.w - a.w; });
      var top = by.filter(function (x) { return x.n >= 2; }).slice(0, 2), ring = '';
      if (top.length) ring = 'Perbedaan di bagian ini paling banyak dijelaskan oleh ' + list(top.map(function (x) { return '<b>' + lab(x.bi) + '</b>'; })) + ', yang berkaitan dengan ' + list(top[0].t.slice(0, 3).map(function (t) { return t.toLowerCase(); })) + (top[0].t.length > 3 ? ', dan hal lain' : '') + '.';
      else if (by.length) ring = '<b>' + lab(by[0].bi) + '</b> menjadi pembeda paling jelas di bagian ini.';
      return { name: g, ringkasan: ring, poin: G[g].poin.slice(0, o.perGroup || 6), lebih: Math.max(0, G[g].poin.length - (o.perGroup || 6)) };
    });
    // kesimpulan lintas topik (triangulasi): profil yang muncul sebagai pembeda di banyak topik
    var tot = {}; found.forEach(function (f) { var t = tot[f.bi] || (tot[f.bi] = { w: 0, g: {} }); t.w += f.v; t.g[qs[f.ti].group || ''] = 1; });
    var drivers = Object.keys(tot).map(function (k) { return { bi: +k, w: tot[k].w, ng: Object.keys(tot[k].g).length }; }).sort(function (a, b) { return b.w - a.w; }).slice(0, 3);
    var kesimpulan = [];
    if (drivers.length) kesimpulan.push('Faktor profil yang paling membedakan perilaku responden adalah ' + list(drivers.map(function (d) { return '<b>' + lab(d.bi) + '</b>'; })) + '.');
    var multi = drivers.filter(function (d) { return d.ng >= 2; });
    if (multi.length) kesimpulan.push(list(multi.map(function (d) { return '<b>' + lab(d.bi) + '</b>'; })) + ' konsisten muncul di beberapa tahap sekaligus (' + list(Object.keys(tot[multi[0].bi].g).map(function (g) { return g.replace(/\s*\(.*\)\s*/, '').toLowerCase(); })) + '), sehingga layak dijadikan dasar segmentasi.');
    var tri = {};
    found.forEach(function (f) { f.lean.slice(0, 2).forEach(function (l) { var k = f.bi + '|' + l.grp + '|' + l.ans, x = tri[k] || (tri[k] = { bi: f.bi, grp: l.grp, ans: l.ans, q: [] }); var nm = bare(f.ti, f.fam || lab(f.ti)).toLowerCase(); if (x.q.indexOf(nm) < 0) x.q.push(nm); }); });
    Object.keys(tri).map(function (k) { return tri[k]; }).filter(function (x) { return x.q.length >= 2; }).sort(function (a, b) { return b.q.length - a.q.length; }).slice(0, 3).forEach(function (x) {
      kesimpulan.push('<b>' + gname(x.bi, x.grp) + '</b> konsisten condong ke “' + x.ans + '” di beberapa pertanyaan sekaligus (' + list(x.q.slice(0, 4)) + (x.q.length > 4 ? ', dll.' : '') + '): ini pola yang kuat, bukan kebetulan.');
    });
    if (!found.length) kesimpulan.push('Belum terlihat hubungan yang jelas antara profil responden dan jawaban. Biasanya muncul setelah jumlah responden valid cukup banyak.');
    return { kesimpulan: kesimpulan, groups: groups, n: N };
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
