import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDb();
  return NextResponse.json({ medical: db.data.medical, guardianMode: db.data.guardianMode });
}

export async function POST(req: Request) {
  const data = await req.json();
  const db = await getDb();
  db.data.medical = { ...db.data.medical, ...data };
  await db.write();
  return NextResponse.json({ medical: db.data.medical });
}
