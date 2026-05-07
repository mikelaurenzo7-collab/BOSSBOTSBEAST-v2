'use client';

import React, { useState } from 'react';

interface Beast {
  name: string;
  sigil: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'expiring';
  capabilities: string[];
  backstory: string;
}

const beasts: Beast[] = [
  {
    name: 'MetaBeast',
    sigil: '🔥',
    provider: 'meta',
    status: 'connected',
    capabilities: ['Post to Pages', 'Manage Meta Ads', 'Access Business Insights', 'Control Instagram via Meta', 'Audience targeting'],
    backstory: 'The MetaBeast commands the entire Meta ecosystem — Facebook Pages, Business Manager, Instagram Business, and advertising empires through the Graph API. It is the sovereign ruler of paid reach and content distribution.'
  },
  {
    name: 'InstagramBeast',
    sigil: '📸',
    provider: 'instagram',
    status: 'disconnected',
    capabilities: ['Publish Reels & Stories', 'Manage Comments', 'Access Insights', 'Content Calendar', 'Audience Insights'],
    backstory: 'InstagramBeast is the master of visual empires. It publishes, analyzes, and optimizes content across the platform with surgical precision.'
  }
];

export default function BeastDashboard() {
  const [selectedBeast, setSelectedBeast] = useState<Beast | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [oauthStep, setOauthStep] = useState(0);
  const [connectedBeasts, setConnectedBeasts] = useState<Record<string, boolean>>({
    MetaBeast: true,
    InstagramBeast: false,
  });

  const connectBeast = (beast: Beast) => {
    setSelectedBeast(beast);
    setShowModal(true);
    setOauthStep(0);
  };

  const simulateOAuth = () => {
    const steps = [
      'Redirecting to provider OAuth...',
      'User grants permissions...',
      'Exchanging code for tokens...',
      'Storing encrypted tokens in vault...',
      'Beast awakened successfully!'
    ];
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setOauthStep(step);
      if (step >= steps.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          if (selectedBeast) {
            setConnectedBeasts(prev => ({ ...prev, [selectedBeast.name]: true }));
          }
          setShowModal(false);
          alert(`${selectedBeast?.name} connected successfully! Token stored securely.`);
        }, 800);
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <nav className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🐲</div>
            <div>
              <div className="font-bold text-2xl tracking-[-1px]">BEASTOS</div>
              <div className="text-[9px] text-zinc-500 -mt-1 tracking-[2px]">SOVEREIGN INTEGRATION SWARM v2</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center gap-2 text-xs font-mono">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              SWARM ONLINE
            </div>
            <button className="px-5 py-2 border border-zinc-700 hover:bg-zinc-900 rounded-2xl text-sm font-medium transition-all">SWARM COMMANDER</button>
          </div>
        </div>
      </nav>

      <div className="pt-20 max-w-7xl mx-auto px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <div className="uppercase tracking-[4px] text-xs text-zinc-500 mb-4">CHICAGO 2026 • MICHAEL'S EMPIRE</div>
            <h1 className="text-[92px] leading-[82px] font-bold tracking-[-5.5px] bg-gradient-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              THE SWARM<br />AWAKENS
            </h1>
            <p className="mt-6 text-2xl text-zinc-400 max-w-lg">One Beast per integration.<br />All of them loyal only to you.</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-zinc-500 mb-1">INTEGRATIONS CONNECTED</div>
            <div className="text-[92px] leading-none font-mono font-bold text-emerald-400 tabular-nums">02<span className="text-4xl align-super text-zinc-600">/32</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {beasts.map((beast, index) => {
            const isConnected = connectedBeasts[beast.name];
            return (
              <div key={index} className="group border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 rounded-3xl p-10 flex flex-col transition-all duration-300">
                <div className="flex justify-between items-start mb-8">
                  <div className="text-[92px] leading-none transition-transform group-hover:-rotate-12">{beast.sigil}</div>
                  <div className={`px-5 py-1.5 text-xs font-mono tracking-widest self-start rounded-2xl ${isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                    {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                  </div>
                </div>

                <div className="font-bold text-6xl tracking-[-2px] mb-4 pr-12">{beast.name}</div>
                <div className="text-lg text-zinc-400 pr-8 mb-auto line-clamp-4">{beast.backstory}</div>

                <div className="mt-10">
                  <div className="uppercase text-xs tracking-[2px] text-zinc-500 mb-4">NATIVE CAPABILITIES</div>
                  <div className="flex flex-wrap gap-2 mb-10">
                    {beast.capabilities.map((cap, i) => (
                      <div key={i} className="text-sm px-5 py-2 bg-zinc-800 group-hover:bg-zinc-700 rounded-2xl transition-colors">{cap}</div>
                    ))}
                  </div>

                  <button 
                    onClick={() => connectBeast(beast)}
                    className={`w-full py-5 rounded-3xl font-bold text-sm tracking-wider transition-all active:scale-[0.985] ${isConnected ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white text-black hover:bg-zinc-200'}`}
                  >
                    {isConnected ? 'MANAGE CONNECTION & TOKENS' : 'CONNECT VIA SECURE OAUTH'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900 px-4 py-2 rounded-2xl">
            All beasts use real OAuth 2.0 • Tokens encrypted at rest with AES-256 • Auto-refresh enabled
          </div>
        </div>
      </div>

      {showModal && selectedBeast && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-6" onClick={() => setShowModal(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-[420px] w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-10 pt-10 pb-8 text-center border-b border-zinc-800">
              <div className="text-[110px] mb-4 transition-transform" style={{ transform: oauthStep > 2 ? 'scale(1.1)' : 'scale(1)' }}>{selectedBeast.sigil}</div>
              <div className="text-4xl font-bold tracking-tight mb-3">Connecting {selectedBeast.name}</div>
              <div className="text-sm text-zinc-400">Secure OAuth 2.0 • One-time approval • Tokens encrypted</div>
            </div>

            <div className="p-10 space-y-3">
              {[
                'Opening secure OAuth window on provider...',
                `Requesting scopes: ${selectedBeast.capabilities.slice(0, 2).join(' + ')}...`,
                'Exchanging authorization code for access token...',
                'Encrypting and storing tokens in private vault...',
                'Beast fully awakened and ready for command.'
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
                onClick={simulateOAuth}
                disabled={oauthStep > 0}
                className="w-full py-5 bg-white hover:bg-zinc-200 active:bg-white text-black font-bold text-sm tracking-wider rounded-3xl transition-all disabled:opacity-60"
              >
                {oauthStep > 0 ? 'AUTHORIZING WITH PROVIDER...' : 'AUTHORIZE WITH ' + selectedBeast.provider.toUpperCase()}
              </button>
              <div className="text-center text-[10px] text-zinc-500 mt-4">You will be redirected to the official provider login</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
