import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders } from '@/services/order';
import { getProductById } from '@/data/products';

export async function GET(req: NextRequest) {
  try {
    const orders = getAllOrders();

    // Transform orders with product info
    const enrichedOrders = orders.map((order) => {
      const product = getProductById(order.productId);
      return {
        id: order.id,
        customerId: order.customerId,
        productName: order.productName,
        totalAmount: order.totalAmount,
        purchaseDate: order.purchaseDate.toISOString(),
        deliveryDate: order.deliveryDate?.toISOString(),
        status: order.status,
        refundRequested: order.refundRequested,
        product: product
          ? {
              id: product.id,
              category: product.category,
              isDigital: product.isDigital,
              isRefundable: product.isRefundable,
            }
          : null,
      };
    });

    return NextResponse.json({ orders: enrichedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
