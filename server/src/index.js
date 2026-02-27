import 'dotenv/config';
import express from 'express';
import { z } from 'zod';
import { getDb, writeDb } from './db.js';
import {
  hashPassword,
  makeId,
  makeResetToken,
  makeUserId,
  nowIso,
  requireAuth,
  sha256,
  signJwt,
  verifyPassword,
} from './auth.js';

const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

const app = express();
app.use(express.json({ limit: '25mb' }));

app.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'truckerlog-ai-api',
    health: '/api/health',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

app.post('/api/auth/signup', async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input' });

  const { email, password } = parsed.data;
  const id = makeUserId();
  const createdAt = nowIso();
  const emailLower = email.toLowerCase();

  const passwordHash = await hashPassword(password);

  const db = await getDb();
  const exists = db.data.users.find((u) => u.email === emailLower);
  if (exists) return res.status(409).json({ error: 'email_in_use' });

  db.data.users.push({
    id,
    email: emailLower,
    password_hash: passwordHash,
    created_at: createdAt,
  });

  db.data.profiles.push({
    user_id: id,
    company_name: null,
    dot_number: null,
    ifta_account: null,
    created_at: createdAt,
    updated_at: createdAt,
  });

  await writeDb();

  const token = signJwt({ sub: id, email: emailLower }, JWT_SECRET);
  return res.json({ token });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
});

app.post('/api/auth/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input' });

  const { email, password } = parsed.data;

  const db = await getDb();
  const user = db.data.users.find((u) => u.email === email.toLowerCase());

  if (!user) return res.status(401).json({ error: 'invalid_credentials' });

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });

  const token = signJwt({ sub: user.id, email: user.email }, JWT_SECRET);
  return res.json({ token });
});

const requestResetSchema = z.object({ email: z.string().email() });

app.post('/api/auth/request-reset', async (req, res) => {
  const parsed = requestResetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input' });

  const { email } = parsed.data;
  const db = await getDb();
  const user = db.data.users.find((u) => u.email === email.toLowerCase());

  if (!user) return res.json({ ok: true });

  const token = makeResetToken();
  const tokenHash = sha256(token);
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString();

  db.data.password_reset_tokens = db.data.password_reset_tokens.filter((t) => t.user_id !== user.id);
  db.data.password_reset_tokens.push({
    user_id: user.id,
    token_hash: tokenHash,
    expires_at: expiresAt,
    created_at: createdAt,
  });
  await writeDb();

  return res.json({ ok: true, token });
});

const resetSchema = z.object({
  email: z.string().email(),
  token: z.string().min(10),
  newPassword: z.string().min(8).max(200),
});

app.post('/api/auth/reset', async (req, res) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input' });

  const { email, token, newPassword } = parsed.data;
  const db = await getDb();
  const user = db.data.users.find((u) => u.email === email.toLowerCase());
  if (!user) return res.status(401).json({ error: 'invalid_reset' });

  const row = db.data.password_reset_tokens.find((t) => t.user_id === user.id);

  if (!row) return res.status(401).json({ error: 'invalid_reset' });
  if (row.token_hash !== sha256(token)) return res.status(401).json({ error: 'invalid_reset' });
  if (new Date(row.expires_at).getTime() < Date.now()) return res.status(401).json({ error: 'reset_expired' });

  const passwordHash = await hashPassword(newPassword);
  user.password_hash = passwordHash;
  db.data.password_reset_tokens = db.data.password_reset_tokens.filter((t) => t.user_id !== user.id);
  await writeDb();

  return res.json({ ok: true });
});

app.get('/api/me', requireAuth(JWT_SECRET), async (req, res) => {
  const userId = req.user.sub;
  const db = await getDb();
  const profile = db.data.profiles.find((p) => p.user_id === userId);

  return res.json({
    user: { id: userId, email: req.user.email },
    profile: profile || { company_name: null, dot_number: null, ifta_account: null },
  });
});

const profileSchema = z.object({
  company_name: z.string().max(200).nullable().optional(),
  dot_number: z.string().max(50).nullable().optional(),
  ifta_account: z.string().max(50).nullable().optional(),
});

app.put('/api/profile', requireAuth(JWT_SECRET), async (req, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input' });

  const userId = req.user.sub;
  const now = nowIso();
  const db = await getDb();
  const current = db.data.profiles.find((p) => p.user_id === userId) || {
    user_id: userId,
    company_name: null,
    dot_number: null,
    ifta_account: null,
    created_at: now,
    updated_at: now,
  };

  const next = {
    company_name: parsed.data.company_name ?? current.company_name,
    dot_number: parsed.data.dot_number ?? current.dot_number,
    ifta_account: parsed.data.ifta_account ?? current.ifta_account,
  };

  const idx = db.data.profiles.findIndex((p) => p.user_id === userId);
  const row = {
    ...current,
    ...next,
    user_id: userId,
    updated_at: now,
  };
  if (idx === -1) db.data.profiles.push(row);
  else db.data.profiles[idx] = row;
  await writeDb();

  return res.json({ ok: true, profile: next });
});

const tripSchema = z.object({
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  origin: z.string().max(200).nullable().optional(),
  destination: z.string().max(200).nullable().optional(),
  jurisdiction_miles: z.record(z.number().nonnegative()).optional(),
  notes: z.string().max(2000).nullable().optional(),
});

app.get('/api/trips', requireAuth(JWT_SECRET), async (req, res) => {
  const userId = req.user.sub;
  const db = await getDb();
  const trips = db.data.trips
    .filter((t) => t.user_id === userId)
    .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
  return res.json({ trips });
});

app.post('/api/trips', requireAuth(JWT_SECRET), async (req, res) => {
  const parsed = tripSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input' });

  const userId = req.user.sub;
  const id = makeId('trp');
  const now = nowIso();

  const db = await getDb();
  db.data.trips.push({
    id,
    user_id: userId,
    start_date: parsed.data.start_date ?? null,
    end_date: parsed.data.end_date ?? null,
    origin: parsed.data.origin ?? null,
    destination: parsed.data.destination ?? null,
    jurisdiction_miles: parsed.data.jurisdiction_miles || {},
    notes: parsed.data.notes ?? null,
    created_at: now,
    updated_at: now,
  });
  await writeDb();

  return res.json({ ok: true, id });
});

app.delete('/api/trips/:id', requireAuth(JWT_SECRET), async (req, res) => {
  const userId = req.user.sub;
  const db = await getDb();
  db.data.trips = db.data.trips.filter((t) => !(t.id === req.params.id && t.user_id === userId));
  await writeDb();
  return res.json({ ok: true });
});

app.post('/api/trips/reset', requireAuth(JWT_SECRET), async (req, res) => {
  const userId = req.user.sub;
  const db = await getDb();
  db.data.trips = db.data.trips.filter((t) => t.user_id !== userId);
  await writeDb();
  return res.json({ ok: true });
});

const expenseSchema = z.object({
  date: z.string().nullable().optional(),
  category: z.string().max(100).nullable().optional(),
  vendor: z.string().max(200).nullable().optional(),
  amount: z.number().nonnegative().nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

app.get('/api/expenses', requireAuth(JWT_SECRET), async (req, res) => {
  const userId = req.user.sub;
  const db = await getDb();
  const expenses = db.data.expenses
    .filter((e) => e.user_id === userId)
    .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
  return res.json({ expenses });
});

app.post('/api/expenses', requireAuth(JWT_SECRET), async (req, res) => {
  const parsed = expenseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input' });

  const userId = req.user.sub;
  const id = makeId('exp');
  const now = nowIso();

  const db = await getDb();
  db.data.expenses.push({
    id,
    user_id: userId,
    date: parsed.data.date ?? null,
    category: parsed.data.category ?? null,
    vendor: parsed.data.vendor ?? null,
    amount: parsed.data.amount ?? null,
    notes: parsed.data.notes ?? null,
    created_at: now,
    updated_at: now,
  });
  await writeDb();

  return res.json({ ok: true, id });
});

app.delete('/api/expenses/:id', requireAuth(JWT_SECRET), async (req, res) => {
  const userId = req.user.sub;
  const db = await getDb();
  db.data.expenses = db.data.expenses.filter((e) => !(e.id === req.params.id && e.user_id === userId));
  await writeDb();
  return res.json({ ok: true });
});

app.post('/api/expenses/reset', requireAuth(JWT_SECRET), async (req, res) => {
  const userId = req.user.sub;
  const db = await getDb();
  db.data.expenses = db.data.expenses.filter((e) => e.user_id !== userId);
  await writeDb();
  return res.json({ ok: true });
});

app.post('/api/ai/expense-suggest', requireAuth(JWT_SECRET), (req, res) => {
  const schema = z.object({ vendor: z.string().optional(), notes: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input' });

  const text = `${parsed.data.vendor || ''} ${parsed.data.notes || ''}`.toLowerCase();
  let category = 'Other';

  if (text.includes('pilot') || text.includes('loves') || text.includes('ta') || text.includes('fuel')) category = 'Fuel';
  else if (text.includes('toll')) category = 'Tolls';
  else if (text.includes('repair') || text.includes('service') || text.includes('shop')) category = 'Maintenance';
  else if (text.includes('food') || text.includes('restaurant') || text.includes('meal')) category = 'Meals';

  return res.json({ ok: true, category, confidence: 0.55 });
});

function guessDocumentCategory(filename = '') {
  const n = String(filename || '').toLowerCase();
  if (n.includes('rate') || n.includes('rc') || n.includes('confirmation')) return 'rate-confirmation';
  if (n.includes('insurance') || n.includes('policy') || n.includes('coa')) return 'insurance';
  if (n.includes('permit') || n.includes('license') || n.includes('registration') || n.includes('plate')) return 'permits';
  if (n.includes('report') || n.includes('summary')) return 'reports';
  return 'billing';
}

const documentUploadSchema = z.object({
  name: z.string().min(1).max(300),
  mime: z.string().min(1).max(200),
  size: z.number().int().nonnegative().max(15 * 1024 * 1024),
  category: z.string().max(100).nullable().optional(),
  data: z.string().min(1).max(25_000_000),
});

app.get('/api/documents', requireAuth(JWT_SECRET), async (req, res) => {
  const userId = req.user.sub;
  const db = await getDb();
  const documents = (db.data.documents || [])
    .filter((d) => d.user_id === userId)
    .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
    .map((d) => ({
      id: d.id,
      name: d.name,
      mime: d.mime,
      size: d.size,
      category: d.category,
      status: d.status,
      ai_extracted: d.ai_extracted,
      created_at: d.created_at,
      updated_at: d.updated_at,
    }));
  return res.json({ documents });
});

app.post('/api/documents', requireAuth(JWT_SECRET), async (req, res) => {
  const parsed = documentUploadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input' });

  const userId = req.user.sub;
  const id = makeId('doc');
  const now = nowIso();

  const category = parsed.data.category || guessDocumentCategory(parsed.data.name);

  const db = await getDb();
  db.data.documents.push({
    id,
    user_id: userId,
    name: parsed.data.name,
    mime: parsed.data.mime,
    size: parsed.data.size,
    category,
    status: 'pending',
    ai_extracted: false,
    data: parsed.data.data,
    created_at: now,
    updated_at: now,
  });
  await writeDb();

  return res.json({ ok: true, id });
});

app.get('/api/documents/:id', requireAuth(JWT_SECRET), async (req, res) => {
  const userId = req.user.sub;
  const db = await getDb();
  const doc = (db.data.documents || []).find((d) => d.id === req.params.id && d.user_id === userId);
  if (!doc) return res.status(404).json({ error: 'not_found' });
  return res.json({
    document: {
      id: doc.id,
      name: doc.name,
      mime: doc.mime,
      size: doc.size,
      category: doc.category,
      status: doc.status,
      ai_extracted: doc.ai_extracted,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
      data: doc.data,
    },
  });
});

app.delete('/api/documents/:id', requireAuth(JWT_SECRET), async (req, res) => {
  const userId = req.user.sub;
  const db = await getDb();
  const before = (db.data.documents || []).length;
  db.data.documents = (db.data.documents || []).filter((d) => !(d.id === req.params.id && d.user_id === userId));
  const after = db.data.documents.length;
  if (after === before) return res.status(404).json({ error: 'not_found' });
  await writeDb();
  return res.json({ ok: true });
});

// We use process.env.PORT directly so we don't conflict with any other variables
app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log("Server is running, unlocked, and listening to Render!");
});
