'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { useToast } from '../components/Toast';

const MARKETPLACE_WORKFLOWS = [
  {
    id: 'wf-1',
    name: 'Content Repurposing Engine',
    description: 'YouTube video → TikTok clips + LinkedIn post + Twitter thread',
    category: 'Content',
    bots: ['YouTubeBot', 'TikTokBot', 'LinkedInBot', 'XTwitterBot'],
    steps: 4,
    installs: 1243,
    template: {
      name: 'Content Repurposing Engine',
      steps: [
        { beastType: 'YouTubeBot', action: 'get_video', params: { videoId: 'INPUT' } },
        { beastType: 'TikTokBot', action: 'create_clip', params: { source: 'youtube' } },
        { beastType: 'LinkedInBot', action: 'create_post', params: { text: 'Auto-generated from video' } },
        { beastType: 'XTwitterBot', action: 'create_post', params: { text: 'Thread from video' } }
      ]
    }
  },
  {
    id: 'wf-2',
    name: 'Lead Qualification Pipeline',
    description: 'HubSpot form → Salesforce lead → Slack alert + Notion CRM entry',
    category: 'Sales',
    bots: ['HubSpotBot', 'SalesforceBot', 'SlackBot', 'NotionBot'],
    steps: 4,
    installs: 892,
    template: {
      name: 'Lead Qualification Pipeline',
      steps: [
        { beastType: 'HubSpotBot', action: 'get_form_submission', params: {} },
        { beastType: 'SalesforceBot', action: 'create_lead', params: {} },
        { beastType: 'SlackBot', action: 'send_message', params: { channel: '#sales' } },
        { beastType: 'NotionBot', action: 'create_page', params: { database: 'CRM' } }
      ]
    }
  },
  {
    id: 'wf-3',
    name: 'Customer Onboarding Automation',
    description: 'Stripe payment → Intercom welcome + Linear task + Gmail sequence',
    category: 'Operations',
    bots: ['StripeBot', 'IntercomBot', 'LinearBot', 'GmailBot'],
    steps: 4,
    installs: 1567,
    template: {
      name: 'Customer Onboarding Automation',
      steps: [
        { beastType: 'StripeBot', action: 'payment_succeeded', params: {} },
        { beastType: 'IntercomBot', action: 'send_message', params: { type: 'welcome' } },
        { beastType: 'LinearBot', action: 'create_issue', params: { team: 'onboarding' } },
        { beastType: 'GmailBot', action: 'send_email', params: { template: 'onboarding' } }
      ]
    }
  }
];

export default function Marketplace() {
  const [installed, setInstalled] = useState<string[]>([]);
  const { showToast } = useToast();

  const installWorkflow = async (wf: any) => {
    try {
      const res = await fetch('/api/swarm/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflow: wf.template, triggerData: { source: 'marketplace' } })
      });
      
      if (res.ok) {
        setInstalled([...installed, wf.id]);
        showToast(`Installed "${wf.name}" to your Swarms!`, 'success');
      }
    } catch (e) {
      showToast('Installation failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="text-3xl">🐲</div>
              <div>
                <div className="font-semibold text-xl tracking-tighter">BEAST_BOTS</div>
                <div className="text-[10px] text-emerald-500 -mt-1">MARKETPLACE</div>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/swarm" className="px-4 py-2 text-sm hover:bg-zinc-900 rounded-xl transition">← Swarm Commander</Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm mb-4">
            COMMUNITY • VERIFIED • READY TO INSTALL
          </div>
          <h1 className="text-7xl font-semibold tracking-tighter mb-4">Workflow Marketplace</h1>
          <p className="text-2xl text-zinc-400 max-w-2xl mx-auto">Discover, install, and run pre-built autonomous swarms from the community.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MARKETPLACE_WORKFLOWS.map((wf) => (
            <div key={wf.id} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 hover:border-emerald-500/50 transition group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-4xl mb-4">⚡</div>
                  <div className="font-semibold text-2xl tracking-tight mb-2 group-hover:text-emerald-400 transition">{wf.name}</div>
                  <div className="text-sm text-emerald-500">{wf.category}</div>
                </div>
                <div className="text-right text-xs text-zinc-500">
                  {wf.installs.toLocaleString()} installs
                </div>
              </div>

              <p className="text-zinc-400 text-sm mb-6 line-clamp-3">{wf.description}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {wf.bots.map((bot, i) => (
                  <div key={i} className="text-xs px-3 py-1 bg-zinc-800 rounded-full text-zinc-400">{bot.replace('Bot','')}</div>
                ))}
              </div>

              <button 
                onClick={() => installWorkflow(wf)}
                disabled={installed.includes(wf.id)}
                className="w-full py-3.5 bg-white text-black font-medium rounded-2xl hover:bg-emerald-400 active:bg-emerald-500 transition disabled:bg-emerald-600 disabled:text-white flex items-center justify-center gap-2"
              >
                {installed.includes(wf.id) ? '✅ INSTALLED' : 'INSTALL TO MY SWARMS'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-sm text-zinc-500">
          More workflows added weekly. Submit yours at marketplace@beastbots.dev
        </div>
      </div>
    </div>
  );
}
