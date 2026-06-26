import type { ExecutionLog } from './execution';
import type { Customer } from './customer';
import type { Order } from './order';
import type { PolicyRule, EligibilityCheck } from './policy';

export type AgentState = {
  conversationId: string;
  customerId?: string;
  email?: string;
  orderId?: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  context: {
    customer?: Customer;
    order?: Order;
    eligibilityChecks: EligibilityCheck[];
    policyMatches: PolicyRule[];
  };
  decision: 'APPROVED' | 'DENIED' | 'PENDING' | null;
  reasoning: string;
  executionLogs: ExecutionLog[];
  processingStartTime: Date;
  processingEndTime?: Date;
};

export type AgentToolCall = {
  id: string;
  name: string;
  input: Record<string, any>;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  output?: Record<string, any>;
  error?: string;
  duration: number;
};

export type AgentResponse = {
  conversationId: string;
  message: string;
  state: AgentState;
};
