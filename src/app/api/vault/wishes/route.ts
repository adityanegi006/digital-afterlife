import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDb();
  return NextResponse.json({ wishes: db.data.finalWishes, guardianMode: db.data.guardianMode });
}

export async function POST(req: Request) {
  const data = await req.json();
  const db = await getDb();
  db.data.finalWishes = { ...db.data.finalWishes, ...data };
  await db.write();
  return NextResponse.json({ wishes: db.data.finalWishes });
}
