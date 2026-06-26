import { validateRefundEligibility } from '@/services/policy';
import type { Customer, Order } from '@/types';

export interface ValidatePolicyInput {
  customer: Customer;
  order: Order;
}

export async function validatePolicyTool(input: ValidatePolicyInput): Promise<{
  success: boolean;
  eligible: boolean;
  checks: any[];
  failedRules: string[];
  error?: string;
}> {
  try {
    const result = await validateRefundEligibility(input);
    return {
      success: true,
      eligible: result.eligible,
      checks: result.checks,
      failedRules: result.failedRules,
    };
  } catch (error) {
    return {
      success: false,
      eligible: false,
      checks: [],
      failedRules: [],
      error: `Error validating policy: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
