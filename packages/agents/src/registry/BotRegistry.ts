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
import { IntercomBot } from '../beasts/IntercomBot';
import { ZendeskBot } from '../beasts/ZendeskBot';
import { AsanaBot } from '../beasts/AsanaBot';
import { MondayBot } from '../beasts/MondayBot';
import { ClickUpBot } from '../beasts/ClickUpBot';
import { JiraBot } from '../beasts/JiraBot';
import { ConfluenceBot } from '../beasts/ConfluenceBot';
import { DropboxBot } from '../beasts/DropboxBot';
import { GoogleDriveBot } from '../beasts/GoogleDriveBot';
import { GmailBot } from '../beasts/GmailBot';
import { CalendarBot } from '../beasts/CalendarBot';
import { SheetsBot } from '../beasts/SheetsBot';
import { DocsBot } from '../beasts/DocsBot';
import { YouTubeBot } from '../beasts/YouTubeBot';
import { TikTokBot } from '../beasts/TikTokBot';
import { LinkedInBot } from '../beasts/LinkedInBot';
import { XTwitterBot } from '../beasts/XTwitterBot';

export class BotRegistry {
  private static instance: BotRegistry;
  private bots: Map<string, OAuthIntegrationBeast> = new Map();

  private constructor() {
    this.register(new MetaBot()); this.register(new InstagramBot()); this.register(new SlackBot());
    this.register(new LinearBot()); this.register(new NotionBot()); this.register(new GitHubBot());
    this.register(new VercelBot()); this.register(new StripeBot()); this.register(new HubSpotBot());
    this.register(new SalesforceBot()); this.register(new AirtableBot()); this.register(new FigmaBot());
    this.register(new WebflowBot()); this.register(new ShopifyBot()); this.register(new MailchimpBot());
    this.register(new IntercomBot()); this.register(new ZendeskBot()); this.register(new AsanaBot());
    this.register(new MondayBot()); this.register(new ClickUpBot()); this.register(new JiraBot());
    this.register(new ConfluenceBot()); this.register(new DropboxBot()); this.register(new GoogleDriveBot());
    this.register(new GmailBot()); this.register(new CalendarBot()); this.register(new SheetsBot());
    this.register(new DocsBot()); this.register(new YouTubeBot()); this.register(new TikTokBot());
    this.register(new LinkedInBot()); this.register(new XTwitterBot());
  }

  static getInstance(): BotRegistry {
    if (!BotRegistry.instance) BotRegistry.instance = new BotRegistry();
    return BotRegistry.instance;
  }

  register(bot: OAuthIntegrationBeast) { this.bots.set(bot.name, bot); }
  getBot(name: string) { return this.bots.get(name); }
  getAllBots() { return Array.from(this.bots.values()); }
}
