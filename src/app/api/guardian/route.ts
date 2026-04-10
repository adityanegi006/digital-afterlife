import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = await getDb();
  return NextResponse.json({ guardianMode: db.data.guardianMode });
}

export async function POST() {
  const db = await getDb();
  db.data.guardianMode = !db.data.guardianMode;
  await db.write();
  return NextResponse.json({ guardianMode: db.data.guardianMode });
}
