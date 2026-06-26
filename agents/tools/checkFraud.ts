import { checkFraudScore } from '@/services/fraud';
import type { Customer } from '@/types';

export interface CheckFraudInput {
  customer: Customer;
}

export async function checkFraudTool(input: CheckFraudInput): Promise<{
  success: boolean;
  riskLevel?: string;
  score?: number;
  requiresManualReview?: boolean;
  reason?: string;
  error?: string;
}> {
  try {
    const result = await checkFraudScore(input.customer);
    return {
      success: true,
      riskLevel: result.riskLevel,
      score: result.score,
      requiresManualReview: result.requiresManualReview,
      reason: result.reason,
    };
  } catch (error) {
    return {
      success: false,
      error: `Error checking fraud score: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
