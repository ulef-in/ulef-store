export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface Review {
  id: string;
  userName: string;
  userLocation?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  sizePurchased: Size;
  fitFeedback: 'Runs Small' | 'True to Oversized' | 'Very Oversized';
  images?: string[];
  merchantReply?: string;
  merchantReplyDate?: string;
  isFeatured?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  description: string;
  fabricDetails: string;
  gsm: number; // 240 GSM signature heavyweight knit
  fitType: 'Boxy Drop-Shoulder' | 'Heavyweight Relaxed' | 'Sculpted Minimalist' | 'Vintage Wash Oversized' | 'Acid Washed Boxy';
  colors: ProductColor[];
  sizes: Size[];
  stock: Record<Size, number>;
  images: string[];
  category: 'Essentials' | 'Graphic Street' | 'Acid & Vintage Wash' | 'Minimalist Heavyweight' | 'Limited Drop';
  tags: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  createdAt: string;
}

export interface CartItem {
  id: string; // unique cart item id (product.id + size + color)
  productId: string;
  product: Product;
  selectedSize: Size;
  selectedColor: ProductColor;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 'Processing' | 'Cutting & QC' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string; // e.g. ULF-98241
  items: CartItem[];
  shippingAddress: ShippingAddress;
  billingSameAsShipping: boolean;
  billingAddress?: ShippingAddress;
  paymentMethod: 'credit_card' | 'apple_pay' | 'upi' | 'cash_on_delivery' | 'whatsapp';
  paymentStatus: 'Paid' | 'Pending Verification' | 'Cash on Delivery' | 'Pending WhatsApp Confirmation';
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  createdAt: string;
  statusHistory: {
    status: string;
    timestamp: string;
    description: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  savedAddresses?: ShippingAddress[];
  wishlistIds: string[];
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

export interface CurrencyRate {
  symbol: string;
  rate: number; // relative to USD
}

export interface CustomerContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  source: 'Order History' | 'VIP Drop Club' | 'Bespoke Booking';
  orderCount?: number;
  totalSpent?: number;
  lastOrderDate?: string;
}

export interface CodSettings {
  enabled: boolean;
  extraFee: number;
  advanceRequired: boolean;
  advanceAmount: number;
  customNote: string;
}


