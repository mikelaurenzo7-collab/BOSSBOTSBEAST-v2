import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../packages/db/src/client';
import { beastConnections } from '../../../../../packages/db/src/schema';
import { eq, and } from 'drizzle-orm';
import { encrypt, decrypt } from '../../../../../packages/db/src/encryption';
import { auth } from '@clerk/nextjs/server';

// GET - Fetch all connections for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connections = await db
      .select()
      .from(beastConnections)
      .where(eq(beastConnections.userId, userId));

    // Decrypt tokens for client (never send raw)
    const safeConnections = connections.map(conn => ({
      ...conn,
      accessToken: conn.accessToken ? decrypt(conn.accessToken).substring(0, 8) + '...' : null,
      refreshToken: undefined,
    }));

    return NextResponse.json({ connections: safeConnections });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
  }
}

// POST - Connect a new bot (store encrypted tokens) for authenticated user
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { beastType, provider, accessToken, refreshToken, scopes, accountId, accountName } = await request.json();

    const encryptedAccess = encrypt(accessToken);
    const encryptedRefresh = refreshToken ? encrypt(refreshToken) : null;

    const [newConnection] = await db
      .insert(beastConnections)
      .values({
        userId,
        beastType,
        provider,
        accessToken: encryptedAccess,
        refreshToken: encryptedRefresh,
        scopes,
        accountId,
        accountName,
        isActive: true,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      })
      .returning();

    return NextResponse.json({ success: true, connection: newConnection });
  } catch (error) {
    console.error('Error connecting bot:', error);
    return NextResponse.json({ error: 'Failed to connect bot' }, { status: 500 });
  }
}

// PATCH - Update connection for authenticated user
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, accessToken, refreshToken } = await request.json();

    const encryptedAccess = accessToken ? encrypt(accessToken) : undefined;
    const encryptedRefresh = refreshToken ? encrypt(refreshToken) : undefined;

    const [updated] = await db
      .update(beastConnections)
      .set({
        accessToken: encryptedAccess,
        refreshToken: encryptedRefresh,
        updatedAt: new Date(),
    })
      .where(and(eq(beastConnections.id, id), eq(beastConnections.userId, userId)))
      .returning();

    return NextResponse.json({ success: true, connection: updated });
  } catch (error) {
    console.error('Error updating connection:', error);
    return NextResponse.json({ error: 'Failed to update connection' }, { status: 500 });
  }
}

// DELETE - Disconnect bot for authenticated user
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();

    await db
      .delete(beastConnections)
      .where(and(eq(beastConnections.id, id), eq(beastConnections.userId, userId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting bot:', error);
    return NextResponse.json({ error: 'Failed to disconnect bot' }, { status: 500 });
  }
}
