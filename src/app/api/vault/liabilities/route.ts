import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDb();
  return NextResponse.json({ liabilities: db.data.liabilities, guardianMode: db.data.guardianMode });
}

export async function POST(req: Request) {
  const data = await req.json();
  const db = await getDb();
  const newItem = { id: uuidv4(), ...data };
  db.data.liabilities.push(newItem);
  await db.write();
  return NextResponse.json({ liabilities: db.data.liabilities });
}
