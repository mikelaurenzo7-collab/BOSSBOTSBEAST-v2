import { OAuthIntegrationBeast } from '../beasts/base/OAuthIntegrationBeast';
import { MetaBot } from '../beasts/MetaBeast';
import { InstagramBot } from '../beasts/InstagramBeast';
import { SlackBot } from '../beasts/SlackBot';
import { LinearBot } from '../beasts/LinearBot';
import { NotionBot } from '../beasts/NotionBot';
import { GitHubBot } from '../beasts/GitHubBot';
import { VercelBot } from '../beasts/VercelBot';
import { StripeBot } from '../beasts/StripeBot';
import { HubSpotBot } from '../beasts/HubSpotBot';
import { SalesforceBot } from '../beasts/SalesforceBot';
import { AirtableBot } from '../beasts/AirtableBot';
import { FigmaBot } from '../beasts/FigmaBot';
import { WebflowBot } from '../beasts/WebflowBot';
import { ShopifyBot } from '../beasts/ShopifyBot';
import { MailchimpBot } from '../beasts/MailchimpBot';

export class BotRegistry {
  private static instance: BotRegistry;
  private bots: Map<string, OAuthIntegrationBeast> = new Map();

  private constructor() {
    this.register(new MetaBot());
    this.register(new InstagramBot());
    this.register(new SlackBot());
    this.register(new LinearBot());
    this.register(new NotionBot());
    this.register(new GitHubBot());
    this.register(new VercelBot());
    this.register(new StripeBot());
    this.register(new HubSpotBot());
    this.register(new SalesforceBot());
    this.register(new AirtableBot());
    this.register(new FigmaBot());
    this.register(new WebflowBot());
    this.register(new ShopifyBot());
    this.register(new MailchimpBot());
    // Remaining 17 bots added in full Phase 4 rollout (Intercom, Zendesk, Asana, Monday, ClickUp, Jira, Confluence, Dropbox, GoogleDrive, Gmail, Calendar, Sheets, Docs, YouTube, TikTok, LinkedIn, XTwitter)
  }

  static getInstance(): BotRegistry {
    if (!BotRegistry.instance) BotRegistry.instance = new BotRegistry();
    return BotRegistry.instance;
  }

  register(bot: OAuthIntegrationBeast) { this.bots.set(bot.name, bot); }
  getBot(name: string) { return this.bots.get(name); }
  getAllBots() { return Array.from(this.bots.values()); }
}
