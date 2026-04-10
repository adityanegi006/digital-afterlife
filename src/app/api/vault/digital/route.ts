import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDb();
  return NextResponse.json({ subscriptions: db.data.subscriptions || [], guardianMode: db.data.guardianMode });
}

export async function POST(req: Request) {
  const { service, actionRequired } = await req.json();
  const db = await getDb();
  const newSub = { id: uuidv4(), service, actionRequired };
  db.data.subscriptions = db.data.subscriptions || [];
  db.data.subscriptions.push(newSub);
  await db.write();
  return NextResponse.json({ subscriptions: db.data.subscriptions });
}
