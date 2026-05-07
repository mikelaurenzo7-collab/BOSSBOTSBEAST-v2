// Base class for all OAuth-native Beasts

export abstract class OAuthIntegrationBeast {
  abstract provider: string;
  abstract scopes: string[];

  constructor(protected connectionId?: number) {}

  abstract getCapabilities(): string[];
  abstract execute(action: string, params: any): Promise<any>;

  // Token management will be injected by connection manager
  protected accessToken?: string;
  protected refreshToken?: string;
}
