import { OAuthIntegrationBeast } from './base/OAuthIntegrationBeast';

export class InstagramBeast extends OAuthIntegrationBeast {
  name = 'InstagramBeast';
  provider = 'instagram';
  scopes = ['instagram_basic', 'instagram_content_publish', 'instagram_manage_comments', 'pages_read_engagement'];
  sigil = '📸';
  backstory = 'The InstagramBeast is the sovereign ruler of visual storytelling. It masters the Instagram Graph API for professional and creator accounts — posting, stories, comments, and deep analytics.';

  capabilities = ['Publish Posts & Reels', 'Manage Stories', 'Reply to Comments', 'Access Insights & Analytics'];
}