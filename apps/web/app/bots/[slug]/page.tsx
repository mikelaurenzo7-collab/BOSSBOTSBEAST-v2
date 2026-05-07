'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { useToast } from '../../components/Toast';

export default function BotWorkspace() {
  const params = useParams();
  const slug = params.slug as string;
  const [settings, setSettings] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetch(`/api/bots/settings?beastType=${slug}`)
      .then(res => res.json())
      .then(data => setSettings(data.settings));
  }, [slug]);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/bots/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beastType: slug, ...settings })
      });
      showToast('Settings saved successfully', 'success');
    } catch (e) {
      showToast('Failed to save settings', 'error');
    }
    setIsSaving(false);
  };

  if (!settings) return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">Loading customization...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-emerald-500 hover:underline mb-8 inline-block">← Back to Dashboard</Link>
        
        <h1 className="text-5xl font-semibold tracking-tighter mb-4">{slug} Customization</h1>
        <p className="text-xl text-zinc-400 mb-12">Set autonomy, permissions, and behavior for this beast.</p>

        <div className="space-y-12">
          {/* Autonomy Level */}
          <div>
            <div className="flex justify-between mb-4">
              <div className="font-semibold text-xl">Autonomy Level</div>
              <div className="text-2xl font-mono text-emerald-400">{settings.autonomyLevel}%</div>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={settings.autonomyLevel} 
              onChange={(e) => setSettings({ ...settings, autonomyLevel: parseInt(e.target.value) })}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-2">
              <div>Requires Approval</div>
              <div>Fully Autonomous</div>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <div className="font-semibold text-xl mb-4">Permissions</div>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(settings.permissions || {}).map((key) => (
                <label key={key} className="flex items-center gap-3 bg-zinc-900 p-4 rounded-2xl cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.permissions[key]} 
                    onChange={(e) => setSettings({
                      ...settings,
                      permissions: { ...settings.permissions, [key]: e.target.checked }
                    })}
                    className="accent-emerald-500 w-5 h-5"
                  />
                  <span className="capitalize">{key}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Instructions */}
          <div>
            <div className="font-semibold text-xl mb-4">Custom Instructions</div>
            <textarea 
              value={settings.customInstructions || ''}
              onChange={(e) => setSettings({ ...settings, customInstructions: e.target.value })}
              className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 font-mono text-sm"
              placeholder="Always be concise. Never delete data without confirmation."
            />
          </div>

          {/* Memory & Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold text-xl mb-4">Memory Retention</div>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  value={settings.memoryRetentionDays}
                  onChange={(e) => setSettings({ ...settings, memoryRetentionDays: parseInt(e.target.value) })}
                  className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-2xl w-24 text-center"
                />
                <span className="text-zinc-400">days</span>
              </div>
            </div>
            <div>
              <div className="font-semibold text-xl mb-4">Daily Execution Cap</div>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  value={settings.dailyExecutionCap}
                  onChange={(e) => setSettings({ ...settings, dailyExecutionCap: parseInt(e.target.value) })}
                  className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-2xl w-24 text-center"
                />
                <span className="text-zinc-400">executions</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={saveSettings}
          disabled={isSaving}
          className="mt-12 w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-medium text-lg transition disabled:opacity-50"
        >
          {isSaving ? 'SAVING...' : 'SAVE CUSTOMIZATION'}
        </button>
      </div>
    </div>
  );
}
