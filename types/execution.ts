export type ExecutionLogStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'RETRY';

export type ExecutionLog = {
  id: string;
  timestamp: Date;
  step: number;
  action: string;
  toolName?: string;
  status: ExecutionLogStatus;
  duration: number;
  details?: Record<string, any>;
  error?: string;
  retryCount: number;
};

export type ExecutionEvent = {
  type: 'LOG' | 'DECISION' | 'ERROR' | 'COMPLETE';
  log: ExecutionLog;
  payload?: Record<string, any>;
};
