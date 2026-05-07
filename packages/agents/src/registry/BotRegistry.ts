import { OAuthIntegrationBeast } from '../beasts/base/OAuthIntegrationBeast';
import { MetaBot } from '../beasts/MetaBeast';
import { InstagramBot } from '../beasts/InstagramBeast';

// Future bots will be imported here automatically when we add them
// import { NotionBot } from '../beasts/NotionBot';
// import { SlackBot } from '../beasts/SlackBot';
// import { LinearBot } from '../beasts/LinearBot';

export class BotRegistry {
  private static instance: BotRegistry;
  private bots: Map<string, OAuthIntegrationBeast> = new Map();

  private constructor() {
    // Register core bots
    this.register(new MetaBot());
    this.register(new InstagramBot());
    // Add more here as they are created
  }

  static getInstance(): BotRegistry {
    if (!BotRegistry.instance) {
      BotRegistry.instance = new BotRegistry();
    }
    return BotRegistry.instance;
  }

  register(bot: OAuthIntegrationBeast) {
    this.bots.set(bot.name, bot);
  }

  getBot(name: string): OAuthIntegrationBeast | undefined {
    return this.bots.get(name);
  }

  getAllBots(): OAuthIntegrationBeast[] {
    return Array.from(this.bots.values());
  }

  getBotsByCategory(category: string): OAuthIntegrationBeast[] {
    // In future we can add category metadata to bots
    return this.getAllBots();
  }

  getConnectedBots(): OAuthIntegrationBeast[] {
    return this.getAllBots().filter(bot => bot.isConnected());
  }
}
