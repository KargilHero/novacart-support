import type { Order } from '@/types';
import { CUSTOMERS } from './customers';
import { PRODUCTS } from './products';
import { v4 as uuidv4 } from 'uuid';

const generateOrders = (): Order[] => {
  const orders: Order[] = [];

  CUSTOMERS.forEach((customer) => {
    const orderCount = Math.floor(Math.random() * 8) + 2;

    for (let i = 0; i < orderCount; i++) {
      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      const purchaseDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
      const deliveryDate = new Date(purchaseDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      orders.push({
        id: uuidv4(),
        customerId: customer.id,
        productId: product.id,
        productName: product.name,
        category: product.category,
        price: product.price,
        quantity: Math.floor(Math.random() * 3) + 1,
        totalAmount: product.price * (Math.floor(Math.random() * 3) + 1),
        purchaseDate,
        deliveryDate,
        status: Math.random() > 0.1 ? 'DELIVERED' : 'SHIPPED',
        paymentMethod: ['CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER'][Math.floor(Math.random() * 3)] as any,
        refundRequested: Math.random() > 0.8,
        refundRequestDate: Math.random() > 0.8 ? new Date() : undefined,
      });
    }
  });

  return orders;
};

export const MOCK_ORDERS = generateOrders();

export const getOrderById = (id: string): Order | undefined => {
  return MOCK_ORDERS.find((o) => o.id === id);
};

export const getOrdersByCustomerId = (customerId: string): Order[] => {
  return MOCK_ORDERS.filter((o) => o.customerId === customerId);
};

export const getLatestOrderByCustomerId = (customerId: string): Order | undefined => {
  const orders = getOrdersByCustomerId(customerId);
  return orders.sort((a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime())[0];
};
