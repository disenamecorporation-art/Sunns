/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductColor {
  name: string;
  value: string; // Tailwind color class or hex code
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  description: string;
  details: string[];
  image: string;
  images: string[];
  colors: ProductColor[];
  inStock: boolean;
  featured: boolean;
  rating: number;
  reviewsCount: number;
}

export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface OpticalPrescription {
  sphereOD?: string; // Ojo derecho
  sphereOS?: string; // Ojo izquierdo
  cylinderOD?: string;
  cylinderOS?: string;
  axisOD?: string;
  axisOS?: string;
  pupillaryDistance?: string; // Distancia pupilar en mm
  preferredLensTreatment?: 'polarizado' | 'blue_light' | 'fotocromatico' | 'antirreflejo_hd';
  notes?: string;
}

export interface SavedAddress {
  id: string;
  title: string; // 'Casa', 'Oficina', 'Boutique'
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export interface SavedPaymentMethod {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expMonth: string;
  expYear: string;
  holderName: string;
  isDefault: boolean;
  stripePaymentMethodId: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  colorName: string;
  colorValue: string;
  lensType?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  createdAt: string;
  status: 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusLabel: string;
  paymentMethod: {
    type: 'stripe_card' | 'apple_pay' | 'google_pay';
    brand: 'visa' | 'mastercard' | 'amex';
    last4: string;
    stripePaymentIntentId?: string;
    stripeReceiptUrl?: string;
  };
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state?: string;
    zip: string;
    country: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  tax: number;
  total: number;
  trackingNumber?: string;
  courier?: string;
  estimatedDelivery?: string;
  hasPrescription?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
  tier: 'Club Privé Member' | 'Prestige VIP' | 'Black Elite';
  memberSince: string;
  totalSpent: number;
  loyaltyPoints: number;
  stripeCustomerId?: string;
  twoFactorEnabled?: boolean;
  avatar?: string;
  addresses?: SavedAddress[];
  paymentMethods?: SavedPaymentMethod[];
  prescription?: OpticalPrescription;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: ProductColor;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
}

export type { HomeContent } from './data/homeContent';


