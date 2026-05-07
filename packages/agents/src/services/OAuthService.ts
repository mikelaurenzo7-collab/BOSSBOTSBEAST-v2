import { BeastToken } from '../beasts/base/OAuthIntegrationBeast';

export class OAuthService {
  private static instance: OAuthService;

  private constructor() {}

  static getInstance(): OAuthService {
    if (!OAuthService.instance) {
      OAuthService.instance = new OAuthService();
    }
    return OAuthService.instance;
  }

  async exchangeCodeForTokens(
    provider: string,
    code: string,
    redirectUri: string,
    clientId: string,
    clientSecret: string
  ): Promise<BeastToken> {
    let tokenUrl: string;
    let body: URLSearchParams;

    if (provider === 'meta' || provider === 'instagram') {
      // Meta/Instagram use Facebook Graph API token exchange
      tokenUrl = 'https://graph.facebook.com/v21.0/oauth/access_token';
      body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      });
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token exchange failed for ${provider}: ${error}`);
    }

    const data = await response.json();

    // For Meta/Instagram, we get short-lived token. In production we should exchange for long-lived.
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || undefined,
      expiresAt: new Date(Date.now() + (data.expires_in || 3600) * 1000),
      scope: [], // Will be populated from the original request
    };
  }

  async refreshAccessToken(
    provider: string,
    refreshToken: string,
    clientId: string,
    clientSecret: string
  ): Promise<BeastToken> {
    // Simplified refresh logic - extend per provider
    if (provider === 'meta' || provider === 'instagram') {
      const url = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${refreshToken}`;
      const response = await fetch(url);
      const data = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || refreshToken,
        expiresAt: new Date(Date.now() + (data.expires_in || 5184000) * 1000), // ~60 days
        scope: [],
      };
    }

    throw new Error(`Refresh not implemented for ${provider}`);
  }

  // Helper to build the full OAuth URL (used by bots)
  buildAuthorizationUrl(
    provider: string,
    clientId: string,
    redirectUri: string,
    scopes: string[]
  ): string {
    if (provider === 'meta' || provider === 'instagram') {
      return `https://www.facebook.com/v21.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join(',')}&response_type=code`;
    }
    throw new Error(`Authorization URL not implemented for ${provider}`);
  }
}
