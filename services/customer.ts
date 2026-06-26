import { CUSTOMERS, getCustomerByEmail, getCustomerById } from '@/data/customers';
import type { Customer } from '@/types';

export async function findCustomer(input: { email?: string; customerId?: string }): Promise<Customer | null> {
  if (input.email) {
    return getCustomerByEmail(input.email) || null;
  }
  if (input.customerId) {
    return getCustomerById(input.customerId) || null;
  }
  return null;
}

export function getAllCustomers(): Customer[] {
  return CUSTOMERS;
}
