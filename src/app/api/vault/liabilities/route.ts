import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDb();
  // ensure liabilities array exists in case local-db.json is missing the key
  if (!db.data.liabilities) db.data.liabilities = [];
  return NextResponse.json({ liabilities: db.data.liabilities, guardianMode: db.data.guardianMode });
}

export async function POST(req: Request) {
  const data = await req.json();
  const db = await getDb();
  if (!db.data.liabilities) db.data.liabilities = [];
  const newItem = { id: uuidv4(), ...data };
  db.data.liabilities.push(newItem);
  await db.write();
  return NextResponse.json({ liabilities: db.data.liabilities });
}
