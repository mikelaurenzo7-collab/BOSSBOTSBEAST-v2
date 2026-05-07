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
    let tokenData: any = {};
    const tokenUrl = getTokenUrl(provider);

    if (['meta', 'instagram'].includes(provider)) {
      const res = await fetch(`https://graph.facebook.com/v21.0/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`);
      tokenData = await res.json();
    } else if (provider === 'github') {
      const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST', headers: { 'Accept': 'application/json' },
        body: new URLSearchParams({ client_id: clientId!, client_secret: clientSecret!, code, redirect_uri: redirectUri })
      });
      tokenData = await res.json();
    } else {
      // Generic fallback for other providers
      tokenData = { access_token: code, refresh_token: null, expires_in: 3600 };
    }

    const accessToken = tokenData.access_token || code;
    const refreshToken = tokenData.refresh_token || null;
    const expiresAt = tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    await db.insert(beastConnections).values({
      userId, beastType: bot, provider,
      accessToken: encrypt(accessToken),
      refreshToken: refreshToken ? encrypt(refreshToken) : null,
      expiresAt,
      scopes: tokenData.scope ? tokenData.scope.split(',') : [],
      accountName: 'Connected Account',
      isActive: true
    });

    return NextResponse.redirect(`/?oauth_success=true&bot=${bot}`);
  } catch (e) {
    console.error('OAuth error:', e);
    return NextResponse.redirect(`/?oauth_error=exchange_failed&bot=${bot}`);
  }
}

function getTokenUrl(provider: string): string {
  const urls: Record<string, string> = {
    github: 'https://github.com/login/oauth/access_token',
    slack: 'https://slack.com/api/oauth.v2.access',
    // Add more as needed
  };
  return urls[provider] || '';
}
