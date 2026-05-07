'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Toast, useToast } from '../components/Toast';

interface WorkflowStep {
  beastType: string;
  action: string;
  params: Record<string, any>;
}

interface Workflow {
  name: string;
  steps: WorkflowStep[];
}

const PRESET_WORKFLOWS = [
  {
    name: 'Linear Issue → Slack + Notion',
    steps: [
      { beastType: 'LinearBot', action: 'create_issue', params: { title: 'New bug from swarm', priority: 'high' } },
      { beastType: 'SlackBot', action: 'send_message', params: { channel: '#alerts', text: '🚨 New Linear issue created by BEAST_BOTS swarm' } },
      { beastType: 'NotionBot', action: 'create_page', params: { title: 'Swarm Log Entry', content: 'Issue tracked automatically' } }
    ]
  },
  {
    name: 'GitHub PR → Discord + Linear',
    steps: [
      { beastType: 'GitHubBot', action: 'create_pr', params: { title: 'Feature: Swarm Commander v2', repo: 'bossbotsbeast' } },
      { beastType: 'DiscordBot', action: 'send_message', params: { channel: 'dev-updates', text: 'New PR ready for review' } },
      { beastType: 'LinearBot', action: 'create_issue', params: { title: 'Review PR #42', team: 'eng' } }
    ]
  },
  {
    name: 'Stripe Payment → Notion + Email',
    steps: [
      { beastType: 'StripeBot', action: 'record_payment', params: { amount: 299, customer: 'Acme Corp' } },
      { beastType: 'NotionBot', action: 'create_page', params: { title: 'Revenue Log', database: 'Finance' } },
      { beastType: 'MailchimpBot', action: 'add_subscriber', params: { email: 'finance@acme.com', list: 'VIP' } }
    ]
  }
];

export default function SwarmCommander() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [customSteps, setCustomSteps] = useState<WorkflowStep[]>([]);
  const { toasts, showToast } = useToast();

  const executeSwarm = async (workflow: Workflow) => {
    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const res = await fetch('/api/swarm/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflow, triggerData: { source: 'manual', timestamp: new Date() } })
      });

      const data = await res.json();
      
      if (data.success) {
        showToast(`Swarm "${workflow.name}" executed successfully!`, 'success');
        setExecutionResult(data);
      } else {
        showToast(data.error || 'Execution failed', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Network error', 'error');
      setExecutionResult({ error: err.message });
    } finally {
      setIsExecuting(false);
    }
  };

  const addCustomStep = () => {
    setCustomSteps([...customSteps, { beastType: 'SlackBot', action: 'send_message', params: { text: 'Custom swarm step' } }]);
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
                <div className="text-[10px] text-emerald-500 -mt-1">SWARM COMMANDER</div>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="px-4 py-2 text-sm hover:bg-zinc-900 rounded-xl transition">← Dashboard</Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm mb-4">
              PHASE 3 POLISHED
            </div>
            <h1 className="text-7xl font-semibold tracking-tighter">Swarm Commander</h1>
            <p className="text-2xl text-zinc-400 mt-3 max-w-2xl">One trigger. Infinite autonomous actions across your entire stack.</p>
          </div>
          <div className="text-right">
            <div className="text-emerald-500 text-sm">AUTONOMOUS • RELIABLE • AUDITED</div>
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="text-xl font-semibold">Ready-to-Run Swarms</div>
            <button 
              onClick={() => setSelectedWorkflow(null)}
              className="text-sm px-4 py-2 border border-zinc-700 hover:bg-zinc-900 rounded-2xl transition"
            >
              Custom Builder
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESET_WORKFLOWS.map((wf, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedWorkflow(wf as any)}
                className="group bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 rounded-3xl p-8 cursor-pointer transition-all active:scale-[0.985]"
              >
                <div className="text-4xl mb-6">⚡</div>
                <div className="font-semibold text-2xl tracking-tight mb-3 group-hover:text-emerald-400 transition">{wf.name}</div>
                <div className="text-zinc-400 text-sm mb-6 line-clamp-2">{wf.steps.length} autonomous steps • Instant execution</div>
                
                <div className="flex flex-wrap gap-2">
                  {wf.steps.map((step, i) => (
                    <div key={i} className="text-xs px-3 py-1 bg-zinc-800 rounded-full text-zinc-400">{step.beastType.replace('Bot','')}</div>
                  ))}
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); executeSwarm(wf as any); }}
                  disabled={isExecuting}
                  className="mt-8 w-full py-3.5 bg-white text-black font-medium rounded-2xl hover:bg-emerald-400 active:bg-emerald-500 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isExecuting ? 'EXECUTING...' : '▶ RUN SWARM'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {executionResult && (
          <div className="mb-16 bg-zinc-900 border border-emerald-500/30 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-emerald-500">✅</div>
              <div className="font-semibold text-xl">Swarm Execution Complete</div>
            </div>
            <pre className="text-sm bg-black p-6 rounded-2xl overflow-auto text-emerald-400 font-mono">{JSON.stringify(executionResult, null, 2)}</pre>
          </div>
        )}

        <div className="border border-zinc-800 rounded-3xl p-12">
          <div className="text-xl font-semibold mb-8">Build Your Own Swarm</div>
          
          <div className="flex gap-4 mb-8">
            <button onClick={addCustomStep} className="px-6 py-3 border border-zinc-700 hover:bg-zinc-900 rounded-2xl text-sm flex items-center gap-2">
              + Add Step
            </button>
            <button 
              onClick={() => {
                if (customSteps.length > 0) {
                  executeSwarm({ name: 'Custom Swarm', steps: customSteps });
                }
              }}
              disabled={customSteps.length === 0 || isExecuting}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 rounded-2xl text-sm font-medium transition"
            >
              EXECUTE CUSTOM SWARM
            </button>
          </div>

          <div className="space-y-4">
            {customSteps.length === 0 && (
              <div className="text-center py-12 text-zinc-500">Add steps above to build your autonomous workflow</div>
            )}
            {customSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-4 bg-zinc-900/70 p-5 rounded-2xl">
                <div className="font-mono text-xs text-emerald-500 w-6">{index + 1}</div>
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <input 
                    type="text" 
                    value={step.beastType} 
                    onChange={(e) => {
                      const updated = [...customSteps];
                      updated[index].beastType = e.target.value;
                      setCustomSteps(updated);
                    }}
                    className="bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl text-sm font-mono"
                    placeholder="BeastType (e.g. SlackBot)"
                  />
                  <input 
                    type="text" 
                    value={step.action} 
                    onChange={(e) => {
                      const updated = [...customSteps];
                      updated[index].action = e.target.value;
                      setCustomSteps(updated);
                    }}
                    className="bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl text-sm font-mono"
                    placeholder="Action (e.g. send_message)"
                  />
                  <input 
                    type="text" 
                    value={JSON.stringify(step.params)}
                    onChange={(e) => {
                      try {
                        const updated = [...customSteps];
                        updated[index].params = JSON.parse(e.target.value);
                        setCustomSteps(updated);
                      } catch {}
                    }}
                    className="bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl text-sm font-mono"
                    placeholder='{"text": "Hello"}'
                  />
                </div>
                <button onClick={() => {
                  const updated = customSteps.filter((_, i) => i !== index);
                  setCustomSteps(updated);
                }} className="text-red-400 hover:text-red-500 px-3">✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center text-xs text-zinc-500">
          Every execution is logged in your private activity vault. Real tokens used. Full audit trail.
        </div>
      </div>

      {/* Toast notifications */}
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => {}} 
        />
      ))}
    </div>
  );
}
