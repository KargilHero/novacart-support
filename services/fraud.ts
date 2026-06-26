import type { Customer } from '@/types';

export interface FraudCheckResult {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  score: number;
  requiresManualReview: boolean;
  reason: string;
}

export async function checkFraudScore(customer: Customer): Promise<FraudCheckResult> {
  const score = customer.fraudScore;
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  let reason = '';
  let requiresManualReview = false;

  if (score <= 30) {
    riskLevel = 'LOW';
    reason = 'Customer has low fraud risk';
  } else if (score <= 75) {
    riskLevel = 'MEDIUM';
    reason = 'Customer has moderate fraud risk - monitor carefully';
  } else {
    riskLevel = 'HIGH';
    reason = 'Customer has high fraud risk - manual review required';
    requiresManualReview = true;
  }

  return {
    riskLevel,
    score,
    requiresManualReview,
    reason,
  };
}
