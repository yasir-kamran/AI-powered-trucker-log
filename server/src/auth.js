import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import crypto from 'crypto';

export function nowIso() {
  return new Date().toISOString();
}

export function makeUserId() {
  return `usr_${nanoid(16)}`;
}

export function makeId(prefix) {
  return `${prefix}_${nanoid(16)}`;
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signJwt(payload, secret) {
  return jwt.sign(payload, secret, { expiresIn: '14d' });
}

export function verifyJwt(token, secret) {
  return jwt.verify(token, secret);
}

export function requireAuth(secret) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'missing_token' });

    try {
      const decoded = verifyJwt(token, secret);
      req.user = decoded;
      return next();
    } catch {
      return res.status(401).json({ error: 'invalid_token' });
    }
  };
}

export function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function makeResetToken() {
  return `rst_${nanoid(32)}`;
}
