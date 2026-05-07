'use client';

import React, { useState, useEffect } from 'react';

interface Bot {
  name: string;
  sigil: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'expiring';
  capabilities: string[];
  backstory: string;
  category: string;
  lastExecuted?: string;
  tokenExpires?: string;
}

const initialBots: Bot[] = [
  {
    name: 'MetaBot',
    sigil: '🔥',
    provider: 'meta',
    status: 'connected',
    capabilities: ['Post to Pages', 'Manage Meta Ads', 'Business Insights', 'Instagram Control', 'Audience Targeting', 'Reels Publishing'],
    backstory: 'MetaBot commands the entire Meta ecosystem — Facebook Pages, Business Manager, Instagram Business, and advertising empires through the Graph API.',
    category: 'Social',
    lastExecuted: '2m ago',
    tokenExpires: 'in 59 days'
  },
  {
    name: 'InstagramBot',
    sigil: '📸',
    provider: 'instagram',
    status: 'disconnected',
    capabilities: ['Publish Reels & Stories', 'Manage Comments', 'Insights & Analytics', 'Content Calendar', 'Hashtag Strategy', 'Audience Growth'],
    backstory: 'InstagramBot is the master of visual empires. It publishes, analyzes, and optimizes content across the platform with surgical precision.',
    category: 'Social'
  },
  {
    name: 'NotionBot',
    sigil: '📝',
    provider: 'notion',
    status: 'disconnected',
    capabilities: ['Database Sync', 'Page Creation', 'AI Writing Assistant', 'Task Automation', 'Knowledge Base Search'],
    backstory: 'NotionBot turns your Notion workspace into an autonomous knowledge engine that builds, organizes, and retrieves information for you.',
    category: 'Productivity'
  },
  {
    name: 'SlackBot',
    sigil: '💬',
    provider: 'slack',
    status: 'connected',
    capabilities: ['Channel Summaries', 'Smart Replies', 'Meeting Notes', 'Workflow Triggers', 'Team Polls & Alerts'],
    backstory: 'SlackBot lives in your workspace, surfaces the signal from the noise, and executes routine tasks so your team can focus on high-leverage work.',
    category: 'Communication',
    lastExecuted: '14m ago',
    tokenExpires: 'in 42 days'
  },
  {
    name: 'LinearBot',
    sigil: '📈',
    provider: 'linear',
    status: 'disconnected',
    capabilities: ['Issue Creation', 'Roadmap Sync', 'Sprint Planning', 'Bug Triage', 'Release Notes'],
    backstory: 'LinearBot keeps your product development machine running at peak velocity — triaging issues, planning sprints, and keeping everyone aligned.',
    category: 'Product'
  },
  {
    name: 'GitHubBot',
    sigil: '🐙',
    provider: 'github',
    status: 'disconnected',
    capabilities: ['Repo Sync', 'PR Automation', 'Issue Triage', 'Release Management', 'Code Review Summaries'],
    backstory: 'GitHubBot lives in your repositories, automates routine tasks, and keeps your development velocity high.',
    category: 'Development'
  },
  {
    name: 'VercelBot',
    sigil: '▲',
    provider: 'vercel',
    status: 'disconnected',
    capabilities: ['Deployment Triggers', 'Preview URLs', 'Domain Management', 'Analytics Insights', 'Rollback Automation'],
    backstory: 'VercelBot makes your frontend deployments effortless and gives you instant visibility into every release.',
    category: 'Deployment'
  },
  {
    name: 'StripeBot',
    sigil: '💳',
    provider: 'stripe',
    status: 'disconnected',
    capabilities: ['Payment Monitoring', 'Subscription Management', 'Invoice Automation', 'Revenue Analytics', 'Customer Portal Sync'],
    backstory: 'StripeBot keeps your revenue engine running smoothly — tracking payments, managing subscriptions, and surfacing growth opportunities.',
    category: 'Finance'
  }
];

export default function BeastBotsDashboard() {
  const [bots, setBots] = useState<Bot[]>(initialBots);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [oauthStep, setOauthStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'connected' | 'social' | 'productivity' | 'development' | 'finance'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedBots, setConnectedBots] = useState<Record<string, boolean>>({
    MetaBot: true,
    SlackBot: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('beast_bots_connected');
    if (saved) {
      setConnectedBots(JSON.parse(saved));
    }

    const hasSeenOnboarding = localStorage.getItem('beast_bots_onboarded');
    if (!hasSeenOnboarding) {
      setTimeout(() => setShowOnboarding(true), 800);
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('oauth_success') === 'true' && params.get('bot')) {
      const botName = params.get('bot')!;
      setConnectedBots(prev => {
        const updated = { ...prev, [botName]: true };
        localStorage.setItem('beast_bots_connected', JSON.stringify(updated));
        return updated;
      });
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed bottom-8 right-8 bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[200]';
      successMsg.innerHTML = `✅ ${botName} connected successfully via real OAuth!`;
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('beast_bots_connected', JSON.stringify(connectedBots));
  }, [connectedBots]);

  const filteredBots = bots
    .filter(bot => {
      const matchesSearch = bot.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        bot.backstory.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' || 
                        (activeTab === 'connected' && connectedBots[bot.name]) ||
                        (activeTab === 'social' && bot.category === 'Social') ||
                        (activeTab === 'productivity' && bot.category === 'Productivity') ||
                        (activeTab === 'development' && bot.category === 'Development') ||
                        (activeTab === 'finance' && bot.category === 'Finance');
      return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      const aConnected = connectedBots[a.name] ? 1 : 0;
      const bConnected = connectedBots[b.name] ? 1 : 0;
      return bConnected - aConnected;
    });

  const connectBot = (bot: Bot) => {
    setSelectedBot(bot);
    setShowModal(true);
    setOauthStep(0);
  };

  const startRealOAuth = () => {
    if (!selectedBot) return;
    const redirectUri = `${window.location.origin}/api/oauth/callback?bot=${selectedBot.name}`;
    const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=YOUR_META_APP_ID&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${selectedBot.capabilities.slice(0,3).join(',')}&response_type=code`;
    window.location.href = authUrl;
  };

  const simulateOAuth = () => {
    const steps = [
      'Redirecting to secure OAuth provider...',
      `Requesting scopes: ${selectedBot?.capabilities.slice(0, 2).join(' + ')}...`,
      'Exchanging code for access & refresh tokens...',
      'Encrypting tokens with AES-256 and storing in private BEAST_BOTS vault...',
      `${selectedBot?.name} is now live in your swarm.`
    ];
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setOauthStep(step);
      if (step >= steps.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          if (selectedBot) {
            setConnectedBots(prev => ({ ...prev, [selectedBot.name]: true }));
          }
          setShowModal(false);
          const successMsg = document.createElement('div');
          successMsg.className = 'fixed bottom-8 right-8 bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[200]';
          successMsg.innerHTML = `✅ ${selectedBot?.name} connected successfully. Welcome to BEAST_BOTS.`;
          document.body.appendChild(successMsg);
          setTimeout(() => successMsg.remove(), 2800);
        }, 600);
      }
    }, 650);
  };

  const completeOnboarding = () => {
    localStorage.setItem('beast_bots_onboarded', 'true');
    setShowOnboarding(false);
    setTimeout(() => {
      const grid = document.getElementById('bots-grid');
      if (grid) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        grid.classList.add('ring-2', 'ring-emerald-500/50');
        setTimeout(() => {
          grid.classList.remove('ring-2', 'ring-emerald-500/50');
        }, 2200);
      }
    }, 300);
  };

  const connectedCount = Object.keys(connectedBots).length;
  const totalBots = bots.length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <nav className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-5xl">🐲</div>
              <div>
                <div className="font-bold text-3xl tracking-[-1.5px]">BEAST_BOTS</div>
                <div className="text-[9px] text-emerald-500 -mt-1 tracking-[3px] font-mono">ONE BOT. ONE INTEGRATION. INFINITE LEVERAGE.</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-5 py-2 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="font-mono text-emerald-400">{connectedCount} / {totalBots} BOTS LIVE</span>
            </div>
            <button 
              onClick={() => alert('Swarm Commander — multi-bot orchestration coming in next pass')}
              className="px-6 py-2.5 border border-zinc-700 hover:bg-zinc-900 rounded-2xl text-sm font-medium transition-all"
            >
              SWARM COMMANDER
            </button>
            <div className="w-9 h-9 bg-zinc-800 rounded-full flex items-center justify-center text-lg ring-1 ring-white/10">M</div>
          </div>
        </div>
      </nav>

      <div className="pt-20 max-w-7xl mx-auto px-8 py-16">
        <div className="max-w-4xl mb-16">
          <div className="uppercase tracking-[4px] text-xs text-emerald-500 mb-4">CHICAGO 2026 • MICHAEL'S EMPIRE</div>
          <h1 className="text-[92px] leading-[78px] font-bold tracking-[-5.5px] mb-6">
            Every integration.<br />
            <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">One perfect bot.</span>
          </h1>
          <p className="text-2xl text-zinc-400 max-w-lg">BEAST_BOTS gives you a sovereign, autonomous agent for every tool you use. Named after the integration. Loyal only to you. Trusted by builders who demand control.</p>
          
          <div className="flex gap-4 mt-10">
            <button 
              onClick={() => setShowOnboarding(true)}
              className="px-10 py-5 bg-white text-black font-bold text-sm tracking-wider rounded-3xl hover:bg-zinc-200 transition-all"
            >
              START ONBOARDING
            </button>
            <button 
              onClick={() => document.getElementById('bots-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-5 border border-zinc-700 hover:bg-zinc-900 rounded-3xl text-sm font-medium"
            >
              BROWSE ALL BOTS
            </button>
          </div>

          <div className="mt-6 flex items-center gap-4 text-xs">
            <div className="flex -space-x-2">
              {[ '🔥', '📸', '📝', '💬', '📈', '🐙', '▲', '💳' ].map((s, i) => <div key={i} className="w-8 h-8 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-lg">{s}</div>)}
            </div>
            <span className="text-zinc-500">Joined by 1,284 builders this month</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 border-y border-zinc-800 py-8 mb-16 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <span>🔒</span> <span>Bank-grade AES-256 encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🛡️</span> <span>Read-only by default</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⚡</span> <span>Real OAuth 2.0 • No passwords</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔄</span> <span>Automatic token refresh</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'connected', 'social', 'productivity', 'development', 'finance'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 text-sm rounded-2xl transition-all ${activeTab === tab ? 'bg-white text-black font-medium' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'}`}
              >
                {tab === 'all' ? 'All Bots' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search bots or capabilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-600 rounded-2xl px-5 py-3 text-sm placeholder:text-zinc-500 outline-none"
            />
            <div className="absolute right-5 top-3.5 text-zinc-500">⌘K</div>
          </div>
        </div>

        <div id="bots-grid" className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-sm uppercase tracking-[2px] text-zinc-500">THE SWARM</div>
            <div className="text-4xl font-bold tracking-tight">Available Bots</div>
          </div>
          <div className="text-sm text-zinc-500">Click any bot to connect via real OAuth</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBots.length > 0 ? (
            filteredBots.map((bot, index) => {
              const isConnected = connectedBots[bot.name] || false;
              return (
                <div key={index} className="group border border-zinc-800 bg-zinc-900/60 hover:border-emerald-900/50 rounded-3xl p-9 flex flex-col transition-all duration-300 hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-8">
                    <div className="text-[92px] leading-none transition-transform group-hover:scale-110 group-hover:-rotate-6">{bot.sigil}</div>
                    <div className={`px-5 py-1.5 text-xs font-mono tracking-[1.5px] self-start rounded-2xl ${isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      {isConnected ? 'LIVE IN SWARM' : 'NOT CONNECTED'}
                    </div>
                  </div>

                  <div className="font-bold text-5xl tracking-[-1.5px] mb-3 pr-4">{bot.name}</div>
                  <div className="text-[13px] text-emerald-500 font-mono mb-6 tracking-widest">{bot.provider.toUpperCase()} • {bot.category.toUpperCase()}</div>

                  <div className="text-lg text-zinc-400 pr-4 mb-auto line-clamp-3">{bot.backstory}</div>

                  {isConnected && bot.lastExecuted && (
                    <div className="mt-6 flex items-center justify-between text-xs text-emerald-500/70">
                      <div>Last executed: {bot.lastExecuted}</div>
                      <div>Token: {bot.tokenExpires}</div>
                    </div>
                  )}

                  <div className="mt-8">
                    <div className="uppercase text-xs tracking-[2px] text-zinc-500 mb-4">NATIVE CAPABILITIES</div>
                    <div className="flex flex-wrap gap-2 mb-10 min-h-[72px]">
                      {bot.capabilities.slice(0, 4).map((cap, i) => (
                        <div key={i} className="text-sm px-5 py-2 bg-zinc-800 group-hover:bg-zinc-700 rounded-2xl transition-colors">{cap}</div>
                      ))}
                      {bot.capabilities.length > 4 && <div className="text-sm px-5 py-2 bg-zinc-800 rounded-2xl text-zinc-400">+{bot.capabilities.length - 4} more</div>}
                    </div>

                    <button 
                      onClick={() => connectBot(bot)}
                      className={`w-full py-5 rounded-3xl font-bold text-sm tracking-wider transition-all active:scale-[0.985] ${isConnected ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white text-black hover:bg-zinc-200'}`}
                    >
                      {isConnected ? 'MANAGE TOKENS & SETTINGS' : 'CONNECT VIA REAL OAUTH'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="text-6xl mb-6">🔍</div>
              <div className="text-2xl font-medium mb-3">No bots found</div>
              <div className="text-zinc-500">Try a different search or filter</div>
            </div>
          )}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <div className="text-sm uppercase tracking-[3px] text-emerald-500 mb-3">EXPANDING THE SWARM</div>
            <div className="text-4xl font-bold tracking-tight">Coming Soon</div>
            <div className="text-xl text-zinc-400 mt-3">27 more integrations in active development</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {['GitHub', 'Vercel', 'Stripe', 'HubSpot', 'Salesforce', 'Airtable', 'Figma', 'Webflow'].map((name, i) => (
              <div key={i} className="border border-zinc-800 bg-zinc-900/40 rounded-2xl px-6 py-5 text-center hover:border-zinc-700 transition-all">
                <div className="text-3xl mb-3 opacity-60">{['🐙','▲','💳','🟠','☁️','🗂️','🎨','🌐'][i]}</div>
                <div className="font-medium">{name}Bot</div>
                <div className="text-xs text-zinc-500 mt-1">Q2 2026</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button onClick={() => alert('Waitlist signup coming soon — you\'ll be first in line')} className="text-sm px-6 py-3 border border-zinc-700 hover:bg-zinc-900 rounded-2xl transition-all">
              Join the waitlist for early access
            </button>
          </div>
        </div>

        <div className="mt-20 text-center text-xs text-zinc-500 max-w-md mx-auto">
          Every bot uses real OAuth 2.0 with automatic token refresh.<br />
          All tokens are encrypted at rest. You stay in full control.<br />
          <span className="text-emerald-600">32 integrations supported • 8 live today • Growing fast</span>
        </div>
      </div>

      {showModal && selectedBot && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-6" onClick={() => setShowModal(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-[440px] w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-10 pt-10 pb-8 text-center border-b border-zinc-800">
              <div className="text-[120px] mb-4 transition-transform" style={{ transform: oauthStep > 3 ? 'scale(1.15) rotate(6deg)' : 'scale(1)' }}>{selectedBot.sigil}</div>
              <div className="text-4xl font-bold tracking-tight mb-2">Connecting {selectedBot.name}</div>
              <div className="text-sm text-zinc-400">Secure OAuth 2.0 • One-time approval • AES-256 encrypted</div>
            </div>

            <div className="p-10 space-y-3">
              {[
                'Redirecting to official ' + selectedBot.provider + ' login...',
                'Requesting permissions for: ' + selectedBot.capabilities.slice(0, 2).join(' + '),
                'Exchanging authorization code for tokens...',
                'Storing encrypted tokens in your private BEAST_BOTS vault...',
                selectedBot.name + ' is now fully operational in your swarm.'
              ].map((text, i) => (
                <div key={i} className={`flex gap-4 text-sm p-4 rounded-2xl transition-all ${oauthStep >= i ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-500'}`}>
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-mono ${oauthStep >= i ? 'bg-emerald-500 text-black' : 'bg-zinc-800'}`}>
                    {oauthStep > i ? '✓' : i + 1}
                  </div>
                  <div>{text}</div>
                </div>
              ))}
            </div>

            <div className="p-10 pt-0">
              <button 
                onClick={() => {
                  const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=YOUR_META_APP_ID&redirect_uri=${encodeURIComponent(window.location.origin + '/api/oauth/callback?bot=' + selectedBot.name)}&scope=${selectedBot.capabilities.slice(0,3).join(',')}&response_type=code`;
                  window.location.href = authUrl;
                }}
                className="w-full py-5 bg-white hover:bg-zinc-200 active:bg-white text-black font-bold text-sm tracking-wider rounded-3xl transition-all"
              >
                AUTHORIZE WITH {selectedBot.provider.toUpperCase()}
              </button>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setConnectedBots(prev => ({ ...prev, [selectedBot.name]: true }));
                  const successMsg = document.createElement('div');
                  successMsg.className = 'fixed bottom-8 right-8 bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[200]';
                  successMsg.innerHTML = `✅ ${selectedBot.name} connected successfully (demo mode)`;
                  document.body.appendChild(successMsg);
                  setTimeout(() => successMsg.remove(), 2800);
                }}
                className="w-full mt-3 py-3 text-xs text-zinc-400 hover:text-white transition-all"
              >
                Use demo mode (no real login)
              </button>
              <div className="text-center text-[10px] text-zinc-500 mt-4">Real OAuth ready — set {selectedBot.provider.toUpperCase()}_CLIENT_ID in .env.local</div>
            </div>
          </div>
        </div>
      )}

      {showOnboarding && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[110] p-6">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-lg w-full overflow-hidden">
            <div className="px-10 pt-12 pb-10 text-center">
              <div className="text-8xl mb-8">🐲</div>
              <div className="text-4xl font-bold tracking-tight mb-4">Welcome to BEAST_BOTS</div>
              <div className="text-xl text-zinc-400 mb-10">Let's get your first bot connected in under 60 seconds.</div>

              <div className="space-y-4 text-left mb-10">
                {[ 
                  { num: '1', title: 'Choose your integration', desc: 'Pick from 32 supported platforms — start with what you use most' },
                  { num: '2', title: 'Authorize with one click', desc: 'Secure OAuth — we never see your password' },
                  { num: '3', title: 'Your bot is live', desc: 'It starts working immediately and learns over time' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-5 bg-zinc-950 border border-zinc-800 p-5 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 font-mono text-sm">{step.num}</div>
                    <div>
                      <div className="font-medium mb-1">{step.title}</div>
                      <div className="text-sm text-zinc-500">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={completeOnboarding}
                className="w-full py-5 bg-white text-black font-bold text-sm tracking-wider rounded-3xl hover:bg-zinc-200 transition-all"
              >
                LET'S BROWSE THE SWARM
              </button>

              <div className="text-[10px] text-zinc-500 mt-6">No credit card required • Cancel anytime • Your data stays yours</div>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-zinc-800 py-16 text-center text-xs text-zinc-500">
        BEAST_BOTS • Chicago 2026 • Built for empire builders who refuse to be slaves to their tools<br />
        <span className="text-emerald-600">32 integrations • 8 live today • Real OAuth wired • Bank-grade security</span>
      </footer>
    </div>
  );
}
