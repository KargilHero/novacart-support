export type MembershipTier = 'STANDARD' | 'GOLD' | 'PLATINUM';

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  membershipTier: MembershipTier;
  fraudScore: number;
  totalOrdersCount: number;
  totalSpent: number;
  previousRefundsCount: number;
  accountCreatedAt: Date;
  lastOrderDate?: Date;
  supportTicketsCount: number;
};

export type CustomerIdentificationInput = {
  email?: string;
  orderId?: string;
};
