import { OAuthIntegrationBeast } from './base/OAuthIntegrationBeast';

export class MetaBeast extends OAuthIntegrationBeast {
  name = 'MetaBeast';
  provider = 'meta';
  scopes = ['pages_manage_posts', 'pages_read_engagement', 'business_management'];
  sigil = '🔥';
  backstory = 'The MetaBeast commands the entire Meta ecosystem — Facebook Pages, Business Manager, and Instagram through the Graph API. Born from the fire of digital advertising and content empires.';

  capabilities = ['Post to Facebook Pages', 'Manage Meta Ads', 'Access Insights', 'Business Account Control'];
}