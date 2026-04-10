import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDb();
  return NextResponse.json({ insurance: db.data.insurance, guardianMode: db.data.guardianMode });
}

export async function POST(req: Request) {
  const data = await req.json();
  const db = await getDb();
  const newPolicy = { id: uuidv4(), ...data };
  db.data.insurance.push(newPolicy);
  await db.write();
  return NextResponse.json({ insurance: db.data.insurance });
}
