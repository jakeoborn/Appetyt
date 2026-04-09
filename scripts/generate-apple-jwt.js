const jwt = require('jsonwebtoken');

// Your Apple credentials
const TEAM_ID = 'X54Q9P743S';
const KEY_ID = 'K6U288D8KD';
const CLIENT_ID = 'com.appetyt.web';

// Your .p8 private key - paste the FULL contents between the quotes
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgOs0WntKcxgBnZ08B
ahOtBlpDipM826GfclwC0FDoHRqgCgYIKoZIzj0DAQehRANCAAT3D0BesWTd/4ds
q1NWE+V+qH4Y1eeWY6Z7mreVQ5+0L9cAuFk99xsqIp8hY/+gYyNvz2ltN8Kys/DG
u0NvTeGo
-----END PRIVATE KEY-----`;

const now = Math.floor(Date.now() / 1000);

const token = jwt.sign({}, PRIVATE_KEY, {
  algorithm: 'ES256',
  expiresIn: '180d', // 6 months (Apple max)
  audience: 'https://appleid.apple.com',
  issuer: TEAM_ID,
  subject: CLIENT_ID,
  keyid: KEY_ID,
  header: {
    alg: 'ES256',
    kid: KEY_ID,
  }
});

console.log('\n=== YOUR APPLE CLIENT SECRET (JWT) ===\n');
console.log(token);
console.log('\n=== Copy the entire string above into Supabase "Secret Key" field ===\n');
console.log('This token expires in 180 days. You will need to regenerate it then.\n');
