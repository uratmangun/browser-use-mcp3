'use client';

import { useState, useEffect } from 'react';
import { generateMcpEndpointUrl } from '../utils/mcpEndpoint';

export const McpEndpointBox = () => {
  const [mcpUrl, setMcpUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Generate the MCP endpoint URL when component mounts
    const url = generateMcpEndpointUrl();
    setMcpUrl(url);
  }, []);

  const copyToClipboard = async () => {
    if (!mcpUrl) return;
    
    try {
      await navigator.clipboard.writeText(mcpUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy MCP endpoint URL:', error);
    }
  };

  // Don't render if no URL is available (SSR or error case)
  if (!mcpUrl) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 mb-8">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
        MCP Endpoint URL
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mb-4">
        Use this URL to configure your MCP client connection
      </p>
      <div className="relative">
        <div className="bg-slate-900 dark:bg-slate-950 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm border">
          <code>{mcpUrl}</code>
        </div>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs transition-colors"
          disabled={!mcpUrl}
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};