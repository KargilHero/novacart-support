'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface Customer {
  id: string;
  name: string;
  email: string;
  membershipTier: string;
  totalSpent: number;
  ordersCount: number;
  previousRefunds: number;
  fraudScore: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetch('/api/admin/customers')
      .then((r) => r.json())
      .then((data) => {
        setCustomers(data.customers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Customers Database</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Tier</th>
              <th className="px-4 py-3 text-right">Total Spent</th>
              <th className="px-4 py-3 text-center">Orders</th>
              <th className="px-4 py-3 text-center">Refunds</th>
              <th className="px-4 py-3 text-center">Fraud Score</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="px-4 py-3">{customer.name}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{customer.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    customer.membershipTier === 'PLATINUM'
                      ? 'bg-purple-900 text-purple-200'
                      : customer.membershipTier === 'GOLD'
                      ? 'bg-yellow-900 text-yellow-200'
                      : 'bg-gray-700 text-gray-200'
                  }`}>
                    {customer.membershipTier}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {formatCurrency(customer.totalSpent)}
                </td>
                <td className="px-4 py-3 text-center">{customer.ordersCount}</td>
                <td className="px-4 py-3 text-center">{customer.previousRefunds}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    customer.fraudScore <= 30
                      ? 'bg-green-900 text-green-200'
                      : customer.fraudScore <= 75
                      ? 'bg-yellow-900 text-yellow-200'
                      : 'bg-red-900 text-red-200'
                  }`}>
                    {customer.fraudScore}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
