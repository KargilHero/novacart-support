import type { AgentState } from '@/types';

export function createInitialState(conversationId: string): AgentState {
  return {
    conversationId,
    messages: [],
    context: {
      eligibilityChecks: [],
      policyMatches: [],
    },
    decision: null,
    reasoning: '',
    executionLogs: [],
    processingStartTime: new Date(),
  };
}

export function updateState(state: AgentState, updates: Partial<AgentState>): AgentState {
  return { ...state, ...updates };
}
