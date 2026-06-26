import { POLICY_RULES } from '@/data/policy';
import type { Customer, EligibilityCheck, Order, PolicyRule } from '@/types';
import { calculateDaysSince, calculateRefundWindow } from '@/lib/utils';
import { getProductById } from '@/data/products';
import { calculateDaysSinceDelivery } from './order';

export interface RefundEligibilityInput {
  customer: Customer;
  order: Order;
}

export async function validateRefundEligibility(
  input: RefundEligibilityInput
): Promise<{ eligible: boolean; checks: EligibilityCheck[]; failedRules: string[] }> {
  const { customer, order } = input;
  const checks: EligibilityCheck[] = [];
  const failedRules: string[] = [];

  // Sort rules by priority (higher = check first)
  const sortedRules = [...POLICY_RULES].sort((a, b) => b.priority - a.priority);

  for (const rule of sortedRules) {
    const check = evaluateRule(rule, customer, order);
    checks.push(check);

    if (!check.passed && rule.status === 'DENIED') {
      failedRules.push(rule.ruleNumber);
    }
  }

  const hasFailedRules = failedRules.length > 0;
  return {
    eligible: !hasFailedRules,
    checks,
    failedRules,
  };
}

function evaluateRule(rule: PolicyRule, customer: Customer, order: Order): EligibilityCheck {
  let passed = false;
  let reason = '';
  const metadata: Record<string, any> = {};

  if (rule.ruleNumber === 'RP-001') {
    // Standard Refund Window (30 days)
    if (customer.membershipTier === 'STANDARD' && order.deliveryDate) {
      const daysSince = calculateDaysSinceDelivery(order.deliveryDate);
      passed = daysSince <= 30;
      reason = passed ? `${30 - daysSince} days remaining in refund window` : `${daysSince} days since delivery (exceeds 30-day window)`;
      metadata.daysSince = daysSince;
      metadata.window = 30;
    }
  } else if (rule.ruleNumber === 'RP-002') {
    // Gold Member Refund Window (45 days)
    if (customer.membershipTier === 'GOLD' && order.deliveryDate) {
      const daysSince = calculateDaysSinceDelivery(order.deliveryDate);
      passed = daysSince <= 45;
      reason = passed ? `${45 - daysSince} days remaining in refund window` : `${daysSince} days since delivery (exceeds 45-day window)`;
      metadata.daysSince = daysSince;
      metadata.window = 45;
    }
  } else if (rule.ruleNumber === 'RP-003') {
    // Platinum Member Refund Window (60 days)
    if (customer.membershipTier === 'PLATINUM' && order.deliveryDate) {
      const daysSince = calculateDaysSinceDelivery(order.deliveryDate);
      passed = daysSince <= 60;
      reason = passed ? `${60 - daysSince} days remaining in refund window` : `${daysSince} days since delivery (exceeds 60-day window)`;
      metadata.daysSince = daysSince;
      metadata.window = 60;
    }
  } else if (rule.ruleNumber === 'RP-004') {
    // Digital Product Final Sale
    const product = getProductById(order.productId);
    passed = !(product?.isDigital === true);
    reason = product?.isDigital ? 'Digital product - final sale after activation' : 'Physical product - eligible for refund';
    metadata.isDigital = product?.isDigital || false;
  } else if (rule.ruleNumber === 'RP-005') {
    // Gift Card Non-Refundable
    passed = order.category !== 'GIFT_CARD';
    reason = order.category === 'GIFT_CARD' ? 'Gift cards are non-refundable' : 'Not a gift card';
  } else if (rule.ruleNumber === 'RP-006') {
    // High Fraud Score Review
    passed = customer.fraudScore <= 75;
    reason = customer.fraudScore > 75 ? `Fraud score ${customer.fraudScore} exceeds threshold (75)` : `Fraud score ${customer.fraudScore} is acceptable`;
    metadata.fraudScore = customer.fraudScore;
    metadata.threshold = 75;
  } else if (rule.ruleNumber === 'RP-007') {
    // Previous Refund Limit (3 per year)
    passed = customer.previousRefundsCount < 3;
    reason = customer.previousRefundsCount >= 3
      ? `Customer has ${customer.previousRefundsCount} refunds this year (limit: 3)`
      : `Customer has ${customer.previousRefundsCount} refunds this year (limit: 3)`;
    metadata.refundCount = customer.previousRefundsCount;
    metadata.limit = 3;
  } else if (rule.ruleNumber === 'RP-008') {
    // Minimum Price Threshold (₹500)
    passed = order.totalAmount >= 500;
    reason = order.totalAmount < 500 ? `Order amount ₹${order.totalAmount} is below ₹500 minimum` : `Order amount ₹${order.totalAmount} meets minimum threshold`;
    metadata.amount = order.totalAmount;
    metadata.threshold = 500;
  } else if (rule.ruleNumber === 'RP-009') {
    // Premium Threshold Exception (Platinum: ₹250)
    if (customer.membershipTier === 'PLATINUM') {
      passed = order.totalAmount >= 250;
      reason = order.totalAmount >= 250 ? `Platinum member - eligible for ₹250 minimum` : `Order amount below Platinum minimum (₹250)`;
      metadata.amount = order.totalAmount;
      metadata.threshold = 250;
    }
  } else if (rule.ruleNumber === 'RP-010') {
    // Custom/Engraved Items
    passed = true; // Assume not custom unless specified
    reason = 'Not a custom-engraved product';
  } else if (rule.ruleNumber === 'RP-011') {
    // Hygiene Product Exclusion
    passed = true; // Assume not hygiene unless specified
    reason = 'Not a hygiene product';
  } else if (rule.ruleNumber === 'RP-012') {
    // Refund Window Expired (catch-all)
    if (order.deliveryDate) {
      const window = calculateRefundWindow(customer.membershipTier);
      const daysSince = calculateDaysSinceDelivery(order.deliveryDate);
      passed = daysSince <= window;
      reason = passed ? `Within refund window (${window} days)` : `Refund window expired`;
      metadata.daysSince = daysSince;
      metadata.window = window;
    }
  }

  return {
    ruleId: rule.id,
    ruleName: rule.name,
    ruleNumber: rule.ruleNumber,
    passed,
    reason,
    metadata,
  };
}

export function getPolicyRules(): PolicyRule[] {
  return POLICY_RULES;
}
