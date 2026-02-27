import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = path.join(__dirname, '..', 'data.json');

const defaultData = {
  users: [],
  profiles: [],
  password_reset_tokens: [],
  trips: [],
  expenses: [],
  documents: [],
};

const adapter = new JSONFile(file);
const db = new Low(adapter, defaultData);

export async function getDb() {
  await db.read();
  db.data ||= { ...defaultData };
  db.data.users ||= [];
  db.data.profiles ||= [];
  db.data.password_reset_tokens ||= [];
  db.data.trips ||= [];
  db.data.expenses ||= [];
  db.data.documents ||= [];
  return db;
}

export async function writeDb() {
  await db.write();
}
