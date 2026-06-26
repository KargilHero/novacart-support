export const SITE_NAME = 'NovaCart Support';
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const REFUND_STATUSES = {
  PENDING: 'Pending Review',
  APPROVED: 'Approved',
  DENIED: 'Denied',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
} as const;

export const MEMBERSHIP_TIERS = {
  STANDARD: 'Standard',
  GOLD: 'Gold',
  PLATINUM: 'Platinum',
} as const;

export const EXECUTION_STATUS = {
  PENDING: 'Pending',
  RUNNING: 'Running',
  SUCCESS: 'Success',
  FAILED: 'Failed',
  RETRY: 'Retry',
} as const;
