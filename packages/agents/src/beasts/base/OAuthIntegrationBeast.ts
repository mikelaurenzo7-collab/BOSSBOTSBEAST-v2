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

  // Core OAuth methods
  abstract initiateOAuthFlow(redirectUri: string): Promise<string>;
  abstract handleOAuthCallback(code: string, state?: string): Promise<BeastToken>;

  // Token management
  async refreshToken(): Promise<BeastToken> {
    // To be implemented with provider-specific logic
    throw new Error('refreshToken not implemented');
  }

  getStatus(): BeastStatus {
    return this.status;
  }

  isConnected(): boolean {
    return this.status.connected && this.status.tokenHealthy;
  }

  // High-level capabilities (to be overridden)
  async executeCapability(capability: string, params: any): Promise<any> {
    throw new Error(`Capability ${capability} not implemented in ${this.name}`);
  }
}
