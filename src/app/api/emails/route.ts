import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { EmailItem } from '@/types/email';
import crypto from 'crypto';

function ensureSchema(db: ReturnType<typeof Database>) {
  db.pragma('journal_mode = WAL');
  db.pragma('busy_timeout = 5000');
  db.exec(`
    CREATE TABLE IF NOT EXISTS emails (
      id TEXT PRIMARY KEY,
      "from" TEXT,
      subject TEXT,
      textPlain TEXT,
      category TEXT,
      confidence REAL,
      priority TEXT,
      processedAt TEXT,
      status TEXT,
      attachments TEXT
    )
  `);
  const migrations = [
    'ALTER TABLE emails ADD COLUMN messageId TEXT',
    'ALTER TABLE emails ADD COLUMN reasoning TEXT',
    'ALTER TABLE emails ADD COLUMN evidence TEXT',
    'ALTER TABLE emails ADD COLUMN originalCategory TEXT',
    'ALTER TABLE emails ADD COLUMN reclassifiedAt TEXT',
    'ALTER TABLE emails ADD COLUMN reclassifiedBy TEXT',
  ];
  for (const sql of migrations) {
    try { db.exec(sql); } catch (_) { /* already exists */ }
  }
}

export async function GET() {
  try {
    const dbPath = process.env.SQLITE_DB_PATH || './caldim_postmaster.db';
    const db = new Database(dbPath, { fileMustExist: false });
    ensureSchema(db);

    const rows = db.prepare('SELECT * FROM emails ORDER BY processedAt DESC').all();

    const emails: EmailItem[] = rows.map((row: any) => ({
      id: row.id,
      messageId: row.messageId || undefined,
      from: row.from,
      subject: row.subject,
      textPlain: row.textPlain,
      category: row.category,
      confidence: row.confidence,
      priority: row.priority,
      processedAt: row.processedAt,
      status: row.status,
      attachments: row.attachments ? JSON.parse(row.attachments) : [],
      reasoning: row.reasoning || undefined,
      evidence: row.evidence ? JSON.parse(row.evidence) : undefined,
      originalCategory: row.originalCategory || undefined,
      reclassifiedAt: row.reclassifiedAt || undefined,
      reclassifiedBy: row.reclassifiedBy || undefined,
    }));

    db.close();
    return NextResponse.json(emails);
  } catch (error) {
    console.error('Database GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from, subject, textPlain, category, confidence, priority, attachments } = body;

    const dbPath = process.env.SQLITE_DB_PATH || './caldim_postmaster.db';
    const db = new Database(dbPath, { fileMustExist: false });
    ensureSchema(db);

    const id = crypto.randomUUID();
    const processedAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO emails (id, "from", subject, textPlain, category, confidence, priority, processedAt, status, attachments)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, from, subject, textPlain, category, confidence, priority,
      processedAt, 'classified',
      attachments ? JSON.stringify(attachments) : JSON.stringify([])
    );

    db.close();
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error('Database POST Error:', error);
    return NextResponse.json({ error: 'Failed to save email' }, { status: 500 });
  }
}
