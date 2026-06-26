import { NextRequest, NextResponse } from 'next/server';
import { getAllCustomers } from '@/services/customer';

export async function GET(req: NextRequest) {
  try {
    const customers = getAllCustomers();

    // Transform to expose safe customer data
    const safeCustomers = customers.map((c) => ({
      id: c.id,
      name: `${c.firstName} ${c.lastName}`,
      email: c.email,
      membershipTier: c.membershipTier,
      totalSpent: c.totalSpent,
      ordersCount: c.totalOrdersCount,
      previousRefunds: c.previousRefundsCount,
      fraudScore: c.fraudScore,
    }));

    return NextResponse.json({ customers: safeCustomers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
