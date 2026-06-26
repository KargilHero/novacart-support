import { findOrderById, findLatestOrder } from '@/services/order';
import type { Order } from '@/types';

export interface FindOrderInput {
  orderId?: string;
  customerId?: string;
  getLatest?: boolean;
}

export async function findOrderTool(input: FindOrderInput): Promise<{
  success: boolean;
  order?: Order;
  orders?: Order[];
  error?: string;
}> {
  try {
    if (input.orderId) {
      const order = await findOrderById(input.orderId);
      if (!order) {
        return {
          success: false,
          error: `Order ${input.orderId} not found`,
        };
      }
      return { success: true, order };
    }

    if (input.customerId && input.getLatest) {
      const order = await findLatestOrder(input.customerId);
      if (!order) {
        return {
          success: false,
          error: `No orders found for customer ${input.customerId}`,
        };
      }
      return { success: true, order };
    }

    return {
      success: false,
      error: 'Please provide orderId or (customerId with getLatest: true)',
    };
  } catch (error) {
    return {
      success: false,
      error: `Error finding order: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
