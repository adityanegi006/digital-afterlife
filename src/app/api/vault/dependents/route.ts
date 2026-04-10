import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDb();
  return NextResponse.json({ dependents: db.data.dependents, guardianMode: db.data.guardianMode });
}

export async function POST(req: Request) {
  const data = await req.json();
  const db = await getDb();
  db.data.dependents = { ...db.data.dependents, ...data };
  await db.write();
  return NextResponse.json({ dependents: db.data.dependents });
}
