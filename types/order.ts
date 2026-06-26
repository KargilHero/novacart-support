export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'RETURNED' | 'REFUNDED' | 'CANCELLED';

export type Order = {
  id: string;
  customerId: string;
  productId: string;
  productName: string;
  category: string;
  price: number;
  quantity: number;
  totalAmount: number;
  purchaseDate: Date;
  deliveryDate?: Date;
  status: OrderStatus;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER';
  refundRequested?: boolean;
  refundRequestDate?: Date;
  refundApprovalDate?: Date;
  refundReason?: string;
  refundAmount?: number;
};

export type OrderWithProduct = Order & {
  product: {
    name: string;
    category: string;
    price: number;
    isDigital: boolean;
    isRefundable: boolean;
    warrantyDays: number;
  };
};
