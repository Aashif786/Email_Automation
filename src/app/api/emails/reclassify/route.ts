import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { emailId, category, priority, reclassifiedBy } = body;

    if (!emailId || !category) {
      return NextResponse.json({ error: 'Missing required fields: emailId, category' }, { status: 400 });
    }

    const dbPath = process.env.SQLITE_DB_PATH || './caldim_postmaster.db';
    const db = new Database(dbPath);

    // Fetch the current email to capture the original AI category for the audit trail
    const existing: any = db
      .prepare('SELECT category, originalCategory FROM emails WHERE id = ?')
      .get(emailId);

    if (!existing) {
      db.close();
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    // Preserve the very first AI-assigned category — never overwrite if already set
    const originalCategory = existing.originalCategory || existing.category;
    const reclassifiedAt = new Date().toISOString();
    const actor = reclassifiedBy || 'user'; // placeholder until auth is implemented

    let stmt;
    if (priority) {
      stmt = db.prepare(`
        UPDATE emails
        SET
          category         = ?,
          priority         = ?,
          status           = 'manually_reclassified',
          originalCategory = ?,
          reclassifiedAt   = ?,
          reclassifiedBy   = ?
        WHERE id = ?
      `);
      stmt.run(category, priority, originalCategory, reclassifiedAt, actor, emailId);
    } else {
      stmt = db.prepare(`
        UPDATE emails
        SET
          category         = ?,
          status           = 'manually_reclassified',
          originalCategory = ?,
          reclassifiedAt   = ?,
          reclassifiedBy   = ?
        WHERE id = ?
      `);
      stmt.run(category, originalCategory, reclassifiedAt, actor, emailId);
    }

    db.close();

    return NextResponse.json({
      success: true,
      message: 'Email reclassified successfully',
      audit: {
        emailId,
        originalCategory,
        newCategory: category,
        reclassifiedAt,
        reclassifiedBy: actor,
      },
    });
  } catch (error) {
    console.error('Reclassify Error:', error);
    return NextResponse.json({ error: 'Failed to reclassify email' }, { status: 500 });
  }
}
