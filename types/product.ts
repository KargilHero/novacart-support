export type ProductCategory =
  | 'HEADPHONES'
  | 'KEYBOARD'
  | 'MOUSE'
  | 'MONITOR'
  | 'LAPTOP'
  | 'GAMING_GEAR'
  | 'OFFICE_EQUIPMENT'
  | 'PERIPHERALS'
  | 'WEBCAM'
  | 'MICROPHONE'
  | 'STAND'
  | 'CHAIR'
  | 'DESK'
  | 'LIGHTING'
  | 'SOFTWARE';

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  sku: string;
  description: string;
  isDigital: boolean;
  isRefundable: boolean;
  requiresEvidenceForDamage: boolean;
  warrantyDays: number;
  restockingFeesPercentage: number;
};
