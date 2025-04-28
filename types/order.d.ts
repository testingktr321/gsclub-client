export interface ProductImage {
  id: string;
  url: string;
  position: number;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductSnapshot {
  id: string;
  name: string;
  currentPrice: number;
  originalPrice: number;
  brandName: string;
  flavorName: string;
  nicotineName: string;
  puffs: {
    name: string;
    description: string;
  }[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  quantity: number;
  productId: string;
  productSnapshot: ProductSnapshot;
  purchasePrice: number;
  product?: Product;
}

export interface Shipment {
  id: string;
  orderId: string;
  shippoShipmentId: string | null;
  shippoTransactionId: string | null;
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  labelUrl: string | null;
  status: "pending" | "label_purchased" | "shipped" | "delivered";
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userEmail: string;
  isPaid: boolean;
  isDelivered: boolean;
  phone: string;
  shippingName: string;
  shippingStreetAddress: string;
  shippingState: string;
  shippingCity: string;
  shippingZipCode: string;
  totalAmount: number;
  shippingAmount?: string | null;
  shippingRateId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  Shipment?: Shipment | null;
  orderItems: OrderItem[];
}
