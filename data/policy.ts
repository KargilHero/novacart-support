import type { PolicyRule } from '@/types';

export const REFUND_POLICY_DOCUMENT = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    NOVACART REFUND POLICY - INTERNAL MANUAL                  ║
║                          Effective: January 1, 2024                          ║
╚══════════════════════════════════════════════════════════════════════════════╝

═══ 1. REFUND WINDOW ═══
Standard Customers: 30 days from delivery
Gold Members: 45 days from delivery
Platinum Members: 60 days from delivery

═══ 2. DIGITAL PRODUCTS ═══
Digital products (software, licenses, digital files) are FINAL SALE after activation.
No refund possible once download or license key is activated.

═══ 3. PHYSICAL PRODUCTS ═══
Must be in original condition with all packaging and accessories.
Opened but unused products may be refunded with 15% restocking fee.
Damaged or heavily used items are ineligible.

═══ 4. MEMBERSHIP EXCEPTIONS ═══
Platinum members receive:
- Extended 60-day refund window
- Free return shipping
- Waived restocking fees on select items

═══ 5. GIFT CARDS & STORE CREDIT ═══
Gift cards and store credit are non-refundable under any circumstances.

═══ 6. FRAUD DETECTION ═══
Customers with fraud score > 75 require manual review.
Flagged orders must be investigated before refund approval.

═══ 7. PREVIOUS REFUND LIMIT ═══
Maximum 3 refunds per customer per calendar year.
Customers exceeding limit require manager approval.

═══ 8. PRICE THRESHOLD ═══
Orders under ₹500 are non-refundable unless defective.
Exception: Premium members can refund orders as low as ₹250.

═══ 9. PRODUCT EXCLUSIONS ═══
The following items are NEVER refundable:
- Opened hygiene products (soaps, face masks, etc.)
- Custom-engraved or personalized items
- Clearance or final sale items
- Damaged goods where customer is liable

═══ 10. DEFECTIVE PRODUCTS ═══
Defective items may be refunded outside the standard window with evidence:
- Clear photos of defect
- Proof of attempted repair
- Original receipt

═══ 11. SHIPPING DAMAGES ═══
Items damaged during shipping require:
- Photos of packaging and damage
- Carrier incident report
- Full cooperation in insurance claim

═══ 12. RETURN SHIPPING ═══
Standard customers pay return shipping: ₹200-500
Gold/Platinum members receive free return shipping label.

═══ 13. REFUND PROCESSING TIME ═══
Approved refunds take 5-7 business days to reach customer account.
Digital refunds process within 2 hours of approval.

═══ 14. DUPLICATE REFUND REQUESTS ═══
Only ONE refund request allowed per order.
Duplicate requests are automatically denied.

═══ 15. SEASONAL SALES ITEMS ═══
Items purchased during Black Friday / Cyber Monday sales have 15-day window only.

═══ 16. BUNDLE ITEMS ═══
Bundles cannot be partially refunded.
All or nothing basis only.

═══ 17. OPEN BOX ITEMS ═══
Open box items (marked as such) are non-refundable.
Customer acknowledges condition at purchase.

═══ 18. FINAL DECISION AUTHORITY ═══
All refund decisions are final and legally binding once approved.
Refunds cannot be reversed or canceled by customers.

═══ 19. EXCESSIVE RETURNS POLICY ═══
Customers with >5 refunds in 6 months may face account restrictions.
Pattern of abuse results in permanent account closure.

═══ 20. MANUAL REVIEW ESCALATION ═══
Any ambiguous cases must escalate to human manager.
AI approvals are only for clear-cut policy matches.
`;

export const POLICY_RULES: PolicyRule[] = [
  {
    id: 'rule_001',
    ruleNumber: 'RP-001',
    name: 'Standard Refund Window',
    type: 'REFUND_WINDOW',
    description: 'Standard customers have 30 days from delivery for refunds',
    condition: 'membershipTier === STANDARD && daysSinceDelivery <= 30',
    status: 'ALLOWED',
    message: 'Within standard 30-day refund window',
    priority: 5,
  },
  {
    id: 'rule_002',
    ruleNumber: 'RP-002',
    name: 'Gold Member Refund Window',
    type: 'MEMBERSHIP_EXCEPTION',
    description: 'Gold members have 45 days from delivery',
    condition: 'membershipTier === GOLD && daysSinceDelivery <= 45',
    status: 'ALLOWED',
    message: 'Within Gold member 45-day refund window',
    priority: 4,
  },
  {
    id: 'rule_003',
    ruleNumber: 'RP-003',
    name: 'Platinum Member Refund Window',
    type: 'MEMBERSHIP_EXCEPTION',
    description: 'Platinum members have 60 days from delivery',
    condition: 'membershipTier === PLATINUM && daysSinceDelivery <= 60',
    status: 'ALLOWED',
    message: 'Within Platinum member 60-day refund window',
    priority: 3,
  },
  {
    id: 'rule_004',
    ruleNumber: 'RP-004',
    name: 'Digital Product Final Sale',
    type: 'DIGITAL_PRODUCT',
    description: 'Digital products are non-refundable after activation',
    condition: 'product.isDigital === true && product.activated === true',
    status: 'DENIED',
    message: 'Digital products are final sale after activation',
    priority: 9,
  },
  {
    id: 'rule_005',
    ruleNumber: 'RP-005',
    name: 'Gift Card Non-Refundable',
    type: 'GIFT_CARD',
    description: 'Gift cards cannot be refunded under any circumstances',
    condition: 'product.category === GIFT_CARD',
    status: 'DENIED',
    message: 'Gift cards are non-refundable',
    priority: 10,
  },
  {
    id: 'rule_006',
    ruleNumber: 'RP-006',
    name: 'High Fraud Score Review',
    type: 'FRAUD_CHECK',
    description: 'Customers with fraud score > 75 require manual review',
    condition: 'customer.fraudScore > 75',
    status: 'REQUIRES_REVIEW',
    message: 'High fraud score detected - requires manual review',
    priority: 8,
  },
  {
    id: 'rule_007',
    ruleNumber: 'RP-007',
    name: 'Previous Refund Limit',
    type: 'PREVIOUS_REFUND',
    description: 'Maximum 3 refunds per customer per year',
    condition: 'customer.refundsThisYear >= 3',
    status: 'DENIED',
    message: 'Customer has reached maximum refunds for this year',
    priority: 6,
  },
  {
    id: 'rule_008',
    ruleNumber: 'RP-008',
    name: 'Minimum Price Threshold',
    type: 'PRICE_THRESHOLD',
    description: 'Orders under ₹500 are non-refundable unless defective',
    condition: 'order.amount < 500 && !product.isDefective',
    status: 'DENIED',
    message: 'Orders under ₹500 are non-refundable',
    priority: 7,
  },
  {
    id: 'rule_009',
    ruleNumber: 'RP-009',
    name: 'Premium Threshold Exception',
    type: 'MEMBERSHIP_EXCEPTION',
    description: 'Platinum members can refund orders as low as ₹250',
    condition: 'membershipTier === PLATINUM && order.amount >= 250',
    status: 'ALLOWED',
    message: 'Platinum member exception: eligible for lower minimum',
    priority: 5,
  },
  {
    id: 'rule_010',
    ruleNumber: 'RP-010',
    name: 'Custom/Engraved Items Excluded',
    type: 'PRODUCT_EXCLUSION',
    description: 'Custom-engraved items cannot be refunded',
    condition: 'product.isCustomEngraved === true',
    status: 'DENIED',
    message: 'Custom-engraved products are not refundable',
    priority: 10,
  },
  {
    id: 'rule_011',
    ruleNumber: 'RP-011',
    name: 'Hygiene Product Exclusion',
    type: 'PRODUCT_EXCLUSION',
    description: 'Opened hygiene products cannot be refunded',
    condition: 'product.isHygieneProduct === true && order.isOpened === true',
    status: 'DENIED',
    message: 'Opened hygiene products cannot be refunded',
    priority: 9,
  },
  {
    id: 'rule_012',
    ruleNumber: 'RP-012',
    name: 'Refund Window Expired',
    type: 'REFUND_WINDOW',
    description: 'Default: refund window has expired',
    condition: 'daysSinceDelivery > refundWindowDays',
    status: 'DENIED',
    message: 'Refund window has expired',
    priority: 9,
  },
];

export const getPolicyRuleById = (id: string): PolicyRule | undefined => {
  return POLICY_RULES.find((rule) => rule.id === id);
};

export const getPolicyRuleByNumber = (number: string): PolicyRule | undefined => {
  return POLICY_RULES.find((rule) => rule.ruleNumber === number);
};
