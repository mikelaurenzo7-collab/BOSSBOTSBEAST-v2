import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../../../packages/db/src/client';
import { botSettings } from '../../../../../packages/db/src/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const beastType = searchParams.get('beastType');

  const [settings] = await db.select().from(botSettings).where(and(eq(botSettings.userId, userId), eq(botSettings.beastType, beastType || '')));
  return NextResponse.json({ settings: settings || { autonomyLevel: 70, permissions: { read: true, write: true, delete: false, notify: true }, memoryRetentionDays: 30, dailyExecutionCap: 100 } });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { beastType, autonomyLevel, permissions, customInstructions, memoryRetentionDays, dailyExecutionCap, notifyOnFailure } = await request.json();

  await db.insert(botSettings).values({
    userId, beastType, autonomyLevel, permissions, customInstructions, memoryRetentionDays, dailyExecutionCap, notifyOnFailure
  }).onConflictDoUpdate({
    target: [botSettings.userId, botSettings.beastType],
    set: { autonomyLevel, permissions, customInstructions, memoryRetentionDays, dailyExecutionCap, notifyOnFailure, updatedAt: new Date() }
  });

  return NextResponse.json({ success: true });
}
