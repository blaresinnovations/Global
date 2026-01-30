const crypto = require('crypto');

const SECRET = process.env.AUTH_SECRET || process.env.JWT_SECRET || 'change_this_secret';

function base64url(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function signToken(obj) {
  const payload = JSON.stringify(obj);
  const b = base64url(payload);
  const h = crypto.createHmac('sha256', SECRET).update(b).digest('hex');
  return `${b}.${h}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [b, sig] = parts;
  const expected = crypto.createHmac('sha256', SECRET).update(b).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) return null;
  try {
    // convert base64url -> base64
    let base64 = b.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const json = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function requireAuth(role) {
  return (req, res, next) => {
    const auth = req.headers.authorization || req.headers.Authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
    const token = auth.slice(7).trim();
    const data = verifyToken(token);
    if (!data) return res.status(401).json({ error: 'Invalid token' });
    if (role) {
      const actual = String(data.role || '').trim().toLowerCase();
      const expected = String(role || '').trim().toLowerCase();
      if (actual !== expected) {
        console.warn('requireAuth: role mismatch', { expected, actual, user: data });
        return res.status(403).json({ error: 'Forbidden' });
      }
    }
    req.user = data;
    next();
  };
}

module.exports = { signToken, verifyToken, requireAuth };
