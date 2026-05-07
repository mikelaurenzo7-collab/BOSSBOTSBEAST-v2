import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../../../packages/db/src/client';
import { beastConnections } from '../../../../../packages/db/src/schema';
import { encrypt } from '../../../../../packages/db/src/encryption';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.redirect('/?oauth_error=unauthorized');

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const bot = searchParams.get('bot');
  const error = searchParams.get('error');

  if (error) return NextResponse.redirect(`/?oauth_error=${error}&bot=${bot}`);
  if (!code || !bot) return NextResponse.redirect('/?oauth_error=missing_params');

  const provider = bot.toLowerCase().replace('bot', '');
  const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`];
  const clientSecret = process.env[`${provider.toUpperCase()}_CLIENT_SECRET`];
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/oauth/callback?bot=${bot}`;

  try {
    // Exchange code for token (simplified - real implementation per provider)
    let tokenData: any = {};
    
    if (provider === 'meta' || provider === 'instagram') {
      const res = await fetch(`https://graph.facebook.com/v21.0/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`);
      tokenData = await res.json();
    } else if (provider === 'github') {
      const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new URLSearchParams({ client_id: clientId!, client_secret: clientSecret!, code, redirect_uri: redirectUri })
      });
      tokenData = await res.json();
    } else {
      // For other providers, store the code for now (real exchange would be similar)
      tokenData = { access_token: code, token_type: 'bearer' };
    }

    const accessToken = tokenData.access_token || code;

    await db.insert(beastConnections).values({
      userId,
      beastType: bot,
      provider,
      accessToken: encrypt(accessToken),
      refreshToken: tokenData.refresh_token ? encrypt(tokenData.refresh_token) : null,
      scopes: tokenData.scope ? tokenData.scope.split(',') : [],
      accountName: 'Connected Account',
      isActive: true,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    });

    return NextResponse.redirect(`/?oauth_success=true&bot=${bot}`);
  } catch (e) {
    console.error('OAuth error:', e);
    return NextResponse.redirect(`/?oauth_error=exchange_failed&bot=${bot}`);
  }
}
