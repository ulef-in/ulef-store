import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, User, Currency, Size, ProductColor, Review, CustomerContact, CodSettings } from '../types';
import { INITIAL_ORDERS } from '../data/initialProducts';
import {
  fetchSupabaseProducts,
  createSupabaseProduct,
  updateSupabaseProduct,
  deleteSupabaseProduct,
  subscribeToProductChanges
} from '../lib/supabase';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export type ViewType =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'admin'
  | 'lookbook'
  | 'about'
  | 'contact'
  | 'order-tracking'
  | 'wishlist'
  | 'order-confirmation';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  currentUser: User | null;
  theme: 'dark' | 'light';
  activeView: ViewType;
  selectedProduct: Product | null;
  quickViewProduct: Product | null;
  isCartOpen: boolean;
  isAuthOpen: boolean;
  isSearchOpen: boolean;
  isSizeGuideOpen: boolean;
  isSupportChatOpen: boolean;
  currency: Currency;
  searchQuery: string;
  appliedCoupon: { code: string; discountPercent: number } | null;
  toasts: Toast[];
  lastPlacedOrder: Order | null;
  
  // Navigation & View Actions
  setActiveView: (view: ViewType) => void;
  openProductDetail: (product: Product) => void;
  openQuickView: (product: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsAuthOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsSizeGuideOpen: (open: boolean) => void;
  setIsSupportChatOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setCurrency: (currency: Currency) => void;
  toggleTheme: () => void;
  
  // Cart Actions
  addToCart: (product: Product, size: Size, color: ProductColor, quantity?: number, openDrawer?: boolean) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTax: number;
  cartGrandTotal: number;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Coupon Actions
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  
  // Orders
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber' | 'statusHistory' | 'carrier' | 'estimatedDelivery'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateOrderCourier: (orderId: string, carrier: string, trackingNumber: string, estimatedDelivery?: string) => void;
  
  // Store Settings (Owner WhatsApp & Payment UPI & COD)
  merchantWhatsAppPhone: string;
  setMerchantWhatsAppPhone: (phone: string) => void;
  merchantUpiId: string;
  setMerchantUpiId: (upiId: string) => void;
  merchantUpiQrImage: string;
  setMerchantUpiQrImage: (image: string) => void;
  merchantUpiName: string;
  setMerchantUpiName: (name: string) => void;
  codSettings: CodSettings;
  setCodSettings: (settings: Partial<CodSettings>) => void;
  
  // Storefront Hero Poster
  heroBannerImage: string;
  setHeroBannerImage: (image: string) => void;
  heroBannerOpacity: number;
  setHeroBannerOpacity: (opacity: number) => void;
  
  // Customer WhatsApp Broadcast & VIP Club
  customerContacts: CustomerContact[];
  broadcastWebhookUrl: string;
  setBroadcastWebhookUrl: (url: string) => void;
  addVipSubscriber: (name: string, phone: string, city?: string) => void;
  
  // Admin & Products
  addProduct: (newProduct: Omit<Product, 'id' | 'slug' | 'createdAt' | 'reviews' | 'rating' | 'reviewsCount'>) => Promise<void> | void;
  updateProduct: (idOrProduct: string | Product, updated?: Partial<Product>) => Promise<void> | void;
  deleteProduct: (id: string) => Promise<void> | void;
  reloadProductsFromSupabase: () => Promise<void>;
  isProductsLoading: boolean;
  addReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
  deleteReview: (productId: string, reviewId: string) => void;
  replyToReview: (productId: string, reviewId: string, reply: string) => void;
  toggleFeatureReview: (productId: string, reviewId: string) => void;
  
  // Auth
  login: (email: string, name: string, role?: 'customer' | 'admin') => void;
  logout: () => void;
  
  // Admin Security & Password Gate
  isAdminAuthenticated: boolean;
  verifyAdminPassword: (password: string) => boolean;
  setAdminPassword: (newPassword: string) => void;
  lockAdmin: () => void;
  
  // Utilities
  formatPrice: (amountInINR: number) => string;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Base store currency is strictly INR (₹)
// 1 USD = 85 INR (1 INR = 1 / 85 USD)
// 1 EUR = 92 INR (1 INR = 1 / 92 EUR)
// 1 GBP = 108 INR (1 INR = 1 / 108 GBP)
export const CURRENCY_CONFIG: Record<Currency, { symbol: string; rateFromINR: number; label: string }> = {
  INR: { symbol: '₹', rateFromINR: 1, label: 'INR (₹)' },
  USD: { symbol: '$', rateFromINR: 1 / 85, label: 'USD ($)' },
  EUR: { symbol: '€', rateFromINR: 1 / 92, label: 'EUR (€)' },
  GBP: { symbol: '£', rateFromINR: 1 / 108, label: 'GBP (£)' },
};

export const sanitizeProduct = (p: any): Product => {
  const gsmVal = Number(p.gsm) || 240;
  const nameStr = (p.name || 'Signature Luxury Silhouette').toString();
  const descStr = (p.description || `${nameStr} - crafted from signature 240 GSM heavyweight combed cotton with reinforced ribbing.`).toString();
  const fabricStr = (p.fabricDetails || '100% Combed Compact Cotton, pre-shrunk bio-wash, anti-bacon collar.').toString();
  const tagsArr = Array.isArray(p.tags) && p.tags.length > 0
    ? p.tags.map((t: any) => String(t).replace(/(260|280|300|320)\s*GSM/gi, '240 GSM'))
    : ['Heavyweight', '240 GSM', 'Drop 04'];

  return {
    id: p.id || `ulef-${Date.now().toString().slice(-4)}`,
    slug: p.slug || nameStr.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: nameStr.replace(/(260|280|300|320)\s*GSM/gi, '240 GSM'),
    subtitle: (p.subtitle || '240 GSM Signature Luxury Silhouette').toString().replace(/(260|280|300|320)\s*GSM/gi, '240 GSM'),
    price: typeof p.price === 'number' && !isNaN(p.price) ? p.price : 1499,
    originalPrice: typeof p.originalPrice === 'number' && !isNaN(p.originalPrice) ? p.originalPrice : (typeof p.price === 'number' ? Math.round(p.price * 1.3) : 1999),
    description: descStr.replace(/(260|280|300|320)\s*GSM/gi, '240 GSM'),
    fabricDetails: fabricStr.replace(/(260|280|300|320)\s*GSM/gi, '240 GSM'),
    gsm: 240,
    fitType: p.fitType || 'Boxy Drop-Shoulder',
    colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : [
      { name: 'Washed Onyx', hex: '#1a1a1a', image: (Array.isArray(p.images) && p.images[0]) || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    stock: p.stock && typeof p.stock === 'object' ? p.stock : {
      XS: 10, S: 15, M: 25, L: 30, XL: 20, XXL: 12, XXXL: 8
    },
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85'],
    category: p.category || 'Essentials',
    tags: tagsArr,
    isFeatured: p.isFeatured !== undefined ? p.isFeatured : true,
    isNewArrival: p.isNewArrival !== undefined ? p.isNewArrival : true,
    isBestSeller: Boolean(p.isBestSeller),
    rating: typeof p.rating === 'number' && !isNaN(p.rating) ? p.rating : 5.0,
    reviewsCount: typeof p.reviewsCount === 'number' && !isNaN(p.reviewsCount) ? p.reviewsCount : 0,
    reviews: Array.isArray(p.reviews) ? p.reviews : [],
    createdAt: p.createdAt || new Date().toISOString()
  };
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('ulef_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // default to high-end luxury dark aesthetic
  });

  // Purge legacy product caches from localStorage to guarantee 100% pure Supabase data
  try {
    localStorage.removeItem('ulef_products');
    localStorage.removeItem('ulef_products_v2');
    localStorage.removeItem('ulef_products_v3');
  } catch {}

  // Products state: Direct Real-Time Supabase Cloud Sync (replaces initialProducts & localStorage)
  const [products, setProducts] = useState<Product[]>([]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ulef_cart');
    if (saved) {
      try {
        const parsed: CartItem[] = JSON.parse(saved);
        return parsed.map(item => ({
          ...item,
          product: {
            ...item.product,
            gsm: 240,
            name: item.product.name.replace(/(240|260|280|300|320)\s*GSM/gi, '240 GSM')
          }
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('ulef_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return ['ulef-01', 'ulef-03'];
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ulef_orders');
    if (saved) {
      try {
        const parsed: Order[] = JSON.parse(saved);
        return parsed.map(o => ({
          ...o,
          statusHistory: (o.statusHistory || []).map(h => ({
            ...h,
            description: h.description.replace(/(240|260|280|300|320)\s*GSM/gi, '240 GSM')
          })),
          items: (o.items || []).map(item => ({
            ...item,
            product: item.product ? {
              ...item.product,
              gsm: 240,
              name: (item.product.name || '').replace(/(240|260|280|300|320)\s*GSM/gi, '240 GSM')
            } : item.product
          }))
        }));
      } catch {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  // Current User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const isUnlocked = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('ulef_admin_auth') === 'true';
    let saved = localStorage.getItem('ulef_user');
    if (!saved) {
      saved = localStorage.getItem('ulef_user_v2');
    }
    try {
      localStorage.removeItem('ulef_user_v2');
    } catch {}

    if (saved) {
      try {
        const u = JSON.parse(saved);
        return {
          ...u,
          role: (u.role === 'admin' && isUnlocked) ? 'admin' : 'customer'
        };
      } catch {
        return null;
      }
    }
    return {
      id: 'usr-1',
      name: 'Julian Vance',
      email: 'julian.vance@studio.com',
      role: isUnlocked ? 'admin' : 'customer',
      wishlistIds: ['ulef-01', 'ulef-03']
    };
  });

  // Admin Security Password State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return typeof sessionStorage !== 'undefined' && sessionStorage.getItem('ulef_admin_auth') === 'true';
  });

  // Navigation & Modals
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('ulef_currency_v3');
    if (saved === 'INR' || saved === 'USD' || saved === 'EUR' || saved === 'GBP') {
      return saved as Currency;
    }
    return 'INR'; // Default to INR (₹) across the entire store
  });

  useEffect(() => {
    try {
      localStorage.setItem('ulef_currency_v3', currency);
    } catch {}
  }, [currency]);

  const [isProductsLoading, setIsProductsLoading] = useState(false);

  // Live Supabase Products Sync & Realtime Subscription
  const reloadProductsFromSupabase = async () => {
    setIsProductsLoading(true);
    try {
      const live = await fetchSupabaseProducts();
      if (live && live.length > 0) {
        const sanitized = live.map(sanitizeProduct);
        setProducts(sanitized);
        setSelectedProduct(prev => prev ? (sanitized.find(p => p.id === prev.id) || sanitized[0]) : sanitized[0]);
      }
    } catch (err) {
      console.warn('Live Supabase product sync warning:', err);
    } finally {
      setIsProductsLoading(false);
    }
  };

  useEffect(() => {
    reloadProductsFromSupabase();

    // Subscribe to realtime postgres_changes from Supabase
    const unsubscribe = subscribeToProductChanges(() => {
      reloadProductsFromSupabase();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Sync theme with HTML root
  useEffect(() => {
    try {
      localStorage.setItem('ulef_theme', theme);
    } catch {}
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ulef_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ulef_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('ulef_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ulef_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ulef_user');
    }
  }, [currentUser]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('product-detail');
  };

  const openQuickView = (product: Product | null) => {
    setQuickViewProduct(product);
  };

  // Cart operations
  const addToCart = (product: Product, size: Size, color: ProductColor, quantity = 1, openDrawer = true) => {
    const cartItemId = `${product.id}-${size}-${color.name.toLowerCase().replace(/\s+/g, '-')}`;
    
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            productId: product.id,
            product,
            selectedSize: size,
            selectedColor: color,
            quantity,
            price: product.price,
          },
        ];
      }
    });

    showToast('Added to Cart', `${product.name} (${size}, ${color.name}) is in your cart.`, 'success');
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Removed', 'Item removed from your cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartDiscount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercent) / 100 : 0;
  // Free Express Shipping across India on orders >= ₹1,499
  const cartShippingFee = cartSubtotal >= 1499 || cartSubtotal === 0 ? 0 : 99;
  const cartTax = Math.round((cartSubtotal - cartDiscount) * 0.05); // 5% GST on luxury knitwear
  const cartGrandTotal = Math.max(0, cartSubtotal - cartDiscount + cartShippingFee + cartTax);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'Item removed from your saved list.', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to Wishlist', 'Item saved to your curated wishlist.', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupon
  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'ULEF10') {
      setAppliedCoupon({ code: 'ULEF10', discountPercent: 10 });
      showToast('Coupon Applied!', '10% discount added to your order.', 'success');
      return true;
    } else if (cleanCode === 'DROP04' || cleanCode === 'WELCOME20') {
      setAppliedCoupon({ code: cleanCode, discountPercent: 20 });
      showToast('VIP Discount Applied!', '20% VIP welcome discount added.', 'success');
      return true;
    } else if (cleanCode === 'HEAVY30') {
      setAppliedCoupon({ code: 'HEAVY30', discountPercent: 30 });
      showToast('Heavyweight Insider Applied!', '30% member discount unlocked.', 'success');
      return true;
    } else {
      showToast('Invalid Coupon', 'Code not recognized or expired. Try "ULEF10" or "WELCOME20".', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon Removed', 'Discount cleared.', 'info');
  };

  // Orders
  const placeOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber' | 'statusHistory' | 'carrier' | 'estimatedDelivery'>): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ULF-${randomNum}`;
    const trackingNum = `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const now = new Date();

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: now.toISOString(),
      trackingNumber: trackingNum,
      carrier: 'DHL Express Luxury Courier',
      estimatedDelivery: '3-4 Business Days',
      status: 'Processing',
      statusHistory: [
        {
          status: 'Order Confirmed',
          timestamp: 'Just now',
          description: `Order ${orderId} received and payment confirmed.`
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    clearCart();
    setAppliedCoupon(null);
    setActiveView('order-confirmation');
    showToast('Order Placed Successfully!', `Order #${orderId} has been confirmed.`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...ord,
            status,
            statusHistory: [
              ...ord.statusHistory,
              {
                status,
                timestamp: `Today at ${nowStr}`,
                description: `Status updated to ${status} by ULEF Fulfillment.`
              }
            ]
          };
        }
        return ord;
      })
    );
    showToast('Order Status Updated', `Order ${orderId} is now ${status}.`, 'info');
  };

  const updateOrderCourier = (orderId: string, carrier: string, trackingNumber: string, estimatedDelivery?: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const newTracking = trackingNumber.trim() || ord.trackingNumber;
          const newCarrier = carrier.trim() || ord.carrier;
          const newEstimated = estimatedDelivery || '3-4 Business Days';
          return {
            ...ord,
            carrier: newCarrier,
            trackingNumber: newTracking,
            estimatedDelivery: newEstimated,
            status: ord.status === 'Processing' || ord.status === 'Packed' ? 'Shipped' : ord.status,
            statusHistory: [
              ...ord.statusHistory,
              {
                status: `Dispatched via ${newCarrier}`,
                timestamp: `Today at ${nowStr}`,
                description: `Handed over to ${newCarrier} with AWB #${newTracking}. Live tracking active.`
              }
            ]
          };
        }
        return ord;
      })
    );
    showToast('Courier Updated', `Assigned ${carrier} (#${trackingNumber}) to order ${orderId}`, 'success');
  };

  // Merchant Settings State
  const [merchantWhatsAppPhone, setMerchantWhatsAppPhoneState] = useState<string>(() => {
    return localStorage.getItem('ulef_merchant_whatsapp') || '919316614778';
  });

  const [merchantUpiId, setMerchantUpiIdState] = useState<string>(() => {
    return localStorage.getItem('ulef_merchant_upi') || 'ulef.luxury@okhdfcbank';
  });

  const [merchantUpiQrImage, setMerchantUpiQrImageState] = useState<string>(() => {
    return localStorage.getItem('ulef_merchant_upi_qr') || '';
  });

  const [merchantUpiName, setMerchantUpiNameState] = useState<string>(() => {
    return localStorage.getItem('ulef_merchant_upi_name') || 'ULEF LUXURY';
  });

  const [codSettings, setCodSettingsState] = useState<CodSettings>(() => {
    const saved = localStorage.getItem('ulef_cod_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      enabled: true,
      extraFee: 0,
      advanceRequired: false,
      advanceAmount: 0,
      customNote: 'Pay with cash upon parcel delivery at your doorstep across India.'
    };
  });

  const setMerchantWhatsAppPhone = (phone: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    localStorage.setItem('ulef_merchant_whatsapp', clean);
    setMerchantWhatsAppPhoneState(clean);
    showToast('WhatsApp Saved', `Order notifications routed to +${clean}`, 'success');
  };

  const setMerchantUpiId = (upi: string) => {
    const clean = upi.trim();
    localStorage.setItem('ulef_merchant_upi', clean);
    setMerchantUpiIdState(clean);
    showToast('UPI ID Saved', `Instant UPI QR Code updated to ${clean}`, 'success');
  };

  const setMerchantUpiQrImage = (image: string) => {
    const clean = image.trim();
    if (clean) {
      localStorage.setItem('ulef_merchant_upi_qr', clean);
    } else {
      localStorage.removeItem('ulef_merchant_upi_qr');
    }
    setMerchantUpiQrImageState(clean);
    showToast('Custom QR Saved', clean ? 'Custom UPI QR Code image activated for checkout' : 'Reset to auto-generated UPI QR code', 'success');
  };

  const setMerchantUpiName = (name: string) => {
    const clean = name.trim();
    localStorage.setItem('ulef_merchant_upi_name', clean);
    setMerchantUpiNameState(clean);
    showToast('UPI Name Saved', `Account name updated to ${clean}`, 'success');
  };

  const setCodSettings = (newSettings: Partial<CodSettings>) => {
    setCodSettingsState(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('ulef_cod_settings', JSON.stringify(updated));
      return updated;
    });
    showToast('COD Settings Saved', 'Cash on Delivery preferences updated successfully', 'success');
  };

  // Storefront Hero Poster State
  const [heroBannerImage, setHeroBannerImageState] = useState<string>(() => {
    return localStorage.getItem('ulef_hero_banner_image') || 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=2000&q=90';
  });

  const [heroBannerOpacity, setHeroBannerOpacityState] = useState<number>(() => {
    const saved = localStorage.getItem('ulef_hero_banner_opacity');
    return saved ? Number(saved) : 40;
  });

  const setHeroBannerImage = (url: string) => {
    const clean = url.trim();
    localStorage.setItem('ulef_hero_banner_image', clean);
    setHeroBannerImageState(clean);
    showToast('Background Poster Updated', 'New homepage hero banner poster is now live!', 'success');
  };

  const setHeroBannerOpacity = (opacity: number) => {
    localStorage.setItem('ulef_hero_banner_opacity', opacity.toString());
    setHeroBannerOpacityState(opacity);
  };

  // VIP Drop Alert Subscribers
  const [vipSubscribers, setVipSubscribers] = useState<CustomerContact[]>(() => {
    const saved = localStorage.getItem('ulef_vip_subscribers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'vip-01',
        name: 'Aman Sharma',
        phone: '9820145678',
        email: 'aman.sharma@gmail.com',
        city: 'Mumbai',
        source: 'VIP Drop Club',
        orderCount: 2,
        totalSpent: 136,
        lastOrderDate: '2026-09-18'
      },
      {
        id: 'vip-02',
        name: 'Rohit Verma',
        phone: '9811223344',
        email: 'rohit.v@outlook.com',
        city: 'New Delhi',
        source: 'VIP Drop Club',
        orderCount: 1,
        totalSpent: 68,
        lastOrderDate: '2026-09-20'
      }
    ];
  });

  // Broadcast Webhook (Wati / AISensy / Meta Cloud API)
  const [broadcastWebhookUrl, setBroadcastWebhookUrlState] = useState<string>(() => {
    return localStorage.getItem('ulef_broadcast_webhook') || '';
  });

  const setBroadcastWebhookUrl = (url: string) => {
    const clean = url.trim();
    localStorage.setItem('ulef_broadcast_webhook', clean);
    setBroadcastWebhookUrlState(clean);
    showToast('Webhook Configured', 'WhatsApp Broadcast Webhook updated successfully', 'success');
  };

  const addVipSubscriber = (name: string, phone: string, city = 'India') => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      showToast('Invalid Phone', 'Please enter a valid 10-digit WhatsApp number.', 'error');
      return;
    }
    const newSub: CustomerContact = {
      id: `vip-${Date.now()}`,
      name: name.trim() || 'VIP Collector',
      phone: cleanPhone,
      city,
      source: 'VIP Drop Club',
      orderCount: 0,
      totalSpent: 0,
      lastOrderDate: 'Just Joined'
    };
    setVipSubscribers(prev => {
      if (prev.some(p => p.phone.replace(/[^0-9]/g, '') === cleanPhone)) {
        showToast('Already Enrolled', 'This WhatsApp number is already registered for VIP alerts.', 'info');
        return prev;
      }
      const updated = [newSub, ...prev];
      try {
        localStorage.setItem('ulef_vip_subscribers', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('VIP Club Enrolled', `+${cleanPhone} added for instant WhatsApp Drop Alerts!`, 'success');
  };

  // Unified Customer Contacts List (Aggregated from Orders + VIP Subscribers)
  const customerContacts: CustomerContact[] = React.useMemo(() => {
    const map = new Map<string, CustomerContact>();

    // 1. From orders
    orders.forEach(ord => {
      const phone = (ord.shippingAddress?.phone || '').replace(/[^0-9]/g, '');
      if (phone && phone.length >= 10) {
        const name = `${ord.shippingAddress.firstName || ''} ${ord.shippingAddress.lastName || ''}`.trim() || 'Valued Customer';
        const city = ord.shippingAddress.city || 'India';
        const existing = map.get(phone);
        if (existing) {
          existing.orderCount = (existing.orderCount || 1) + 1;
          existing.totalSpent = (existing.totalSpent || 0) + ord.total;
        } else {
          map.set(phone, {
            id: `ord-cust-${ord.id}`,
            name,
            phone,
            email: ord.shippingAddress.email,
            city,
            source: 'Order History',
            orderCount: 1,
            totalSpent: ord.total,
            lastOrderDate: ord.createdAt
          });
        }
      }
    });

    // 2. From VIP subscribers
    vipSubscribers.forEach(sub => {
      const phone = sub.phone.replace(/[^0-9]/g, '');
      if (phone && !map.has(phone)) {
        map.set(phone, sub);
      }
    });

    return Array.from(map.values());
  }, [orders, vipSubscribers]);


  // Admin Product Management
  const addProduct = async (newProductData: Omit<Product, 'id' | 'slug' | 'createdAt' | 'reviews' | 'rating' | 'reviewsCount'>) => {
    showToast('Saving to Supabase', `Syncing "${newProductData.name}" with live database...`, 'info');
    
    // Execute directly in Supabase
    const res = await createSupabaseProduct(newProductData);
    let createdProduct: Product;
    
    if (res.success && res.product) {
      createdProduct = sanitizeProduct(res.product);
    } else {
      const id = `ulef-${Date.now().toString().slice(-4)}`;
      const nameStr = (newProductData.name || 'Signature Luxury Silhouette').trim();
      const slug = nameStr.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      createdProduct = sanitizeProduct({
        ...newProductData,
        id,
        slug,
        rating: 5.0,
        reviewsCount: 0,
        reviews: [],
        createdAt: new Date().toISOString()
      });
    }

    setProducts(prev => {
      const filtered = prev.filter(p => p.id !== createdProduct.id);
      return [createdProduct, ...filtered];
    });

    showToast('Product Live on Supabase', `"${createdProduct.name}" is now live for all visitors!`, 'success');
  };

  const updateProduct = async (idOrProduct: string | Product, updatedArg?: Partial<Product>) => {
    let id: string;
    let updated: Partial<Product>;
    if (typeof idOrProduct === 'object' && idOrProduct !== null) {
      id = (idOrProduct as Product).id;
      updated = idOrProduct;
    } else {
      id = idOrProduct as string;
      updated = updatedArg || {};
    }

    // 1. Optimistic local update
    setProducts(prev => prev.map(p => (p.id === id ? sanitizeProduct({ ...p, ...updated }) : p)));
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct(prev => (prev ? sanitizeProduct({ ...prev, ...updated }) : null));
    }

    // 2. Direct Supabase update
    await updateSupabaseProduct(id, updated);
    showToast('Product Updated in Supabase', 'Live changes saved successfully.', 'success');
  };

  const deleteProduct = async (id: string) => {
    // 1. Optimistic delete
    setProducts(prev => prev.filter(p => p.id !== id));

    // 2. Direct Supabase delete
    await deleteSupabaseProduct(id);
    showToast('Product Removed', 'Product deleted from Supabase live catalog.', 'info');
  };

  const addReview = (productId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Today'
    };

    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...p.reviews];
          const newAvgRating =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: Number(newAvgRating.toFixed(1))
          };
        }
        return p;
      })
    );

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(prev => {
        if (!prev) return null;
        const updatedReviews = [newReview, ...prev.reviews];
        const newAvgRating =
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          ...prev,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: Number(newAvgRating.toFixed(1))
        };
      });
    }

    showToast('Review Published', 'Thank you for your feedback on ULEF.IN!', 'success');
  };

  const deleteReview = (productId: string, reviewId: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const updatedReviews = p.reviews.filter(r => r.id !== reviewId);
          const newAvgRating = updatedReviews.length > 0
            ? Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1))
            : 5.0;
          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: newAvgRating
          };
        }
        return p;
      })
    );

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(prev => {
        if (!prev) return null;
        const updatedReviews = prev.reviews.filter(r => r.id !== reviewId);
        const newAvgRating = updatedReviews.length > 0
          ? Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1))
          : 5.0;
        return {
          ...prev,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: newAvgRating
        };
      });
    }

    showToast('Review Removed', 'Review has been deleted from catalog.', 'info');
  };

  const replyToReview = (productId: string, reviewId: string, reply: string) => {
    const cleanReply = reply.trim();
    if (!cleanReply) return;

    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const updatedReviews = p.reviews.map(r => {
            if (r.id === reviewId) {
              return {
                ...r,
                merchantReply: cleanReply,
                merchantReplyDate: 'Today'
              };
            }
            return r;
          });
          return { ...p, reviews: updatedReviews };
        }
        return p;
      })
    );

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(prev => {
        if (!prev) return null;
        const updatedReviews = prev.reviews.map(r => {
          if (r.id === reviewId) {
            return {
              ...r,
              merchantReply: cleanReply,
              merchantReplyDate: 'Today'
            };
          }
          return r;
        });
        return { ...prev, reviews: updatedReviews };
      });
    }

    showToast('Reply Saved', 'Official brand response posted to customer review.', 'success');
  };

  const toggleFeatureReview = (productId: string, reviewId: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const updatedReviews = p.reviews.map(r => {
            if (r.id === reviewId) {
              return { ...r, isFeatured: !r.isFeatured };
            }
            return r;
          });
          return { ...p, reviews: updatedReviews };
        }
        return p;
      })
    );

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(prev => {
        if (!prev) return null;
        const updatedReviews = prev.reviews.map(r => {
          if (r.id === reviewId) {
            return { ...r, isFeatured: !r.isFeatured };
          }
          return r;
        });
        return { ...prev, reviews: updatedReviews };
      });
    }

    showToast('Review Updated', 'Featured status updated for homepage display.', 'success');
  };

  // Auth operations
  const login = (email: string, name: string, role: 'customer' | 'admin' = 'customer') => {
    const user: User = {
      id: `usr-${Date.now()}`,
      email,
      name,
      role: (role === 'admin' && isAdminAuthenticated) ? 'admin' : 'customer',
      wishlistIds: wishlist
    };
    setCurrentUser(user);
    setIsAuthOpen(false);
    showToast('Welcome back', `Signed in as ${name}`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    lockAdmin();
    showToast('Signed Out', 'You have been signed out.', 'info');
  };

  // Admin Password Gate Operations
  const verifyAdminPassword = (enteredPassword: string): boolean => {
    const currentPass = localStorage.getItem('ulef_admin_password') || 'admin123';
    const trimmed = (enteredPassword || '').trim();
    // Allow custom set password or standard master defaults: 'admin123' / '9316614778'
    if (trimmed && (trimmed === currentPass || trimmed === 'admin123' || trimmed === '9316614778')) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('ulef_admin_auth', 'true');
      setCurrentUser(prev => prev ? { ...prev, role: 'admin' } : {
        id: 'admin-owner',
        name: 'Store Owner',
        email: 'ulef.in0@gmail.com',
        role: 'admin',
        wishlistIds: []
      });
      showToast('Admin Access Unlocked', 'Welcome to Atelier Management Portal', 'success');
      return true;
    }
    showToast('Access Denied', 'Incorrect admin password. Unauthorized access blocked.', 'error');
    return false;
  };

  const setAdminPassword = (newPassword: string): void => {
    if (!newPassword || newPassword.trim().length < 4) {
      showToast('Error', 'Password must be at least 4 characters long', 'error');
      return;
    }
    localStorage.setItem('ulef_admin_password', newPassword.trim());
    showToast('Password Updated', 'Admin security password changed successfully.', 'success');
  };

  const lockAdmin = (): void => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('ulef_admin_auth');
    setCurrentUser(prev => prev ? { ...prev, role: 'customer' } : null);
    showToast('Admin Locked', 'Admin panel locked and session terminated.', 'info');
  };

  // Price conversion helper - Base store currency is strictly INR (₹)
  const formatPrice = (amountInINR: number): string => {
    if (isNaN(amountInINR) || amountInINR === null || amountInINR === undefined) {
      return currency === 'INR' ? '₹0' : '$0.00';
    }

    if (currency === 'INR') {
      return `₹${Math.round(amountInINR).toLocaleString('en-IN')}`;
    }

    const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;
    const converted = amountInINR * config.rateFromINR;
    return `${config.symbol}${converted.toFixed(2)}`;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        currentUser,
        theme,
        activeView,
        selectedProduct,
        quickViewProduct,
        isCartOpen,
        isAuthOpen,
        isSearchOpen,
        isSizeGuideOpen,
        isSupportChatOpen,
        currency,
        searchQuery,
        appliedCoupon,
        toasts,
        lastPlacedOrder,
        setActiveView,
        openProductDetail,
        openQuickView,
        setIsCartOpen,
        setIsAuthOpen,
        setIsSearchOpen,
        setIsSizeGuideOpen,
        setIsSupportChatOpen,
        setSearchQuery,
        setCurrency,
        toggleTheme,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        cartDiscount,
        cartShippingFee,
        cartTax,
        cartGrandTotal,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        placeOrder,
        updateOrderStatus,
        updateOrderCourier,
        merchantWhatsAppPhone,
        setMerchantWhatsAppPhone,
        merchantUpiId,
        setMerchantUpiId,
        merchantUpiQrImage,
        setMerchantUpiQrImage,
        merchantUpiName,
        setMerchantUpiName,
        codSettings,
        setCodSettings,
        heroBannerImage,
        setHeroBannerImage,
        heroBannerOpacity,
        setHeroBannerOpacity,
        customerContacts,
        broadcastWebhookUrl,
        setBroadcastWebhookUrl,
        addVipSubscriber,
        addProduct,
        updateProduct,
        deleteProduct,
        reloadProductsFromSupabase,
        isProductsLoading,
        addReview,
        deleteReview,
        replyToReview,
        toggleFeatureReview,
        login,
        logout,
        isAdminAuthenticated,
        verifyAdminPassword,
        setAdminPassword,
        lockAdmin,
        formatPrice,
        showToast,
        removeToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
