import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const bot = searchParams.get('bot');
  const provider = searchParams.get('provider') || bot?.toLowerCase().replace('bot', '');

  if (!bot) return NextResponse.json({ error: 'Missing bot' }, { status: 400 });

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/oauth/callback?bot=${bot}`;

  let authUrl = '';
  const clientId = process.env[`${provider?.toUpperCase()}_CLIENT_ID`];

  switch (provider) {
    case 'meta':
    case 'instagram':
      authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=pages_manage_posts,instagram_basic,business_management&response_type=code`;
      break;
    case 'github':
      authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,read:user&response_type=code`;
      break;
    case 'slack':
      authUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=chat:write,channels:read&response_type=code`;
      break;
    case 'linear':
      authUrl = `https://linear.app/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read,write&response_type=code`;
      break;
    case 'notion':
      authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
      break;
    case 'stripe':
      authUrl = `https://connect.stripe.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read_write&response_type=code`;
      break;
    default:
      return NextResponse.json({ error: 'Provider not supported yet' }, { status: 400 });
  }

  return NextResponse.redirect(authUrl);
}
