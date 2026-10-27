// Login Google untuk clasp tanpa server lokal (cocok untuk GitHub Codespaces).
// Menghasilkan ~/.clasprc.json dengan format yang sama seperti `clasp login`.
const fs = require('fs'), os = require('os'), path = require('path'), readline = require('readline');
const CLIENT = { clientId: '1072944905499-vm2v2i5dvn0a0d2o4ca36i1vge8cvbn0.apps.googleusercontent.com', clientSecret: 'v6V3fKV_zWU7iw1DrpO1rknX', redirectUri: 'http://localhost' };
const REDIRECT = 'http://localhost:8888';
const SCOPES = ['https://www.googleapis.com/auth/script.deployments', 'https://www.googleapis.com/auth/script.projects', 'https://www.googleapis.com/auth/script.webapp.deploy',
  'https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/service.management',
  'https://www.googleapis.com/auth/logging.read', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/cloud-platform'];
const url = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({ client_id: CLIENT.clientId, redirect_uri: REDIRECT, response_type: 'code', access_type: 'offline', prompt: 'consent', scope: SCOPES.join(' ') });
console.log('\n1) Buka link ini di browser (Ctrl/Cmd + klik):\n\n' + url + '\n');
console.log('2) Pilih akun @mildigital.id, klik Allow / Izinkan.');
console.log('3) Browser akan menampilkan halaman localhost yang gagal dimuat. Itu normal.');
console.log('   Salin seluruh alamat halaman tersebut (diawali http://localhost:8888/?code=...)\n');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Tempel alamatnya di sini lalu Enter: ', async (ans) => {
  rl.close();
  let code = ans.trim();
  try { const u = new URL(code); code = u.searchParams.get('code') || code; } catch (e) {}
  if (!code) { console.error('Kode kosong. Ulangi.'); process.exit(1); }
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code, client_id: CLIENT.clientId, client_secret: CLIENT.clientSecret, redirect_uri: REDIRECT, grant_type: 'authorization_code' }) });
  const t = await r.json();
  if (!r.ok || !t.refresh_token) { console.error('Login gagal:', JSON.stringify(t)); process.exit(1); }
  const rc = { token: { access_token: t.access_token, refresh_token: t.refresh_token, scope: t.scope, token_type: t.token_type, id_token: t.id_token, expiry_date: Date.now() + (t.expires_in || 3600) * 1000 }, oauth2ClientSettings: CLIENT, isLocalCreds: false };
  fs.writeFileSync(path.join(os.homedir(), '.clasprc.json'), JSON.stringify(rc));
  let who = ''; try { who = JSON.parse(Buffer.from(t.id_token.split('.')[1], 'base64').toString()).email; } catch (e) {}
  console.log('\nLogin berhasil' + (who ? ' sebagai ' + who : '') + '.');
  if (who && !/@mildigital\.id$/i.test(who)) console.log('PERINGATAN: akun ini bukan @mildigital.id. Dashboard butuh akun @mildigital.id. Ulangi login dengan akun yang benar.');
});
