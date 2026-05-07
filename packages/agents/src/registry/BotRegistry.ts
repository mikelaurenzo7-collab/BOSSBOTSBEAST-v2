import { OAuthIntegrationBeast } from '../beasts/base/OAuthIntegrationBeast';
import { MetaBot } from '../beasts/MetaBeast';
import { InstagramBot } from '../beasts/InstagramBeast';
import { SlackBot } from '../beasts/SlackBot';
import { LinearBot } from '../beasts/LinearBot';
import { NotionBot } from '../beasts/NotionBot';

export class BotRegistry {
  private static instance: BotRegistry;
  private bots: Map<string, OAuthIntegrationBeast> = new Map();

  private constructor() {
    this.register(new MetaBot());
    this.register(new InstagramBot());
    this.register(new SlackBot());
    this.register(new LinearBot());
    this.register(new NotionBot());
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
}
