import { OAuthService } from '../../services/OAuthService';

export interface BeastToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  scope: string[];
}

export interface BeastStatus {
  connected: boolean;
  tokenHealthy: boolean;
  lastUsed?: Date;
  expiresAt?: Date;
}

export abstract class OAuthIntegrationBeast {
  abstract name: string;
  abstract provider: string;
  abstract scopes: string[];
  abstract sigil: string;
  abstract backstory: string;
  abstract capabilities: string[];

  protected token?: BeastToken;
  protected status: BeastStatus = { connected: false, tokenHealthy: false };

  private oauthService = OAuthService.getInstance();

  // Core OAuth methods - bots can override or use defaults
  async initiateOAuthFlow(redirectUri: string): Promise<string> {
    const clientId = process.env[`${this.provider.toUpperCase()}_CLIENT_ID`] || 'YOUR_CLIENT_ID';
    return this.oauthService.buildAuthorizationUrl(this.provider, clientId, redirectUri, this.scopes);
  }

  async handleOAuthCallback(code: string, redirectUri: string): Promise<BeastToken> {
    const clientId = process.env[`${this.provider.toUpperCase()}_CLIENT_ID`] || 'YOUR_CLIENT_ID';
    const clientSecret = process.env[`${this.provider.toUpperCase()}_CLIENT_SECRET`] || 'YOUR_CLIENT_SECRET';

    const token = await this.oauthService.exchangeCodeForTokens(
      this.provider,
      code,
      redirectUri,
      clientId,
      clientSecret
    );

    this.token = token;
    this.status = {
      connected: true,
      tokenHealthy: true,
      lastUsed: new Date(),
      expiresAt: token.expiresAt,
    };

    return token;
  }

  // Token management
  async refreshToken(): Promise<BeastToken> {
    if (!this.token?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const clientId = process.env[`${this.provider.toUpperCase()}_CLIENT_ID`] || 'YOUR_CLIENT_ID';
    const clientSecret = process.env[`${this.provider.toUpperCase()}_CLIENT_SECRET`] || 'YOUR_CLIENT_SECRET';

    const newToken = await this.oauthService.refreshAccessToken(
      this.provider,
      this.token.refreshToken,
      clientId,
      clientSecret
    );

    this.token = newToken;
    this.status = {
      ...this.status,
      tokenHealthy: true,
      expiresAt: newToken.expiresAt,
    };

    return newToken;
  }

  getStatus(): BeastStatus {
    return this.status;
  }

  isConnected(): boolean {
    return this.status.connected && this.status.tokenHealthy;
  }

  // High-level capabilities (to be overridden by specific bots)
  async executeCapability(capability: string, params: any): Promise<any> {
    throw new Error(`Capability ${capability} not implemented in ${this.name}`);
  }
}
