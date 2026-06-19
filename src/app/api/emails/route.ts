import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { EmailItem } from '@/types/email';

export async function GET() {
  try {
    const dbPath = process.env.SQLITE_DB_PATH || './caldim_postmaster.db';
    const db = new Database(dbPath, { fileMustExist: false });

    // Ensure the table exists in case n8n hasn't created it yet
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

    const rows = db.prepare('SELECT * FROM emails ORDER BY processedAt DESC').all();

    const emails: EmailItem[] = rows.map((row: any) => ({
      id: row.id,
      from: row.from,
      subject: row.subject,
      textPlain: row.textPlain,
      category: row.category,
      confidence: row.confidence,
      priority: row.priority,
      processedAt: row.processedAt,
      status: row.status,
      attachments: row.attachments ? JSON.parse(row.attachments) : []
    }));

    db.close();

    return NextResponse.json(emails);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch emails from database' }, { status: 500 });
  }
}
