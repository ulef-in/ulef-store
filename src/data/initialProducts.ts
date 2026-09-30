import { Product, Order } from '../types';

/**
 * Empty by default - All products are strictly fetched in real time
 * from the live Supabase 'products' table. No mock or sample products.
 */
export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ULF-89231',
    items: [
      {
        id: 'cart-init-1',
        productId: 'order-item-1',
        product: {
          id: 'order-item-1',
          slug: 'ulef-atelier-sample',
          name: 'ULEF Atelier Heavyweight 240 GSM',
          subtitle: 'Architectural Heavyweight Essential',
          price: 2499,
          originalPrice: 3499,
          description: '240 GSM Combed Compact Cotton',
          fabricDetails: '240 GSM 100% Combed Compact Cotton',
          gsm: 240,
          fitType: 'Boxy Drop-Shoulder',
          category: 'Essentials',
          tags: ['Drop 04'],
          isFeatured: false,
          isNewArrival: false,
          isBestSeller: true,
          rating: 5.0,
          reviewsCount: 1,
          colors: [{ name: 'Onyx Black', hex: '#111111', image: 'https://i.ibb.co/ksz6KPN4/1790772061924.png' }],
          sizes: ['L'],
          stock: { XS: 0, S: 0, M: 0, L: 10, XL: 0, XXL: 0, XXXL: 0 },
          images: ['https://i.ibb.co/ksz6KPN4/1790772061924.png'],
          reviews: [],
          createdAt: '2026-09-28T14:30:00Z'
        },
        selectedSize: 'L',
        selectedColor: { name: 'Onyx Black', hex: '#111111', image: 'https://i.ibb.co/ksz6KPN4/1790772061924.png' },
        quantity: 1,
        price: 2499
      }
    ],
    shippingAddress: {
      firstName: 'Jordan',
      lastName: 'Miller',
      email: 'jordan.miller@example.com',
      phone: '+91 98765 43210',
      addressLine1: '482 Mercer Street, Apt 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    },
    billingSameAsShipping: true,
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'Cash on Delivery',
    subtotal: 2499,
    discount: 250,
    couponCode: 'ULEF10',
    shippingFee: 0,
    tax: 0,
    total: 2249,
    status: 'Processing',
    trackingNumber: 'TRK-902847291',
    carrier: 'Delhivery Express',
    estimatedDelivery: 'In 2-3 business days',
    createdAt: '2026-09-28T14:30:00Z',
    statusHistory: [
      { status: 'Order Confirmed', timestamp: 'Sep 28, 2:30 PM', description: 'Order ULF-89231 received and verified.' }
    ]
  }
];
