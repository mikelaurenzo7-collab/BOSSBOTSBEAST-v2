import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../../../packages/db/src/client';
import { beastConnections } from '../../../../../packages/db/src/schema';
import { eq, and } from 'drizzle-orm';
import { encrypt, decrypt } from '../../../../../packages/db/src/encryption';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { beastType } = await request.json();

  const [conn] = await db.select().from(beastConnections).where(and(eq(beastConnections.userId, userId), eq(beastConnections.beastType, beastType)));
  if (!conn?.refreshToken) return NextResponse.json({ error: 'No refresh token' }, { status: 400 });

  const provider = beastType.toLowerCase().replace('bot', '');
  const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`];
  const clientSecret = process.env[`${provider.toUpperCase()}_CLIENT_SECRET`];

  try {
    // Generic refresh (customize per provider)
    const res = await fetch('https://api.example.com/oauth/refresh', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        refresh_token: decrypt(conn.refreshToken),
        grant_type: 'refresh_token'
      })
    });
    const newTokens = await res.json();

    await db.update(beastConnections).set({
      accessToken: encrypt(newTokens.access_token),
      refreshToken: newTokens.refresh_token ? encrypt(newTokens.refresh_token) : conn.refreshToken,
      expiresAt: new Date(Date.now() + (newTokens.expires_in || 3600) * 1000),
      updatedAt: new Date()
    }).where(eq(beastConnections.id, conn.id));

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Refresh failed' }, { status: 500 });
  }
}
