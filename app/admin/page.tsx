'use client';

import { useEffect, useState } from 'react';
import { formatCurrency, formatTime } from '@/lib/utils';

type ExecutionEvent = {
  type: 'log' | 'decision' | 'error' | 'complete';
  [key: string]: any;
};

export default function AdminDashboard() {
  const [events, setEvents] = useState<ExecutionEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleProcessRequest = async () => {
    if (!email) return;

    setLoading(true);
    setEvents([]);

    try {
      const response = await fetch('/api/agent/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok || !response.body) throw new Error('Stream failed');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (let i = 0; i < lines.length - 1; i += 2) {
          if (lines[i].startsWith('event:')) {
            const eventType = lines[i].replace('event: ', '');
            if (lines[i + 1].startsWith('data:')) {
              const eventData = JSON.parse(lines[i + 1].replace('data: ', ''));
              setEvents((prev) => [...prev, { type: eventType, ...eventData }]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Process Request</h2>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Customer email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              disabled={loading}
            />
            <button
              onClick={handleProcessRequest}
              disabled={loading || !email}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded font-semibold transition"
            >
              {loading ? 'Processing...' : 'Start Agent'}
            </button>
          </div>
        </div>

        {/* Execution Logs */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Execution Timeline</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-sm">
            {events.length === 0 ? (
              <p className="text-gray-400">Waiting for events...</p>
            ) : (
              events.map((event, idx) => {
                if (event.type === 'log') {
                  return (
                    <div key={idx} className="bg-gray-700 p-3 rounded border border-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">{event.log?.action || event.action}</span>
                        <span className={`text-xs font-semibold ${
                          event.log?.status === 'SUCCESS'
                            ? 'text-green-400'
                            : event.log?.status === 'FAILED'
                            ? 'text-red-400'
                            : 'text-yellow-400'
                        }`}>
                          {event.log?.status || event.status}
                        </span>
                      </div>
                      {event.log?.duration && (
                        <div className="text-gray-400 text-xs mt-1">
                          Duration: {event.log.duration}ms
                        </div>
                      )}
                    </div>
                  );
                } else if (event.type === 'decision') {
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded border-2 ${
                        event.decision === 'APPROVED'
                          ? 'bg-green-900 border-green-600'
                          : 'bg-red-900 border-red-600'
                      }`}
                    >
                      <div className="font-bold mb-2">Decision: {event.decision}</div>
                      <div className="text-sm">{event.reasoning}</div>
                    </div>
                  );
                }
                return null;
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
