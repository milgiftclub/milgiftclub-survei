// ==========================================================
//  PENGATURAN WEBSITE SURVEI MIL GIFT CLUB
//  Buka file ini dengan TextEdit, ubah teks DI ANTARA tanda kutip ' ',
//  simpan, lalu upload ulang folder ke Netlify (tab Deploys).
//  Jangan hapus tanda kutip, koma, atau kurung.
// ==========================================================
window.SURVEI_CONFIG = {

  // ---- 1. Alamat Apps Script (JANGAN diubah kecuali deployment berganti) ----
  API_V1: 'https://script.google.com/macros/s/AKfycbzfKRzS_qZhPjaH9CrXr-l-afFfX-7QCerSDxc5aIDemYNpuHWA5xWVmaMwxGQUZ9IaoQ/exec',
  API_V2: 'https://script.google.com/macros/s/AKfycbzfKRzS_qZhPjaH9CrXr-l-afFfX-7QCerSDxc5aIDemYNpuHWA5xWVmaMwxGQUZ9IaoQ/exec',  // sama dengan API_V1: kedua survei tersimpan di satu Sheet

  // ---- 2. Teks yang tampil di survei (boleh diubah) ----
  TAMPILAN: {
    // Halaman pertama: paragraf pembuka (kotak bergaris) dan pertanyaan persetujuan
    TEKS_PEMBUKA: 'Terima kasih telah berpartisipasi dalam survei tentang kebiasaan belanja online. Survei ini membutuhkan waktu ±7 menit. Jawaban Anda bersifat rahasia dan hanya digunakan untuk keperluan riset. Data kontak hanya digunakan untuk keperluan undian dan verifikasi pemenang.',
    PERTANYAAN_PEMBUKA: 'Apakah Anda bersedia mengikuti survei ini?',

    PERIODE_LABEL: 'Survei MIL Gift Club · Periode 1 2026',
    HADIAH_UTAMA: 'Apple AirPods 4',
    HADIAH: [
      'Voucher MAP Rp500.000 untuk 3 pemenang',
      'Saldo GoPay Rp50.000 untuk 5 pemenang'
    ],
    PERIODE_GIVEAWAY: 'Hingga 31 Desember 2026',
    PENGUMUMAN_PEMENANG: '4 Januari 2027',
    IG_HANDLE: '@milgiftclub',
    LANGKAH_PENUTUP: [
      'Follow Instagram @milgiftclub',
      '❤️ Like postingan giveaway ini',
      'Tag 3 teman kamu di kolom komentar',
      'Share postingan ini ke Instagram Story kamu dan tag @milgiftclub',
      'Nantikan pengumuman pemenangnya!'
    ],
    PESAN_PENUTUP: 'Isi survei lainnya untuk memperbesar kesempatan kamu menang!',

    // Halaman penutup bila responden tidak lolos kriteria / menolak ikut (kedua survei; kecuali usia < 18)
    TEKS_TIDAK_ELIGIBLE: 'Kamu belum termasuk kriteria survei ini. Tapi jangan khawatir, kamu masih bisa memenangkan hadiah dengan mengisi survei lainnya.',
    TEKS_SUDAH_ISI: 'Akun Instagram ini sudah pernah mengisi survei ini. Satu akun hanya bisa ikut satu kali. Tapi jangan khawatir, kamu masih bisa memenangkan hadiah dengan mengisi survei lainnya.',
    TEKS_MENOLAK: 'Tidak apa-apa kalau kamu belum ingin mengisi survei ini. Kamu masih bisa memenangkan hadiah dengan mengisi survei lainnya.',
    TOMBOL_SURVEI_LAIN: 'Isi survei lainnya',
    LINK_SURVEI_LAIN: 'https://linktr.ee/milgiftclub',

    // Tombol Instagram di halaman penutup (terima kasih, tidak lolos, survei ditutup)
    TOMBOL_INSTAGRAM: 'Follow @milgiftclub di Instagram',
    LINK_INSTAGRAM: 'https://www.instagram.com/milgiftclub/',

    PRIVACY_URL: '',   // link Kebijakan Privasi (kosong = tidak ditampilkan)
    TNC_URL: ''        // link Syarat & Ketentuan giveaway (kosong = tidak ditampilkan)
  }
};
