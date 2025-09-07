'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk'
import { McpEndpointBox } from '../components/McpEndpointBox';

export default function Home() {
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const initializeSdk = async () => {
      await sdk.actions.ready();
    };
    initializeSdk();
  }, []);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const commands: { id: string; title: string; command: string; description: string }[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Browser-use mcp
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            use browser-use rest api as a mcp easily
          </p>
        </header>

        <McpEndpointBox />

        <div className="space-y-6">
          {commands.map((cmd) => (
            <div
              key={cmd.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
            >
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
                {cmd.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {cmd.description}
              </p>
              <div className="relative">
                <pre className="bg-slate-900 dark:bg-slate-950 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                  <code>{cmd.command}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(cmd.command, cmd.id)}
                  className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs transition-colors"
                >
                  {copied === cmd.id ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>


        <footer className="text-center mt-12 text-slate-500 dark:text-slate-400">
        </footer>
      </div>
    </div>
  );
}
