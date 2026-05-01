// Generate Apple Sign In client_secret JWT for Supabase.
//
// Usage:
//   node scripts/gen-apple-jwt.js <path-to-.p8> <KEY_ID>
//
// Defaults below assume our Dim Hour setup. Override via env if needed:
//   APPLE_TEAM_ID    (default: X54Q9P743S)
//   APPLE_SERVICES_ID (default: com.dimhour.signin)
//
// Output: a JWT string. Paste it into Supabase Auth > Providers > Apple > "Secret Key (for OAuth)".

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TEAM_ID = process.env.APPLE_TEAM_ID || 'X54Q9P743S';
const SERVICES_ID = process.env.APPLE_SERVICES_ID || 'com.dimhour.signin';

const p8Path = process.argv[2];
const KEY_ID = process.argv[3];

if (!p8Path || !KEY_ID) {
  console.error('Usage: node scripts/gen-apple-jwt.js <path-to-.p8> <KEY_ID>');
  process.exit(1);
}

const p8 = fs.readFileSync(path.resolve(p8Path), 'utf8');

// 6-month expiry (Apple max)
const now = Math.floor(Date.now() / 1000);
const exp = now + 60 * 60 * 24 * 180;

const header = { alg: 'ES256', kid: KEY_ID, typ: 'JWT' };
const payload = {
  iss: TEAM_ID,
  iat: now,
  exp,
  aud: 'https://appleid.apple.com',
  sub: SERVICES_ID,
};

function b64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

const headerB64 = b64url(JSON.stringify(header));
const payloadB64 = b64url(JSON.stringify(payload));
const signingInput = `${headerB64}.${payloadB64}`;

const keyObj = crypto.createPrivateKey({ key: p8, format: 'pem' });
const sigDer = crypto.sign('sha256', Buffer.from(signingInput), keyObj);

// Convert DER ECDSA signature to JOSE (raw r||s, 64 bytes)
function derToJose(der) {
  // DER: 0x30 len 0x02 rLen r 0x02 sLen s
  let offset = 2;
  if (der[1] & 0x80) offset = 2 + (der[1] & 0x7f);
  if (der[offset] !== 0x02) throw new Error('bad DER');
  const rLen = der[offset + 1];
  let r = der.slice(offset + 2, offset + 2 + rLen);
  offset = offset + 2 + rLen;
  if (der[offset] !== 0x02) throw new Error('bad DER');
  const sLen = der[offset + 1];
  let s = der.slice(offset + 2, offset + 2 + sLen);
  // Strip leading zeros, then left-pad to 32
  while (r.length > 32 && r[0] === 0) r = r.slice(1);
  while (s.length > 32 && s[0] === 0) s = s.slice(1);
  const rPad = Buffer.concat([Buffer.alloc(32 - r.length), r]);
  const sPad = Buffer.concat([Buffer.alloc(32 - s.length), s]);
  return Buffer.concat([rPad, sPad]);
}

const sigJose = derToJose(sigDer);
const jwt = `${signingInput}.${b64url(sigJose)}`;

console.log('');
console.log('=== Apple Sign In client_secret JWT ===');
console.log(jwt);
console.log('');
console.log(`Team ID:     ${TEAM_ID}`);
console.log(`Services ID: ${SERVICES_ID}`);
console.log(`Key ID:      ${KEY_ID}`);
console.log(`Expires:     ${new Date(exp * 1000).toISOString()} (~6 months)`);
console.log('');
console.log('Paste the JWT above into Supabase > Auth > Providers > Apple > "Secret Key (for OAuth)".');
console.log('Set re-generation reminder before expiry — Apple caps client_secret at 6 months.');
