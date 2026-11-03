/** Link video / gambar -> cara menampilkannya. Dipakai di Dashboard (pembuat survei) & halaman survei. */
function mediaInfo(u) {
  u = String(u || '').trim(); if (!/^https?:\/\//i.test(u)) return null;
  var m;
  if ((m = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{6,})/i))) return { kind: 'iframe', src: 'https://www.youtube-nocookie.com/embed/' + m[1] + '?rel=0&playsinline=1&modestbranding=1', vertical: /shorts\//i.test(u), via: 'YouTube' };
  if ((m = u.match(/tiktok\.com\/(?:@[\w.-]+\/video|embed(?:\/v2)?|v)\/(\d+)/i))) return { kind: 'iframe', src: 'https://www.tiktok.com/embed/v2/' + m[1], vertical: true, via: 'TikTok' };
  if ((m = u.match(/instagram\.com\/(?:[\w.]+\/)?(reel|reels|p|tv)\/([\w-]+)/i))) return { kind: 'iframe', src: 'https://www.instagram.com/' + (m[1] === 'p' ? 'p' : 'reel') + '/' + m[2] + '/embed', vertical: true, via: 'Instagram' };
  if ((m = u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:.*&)?id=)([\w-]{10,})/i))) return { kind: 'iframe', src: 'https://drive.google.com/file/d/' + m[1] + '/preview', vertical: true, via: 'Google Drive' };
  if (/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(u)) return { kind: 'video', src: u, vertical: true, via: 'video' };
  if (/\.(jpe?g|png|gif|webp|avif)(\?|#|$)/i.test(u) || /googleusercontent\.com|imgur\.com/i.test(u)) return { kind: 'image', src: u, vertical: false, via: 'gambar' };
  return null;
}
