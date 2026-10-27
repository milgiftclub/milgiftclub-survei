// Dipakai workflow "Login Google": menukar alamat localhost (berisi ?code=...) menjadi ~/.clasprc.json
const fs = require('fs'), os = require('os'), path = require('path');
const CLIENT = { clientId: '1072944905499-vm2v2i5dvn0a0d2o4ca36i1vge8cvbn0.apps.googleusercontent.com', clientSecret: 'v6V3fKV_zWU7iw1DrpO1rknX', redirectUri: 'http://localhost' };
(async () => {
  let code = String(process.env.ALAMAT || '').trim();
  try { code = new URL(code).searchParams.get('code') || code; } catch (e) {}
  if (!code) throw new Error('Alamat kosong.');
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code, client_id: CLIENT.clientId, client_secret: CLIENT.clientSecret, redirect_uri: 'http://localhost:8888', grant_type: 'authorization_code' }) });
  const t = await r.json();
  if (!r.ok || !t.refresh_token) throw new Error('Login gagal (' + (t.error_description || t.error || r.status) + '). Kode hanya berlaku beberapa menit dan sekali pakai: ulangi dari klik link Google.');
  let who = ''; try { who = JSON.parse(Buffer.from(t.id_token.split('.')[1], 'base64').toString()).email; } catch (e) {}
  if (!/@mildigital\.id$/i.test(who)) throw new Error('Akun yang login: ' + (who || '?') + '. Harus akun @mildigital.id. Ulangi dari klik link Google dan pilih akun @mildigital.id.');
  fs.writeFileSync(path.join(os.homedir(), '.clasprc.json'), JSON.stringify({ token: { access_token: t.access_token, refresh_token: t.refresh_token, scope: t.scope, token_type: t.token_type, id_token: t.id_token, expiry_date: Date.now() + (t.expires_in || 3600) * 1000 }, oauth2ClientSettings: CLIENT, isLocalCreds: false }));
  console.log('Login berhasil sebagai ' + who);
})().catch(e => { console.log('::error::' + e.message); process.exit(1); });
