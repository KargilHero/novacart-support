import { createStreamableValue } from 'ai/rsc';

export type StreamEvent = 
  | { type: 'log'; log: { timestamp: string; action: string; status: string; duration?: number } }
  | { type: 'decision'; decision: { approved: boolean; reason: string } }
  | { type: 'error'; error: string }
  | { type: 'complete'; payload: Record<string, any> };

export function createEventStream() {
  return createStreamableValue<StreamEvent>();
}

export async function streamLog(
  stream: any,
  action: string,
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED',
  duration?: number
) {
  const timestamp = new Date().toLocaleTimeString('en-IN');
  stream.append({
    type: 'log',
    log: { timestamp, action, status, duration },
  });
}
