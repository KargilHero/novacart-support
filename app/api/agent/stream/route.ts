import { NextRequest, NextResponse } from 'next/server';
import { processRefundRequest } from '@/agents/refund-agent';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';

function createSSEResponse(readable: ReadableStream<string>) {
  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

function encodeEvent(event: string, data: any): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

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

    const readable = new ReadableStream<string>(async (controller) => {
      try {
        // Send start event
        controller.enqueue(
          encodeEvent('start', {
            conversationId,
            timestamp: new Date().toISOString(),
          })
        );

        // Process refund request
        const { state, logs } = await processRefundRequest({
          conversationId,
          customerId,
          email,
          orderId,
        });

        // Stream each log
        for (const log of logs) {
          controller.enqueue(
            encodeEvent('log', {
              step: log.step,
              action: log.action,
              status: log.status,
              duration: log.duration,
              toolName: log.toolName,
              details: log.details,
              error: log.error,
              timestamp: log.timestamp.toISOString(),
            })
          );
        }

        // Send decision event
        controller.enqueue(
          encodeEvent('decision', {
            decision: state.decision,
            reasoning: state.reasoning,
            eligible: state.decision === 'APPROVED',
            processingTimeMs: state.processingEndTime
              ? state.processingEndTime.getTime() - state.processingStartTime.getTime()
              : 0,
          })
        );

        // Send complete event
        controller.enqueue(
          encodeEvent('complete', {
            conversationId,
            decision: state.decision,
            context: {
              customer: state.context.customer
                ? {
                    id: state.context.customer.id,
                    firstName: state.context.customer.firstName,
                    lastName: state.context.customer.lastName,
                    email: state.context.customer.email,
                    membershipTier: state.context.customer.membershipTier,
                    fraudScore: state.context.customer.fraudScore,
                  }
                : null,
              order: state.context.order
                ? {
                    id: state.context.order.id,
                    productName: state.context.order.productName,
                    totalAmount: state.context.order.totalAmount,
                    purchaseDate: state.context.order.purchaseDate,
                    deliveryDate: state.context.order.deliveryDate,
                  }
                : null,
              eligibilityChecks: state.context.eligibilityChecks,
            },
          })
        );

        controller.close();
      } catch (error) {
        controller.enqueue(
          encodeEvent('error', {
            message: error instanceof Error ? error.message : 'Unknown error',
          })
        );
        controller.close();
      }
    });

    return createSSEResponse(readable);
  } catch (error) {
    console.error('Error in SSE endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to start streaming' },
      { status: 500 }
    );
  }
}
