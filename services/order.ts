import { getOrderById, getOrdersByCustomerId, getLatestOrderByCustomerId, MOCK_ORDERS } from '@/data/mockOrders';
import { getProductById } from '@/data/products';
import type { Order } from '@/types';

export async function findOrderById(orderId: string): Promise<Order | null> {
  return getOrderById(orderId) || null;
}

export async function findOrdersByCustomerId(customerId: string): Promise<Order[]> {
  return getOrdersByCustomerId(customerId);
}

export async function findLatestOrder(customerId: string): Promise<Order | null> {
  return getLatestOrderByCustomerId(customerId) || null;
}

export function getAllOrders(): Order[] {
  return MOCK_ORDERS;
}

export function calculateDaysSinceDelivery(deliveryDate: Date): number {
  const now = new Date();
  const diff = now.getTime() - deliveryDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
