import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const bot = searchParams.get('bot');
  const provider = (searchParams.get('provider') || bot?.toLowerCase().replace('bot', '') || '').toLowerCase();

  if (!bot) return NextResponse.json({ error: 'Missing bot' }, { status: 400 });

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/oauth/callback?bot=${bot}`;
  const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`];

  const providerUrls: Record<string, string> = {
    meta: `https://www.facebook.com/v21.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=pages_manage_posts,instagram_basic,business_management&response_type=code`,
    instagram: `https://www.facebook.com/v21.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=pages_manage_posts,instagram_basic,business_management&response_type=code`,
    github: `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,read:user&response_type=code`,
    slack: `https://slack.com/oauth/v2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=chat:write,channels:read&response_type=code`,
    linear: `https://linear.app/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read,write&response_type=code`,
    notion: `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`,
    stripe: `https://connect.stripe.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read_write&response_type=code`,
    hubspot: `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=contacts,content&response_type=code`,
    salesforce: `https://login.salesforce.com/services/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=api&response_type=code`,
    airtable: `https://airtable.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=data.records:read,data.records:write&response_type=code`,
    figma: `https://www.figma.com/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=files:read,files:write&response_type=code`,
    webflow: `https://webflow.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=authorized_user&response_type=code`,
    shopify: `https://shopify.com/admin/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read_products,write_products&response_type=code`,
    mailchimp: `https://login.mailchimp.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read,write&response_type=code`,
    intercom: `https://app.intercom.com/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read,write&response_type=code`,
    zendesk: `https://accounts.zendesk.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read,write&response_type=code`,
    asana: `https://app.asana.com/-/oauth_authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=default&response_type=code`,
    monday: `https://auth.monday.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=boards:read,boards:write&response_type=code`,
    clickup: `https://app.clickup.com/api/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=tasks:read,tasks:write&response_type=code`,
    jira: `https://auth.atlassian.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:jira-work,write:jira-work&response_type=code`,
    confluence: `https://auth.atlassian.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:confluence-content.all,write:confluence-content&response_type=code`,
    dropbox: `https://www.dropbox.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=files.metadata.read,files.content.write&response_type=code`,
    googledrive: `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=https://www.googleapis.com/auth/drive.file&response_type=code`,
    gmail: `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=https://www.googleapis.com/auth/gmail.send&response_type=code`,
    calendar: `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=https://www.googleapis.com/auth/calendar&response_type=code`,
    sheets: `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=https://www.googleapis.com/auth/spreadsheets&response_type=code`,
    docs: `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=https://www.googleapis.com/auth/documents&response_type=code`,
    youtube: `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=https://www.googleapis.com/auth/youtube.upload&response_type=code`,
    tiktok: `https://www.tiktok.com/auth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user.info.basic,video.list&response_type=code`,
    linkedin: `https://www.linkedin.com/oauth/v2/authorization?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=r_liteprofile,w_member_social&response_type=code`,
    xtwitter: `https://api.twitter.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=tweet.read,tweet.write&response_type=code`
  };

  const authUrl = providerUrls[provider] || providerUrls['meta'];
  return NextResponse.redirect(authUrl);
}
