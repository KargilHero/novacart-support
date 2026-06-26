export type PolicyRuleType =
  | 'REFUND_WINDOW'
  | 'DIGITAL_PRODUCT'
  | 'MEMBERSHIP_EXCEPTION'
  | 'DAMAGE_REQUIREMENT'
  | 'GIFT_CARD'
  | 'FRAUD_CHECK'
  | 'PREVIOUS_REFUND'
  | 'PRICE_THRESHOLD'
  | 'PRODUCT_EXCLUSION';

export type PolicyRuleStatus = 'ALLOWED' | 'DENIED' | 'REQUIRES_REVIEW';

export type PolicyRule = {
  id: string;
  ruleNumber: string;
  name: string;
  type: PolicyRuleType;
  description: string;
  condition: string;
  status: PolicyRuleStatus;
  message: string;
  priority: number;
};

export type EligibilityCheck = {
  ruleId: string;
  ruleName: string;
  ruleNumber: string;
  passed: boolean;
  reason: string;
  metadata?: Record<string, any>;
};

export type RefundDecision = {
  approved: boolean;
  amount: number;
  reason: string;
  matchedRules: string[];
  failedRules: string[];
};
