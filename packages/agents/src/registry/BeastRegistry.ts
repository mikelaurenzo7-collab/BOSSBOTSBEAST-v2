import { OAuthIntegrationBeast } from '../beasts/base/OAuthIntegrationBeast';

// Dynamic registry for all Integration Beasts
class BeastRegistry {
  private beasts = new Map<string, OAuthIntegrationBeast>();

  register(beast: OAuthIntegrationBeast) {
    this.beasts.set(beast.provider, beast);
    console.log(`🐲 Registered ${beast.name} (${beast.provider})`);
  }

  getBeast(provider: string): OAuthIntegrationBeast | undefined {
    return this.beasts.get(provider);
  }

  getAllBeasts(): OAuthIntegrationBeast[] {
    return Array.from(this.beasts.values());
  }

  getConnectedBeasts(): OAuthIntegrationBeast[] {
    return this.getAllBeasts().filter(beast => beast.isConnected());
  }
}

export const beastRegistry = new BeastRegistry();

export default beastRegistry;
