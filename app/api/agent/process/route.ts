import { NextRequest, NextResponse } from 'next/server';
import { processRefundRequest } from '@/agents/refund-agent';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, customerId, orderId } = await req.json();

    if (!email && !customerId && !orderId) {
      return NextResponse.json(
        { error: 'Please provide email, customerId, or orderId' },
        { status: 400 }
      );
    }

    const conversationId = uuidv4();
    const { state, logs } = await processRefundRequest({
      conversationId,
      customerId,
      email,
      orderId,
    });

    return NextResponse.json({
      success: true,
      conversationId,
      decision: state.decision,
      reasoning: state.reasoning,
      logs,
      context: {
        customer: state.context.customer,
        order: state.context.order,
        eligibilityChecks: state.context.eligibilityChecks,
      },
      processingTimeMs: state.processingEndTime
        ? state.processingEndTime.getTime() - state.processingStartTime.getTime()
        : 0,
    });
  } catch (error) {
    console.error('Error processing refund request:', error);
    return NextResponse.json(
      { error: 'Failed to process refund request' },
      { status: 500 }
    );
  }
}
