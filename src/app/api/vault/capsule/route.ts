import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const db = await getDb();
  return NextResponse.json({ capsules: db.data.timeCapsules, guardianMode: db.data.guardianMode });
}

export async function POST(req: Request) {
  const data = await req.json();
  const db = await getDb();
  const newCapsule = { id: uuidv4(), ...data };
  db.data.timeCapsules.push(newCapsule);
  await db.write();
  return NextResponse.json({ capsules: db.data.timeCapsules });
}
