import type { Customer, MembershipTier } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const createCustomer = (
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  tier: MembershipTier,
  fraudScore: number,
  previousRefunds: number
): Customer => ({
  id: uuidv4(),
  firstName,
  lastName,
  email,
  phone,
  shippingAddress: {
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'United States',
  },
  membershipTier: tier,
  fraudScore,
  totalOrdersCount: Math.floor(Math.random() * 20) + 1,
  totalSpent: Math.floor(Math.random() * 500000) + 5000,
  previousRefundsCount: previousRefunds,
  accountCreatedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
  lastOrderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  supportTicketsCount: Math.floor(Math.random() * 10),
});

export const CUSTOMERS: Customer[] = [
  createCustomer('Raj', 'Patel', 'raj.patel@email.com', '555-0101', 'PLATINUM', 15, 1),
  createCustomer('Sarah', 'Chen', 'sarah.chen@email.com', '555-0102', 'GOLD', 20, 2),
  createCustomer('Marcus', 'Johnson', 'marcus.j@email.com', '555-0103', 'STANDARD', 25, 0),
  createCustomer('Emily', 'Rodriguez', 'emily.rod@email.com', '555-0104', 'GOLD', 35, 1),
  createCustomer('David', 'Kim', 'david.kim@email.com', '555-0105', 'STANDARD', 10, 0),
  createCustomer('Priya', 'Sharma', 'priya.sharma@email.com', '555-0106', 'PLATINUM', 5, 0),
  createCustomer('James', 'Wilson', 'james.w@email.com', '555-0107', 'STANDARD', 42, 2),
  createCustomer('Lisa', 'Anderson', 'lisa.and@email.com', '555-0108', 'GOLD', 18, 1),
  createCustomer('Ahmed', 'Hassan', 'ahmed.hassan@email.com', '555-0109', 'STANDARD', 55, 3),
  createCustomer('Sophie', 'Laurent', 'sophie.l@email.com', '555-0110', 'PLATINUM', 8, 0),
  createCustomer('Carlos', 'Martinez', 'carlos.m@email.com', '555-0111', 'STANDARD', 65, 2),
  createCustomer('Nina', 'Bergström', 'nina.b@email.com', '555-0112', 'GOLD', 22, 1),
  createCustomer('Vikram', 'Singh', 'vikram.singh@email.com', '555-0113', 'STANDARD', 12, 0),
  createCustomer('Michelle', 'Taylor', 'michelle.t@email.com', '555-0114', 'PLATINUM', 9, 0),
  createCustomer('Zhang', 'Liu', 'zhang.liu@email.com', '555-0115', 'STANDARD', 78, 1),
];

export const getCustomerByEmail = (email: string): Customer | undefined => {
  return CUSTOMERS.find((c) => c.email.toLowerCase() === email.toLowerCase());
};

export const getCustomerById = (id: string): Customer | undefined => {
  return CUSTOMERS.find((c) => c.id === id);
};
