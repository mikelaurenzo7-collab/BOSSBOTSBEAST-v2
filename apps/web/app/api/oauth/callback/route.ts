import { NextRequest, NextResponse } from 'next/server';
import { OAuthService } from '../../../../../packages/agents/src/services/OAuthService';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const botName = searchParams.get('bot');
  const state = searchParams.get('state');

  if (!code || !botName) {
    return NextResponse.redirect(
      new URL('/?oauth_error=missing_code', request.url)
    );
  }

  try {
    const oauthService = OAuthService.getInstance();
    
    // In production, you would look up the bot from BotRegistry
    // For now, we use the provider from the bot name
    const provider = botName.toLowerCase().replace('bot', '');
    
    const redirectUri = `${request.nextUrl.origin}/api/oauth/callback?bot=${botName}`;
    
    const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`] || '';
    const clientSecret = process.env[`${provider.toUpperCase()}_CLIENT_SECRET`] || '';

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        new URL(`/?oauth_error=missing_credentials&bot=${botName}`, request.url)
      );
    }

    const token = await oauthService.exchangeCodeForTokens(
      provider,
      code,
      redirectUri,
      clientId,
      clientSecret
    );

    // In production: store token in database (Vercel Postgres + Drizzle)
    // For now: pass token info via URL params (demo only)
    const successUrl = new URL('/', request.url);
    successUrl.searchParams.set('oauth_success', 'true');
    successUrl.searchParams.set('bot', botName);
    successUrl.searchParams.set('token_preview', token.accessToken.substring(0, 8) + '...');

    return NextResponse.redirect(successUrl);

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/?oauth_error=exchange_failed&bot=${botName}`, request.url)
    );
  }
}
