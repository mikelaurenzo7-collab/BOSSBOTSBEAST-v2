export abstract class OAuthIntegrationBeast {
  abstract name: string;
  abstract provider: string;
  abstract scopes: string[];
  abstract sigil: string;
  abstract backstory: string;

  // OAuth flow methods will be implemented here later
  async connect() {
    // Placeholder for OAuth flow
    console.log(`Connecting ${this.name}...`);
  }
}