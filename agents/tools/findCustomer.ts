import { findCustomer as findCustomerService } from '@/services/customer';
import type { Customer } from '@/types';

export interface FindCustomerInput {
  email?: string;
  customerId?: string;
}

export async function findCustomerTool(input: FindCustomerInput): Promise<{
  success: boolean;
  customer?: Customer;
  error?: string;
}> {
  try {
    if (!input.email && !input.customerId) {
      return {
        success: false,
        error: 'Please provide either email or customer ID',
      };
    }

    const customer = await findCustomerService(input);

    if (!customer) {
      return {
        success: false,
        error: `Customer not found with provided information`,
      };
    }

    return {
      success: true,
      customer,
    };
  } catch (error) {
    return {
      success: false,
      error: `Error finding customer: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
