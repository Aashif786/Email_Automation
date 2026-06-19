import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { emailId, category, priority } = body;

    if (!emailId || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const dbPath = process.env.SQLITE_DB_PATH || './caldim_postmaster.db';
    const db = new Database(dbPath);

    let runResult;
    if (priority) {
      const stmt = db.prepare(`
        UPDATE emails 
        SET category = ?, priority = ?, status = 'classified'
        WHERE id = ?
      `);
      runResult = stmt.run(category, priority, emailId);
    } else {
      const stmt = db.prepare(`
        UPDATE emails 
        SET category = ?, status = 'classified'
        WHERE id = ?
      `);
      runResult = stmt.run(category, emailId);
    }

    db.close();

    if (runResult.changes === 0) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Email reclassified successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to update email in database' }, { status: 500 });
  }
}
