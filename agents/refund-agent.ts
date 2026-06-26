import type { AgentState, Customer, Order, ExecutionLog } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { findCustomerTool } from './tools/findCustomer';
import { findOrderTool } from './tools/findOrder';
import { validatePolicyTool } from './tools/validatePolicy';
import { checkFraudTool } from './tools/checkFraud';
import { calculateDaysSinceDelivery } from '@/services/order';
import { getProductById } from '@/data/products';

export interface RefundAgentInput {
  conversationId: string;
  customerId?: string;
  email?: string;
  orderId?: string;
}

export async function processRefundRequest(input: RefundAgentInput): Promise<{
  state: AgentState;
  logs: ExecutionLog[];
}> {
  const logs: ExecutionLog[] = [];
  const state: AgentState = {
    conversationId: input.conversationId,
    customerId: input.customerId,
    email: input.email,
    orderId: input.orderId,
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

  let stepNumber = 1;

  // Step 1: Find Customer
  let log = createLog(stepNumber, 'Finding customer', 'RUNNING', 'findCustomer');
  logs.push(log);
  state.executionLogs.push(log);

  const startTime = Date.now();
  const findCustomerResult = await findCustomerTool({
    email: input.email,
    customerId: input.customerId,
  });
  const duration = Date.now() - startTime;

  if (!findCustomerResult.success || !findCustomerResult.customer) {
    log = updateLog(logs[logs.length - 1], 'FAILED', duration);
    log.error = findCustomerResult.error;
    logs[logs.length - 1] = log;
    state.executionLogs[state.executionLogs.length - 1] = log;
    state.decision = 'DENIED';
    state.reasoning = `Unable to locate customer: ${findCustomerResult.error}`;
    state.processingEndTime = new Date();
    return { state, logs };
  }

  const customer = findCustomerResult.customer;
  state.customerId = customer.id;
  state.context.customer = customer;

  log = updateLog(logs[logs.length - 1], 'SUCCESS', duration);
  log.details = { customerId: customer.id, name: `${customer.firstName} ${customer.lastName}`, membership: customer.membershipTier };
  logs[logs.length - 1] = log;
  state.executionLogs[state.executionLogs.length - 1] = log;

  stepNumber++;

  // Step 2: Check Fraud Score
  log = createLog(stepNumber, 'Checking fraud score', 'RUNNING', 'checkFraud');
  logs.push(log);
  state.executionLogs.push(log);

  const startTime2 = Date.now();
  const fraudResult = await checkFraudTool({ customer });
  const duration2 = Date.now() - startTime2;

  if (!fraudResult.success) {
    log = updateLog(logs[logs.length - 1], 'FAILED', duration2);
    log.error = fraudResult.error;
    logs[logs.length - 1] = log;
    state.executionLogs[state.executionLogs.length - 1] = log;
  } else {
    log = updateLog(logs[logs.length - 1], 'SUCCESS', duration2);
    log.details = {
      riskLevel: fraudResult.riskLevel,
      score: fraudResult.score,
      requiresReview: fraudResult.requiresManualReview,
    };

    if (fraudResult.requiresManualReview) {
      log.details.manualReviewRequired = true;
    }

    logs[logs.length - 1] = log;
    state.executionLogs[state.executionLogs.length - 1] = log;
  }

  stepNumber++;

  // Step 3: Find Order
  log = createLog(stepNumber, 'Locating order', 'RUNNING', 'findOrder');
  logs.push(log);
  state.executionLogs.push(log);

  const startTime3 = Date.now();
  const findOrderResult = await findOrderTool({
    orderId: input.orderId,
    customerId: customer.id,
    getLatest: !input.orderId,
  });
  const duration3 = Date.now() - startTime3;

  if (!findOrderResult.success || !findOrderResult.order) {
    log = updateLog(logs[logs.length - 1], 'FAILED', duration3);
    log.error = findOrderResult.error;
    logs[logs.length - 1] = log;
    state.executionLogs[state.executionLogs.length - 1] = log;
    state.decision = 'DENIED';
    state.reasoning = `Unable to locate order: ${findOrderResult.error}`;
    state.processingEndTime = new Date();
    return { state, logs };
  }

  const order = findOrderResult.order;
  state.orderId = order.id;
  state.context.order = order;

  log = updateLog(logs[logs.length - 1], 'SUCCESS', duration3);
  log.details = {
    orderId: order.id,
    product: order.productName,
    amount: order.totalAmount,
    purchaseDate: order.purchaseDate.toISOString(),
    deliveryDate: order.deliveryDate?.toISOString(),
  };
  logs[logs.length - 1] = log;
  state.executionLogs[state.executionLogs.length - 1] = log;

  stepNumber++;

  // Step 4: Validate Policy
  log = createLog(stepNumber, 'Validating refund policy', 'RUNNING', 'validatePolicy');
  logs.push(log);
  state.executionLogs.push(log);

  const startTime4 = Date.now();
  const policyResult = await validatePolicyTool({ customer, order });
  const duration4 = Date.now() - startTime4;

  if (!policyResult.success) {
    log = updateLog(logs[logs.length - 1], 'FAILED', duration4);
    log.error = policyResult.error;
    logs[logs.length - 1] = log;
    state.executionLogs[state.executionLogs.length - 1] = log;
  } else {
    log = updateLog(logs[logs.length - 1], 'SUCCESS', duration4);
    log.details = {
      eligible: policyResult.eligible,
      checksPerformed: policyResult.checks.length,
      failedRules: policyResult.failedRules,
    };
    logs[logs.length - 1] = log;
    state.executionLogs[state.executionLogs.length - 1] = log;

    state.context.eligibilityChecks = policyResult.checks;
  }

  stepNumber++;

  // Step 5: Make Decision
  log = createLog(stepNumber, 'Making refund decision', 'RUNNING');
  logs.push(log);
  state.executionLogs.push(log);

  const startTime5 = Date.now();
  
  const isEligible = policyResult.eligible && !fraudResult.requiresManualReview;
  const decision = isEligible ? 'APPROVED' : 'DENIED';
  
  let reasoning = '';
  if (!policyResult.eligible) {
    const failedRuleDescriptions = policyResult.failedRules.join(', ');
    reasoning = `Refund request denied. Failed policy rules: ${failedRuleDescriptions}`;
  } else if (fraudResult.requiresManualReview) {
    reasoning = `Refund request requires manual review due to elevated fraud score (${fraudResult.score}).`;
  } else {
    reasoning = `Refund request approved. Customer meets all eligibility criteria. Order will be processed within 5-7 business days.`;
  }

  const duration5 = Date.now() - startTime5;
  log = updateLog(logs[logs.length - 1], 'SUCCESS', duration5);
  log.details = { decision, eligible: isEligible, fraudReview: fraudResult.requiresManualReview };
  logs[logs.length - 1] = log;
  state.executionLogs[state.executionLogs.length - 1] = log;

  state.decision = decision;
  state.reasoning = reasoning;
  state.processingEndTime = new Date();

  return { state, logs };
}

function createLog(
  step: number,
  action: string,
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'RETRY',
  toolName?: string
): ExecutionLog {
  return {
    id: uuidv4(),
    timestamp: new Date(),
    step,
    action,
    toolName,
    status,
    duration: 0,
    retryCount: 0,
  };
}

function updateLog(
  log: ExecutionLog,
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'RETRY',
  duration: number,
  details?: Record<string, any>,
  error?: string
): ExecutionLog {
  return {
    ...log,
    status,
    duration,
    details,
    error,
  };
}
