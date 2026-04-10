import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDb();
  return NextResponse.json({ documents: db.data.importantDocs, guardianMode: db.data.guardianMode });
}

export async function POST(req: Request) {
  const { title, filePath, notes } = await req.json();
  const db = await getDb();
  const newDoc = { id: uuidv4(), title, filePath, notes };
  db.data.importantDocs.push(newDoc);
  await db.write();
  return NextResponse.json({ documents: db.data.importantDocs });
}
