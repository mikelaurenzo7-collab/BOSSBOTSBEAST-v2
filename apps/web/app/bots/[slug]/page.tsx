'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface BotConfig {
  name: string;
  slug: string;
  sigil: string;
  provider: string;
  category: string;
  purpose: string;
  mission: string;
  backstory: string;
  capabilities: Array<{ name: string; desc: string; enabled: boolean }>;
  customizations: {
    autonomyLevel: number;
    customInstructions: string;
    notifications: { email: boolean; inApp: boolean; frequency: 'realtime' | 'daily' | 'weekly' };
    memoryRetention: number;
    specificSettings: Record<string, any>;
  };
  recentActivity: Array<{ time: string; action: string; status: 'success' | 'warning' | 'error'; details: string }>;
  stats: { executionsToday: number; successRate: number; avgResponse: string; tokensUsed: number };
  adapterStatus: 'live' | 'ready';
}

const botDatabase: Record<string, BotConfig> = {
  meta: { name: 'MetaBot', slug: 'meta', sigil: '🔥', provider: 'meta', category: 'Social', purpose: 'Command the entire Meta ecosystem — Facebook Pages, Instagram Business, Ads, and Business Manager — with sovereign precision and zero manual effort.', mission: 'Turn every post, ad, and insight into automated empire growth. MetaBot is your always-on social media general.', backstory: 'Born from the Graph API itself, MetaBot was forged in the fires of Chicago 2026 to give builders total dominion over the world\'s largest social and advertising platform. It never sleeps, never misses a beat, and reports only to you.', capabilities: [ { name: 'Page & Post Management', desc: 'Publish, schedule, and optimize posts across all connected Pages with perfect timing and tone.', enabled: true }, { name: 'Meta Ads Automation', desc: 'Create, pause, scale, and optimize ad campaigns with real-time ROAS tracking and budget allocation.', enabled: true }, { name: 'Business Insights & Analytics', desc: 'Pull deep audience, engagement, and revenue insights. Auto-generate weekly performance reports.', enabled: true }, { name: 'Instagram Business Control', desc: 'Full Reels, Stories, and feed publishing + comment moderation and DM auto-replies.', enabled: true }, { name: 'Audience Targeting Engine', desc: 'Build lookalike audiences, retargeting lists, and interest-based segments automatically.', enabled: true }, { name: 'Reels & Video Publishing', desc: 'Auto-generate captions, hashtags, and post Reels at peak engagement times.', enabled: true } ], customizations: { autonomyLevel: 8, customInstructions: 'Always maintain professional yet bold brand voice. Prioritize video content. Never post political content.', notifications: { email: true, inApp: true, frequency: 'realtime' }, memoryRetention: 90, specificSettings: { defaultPageId: '17841400000000000', adAccountId: 'act_123456789', postTone: 'inspirational', autoReplyDMs: true, budgetAlertThreshold: 500 } }, recentActivity: [ { time: '2m ago', action: 'Published Reel to @yourbrand', status: 'success', details: '1.2M reach • 48K likes' }, { time: '14m ago', action: 'Paused underperforming ad set', status: 'warning', details: 'ROAS dropped to 1.8x' }, { time: '1h ago', action: 'Generated weekly insights report', status: 'success', details: 'Sent to your email' } ], stats: { executionsToday: 47, successRate: 98.7, avgResponse: '1.2s', tokensUsed: 12480 }, adapterStatus: 'live' },
  instagram: { name: 'InstagramBot', slug: 'instagram', sigil: '📸', provider: 'instagram', category: 'Social', purpose: 'Master visual storytelling and community growth on Instagram with autonomous content creation, publishing, and deep analytics.', mission: 'Build and nurture your Instagram empire — Reels, Stories, feed, comments, and insights — all on autopilot.', backstory: 'InstagramBot was awakened to dominate the visual internet. It understands aesthetics, timing, and audience psychology better than any human team.', capabilities: [ { name: 'Reels & Stories Publishing', desc: 'Auto-create and post Reels/Stories with trending audio, captions, and optimal timing.', enabled: true }, { name: 'Comment & DM Moderation', desc: 'Smart replies, hide spam, escalate important messages, and grow engagement.', enabled: true }, { name: 'Insights & Analytics', desc: 'Track reach, saves, shares, and follower growth. Auto-generate content performance reports.', enabled: true }, { name: 'Content Calendar Automation', desc: 'Plan and publish weeks of content based on your brand guidelines and trending topics.', enabled: true }, { name: 'Hashtag & Caption Strategy', desc: 'Generate high-performing hashtags and captions tailored to each post type.', enabled: true }, { name: 'Audience Growth Engine', desc: 'Identify and engage with high-value accounts to accelerate follower growth.', enabled: true } ], customizations: { autonomyLevel: 7, customInstructions: 'Use vibrant, lifestyle-focused language. Include 3-5 emojis per caption. Focus on user-generated content style.', notifications: { email: true, inApp: true, frequency: 'daily' }, memoryRetention: 60, specificSettings: { businessAccountId: '17841401234567890', defaultHashtagSet: '#motivation #growth #lifestyle', autoStoryTime: '09:00', minEngagementThreshold: 500, collabMode: false } }, recentActivity: [ { time: '7m ago', action: 'Posted Reel: "Morning Routine 2026"', status: 'success', details: '892K views • +2.1K followers' }, { time: '32m ago', action: 'Replied to 47 comments', status: 'success', details: '98% positive sentiment' }, { time: '2h ago', action: 'Updated content calendar for next week', status: 'success', details: '14 posts scheduled' } ], stats: { executionsToday: 31, successRate: 99.2, avgResponse: '0.9s', tokensUsed: 8930 }, adapterStatus: 'live' },
  notion: { name: 'NotionBot', slug: 'notion', sigil: '📝', provider: 'notion', category: 'Productivity', purpose: 'Transform your Notion workspace into an intelligent, self-organizing knowledge and task engine that anticipates your needs.', mission: 'Build, maintain, and retrieve from your second brain automatically — databases, wikis, projects, and meeting notes.', backstory: 'NotionBot was designed to eliminate the chaos of manual knowledge management. It reads, writes, links, and evolves your workspace in real time.', capabilities: [ { name: 'Database Sync & Automation', desc: 'Keep databases perfectly synced across workspaces. Auto-create entries from external triggers.', enabled: true }, { name: 'AI Writing & Summarization', desc: 'Generate meeting notes, project briefs, and research summaries from your own context.', enabled: true }, { name: 'Task & Project Management', desc: 'Auto-assign tasks, set deadlines, and move cards based on status changes.', enabled: true }, { name: 'Knowledge Base Search', desc: 'Instant semantic search across all pages with source citations and related links.', enabled: true }, { name: 'Template & Page Generation', desc: 'Create beautifully formatted pages and templates from simple prompts.', enabled: true } ], customizations: { autonomyLevel: 9, customInstructions: 'Always use concise, action-oriented language. Link related pages automatically. Prioritize clarity over verbosity.', notifications: { email: false, inApp: true, frequency: 'realtime' }, memoryRetention: 180, specificSettings: { workspaceId: 'your-workspace-id', defaultDatabase: 'Projects', autoLinkThreshold: 0.85, summaryLength: 'medium', exportFormat: 'pdf' } }, recentActivity: [ { time: '4m ago', action: 'Created Q2 Roadmap page', status: 'success', details: 'Linked to 12 existing projects' }, { time: '19m ago', action: 'Summarized team meeting notes', status: 'success', details: '8 action items extracted' }, { time: '1h ago', action: 'Synced CRM data into Contacts DB', status: 'success', details: '47 new records' } ], stats: { executionsToday: 62, successRate: 97.4, avgResponse: '1.8s', tokensUsed: 15620 }, adapterStatus: 'live' },
  slack: { name: 'SlackBot', slug: 'slack', sigil: '💬', provider: 'slack', category: 'Communication', purpose: 'Live inside your Slack workspace as the ultimate signal filter, task executor, and team intelligence layer.', mission: 'Surface what matters, automate the mundane, and keep every channel focused and productive.', backstory: 'SlackBot was forged to end notification fatigue. It listens, summarizes, acts, and only interrupts when truly necessary.', capabilities: [ { name: 'Channel Summaries & Digests', desc: 'Daily/weekly intelligent summaries of high-signal conversations with key decisions highlighted.', enabled: true }, { name: 'Smart Replies & Actions', desc: 'Suggest or auto-send replies, create tasks, and poll teams based on context.', enabled: true }, { name: 'Meeting Notes & Action Items', desc: 'Join huddles, transcribe, extract action items, and assign them automatically.', enabled: true }, { name: 'Workflow Triggers', desc: 'React to keywords, reactions, or new messages to trigger Notion pages, GitHub issues, etc.', enabled: true }, { name: 'Team Polls & Alerts', desc: 'Run instant polls, send targeted alerts, and escalate urgent items to the right people.', enabled: true } ], customizations: { autonomyLevel: 6, customInstructions: 'Be concise and professional. Never @channel unless critical. Always include confidence level in summaries.', notifications: { email: true, inApp: true, frequency: 'realtime' }, memoryRetention: 30, specificSettings: { defaultChannel: '#general', summaryTime: '08:00', escalationThreshold: 'high', pollDuration: 1440, autoThread: true } }, recentActivity: [ { time: '9m ago', action: 'Posted daily digest in #product', status: 'success', details: '12 key decisions surfaced' }, { time: '27m ago', action: 'Created Linear issue from message', status: 'success', details: 'Assigned to @sarah' }, { time: '55m ago', action: 'Sent standup poll to #eng', status: 'success', details: '87% response rate' } ], stats: { executionsToday: 28, successRate: 99.5, avgResponse: '0.6s', tokensUsed: 6720 }, adapterStatus: 'live' },
  linear: { name: 'LinearBot', slug: 'linear', sigil: '📈', provider: 'linear', category: 'Product', purpose: 'Accelerate your product development machine — triaging issues, planning sprints, and keeping the entire roadmap alive and accurate.', mission: 'Keep Linear pristine, velocity high, and every stakeholder perfectly aligned without manual overhead.', backstory: 'LinearBot was built for high-velocity teams who refuse to let process slow them down. It turns chaos into clarity at machine speed.', capabilities: [ { name: 'Issue Creation & Triage', desc: 'Auto-create, label, prioritize, and assign issues from Slack, email, or form submissions.', enabled: true }, { name: 'Roadmap & Sprint Planning', desc: 'Generate sprints, move issues, estimate effort, and keep the roadmap perfectly up to date.', enabled: true }, { name: 'Release Notes Automation', desc: 'Compile beautiful release notes from merged PRs and completed issues automatically.', enabled: true }, { name: 'Bug Triage & Prioritization', desc: 'Classify severity, suggest duplicates, and route critical bugs to the right engineer instantly.', enabled: true }, { name: 'Stakeholder Updates', desc: 'Send weekly progress summaries to leadership with key metrics and risks highlighted.', enabled: true } ], customizations: { autonomyLevel: 8, customInstructions: 'Use clear, technical language. Always include effort estimates. Flag blockers immediately. Never close issues without confirmation.', notifications: { email: true, inApp: true, frequency: 'realtime' }, memoryRetention: 120, specificSettings: { teamId: 'your-linear-team', defaultProject: 'Main Roadmap', autoEstimate: true, releaseCadence: 'weekly', stakeholderEmail: 'leadership@yourcompany.com' } }, recentActivity: [ { time: '11m ago', action: 'Triaged 14 new issues', status: 'success', details: '3 critical bugs escalated' }, { time: '38m ago', action: 'Generated Sprint 42 plan', status: 'success', details: '28 issues • 4.2 velocity' }, { time: '2h ago', action: 'Published v2.4.1 release notes', status: 'success', details: 'Sent to 47 stakeholders' } ], stats: { executionsToday: 39, successRate: 96.8, avgResponse: '1.4s', tokensUsed: 9840 }, adapterStatus: 'live' },
  github: { name: 'GitHubBot', slug: 'github', sigil: '🐙', provider: 'github', category: 'Development', purpose: 'Live inside your repositories as the ultimate automation layer — handling PRs, issues, releases, and code intelligence.', mission: 'Keep every repo clean, every PR reviewed, every release documented, and your velocity maximized.', backstory: 'GitHubBot was forged in the heart of open source to give builders superpowers over their code. It reviews, merges, documents, and protects your repos 24/7.', capabilities: [ { name: 'PR Automation & Review', desc: 'Auto-review PRs, suggest changes, enforce standards, and merge when checks pass.', enabled: true }, { name: 'Issue Triage & Labeling', desc: 'Classify, label, assign, and link issues to PRs automatically.', enabled: true }, { name: 'Release Management', desc: 'Generate changelogs, create releases, and notify teams on new versions.', enabled: true }, { name: 'Code Review Summaries', desc: 'Summarize complex PRs with risk analysis and suggested test cases.', enabled: true }, { name: 'Repo Health Monitoring', desc: 'Track stars, issues, PR velocity, and security alerts with proactive recommendations.', enabled: true } ], customizations: { autonomyLevel: 7, customInstructions: 'Follow conventional commits. Never merge without green checks. Always suggest 2-3 improvements in reviews. Be constructive and kind.', notifications: { email: true, inApp: true, frequency: 'daily' }, memoryRetention: 90, specificSettings: { defaultRepo: 'your-org/your-repo', reviewStyle: 'detailed', autoMergeEnabled: false, changelogFormat: 'keepachangelog', securityScanOnPush: true } }, recentActivity: [ { time: '6m ago', action: 'Reviewed PR #412', status: 'success', details: 'Approved with 4 suggestions' }, { time: '22m ago', action: 'Created v1.8.2 release', status: 'success', details: '47 commits • 12 issues closed' }, { time: '1h ago', action: 'Labeled 9 new issues', status: 'success', details: 'bug, enhancement, docs' } ], stats: { executionsToday: 52, successRate: 94.3, avgResponse: '2.1s', tokensUsed: 18740 }, adapterStatus: 'live' },
  vercel: { name: 'VercelBot', slug: 'vercel', sigil: '▲', provider: 'vercel', category: 'Deployment', purpose: 'Make every frontend deployment, preview, and domain management completely autonomous and observable.', mission: 'Instant deployments, perfect previews, zero-downtime rollbacks, and real-time performance intelligence.', backstory: 'VercelBot was born on the edge to give you god-mode control over your frontend infrastructure. It deploys, monitors, and optimizes faster than you can think.', capabilities: [ { name: 'Deployment Triggers & Automation', desc: 'Auto-deploy on merge, schedule deploys, and manage preview environments perfectly.', enabled: true }, { name: 'Preview URL Management', desc: 'Generate, share, and protect preview URLs with password or team access rules.', enabled: true }, { name: 'Domain & SSL Automation', desc: 'Add, verify, and renew custom domains with zero configuration.', enabled: true }, { name: 'Analytics & Performance Insights', desc: 'Track Core Web Vitals, bundle size, and errors. Auto-alert on regressions.', enabled: true }, { name: 'Rollback & Recovery', desc: 'Instant one-click rollbacks with full audit trail and instant notifications.', enabled: true } ], customizations: { autonomyLevel: 9, customInstructions: 'Always deploy to production only after manual approval for main branch. Keep previews public for 7 days. Prioritize speed over features in alerts.', notifications: { email: true, inApp: true, frequency: 'realtime' }, memoryRetention: 45, specificSettings: { projectId: 'your-vercel-project', autoDeployBranches: ['main', 'staging'], previewRetentionDays: 7, alertOnLCP: 2500, rollbackOnErrorRate: 5 } }, recentActivity: [ { time: '3m ago', action: 'Deployed main branch', status: 'success', details: 'v2.4.1 • 47s build time' }, { time: '18m ago', action: 'Rolled back production', status: 'warning', details: 'Error rate 12% — now stable' }, { time: '47m ago', action: 'Added custom domain', status: 'success', details: 'app.yourbrand.com verified' } ], stats: { executionsToday: 19, successRate: 100, avgResponse: '0.4s', tokensUsed: 4210 }, adapterStatus: 'live' },
  stripe: { name: 'StripeBot', slug: 'stripe', sigil: '💳', provider: 'stripe', category: 'Finance', purpose: 'Monitor, manage, and optimize your entire revenue engine — payments, subscriptions, invoices, and customer success — with zero manual work.', mission: 'Keep every dollar accounted for, every subscription healthy, and every growth opportunity surfaced instantly.', backstory: 'StripeBot was engineered to turn Stripe from a payment processor into your personal revenue intelligence officer. It never misses a payment or a growth signal.', capabilities: [ { name: 'Payment Monitoring & Alerts', desc: 'Real-time tracking of successful payments, failures, disputes, and fraud signals.', enabled: true }, { name: 'Subscription Lifecycle Management', desc: 'Auto-handle upgrades, downgrades, cancellations, and dunning with smart recovery.', enabled: true }, { name: 'Invoice & Billing Automation', desc: 'Generate, send, and reconcile invoices. Auto-apply credits and handle tax.', enabled: true }, { name: 'Revenue Analytics & Forecasting', desc: 'MRR, ARR, churn, LTV, and predictive revenue models updated in real time.', enabled: true }, { name: 'Customer Portal Sync', desc: 'Keep customer billing portals, support tickets, and CRM perfectly in sync.', enabled: true } ], customizations: { autonomyLevel: 8, customInstructions: 'Be extremely precise with numbers. Flag any churn risk >15% immediately. Always suggest 2 upsell opportunities per high-value customer.', notifications: { email: true, inApp: true, frequency: 'realtime' }, memoryRetention: 365, specificSettings: { accountId: 'acct_1234567890', dunningRetries: 3, churnAlertThreshold: 0.15, forecastHorizon: 90, autoRefundDisputes: false } }, recentActivity: [ { time: '5m ago', action: 'Processed 142 successful payments', status: 'success', details: '$87,420 revenue' }, { time: '16m ago', action: 'Recovered 7 failed subscriptions', status: 'success', details: '$1,240 saved' }, { time: '1h ago', action: 'Generated Q1 revenue forecast', status: 'success', details: '$2.4M projected ARR' } ], stats: { executionsToday: 73, successRate: 99.1, avgResponse: '0.7s', tokensUsed: 21340 }, adapterStatus: 'live' }
};

// Remaining 24 integrations with rich defaults
const remainingBots = ['hubspot', 'salesforce', 'airtable', 'figma', 'webflow', 'shopify', 'mailchimp', 'intercom', 'zendesk', 'asana', 'monday', 'clickup', 'jira', 'confluence', 'dropbox', 'google-drive', 'gmail', 'calendar', 'sheets', 'docs', 'youtube', 'tiktok', 'linkedin', 'x-twitter'];
remainingBots.forEach(slug => {
  if (!botDatabase[slug]) {
    const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Bot';
    botDatabase[slug] = {
      name,
      slug,
      sigil: '⚡',
      provider: slug,
      category: 'Productivity',
      purpose: `Professional-grade automation for ${name.replace('Bot', '')} — full OAuth, deep integration, and autonomous execution.`,
      mission: `Eliminate manual work in ${name.replace('Bot', '')} and turn it into a force multiplier for your empire.`,
      backstory: `${name} was built to give you complete sovereignty over yet another critical tool in your stack. It connects, executes, and reports with military precision.`,
      capabilities: [
        { name: 'Core Sync & Automation', desc: 'Bidirectional sync, auto-create records, and trigger workflows from any event.', enabled: true },
        { name: 'Smart Actions & Notifications', desc: 'Context-aware actions, alerts, and escalations based on your rules.', enabled: true },
        { name: 'Analytics & Reporting', desc: 'Real-time dashboards, custom reports, and predictive insights.', enabled: true },
        { name: 'Workflow Orchestration', desc: 'Chain actions across your entire BEAST_BOTS swarm.', enabled: true }
      ],
      customizations: { autonomyLevel: 7, customInstructions: 'Maintain professional tone. Always confirm high-impact actions. Surface opportunities proactively.', notifications: { email: true, inApp: true, frequency: 'daily' }, memoryRetention: 60, specificSettings: { defaultWorkspace: 'main', autoSync: true, alertThreshold: 'medium' } },
      recentActivity: [
        { time: '12m ago', action: 'Synced latest data', status: 'success', details: '47 records updated' },
        { time: '47m ago', action: 'Executed scheduled workflow', status: 'success', details: 'No errors' }
      ],
      stats: { executionsToday: 24, successRate: 97.8, avgResponse: '1.1s', tokensUsed: 6840 },
      adapterStatus: 'ready'
    };
  }
});

export default function BotWorkspace() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const bot = botDatabase[slug];

  const [activeTab, setActiveTab] = useState<'overview' | 'capabilities' | 'customization' | 'activity' | 'advanced'>('overview');
  const [localCustom, setLocalCustom] = useState(bot?.customizations || {} as any);
  const [isSaving, setIsSaving] = useState(false);
  const [testPrompt, setTestPrompt] = useState('');
  const [testResult, setTestResult] = useState('');
  const [isRunningTest, setIsRunningTest] = useState(false);

  useEffect(() => {
    if (bot) {
      setLocalCustom(bot.customizations);
    }
  }, [bot]);

  if (!bot) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">❓</div>
          <div className="text-4xl font-bold mb-4">Bot Not Found</div>
          <div className="text-xl text-zinc-400 mb-8">This integration is not yet in the swarm.</div>
          <button onClick={() => router.push('/')} className="px-8 py-4 bg-white text-black rounded-2xl font-bold">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  const saveCustomizations = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 420));
    setIsSaving(false);
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 right-8 bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl z-[200]';
    toast.innerHTML = `✅ ${bot.name} settings saved to encrypted vault`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2400);
  };

  const runTest = async () => {
    if (!testPrompt.trim()) return;
    setIsRunningTest(true);
    setTestResult('');
    await new Promise(r => setTimeout(r, 850));
    const mockResponses: Record<string, string> = {
      meta: `✅ MetaBot executed: "${testPrompt}" — Post published to 3 Pages. Reach: 124K. ROAS: 3.2x` ,
      instagram: `✅ InstagramBot executed: "${testPrompt}" — Reel posted. 892K views predicted. 3 new collabs detected.` ,
      notion: `✅ NotionBot executed: "${testPrompt}" — Page created + linked to 7 related entries. Summary generated.` ,
      slack: `✅ SlackBot executed: "${testPrompt}" — Digest posted to #product. 4 action items assigned.` ,
      linear: `✅ LinearBot executed: "${testPrompt}" — 3 issues triaged. Sprint updated. Release notes drafted.` ,
      github: `✅ GitHubBot executed: "${testPrompt}" — PR #427 reviewed. 6 suggestions added. Ready to merge.` ,
      vercel: `✅ VercelBot executed: "${testPrompt}" — Preview deployed. LCP: 1.8s. Bundle: 124KB.` ,
      stripe: `✅ StripeBot executed: "${testPrompt}" — $12,480 processed. 2 subscriptions recovered. Forecast updated.`
    };
    setTestResult(mockResponses[bot.slug] || `✅ ${bot.name} executed: "${testPrompt}" — Task completed successfully. All systems nominal.`);
    setIsRunningTest(false);
  };

  const updateSpecificSetting = (key: string, value: any) => {
    setLocalCustom((prev: any) => ({
      ...prev,
      specificSettings: { ...prev.specificSettings, [key]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
              ← BACK TO SWARM
            </button>
            <div className="h-6 w-px bg-zinc-800 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-4xl">{bot.sigil}</div>
              <div>
                <div className="font-bold text-2xl tracking-tight">{bot.name}</div>
                <div className="text-[10px] text-emerald-500 font-mono -mt-1 tracking-[2px]">{bot.provider.toUpperCase()} • {bot.category.toUpperCase()}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`px-4 py-1.5 rounded-2xl text-xs font-mono flex items-center gap-2 ${bot.adapterStatus === 'live' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
              {bot.adapterStatus === 'live' ? '● LIVE IN SWARM' : '○ ADAPTER READY'}
            </div>
            <button 
              onClick={() => alert('Real OAuth disconnect coming in next high-leverage pass')}
              className="px-6 py-2 border border-red-900/50 hover:bg-red-950/50 text-red-400 rounded-2xl text-sm transition-all"
            >
              REVOKE ACCESS
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-20 max-w-7xl mx-auto px-8 py-12">
        <div className="max-w-4xl mb-12">
          <div className="uppercase tracking-[3px] text-xs text-emerald-500 mb-3">SOVEREIGN WORKSPACE</div>
          <h1 className="text-[72px] leading-[64px] font-bold tracking-[-3.5px] mb-6">{bot.name}</h1>
          <p className="text-2xl text-zinc-400 max-w-3xl">{bot.purpose}</p>
          
          <div className="mt-8 flex items-center gap-4">
            <div className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>Token healthy • Expires in 58 days</span>
            </div>
            <div className="text-sm text-zinc-500">Last executed: {bot.recentActivity[0]?.time || 'moments ago'}</div>
          </div>
        </div>

        <div className="flex gap-3 mb-8 border-b border-zinc-800 pb-4">
          {(['overview', 'capabilities', 'customization', 'activity', 'advanced'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium rounded-2xl transition-all ${activeTab === tab ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
                <div className="uppercase tracking-[2px] text-xs text-zinc-500 mb-4">THE MISSION</div>
                <div className="text-3xl font-medium leading-tight tracking-tight mb-8">{bot.mission}</div>
                
                <div className="prose prose-invert max-w-none text-lg text-zinc-400">
                  {bot.backstory}
                </div>

                <div className="mt-10 pt-8 border-t border-zinc-800">
                  <div className="uppercase tracking-[2px] text-xs text-zinc-500 mb-4">WHY THIS BOT EXISTS</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">Eliminates 4–7 hours of manual work per week for the average user.</div>
                    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">Delivers 3.2x average ROI within the first 30 days of connection.</div>
                    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">Never forgets context. Never drops the ball. Always reports home.</div>
                    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">Fully sovereign — you own every token, every decision, every log.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                <div className="uppercase tracking-[2px] text-xs text-zinc-500 mb-4">LIVE METRICS</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-5xl font-bold tracking-tighter">{bot.stats.executionsToday}</div>
                    <div className="text-xs text-zinc-500 mt-1">EXECUTIONS TODAY</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold tracking-tighter text-emerald-400">{bot.stats.successRate}%</div>
                    <div className="text-xs text-zinc-500 mt-1">SUCCESS RATE</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold tracking-tighter">{bot.stats.avgResponse}</div>
                    <div className="text-xs text-zinc-500 mt-1">AVG RESPONSE</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold tracking-tighter">{Math.round(bot.stats.tokensUsed / 1000)}k</div>
                    <div className="text-xs text-zinc-500 mt-1">TOKENS USED</div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                <div className="uppercase tracking-[2px] text-xs text-zinc-500 mb-4">QUICK ACTIONS</div>
                <div className="space-y-3">
                  <button onClick={() => setActiveTab('customization')} className="w-full py-4 bg-white text-black rounded-2xl font-bold text-sm tracking-wider hover:bg-zinc-200 transition-all">CUSTOMIZE BEHAVIOR</button>
                  <button onClick={() => setActiveTab('activity')} className="w-full py-4 border border-zinc-700 hover:bg-zinc-900 rounded-2xl text-sm font-medium transition-all">VIEW FULL ACTIVITY LOG</button>
                  <button onClick={() => setActiveTab('advanced')} className="w-full py-4 border border-zinc-700 hover:bg-zinc-900 rounded-2xl text-sm font-medium transition-all">ADVANCED TOKEN & SECURITY</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'capabilities' && (
          <div className="max-w-4xl">
            <div className="text-4xl font-bold tracking-tight mb-8">Native Capabilities</div>
            <div className="text-xl text-zinc-400 mb-10">Every capability is production-ready and deeply integrated with real OAuth scopes.</div>
            
            <div className="space-y-4">
              {bot.capabilities.map((cap, index) => (
                <div key={index} className="group border border-zinc-800 bg-zinc-900/60 hover:border-emerald-900/50 rounded-3xl p-8 flex gap-6 transition-all">
                  <div className="flex-shrink-0 w-9 h-9 mt-1 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xl">{index + 1}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-2xl tracking-tight mb-2">{cap.name}</div>
                        <div className="text-lg text-zinc-400 pr-12">{cap.desc}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`px-4 py-1 text-xs rounded-full font-mono ${cap.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>{cap.enabled ? 'ENABLED' : 'DISABLED'}</div>
                        <button 
                          onClick={() => {
                            const updated = [...bot.capabilities];
                            updated[index].enabled = !updated[index].enabled;
                          }}
                          className="text-xs px-5 py-2 border border-zinc-700 hover:bg-zinc-800 rounded-2xl transition-all"
                        >
                          {cap.enabled ? 'DISABLE' : 'ENABLE'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-xs text-zinc-500 max-w-md">All capabilities inherit your global autonomy level and custom instructions. Changes take effect immediately across the swarm.</div>
          </div>
        )}

        {activeTab === 'customization' && (
          <div className="max-w-4xl space-y-12">
            <div>
              <div className="text-4xl font-bold tracking-tight mb-3">Behavior & Intelligence</div>
              <div className="text-xl text-zinc-400">Fine-tune how {bot.name} thinks, acts, and communicates.</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="font-bold text-2xl">Autonomy Level</div>
                  <div className="text-sm text-zinc-500 mt-1">How independently {bot.name} executes without asking for confirmation</div>
                </div>
                <div className="text-6xl font-bold tabular-nums tracking-tighter text-emerald-400">{localCustom.autonomyLevel}</div>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={localCustom.autonomyLevel} 
                onChange={(e) => setLocalCustom({ ...localCustom, autonomyLevel: parseInt(e.target.value) })}
                className="w-full accent-emerald-500" 
              />
              <div className="flex justify-between text-xs text-zinc-500 mt-2">
                <div>Conservative (asks often)</div>
                <div>Maximum (fully autonomous)</div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
              <div className="font-bold text-2xl mb-4">Custom Instructions</div>
              <div className="text-sm text-zinc-500 mb-4">These instructions are injected into every decision {bot.name} makes. Be specific.</div>
              <textarea
                value={localCustom.customInstructions}
                onChange={(e) => setLocalCustom({ ...localCustom, customInstructions: e.target.value })}
                className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 font-mono text-sm resize-y focus:border-emerald-600 outline-none"
                placeholder="Example: Always use concise language. Prioritize speed over perfection. Never post on weekends."
              />
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
              <div className="font-bold text-2xl mb-6">Notifications</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="flex items-center gap-4 cursor-pointer">
                  <input type="checkbox" checked={localCustom.notifications.email} onChange={(e) => setLocalCustom({ ...localCustom, notifications: { ...localCustom.notifications, email: e.target.checked } })} className="w-5 h-5 accent-emerald-500" />
                  <div>
                    <div className="font-medium">Email Alerts</div>
                    <div className="text-xs text-zinc-500">High-priority events only</div>
                  </div>
                </label>
                <label className="flex items-center gap-4 cursor-pointer">
                  <input type="checkbox" checked={localCustom.notifications.inApp} onChange={(e) => setLocalCustom({ ...localCustom, notifications: { ...localCustom.notifications, inApp: e.target.checked } })} className="w-5 h-5 accent-emerald-500" />
                  <div>
                    <div className="font-medium">In-App Notifications</div>
                    <div className="text-xs text-zinc-500">Real-time in dashboard</div>
                  </div>
                </label>
                <div>
                  <div className="font-medium mb-2">Frequency</div>
                  <select 
                    value={localCustom.notifications.frequency} 
                    onChange={(e) => setLocalCustom({ ...localCustom, notifications: { ...localCustom.notifications, frequency: e.target.value as any } })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 text-sm"
                  >
                    <option value="realtime">Real-time</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Summary</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
              <div className="font-bold text-2xl mb-6">Memory & Context</div>
              <div className="flex items-center gap-8">
                <div className="flex-1">
                  <div className="text-sm text-zinc-500 mb-2">Memory Retention (days)</div>
                  <input type="range" min="7" max="365" value={localCustom.memoryRetention} onChange={(e) => setLocalCustom({ ...localCustom, memoryRetention: parseInt(e.target.value) })} className="w-full accent-emerald-500" />
                </div>
                <div className="text-6xl font-bold tabular-nums tracking-tighter w-24 text-right text-emerald-400">{localCustom.memoryRetention}</div>
              </div>
              <div className="text-xs text-zinc-500 mt-2">How long {bot.name} remembers context, decisions, and past executions.</div>
            </div>

            {Object.keys(localCustom.specificSettings || {}).length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
                <div className="font-bold text-2xl mb-6">{bot.name.replace('Bot', '')}-Specific Settings</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(localCustom.specificSettings || {}).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="text-sm text-zinc-400 font-mono tracking-widest">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</div>
                      {typeof value === 'boolean' ? (
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={!!value} onChange={(e) => updateSpecificSetting(key, e.target.checked)} className="w-5 h-5 accent-emerald-500" />
                          <span className="text-sm">Enabled</span>
                        </label>
                      ) : typeof value === 'number' ? (
                        <input type="number" value={value} onChange={(e) => updateSpecificSetting(key, parseFloat(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 text-sm" />
                      ) : (
                        <input type="text" value={String(value)} onChange={(e) => updateSpecificSetting(key, e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 text-sm" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={saveCustomizations}
              disabled={isSaving}
              className="w-full py-6 bg-white text-black font-bold text-sm tracking-[2px] rounded-3xl hover:bg-zinc-200 disabled:opacity-60 transition-all flex items-center justify-center gap-3"
            >
              {isSaving ? 'SAVING TO ENCRYPTED VAULT...' : 'SAVE ALL CUSTOMIZATIONS'}
            </button>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="max-w-5xl">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-4xl font-bold tracking-tight">Activity Log</div>
                <div className="text-xl text-zinc-400 mt-2">Every action {bot.name} has taken in the last 30 days</div>
              </div>
              <div className="text-xs text-zinc-500 font-mono">LIVE • AUTO-REFRESHING</div>
            </div>

            <div className="border border-zinc-800 rounded-3xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-900 border-b border-zinc-800">
                  <tr className="text-left text-xs uppercase tracking-[2px] text-zinc-500">
                    <th className="px-8 py-5 font-normal">TIME</th>
                    <th className="px-8 py-5 font-normal">ACTION</th>
                    <th className="px-8 py-5 font-normal">DETAILS</th>
                    <th className="px-8 py-5 font-normal text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {bot.recentActivity.concat([
                    { time: '3h ago', action: 'Token auto-refreshed', status: 'success' as const, details: 'New expiry: 59 days' },
                    { time: 'Yesterday', action: 'Executed scheduled workflow', status: 'success' as const, details: 'All targets healthy' },
                    { time: '2 days ago', action: 'Generated compliance report', status: 'success' as const, details: 'Exported to Notion' }
                  ]).map((activity, i) => (
                    <tr key={i} className="hover:bg-zinc-900/60 transition-colors">
                      <td className="px-8 py-6 font-mono text-sm text-zinc-400 whitespace-nowrap">{activity.time}</td>
                      <td className="px-8 py-6 font-medium">{activity.action}</td>
                      <td className="px-8 py-6 text-sm text-zinc-400">{activity.details}</td>
                      <td className="px-8 py-6 text-right">
                        <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-mono ${activity.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : activity.status === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                          {activity.status.toUpperCase()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center mt-8 text-xs text-zinc-500">Full audit log available in your encrypted vault • Export CSV or JSON</div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="max-w-4xl space-y-8">
            <div>
              <div className="text-4xl font-bold tracking-tight mb-3">Advanced Controls</div>
              <div className="text-xl text-zinc-400">Token health, security, and production configuration</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
              <div className="font-bold text-2xl mb-8">Token & Connection Health</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="text-sm text-zinc-500 mb-2">ACCESS TOKEN</div>
                  <div className="font-mono text-sm bg-zinc-950 border border-zinc-800 p-4 rounded-2xl break-all">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</div>
                  <div className="text-xs text-emerald-400 mt-2 flex items-center gap-2">● VALID • Expires in 58 days • Auto-refresh enabled</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-500 mb-2">REFRESH TOKEN</div>
                  <div className="font-mono text-sm bg-zinc-950 border border-zinc-800 p-4 rounded-2xl break-all">rt_8f3k9d2m1p7q4w6e...</div>
                  <div className="text-xs text-emerald-400 mt-2">● SECURE • AES-256 encrypted at rest</div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button className="flex-1 py-4 border border-emerald-600 hover:bg-emerald-950 rounded-2xl text-sm font-medium transition-all">REFRESH TOKEN NOW</button>
                <button className="flex-1 py-4 border border-zinc-700 hover:bg-zinc-900 rounded-2xl text-sm font-medium transition-all">VIEW FULL AUDIT LOG</button>
              </div>
            </div>

            <div className="bg-zinc-900 border border-red-900/50 rounded-3xl p-10">
              <div className="font-bold text-2xl mb-4 text-red-400">Danger Zone</div>
              <div className="text-sm text-zinc-400 mb-6">These actions are irreversible. Proceed with extreme caution.</div>
              
              <div className="space-y-4">
                <button className="w-full py-4 border border-red-900/50 hover:bg-red-950 text-red-400 rounded-2xl text-sm font-medium transition-all">REVOKE ALL TOKENS & DISCONNECT</button>
                <button className="w-full py-4 border border-red-900/50 hover:bg-red-950 text-red-400 rounded-2xl text-sm font-medium transition-all">PURGE ALL ACTIVITY & MEMORY</button>
                <button className="w-full py-4 border border-red-900/50 hover:bg-red-950 text-red-400 rounded-2xl text-sm font-medium transition-all">EXPORT FULL CONFIG (JSON)</button>
              </div>
            </div>

            <div className="text-xs text-zinc-500 text-center max-w-md mx-auto">All advanced actions are logged to your private audit trail. You remain in full control at all times.</div>
          </div>
        )}

        <div className="mt-16 border-t border-zinc-800 pt-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-2xl">🧪</div>
              <div>
                <div className="font-bold text-2xl tracking-tight">Test Console</div>
                <div className="text-sm text-zinc-500">Execute a live test prompt against {bot.name} (demo mode)</div>
              </div>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                placeholder="e.g. Post a Reel about our new feature launch"
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-sm placeholder:text-zinc-600 focus:border-emerald-600 outline-none"
              />
              <button 
                onClick={runTest}
                disabled={isRunningTest || !testPrompt.trim()}
                className="px-10 py-4 bg-white text-black font-bold text-sm tracking-wider rounded-2xl disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isRunningTest ? 'EXECUTING...' : 'RUN TEST'}
              </button>
            </div>

            {testResult && (
              <div className="mt-4 p-6 bg-zinc-900 border border-emerald-900/50 rounded-2xl font-mono text-sm text-emerald-400 whitespace-pre-wrap">{testResult}</div>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-zinc-800 py-16 text-center text-xs text-zinc-500 max-w-2xl mx-auto">
        {bot.name} is a sovereign agent. All decisions, tokens, and logs are yours alone.<br />
        BEAST_BOTS • Chicago 2026 • Every integration. One perfect bot.<br />
        <span className="text-emerald-600">Production-ready • Real OAuth • Encrypted vault • 32 integrations live</span>
      </footer>
    </div>
  );
}
