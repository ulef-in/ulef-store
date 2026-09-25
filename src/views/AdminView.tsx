import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Size, OrderStatus, Order, Review } from '../types';
import {
  Plus,
  Trash2,
  Edit2,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  X,
  Sparkles,
  Search,
  Filter,
  Save,
  Layers,
  Upload,
  Calendar,
  Database,
  RefreshCw,
  Clock,
  MapPin,
  Mail,
  Phone,
  Copy,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Truck,
  Printer,
  QrCode,
  MessageCircle,
  Banknote,
  CreditCard,
  ExternalLink,
  Share2,
  FileText,
  Check,
  Send,
  Users,
  Radio,
  Megaphone,
  Share,
  Star,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchAppointments, AppointmentBooking } from '../lib/supabase';
import {
  getMerchantWhatsAppPhone,
  getWhatsAppUrl,
  generateCustomerDispatchWhatsAppMessage,
  generateNewProductBroadcastMessage,
  getCustomerWhatsAppBroadcastUrl,
  generateReviewRequestWhatsAppMessage,
  sendToWhatsApp,
  DEFAULT_MERCHANT_WHATSAPP
} from '../utils/whatsapp';

export const AdminView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
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
    customerContacts,
    broadcastWebhookUrl,
    setBroadcastWebhookUrl,
    formatPrice,
    showToast,
    addReview,
    deleteReview,
    replyToReview,
    toggleFeatureReview,
    isAdminAuthenticated,
    verifyAdminPassword,
    setAdminPassword,
    lockAdmin,
    setActiveView
  } = useStore();

  // Admin password unlock state
  const [enteredPassword, setEnteredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Change password modal state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [changePassError, setChangePassError] = useState('');

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'appointments' | 'logistics_payment' | 'broadcast' | 'reviews'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // WhatsApp Broadcast state
  const [selectedProductForBroadcast, setSelectedProductForBroadcast] = useState<Product | null>(null);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastRecipientFilter, setBroadcastRecipientFilter] = useState<'all' | 'orders' | 'vip'>('all');
  const [sentCustomerIds, setSentCustomerIds] = useState<Record<string, boolean>>({});
  const [copiedNumbers, setCopiedNumbers] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [isTriggeringWebhook, setIsTriggeringWebhook] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<string>('');
  const [tempWebhookUrl, setTempWebhookUrl] = useState(broadcastWebhookUrl || '');

  // Reviews Tab state
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState<'all' | '5' | '4' | 'critical' | 'featured'>('all');
  const [reviewProductFilter, setReviewProductFilter] = useState<string>('all');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyOpenForReviewId, setReplyOpenForReviewId] = useState<string | null>(null);
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [manualReviewProduct, setManualReviewProduct] = useState<string>(products[0]?.id || '');
  const [manualReviewData, setManualReviewData] = useState({
    userName: '',
    userLocation: 'Mumbai, India',
    rating: 5,
    title: 'Top Tier 240 GSM Quality',
    comment: '',
    sizePurchased: 'L' as Size,
    fitFeedback: 'True to Oversized' as 'Runs Small' | 'True to Oversized' | 'Very Oversized',
    verifiedPurchase: true
  });

  // Shipping Label modal state
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState<Order | null>(null);

  // Store Settings (WhatsApp Phone, UPI ID, QR Code & COD)
  const [tempWhatsApp, setTempWhatsApp] = useState(merchantWhatsAppPhone || '919316614778');
  const [tempUpiId, setTempUpiId] = useState(merchantUpiId || 'ulef.luxury@okhdfcbank');
  const [tempUpiName, setTempUpiName] = useState(merchantUpiName || 'ULEF LUXURY');
  const [tempCodSettings, setTempCodSettings] = useState(codSettings || {
    enabled: true,
    extraFee: 0,
    advanceRequired: false,
    advanceAmount: 0,
    customNote: 'Pay with cash upon parcel delivery at your doorstep across India.'
  });
  const [isUploadingQr, setIsUploadingQr] = useState(false);
  const qrFileInputRef = useRef<HTMLInputElement>(null);

  // Inline courier state per order
  const [courierDrafts, setCourierDrafts] = useState<Record<string, { carrier: string; trackingNumber: string; estimatedDelivery: string }>>({});

  // Supabase appointments list & loading state
  const [appointmentsList, setAppointmentsList] = useState<AppointmentBooking[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  const loadAppointmentsFromSupabase = async () => {
    setIsLoadingAppointments(true);
    const data = await fetchAppointments();
    setAppointmentsList(data as AppointmentBooking[]);
    setIsLoadingAppointments(false);
  };

  useEffect(() => {
    if (activeTab === 'appointments') {
      loadAppointmentsFromSupabase();
    }
  }, [activeTab]);

  // Aggregated Reviews across all products
  const allReviewsList = React.useMemo(() => {
    const list: Array<Review & { productId: string; productName: string; productImage: string }> = [];
    products.forEach(p => {
      if (p.reviews && p.reviews.length > 0) {
        p.reviews.forEach(r => {
          list.push({
            ...r,
            productId: p.id,
            productName: p.name,
            productImage: p.images[0] || ''
          });
        });
      }
    });
    return list;
  }, [products]);

  const filteredReviewsList = React.useMemo(() => {
    return allReviewsList.filter(r => {
      if (reviewProductFilter !== 'all' && r.productId !== reviewProductFilter) return false;
      if (reviewRatingFilter === '5' && r.rating !== 5) return false;
      if (reviewRatingFilter === '4' && r.rating !== 4) return false;
      if (reviewRatingFilter === 'critical' && r.rating > 3) return false;
      if (reviewRatingFilter === 'featured' && !r.isFeatured) return false;
      if (reviewSearchQuery.trim()) {
        const query = reviewSearchQuery.toLowerCase();
        const matchName = r.userName.toLowerCase().includes(query);
        const matchComment = r.comment.toLowerCase().includes(query);
        const matchProduct = r.productName.toLowerCase().includes(query);
        const matchTitle = r.title.toLowerCase().includes(query);
        return matchName || matchComment || matchProduct || matchTitle;
      }
      return true;
    });
  }, [allReviewsList, reviewProductFilter, reviewRatingFilter, reviewSearchQuery]);

  const avgStoreRating = React.useMemo(() => {
    if (allReviewsList.length === 0) return 5.0;
    const total = allReviewsList.reduce((acc, r) => acc + r.rating, 0);
    return Number((total / allReviewsList.length).toFixed(1));
  }, [allReviewsList]);

  const fiveStarPercentage = React.useMemo(() => {
    if (allReviewsList.length === 0) return 100;
    const count5 = allReviewsList.filter(r => r.rating === 5).length;
    return Math.round((count5 / allReviewsList.length) * 100);
  }, [allReviewsList]);


  // Multiple File upload state & refs
  const bulkFileInputRef = useRef<HTMLInputElement>(null);
  const slotFileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [isDraggingOverall, setIsDraggingOverall] = useState(false);
  const [activeDragSlot, setActiveDragSlot] = useState<number | null>(null);

  interface UploadedImageItem {
    id: string;
    url: string;
    fileName: string;
  }

  const [uploadedImages, setUploadedImages] = useState<UploadedImageItem[]>([
    {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85',
      fileName: 'editorial-front-01.jpg',
    }
  ]);

  // Client-side image compression helper to prevent localStorage quota exhaustion
  const compressImageFile = (file: File, maxDim = 850, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) {
          resolve('');
          return;
        }
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve(dataUrl);
          }
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Custom QR Code Image Upload Handler (PhonePe / GPay / Paytm QR photo)
  const handleCustomQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingQr(true);
    try {
      const compressed = await compressImageFile(file, 650, 0.85);
      if (compressed) {
        setMerchantUpiQrImage(compressed);
        showToast('QR Code Uploaded', 'Aapka custom UPI QR Code image checkout par live ho gaya hai!', 'success');
      }
    } catch {
      showToast('Upload Error', 'Could not process QR Code image', 'error');
    } finally {
      setIsUploadingQr(false);
      e.target.value = '';
    }
  };

  // New product form state with resilient fields
  const [newProduct, setNewProduct] = useState({
    name: '',
    subtitle: '240 GSM Heavyweight Architectural Tee',
    description: 'Signature 240 GSM heavyweight combed cotton luxury t-shirt. Features structured boxy drape, pre-shrunk bio-wash, and durable high-density collar ribbing.',
    price: 68,
    originalPrice: 85,
    category: 'Essentials' as Product['category'],
    fitType: 'Boxy Drop-Shoulder' as Product['fitType'],
    gsm: 240,
    fabricDetails: '100% Combed Compact Cotton, pre-shrunk bio-wash, anti-bacon collar.',
    tags: ['Heavyweight', '240 GSM', 'Drop 04', 'Streetwear'],
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85'],
    colors: [
      { name: 'Washed Onyx', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as Size[],
    stock: {
      XS: 10,
      S: 15,
      M: 25,
      L: 30,
      XL: 20,
      XXL: 12,
      XXXL: 8,
    },
    isFeatured: true,
    isBestSeller: false,
    isNewDrop: true,
  });

  const validateFile = (file: File): boolean => {
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const isValidFormat = file.type.startsWith('image/') || validExtensions.includes(fileExtension);

    if (!isValidFormat) {
      showToast('Wrong File Format', `"${file.name}" is not supported. Please upload .jpg, .jpeg, .png, or .webp files.`, 'error');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('File Too Large', `"${file.name}" exceeds 10MB.`, 'error');
      return false;
    }

    return true;
  };

  const handleBatchUpload = async (fileList: FileList | File[]) => {
    const incomingFiles = Array.from(fileList);
    if (incomingFiles.length === 0) return;

    const availableSlots = 3 - uploadedImages.length;
    if (availableSlots <= 0) {
      showToast('Maximum Limit Reached', 'You can upload a maximum of 3 images per product.', 'error');
      return;
    }

    if (incomingFiles.length > availableSlots) {
      showToast('Upload Limit Alert', `Only ${availableSlots} more image(s) allowed. Uploading first ${availableSlots}.`, 'info');
    }

    const filesToProcess = incomingFiles.slice(0, availableSlots);
    const validFiles = filesToProcess.filter(validateFile);
    if (validFiles.length === 0) return;

    const newItems: UploadedImageItem[] = [];

    for (const file of validFiles) {
      const compressedDataUrl = await compressImageFile(file, 850, 0.8);
      newItems.push({
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        url: compressedDataUrl,
        fileName: file.name,
      });
    }

    setUploadedImages(prev => {
      const updated = [...prev, ...newItems].slice(0, 3);
      const updatedUrls = updated.map(item => item.url);
      setNewProduct(np => ({
        ...np,
        images: updatedUrls,
        colors: np.colors.length > 0
          ? [{ ...np.colors[0], image: updatedUrls[0] || '' }]
          : [{ name: 'Default Colorway', hex: '#1a1a1a', image: updatedUrls[0] || '' }]
      }));
      return updated;
    });
    showToast('Images Uploaded', `Successfully attached & optimized ${newItems.length} product image(s).`, 'success');
  };

  const handleSlotUpload = async (file: File, slotIndex: number) => {
    if (!validateFile(file)) return;

    const compressedDataUrl = await compressImageFile(file, 850, 0.8);
    const newItem: UploadedImageItem = {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      url: compressedDataUrl,
      fileName: file.name,
    };

    setUploadedImages(prev => {
      const next = [...prev];
      if (slotIndex < next.length) {
        next[slotIndex] = newItem;
      } else {
        next.push(newItem);
      }
      const trimmed = next.slice(0, 3);
      const updatedUrls = trimmed.map(item => item.url);
      setNewProduct(np => ({
        ...np,
        images: updatedUrls,
        colors: np.colors.length > 0
          ? [{ ...np.colors[0], image: updatedUrls[0] || '' }]
          : [{ name: 'Default Colorway', hex: '#1a1a1a', image: updatedUrls[0] || '' }]
      }));
      return trimmed;
    });
    showToast('Image Attached', `Slot ${slotIndex + 1}: ${file.name} (Optimized)`, 'success');
  };

  const handleRemoveImageIndex = (index: number) => {
    setUploadedImages(prev => {
      const next = prev.filter((_, idx) => idx !== index);
      const updatedUrls = next.map(item => item.url);
      setNewProduct(np => ({
        ...np,
        images: updatedUrls,
        colors: np.colors.length > 0
          ? [{ ...np.colors[0], image: updatedUrls[0] || '' }]
          : [{ name: 'Default Colorway', hex: '#1a1a1a', image: updatedUrls[0] || '' }]
      }));
      return next;
    });
    showToast('Image Removed', `Product image removed.`, 'info');
  };

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalUnitsInStock = products.reduce((sum, p) => {
    return sum + (Object.values(p.stock) as number[]).reduce((a, b) => a + b, 0);
  }, 0);
  const lowStockCount = products.filter(p => {
    return (Object.values(p.stock) as number[]).some(qty => qty < 5);
  }).length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;

    const createdProductData = {
      ...newProduct,
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
    };
    addProduct(createdProductData);

    const fullProductObj: Product = {
      ...createdProductData,
      id: `ulef-${Date.now().toString().slice(-4)}`,
      slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString()
    };

    // Auto-prompt WhatsApp Broadcast for this newly added product
    setSelectedProductForBroadcast(fullProductObj);
    setSentCustomerIds({});
    setCopiedNumbers(false);
    setCopiedMessage(false);
    setIsAddModalOpen(false);
    setIsBroadcastModalOpen(true);

    // Reset form for next entry
    setNewProduct({
      name: '',
      subtitle: '240 GSM Heavyweight Architectural Tee',
      description: 'Signature 240 GSM heavyweight combed cotton luxury t-shirt. Features structured boxy drape, pre-shrunk bio-wash, and durable high-density collar ribbing.',
      price: 68,
      originalPrice: 85,
      category: 'Essentials',
      fitType: 'Boxy Drop-Shoulder',
      gsm: 240,
      fabricDetails: '100% Combed Compact Cotton, pre-shrunk bio-wash, anti-bacon collar.',
      tags: ['Heavyweight', '240 GSM', 'Drop 04', 'Streetwear'],
      images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85'],
      colors: [
        { name: 'Washed Onyx', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as Size[],
      stock: {
        XS: 10,
        S: 15,
        M: 25,
        L: 30,
        XL: 20,
        XXL: 12,
        XXXL: 8,
      },
      isFeatured: true,
      isBestSeller: false,
      isNewDrop: true,
    });
    setUploadedImages([
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85',
        fileName: 'editorial-front-01.jpg',
      }
    ]);
    showToast('Product Created & Saved', `Added "${newProduct.name}" to catalog. Ready for WhatsApp broadcast!`, 'success');
  };

  const handleUpdateStock = (productId: string, size: Size, delta: number) => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;
    const currentQty = p.stock[size] || 0;
    const newQty = Math.max(0, currentQty + delta);
    updateProduct({
      ...p,
      stock: {
        ...p.stock,
        [size]: newQty,
      },
    });
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPasswordError('');
    
    setTimeout(() => {
      const ok = verifyAdminPassword(enteredPassword);
      if (!ok) {
        setPasswordError('Galat password! Sirf authorized store owner hi is panel ko access kar sakte hain.');
      } else {
        setEnteredPassword('');
      }
      setIsVerifying(false);
    }, 350);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminPass.length < 4) {
      setChangePassError('Naya password kam se kam 4 characters ka hona chahiye.');
      return;
    }
    if (newAdminPass !== confirmAdminPass) {
      setChangePassError('Dono passwords match nahi kar rahe hain.');
      return;
    }
    setAdminPassword(newAdminPass);
    setNewAdminPass('');
    setConfirmAdminPass('');
    setChangePassError('');
    setIsChangePasswordOpen(false);
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-6 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-500">
              RESTRICTED ACCESS // STORE OWNER ONLY
            </span>
            <h2 className="text-2xl font-black font-display tracking-tight text-neutral-950 dark:text-white uppercase">
              ADMIN PASSWORD REQUIRED
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed pt-1">
              Yeh panel password protected hai taki koi customer product, price ya orders ko chhedchhad na kar sake. Kripya apna password enter karein.
            </p>
          </div>

          <form onSubmit={handleUnlockAdmin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 mb-1.5 font-bold">
                Admin Password Daalein
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={enteredPassword}
                  onChange={(e) => {
                    setEnteredPassword(e.target.value);
                    setPasswordError('');
                  }}
                  placeholder="Enter admin password..."
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-sm font-mono text-neutral-950 dark:text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {passwordError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isVerifying || !enteredPassword}
              className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold font-display uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {isVerifying ? (
                <span className="flex items-center gap-2 font-mono text-xs">
                  <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  Verifying Credentials...
                </span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Unlock Admin Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Helper hint for store owner */}
          <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 space-y-1 text-left">
            <div className="flex items-center gap-1.5 font-bold text-neutral-800 dark:text-neutral-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Owner Default Credentials:</span>
            </div>
            <p>
              Default Master Password: <span className="font-bold text-amber-500 select-all">admin123</span> (ya mobile nambar <span className="font-bold text-amber-500 select-all">9316614778</span>).
            </p>
            <p className="text-[10px] text-neutral-400">
              Unlock karne ke baad aap "Change Password" button par click karke koi bhi naya password rakh sakte hain.
            </p>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={() => setActiveView('shop')}
              className="text-xs font-mono text-neutral-500 hover:text-neutral-950 dark:hover:text-white flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Customer Store</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
            ATELIER BACKSTAGE CONTROL
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-neutral-950 dark:text-white uppercase mt-1">
            ULEF.IN BRAND MANAGEMENT
          </h1>
        </div>

        {/* Tab Buttons & Security Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all ${
                activeTab === 'inventory'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              Inventory & Stock
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all ${
                activeTab === 'orders'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'appointments'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              <span>Bookings ({appointmentsList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('logistics_payment')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'logistics_payment'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant UPI, COD & Logistics</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('broadcast');
                if (!selectedProductForBroadcast && products.length > 0) {
                  setSelectedProductForBroadcast(products[0]);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'broadcast'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Broadcast ({customerContacts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'bg-amber-500 text-neutral-950 font-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Customer Reviews ({allReviewsList.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Change Admin Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Change Password</span>
            </button>

            <button
              onClick={() => {
                lockAdmin();
                setActiveView('shop');
              }}
              className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Lock Admin Panel"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Panel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Settings Quick Access Bar for UPI & COD */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-neutral-950 dark:text-white flex items-center gap-2">
              <span>Store UPI: <strong>{merchantUpiId || 'ulef.luxury@okhdfcbank'}</strong></span>
              {merchantUpiQrImage ? (
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]">
                  Custom QR Photo Live
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px]">
                  Auto QR Live
                </span>
              )}
            </div>
            <div className="text-[11px] text-neutral-500">
              Cash on Delivery (COD): <strong className={codSettings.enabled ? 'text-emerald-500' : 'text-neutral-400'}>{codSettings.enabled ? 'Active (Live)' : 'Paused'}</strong> • WhatsApp Alert: <strong>+{merchantWhatsAppPhone || '919316614778'}</strong>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('logistics_payment')}
          className="px-3.5 py-1.5 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Edit2 className="w-3 h-3" />
          <span>Edit UPI & COD Settings</span>
        </button>
      </div>

      {/* Overview Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>TOTAL REVENUE</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-950 dark:text-white">
            {formatPrice(totalRevenue)}
          </div>
          <div className="text-[11px] font-mono text-emerald-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +28.4% this month
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>ACTIVE ORDERS</span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-950 dark:text-white">
            {orders.length}
          </div>
          <div className="text-[11px] font-mono text-neutral-400">
            100% On-time Express DHL
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>TOTAL STOCK UNITS</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-950 dark:text-white">
            {totalUnitsInStock}
          </div>
          <div className="text-[11px] font-mono text-neutral-400">
            Across {products.length} Drop 04 models
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>LOW STOCK ALERTS</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-950 dark:text-white">
            {lowStockCount}
          </div>
          <div className="text-[11px] font-mono text-amber-500">
            Restock suggested for sizes &lt; 5
          </div>
        </div>
      </div>

      {/* Tab Content 1: Inventory & Stock */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog silhouettes..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500"
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold font-display uppercase tracking-wider text-xs flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Oversized Drop</span>
            </button>
          </div>

          {/* Products Table / Cards */}
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const totalStock = (Object.values(product.stock) as number[]).reduce((a, b) => a + b, 0);

              return (
                <div
                  key={product.id}
                  className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Thumbnail & Basic Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-20 rounded-xl object-cover bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold font-display uppercase text-neutral-950 dark:text-white">
                          {product.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                          {product.gsm} GSM
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-mono mt-0.5">
                        Category: {product.category} • Price: <strong className="text-neutral-950 dark:text-white">{formatPrice(product.price)}</strong>
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {product.isFeatured && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-amber-400/20 text-amber-600 dark:text-amber-300 font-bold uppercase">
                            Featured
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-400/20 text-emerald-600 dark:text-emerald-300 font-bold uppercase">
                            Bestseller
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Real-time Size Stock Adjusters */}
                  <div className="flex flex-wrap items-center gap-2">
                    {product.sizes.map((sz) => {
                      const qty = product.stock[sz] || 0;
                      return (
                        <div
                          key={sz}
                          className="flex flex-col items-center bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-1.5 min-w-[54px]"
                        >
                          <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">{sz}</span>
                          <span className={`text-xs font-mono font-bold my-0.5 ${qty < 5 ? 'text-amber-500' : 'text-neutral-950 dark:text-white'}`}>
                            {qty}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleUpdateStock(product.id, sz, -1)}
                              className="w-4 h-4 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 flex items-center justify-center text-xs"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleUpdateStock(product.id, sz, 1)}
                              className="w-4 h-4 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 flex items-center justify-center text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedProductForBroadcast(product);
                        setIsBroadcastModalOpen(true);
                        setSentCustomerIds({});
                        setCopiedNumbers(false);
                        setCopiedMessage(false);
                      }}
                      className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Broadcast this product to all customers on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Broadcast</span>
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-red-500 hover:border-red-300 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 2: Orders Management & Logistics */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Truck className="w-5 h-5 shrink-0" />
              <span>
                <strong>COD & Dispatch Management:</strong> Customer ke complete address ("kahan se order kiya hai") check karein, Courier Partner assign karein, aur Parcel Dispatch Slip print karein.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('logistics_payment')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold font-mono text-[11px] shrink-0 transition-colors"
            >
              Delivery & Payment Setup Guide →
            </button>
          </div>

          <div className="space-y-6">
            {orders.map((order) => {
              const customerPhone = (order.shippingAddress.phone || '').replace(/[^0-9]/g, '');
              const customerWhatsAppUrl = customerPhone
                ? `https://wa.me/${customerPhone.startsWith('91') ? customerPhone : '91' + customerPhone}?text=${encodeURIComponent(
                    `Hello ${order.shippingAddress.firstName}, ULEF Atelier team here regarding your order #${order.id}.`
                  )}`
                : null;

              const fullAddress = `${order.shippingAddress.addressLine1}${
                order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''
              }, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}, ${
                order.shippingAddress.country
              }`;

              const draft = courierDrafts[order.id] || {
                carrier: order.carrier || 'Shiprocket (Delhivery)',
                trackingNumber: order.trackingNumber || '',
                estimatedDelivery: order.estimatedDelivery || '3-4 Business Days'
              };

              const handleDraftChange = (field: 'carrier' | 'trackingNumber' | 'estimatedDelivery', value: string) => {
                setCourierDrafts(prev => ({
                  ...prev,
                  [order.id]: {
                    ...draft,
                    [field]: value
                  }
                }));
              };

              const handleSaveCourier = () => {
                updateOrderCourier(order.id, draft.carrier, draft.trackingNumber, draft.estimatedDelivery);
                showToast('Logistics Saved', `Courier details updated for order #${order.id}`, 'success');
              };

              const handleAutoAwb = () => {
                const randomAwb = `AWB-${Math.floor(100000000 + Math.random() * 900000000)}`;
                handleDraftChange('trackingNumber', randomAwb);
                showToast('AWB Generated', `New AWB #${randomAwb} created. Click Update to save.`, 'info');
              };

              const handleCustomerDispatchAlert = () => {
                const msg = generateCustomerDispatchWhatsAppMessage(order);
                const url = customerPhone
                  ? `https://wa.me/${customerPhone.startsWith('91') ? customerPhone : '91' + customerPhone}?text=${encodeURIComponent(msg)}`
                  : null;
                if (url) {
                  window.open(url, '_blank', 'noopener,noreferrer');
                } else {
                  showToast('No Phone Number', 'Customer phone number not available.', 'error');
                }
              };

              const handleSendReviewRequest = () => {
                const firstItem = order.items[0];
                const prodName = firstItem ? firstItem.product.name : 'Heavyweight Architectural T-Shirt';
                const msg = generateReviewRequestWhatsAppMessage(order.shippingAddress.firstName, prodName);
                const url = customerPhone
                  ? `https://wa.me/${customerPhone.startsWith('91') ? customerPhone : '91' + customerPhone}?text=${encodeURIComponent(msg)}`
                  : null;
                if (url) {
                  window.open(url, '_blank', 'noopener,noreferrer');
                  showToast('Review Request Prepared', `WhatsApp review invitation opened for ${order.shippingAddress.firstName}!`, 'success');
                } else {
                  showToast('No Phone Number', 'Customer phone number not available.', 'error');
                }
              };

              return (
                <div
                  key={order.id}
                  className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6"
                >
                  {/* Top Bar: Order ID, Date, Payment Badge, Status */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-base font-bold font-mono text-neutral-950 dark:text-white">
                          ORDER #{order.id}
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">
                          {new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                        {order.paymentMethod === 'cash_on_delivery' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Banknote className="w-3.5 h-3.5" />
                            <span>CASH ON DELIVERY (Collect: {formatPrice(order.total)})</span>
                          </span>
                        ) : order.paymentMethod === 'upi' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>INSTANT UPI ({order.paymentStatus})</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            {order.paymentMethod.replace('_', ' ').toUpperCase()} ({order.paymentStatus})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-xs font-mono flex items-center gap-2">
                        <span className="text-neutral-400">STATUS:</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono font-bold text-neutral-950 dark:text-white"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Cutting & QC">Cutting & QC</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <span className="text-base font-mono font-bold text-neutral-950 dark:text-white">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Customer Information & Delivery Address ("Kahan Se Order Kiya Hai") */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Customer Info Card */}
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                          👤 Customer Ki Details (Kisne Order Kiya)
                        </span>
                        {customerWhatsAppUrl && (
                          <a
                            href={customerWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp Chat</span>
                          </a>
                        )}
                      </div>
                      <div className="space-y-1 text-neutral-700 dark:text-neutral-300">
                        <p>
                          <strong className="text-neutral-950 dark:text-white text-sm">
                            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                          </strong>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span>{order.shippingAddress.phone || 'No phone provided'}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span className="truncate">{order.shippingAddress.email}</span>
                        </p>
                      </div>
                    </div>

                    {/* Delivery Address Card ("Kahan Se Order Kiya Hai") */}
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                        <span className="text-[10px] text-amber-500 uppercase tracking-wider font-bold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Kahan Se Order Kiya Hai (Delivery Pata)</span>
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(fullAddress);
                            showToast('Address Copied', 'Delivery address copied for courier label.', 'success');
                          }}
                          className="text-[10px] text-neutral-400 hover:text-neutral-950 dark:hover:text-white flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      </div>
                      <div className="space-y-0.5 text-neutral-700 dark:text-neutral-300 text-[11px] leading-relaxed">
                        <p>
                          <strong>Street:</strong> {order.shippingAddress.addressLine1}
                          {order.shippingAddress.addressLine2 ? ` (${order.shippingAddress.addressLine2})` : ''}
                        </p>
                        <p>
                          <strong>City & State:</strong> {order.shippingAddress.city}, {order.shippingAddress.state}
                        </p>
                        <p>
                          <strong>Pincode & Country:</strong> {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block font-bold">
                      👕 Ordered 240 GSM Silhouettes ({order.items.length} items)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono"
                        >
                          <img
                            src={item.selectedColor.image || item.product.images[0]}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-14 rounded-lg object-cover bg-neutral-200 dark:bg-neutral-900 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-neutral-950 dark:text-white block truncate">
                              {item.product.name}
                            </span>
                            <span className="text-neutral-500 text-[11px] block">
                              Size {item.selectedSize} • {item.selectedColor.name} (Qty: {item.quantity})
                            </span>
                            <span className="text-[11px] font-bold text-amber-500 block mt-0.5">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Courier Partner & Dispatch Manager Section */}
                  <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-950/80 border border-neutral-200 dark:border-neutral-800 space-y-3 font-mono text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                      <span className="font-bold text-neutral-950 dark:text-white flex items-center gap-1.5 uppercase text-[11px]">
                        <Truck className="w-4 h-4 text-blue-500" />
                        <span>Delivery Partner & Shipping AWB</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForSlip(order)}
                          className="px-3 py-1 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-[10px] flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Print Shipping Slip</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleCustomerDispatchAlert}
                          className="px-3 py-1 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-[10px] flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp Tracking to Customer</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">Courier Partner</label>
                        <select
                          value={draft.carrier}
                          onChange={(e) => handleDraftChange('carrier', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-950 dark:text-white"
                        >
                          <option value="Shiprocket (Delhivery)">Shiprocket (Delhivery)</option>
                          <option value="Shiprocket (Blue Dart)">Shiprocket (Blue Dart)</option>
                          <option value="Delhivery Direct">Delhivery Direct</option>
                          <option value="Blue Dart Express">Blue Dart Express</option>
                          <option value="DTDC Express">DTDC Express</option>
                          <option value="XpressBees">XpressBees</option>
                          <option value="Speed Post / India Post">Speed Post / India Post</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-neutral-400 uppercase">AWB Tracking Code</label>
                          <button
                            type="button"
                            onClick={handleAutoAwb}
                            className="text-[9px] text-amber-500 hover:underline"
                          >
                            Auto-Generate
                          </button>
                        </div>
                        <input
                          type="text"
                          value={draft.trackingNumber}
                          onChange={(e) => handleDraftChange('trackingNumber', e.target.value)}
                          placeholder="e.g. TRK-8921820"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">Estimated Delivery</label>
                        <input
                          type="text"
                          value={draft.estimatedDelivery}
                          onChange={(e) => handleDraftChange('estimatedDelivery', e.target.value)}
                          placeholder="e.g. 3-4 Business Days"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white font-mono"
                        />
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={handleSaveCourier}
                          className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Update Courier</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Appointments List Tab (Connected to Supabase) */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          {/* Supabase Connection Status Banner */}
          <div className="p-6 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Supabase Live Connection Active
                </span>
              </div>
              <h3 className="text-xl font-bold font-display uppercase tracking-tight text-white">
                Atelier Appointment Bookings
              </h3>
              <p className="text-xs font-mono text-neutral-400">
                Connected to Project: <code className="text-amber-400 bg-neutral-950 px-1.5 py-0.5 rounded">szuleuoasvqulhpaqcqn</code> • Table: <code className="text-amber-400 bg-neutral-950 px-1.5 py-0.5 rounded">appointments</code>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadAppointmentsFromSupabase}
                disabled={isLoadingAppointments}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAppointments ? 'animate-spin' : ''}`} />
                <span>Refresh Supabase Data</span>
              </button>
            </div>
          </div>

          {/* Bookings List or Empty State */}
          {isLoadingAppointments ? (
            <div className="py-16 text-center text-xs font-mono text-neutral-500 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500" />
              <p>Fetching appointments from Supabase PostgreSQL tables...</p>
            </div>
          ) : appointmentsList.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-4">
              <Calendar className="w-10 h-10 text-neutral-400 mx-auto" />
              <h4 className="text-base font-bold font-display uppercase text-neutral-950 dark:text-white">
                No Bookings Yet
              </h4>
              <p className="text-xs font-mono text-neutral-500 max-w-md mx-auto">
                Whenever clients submit the Atelier Appointment Booking form on the Contact & Concierge page, their details will appear here automatically in real-time.
              </p>
              
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-left max-w-xl mx-auto space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-neutral-700 dark:text-neutral-300">
                    Supabase SQL Schema (Optional Table Initialization)
                  </span>
                  <button
                    onClick={() => {
                      const sql = `CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  studio_location TEXT NOT NULL,
  service_type TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'Confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;
                      navigator.clipboard.writeText(sql);
                      showToast('Copied to Clipboard', 'Paste into your Supabase SQL Editor.', 'success');
                    }}
                    className="text-[10px] font-mono text-amber-500 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Copy className="w-3 h-3" /> Copy SQL
                  </button>
                </div>
                <pre className="text-[10px] font-mono text-neutral-500 overflow-x-auto p-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
{`CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  studio_location TEXT NOT NULL,
  service_type TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'Confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
                </pre>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointmentsList.map((appt, idx) => (
                <div
                  key={appt.id || idx}
                  className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4 font-mono text-xs"
                >
                  <div className="flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Client</span>
                      <strong className="text-sm font-display uppercase text-neutral-950 dark:text-white">
                        {appt.name}
                      </strong>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase">
                      {appt.status || 'Confirmed'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{appt.email}</span>
                    </div>
                    {appt.phone ? (
                      <div className="flex items-center gap-1.5 truncate">
                        <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate">{appt.phone}</span>
                      </div>
                    ) : (
                      <div className="text-neutral-400 text-[11px]">—</div>
                    )}
                  </div>

                  <div className="space-y-1.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[11px]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="font-bold text-neutral-950 dark:text-white">{appt.studio_location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{appt.appointment_date} @ {appt.appointment_time}</span>
                    </div>
                    <div className="pt-1 text-neutral-500">
                      <strong>Service:</strong> {appt.service_type}
                    </div>
                    {appt.notes && (
                      <div className="pt-1 text-neutral-500 italic border-t border-neutral-200 dark:border-neutral-800">
                        "{appt.notes}"
                      </div>
                    )}
                  </div>

                  {appt.created_at && (
                    <div className="text-[10px] text-neutral-400 text-right">
                      Received: {new Date(appt.created_at).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: Delivery Partners & Payment Hub */}
      {activeTab === 'logistics_payment' && (
        <div className="space-y-8 font-mono text-xs">
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                  Logistics & Merchant Payments Hub
                </span>
              </div>
              <h3 className="text-xl font-bold font-display uppercase tracking-tight text-white">
                Delivery Partners & Payment Gateway Setup
              </h3>
              <p className="text-xs text-neutral-400">
                Configure owner WhatsApp notifications, direct UPI QR code, Cash on Delivery (COD) remittance, and courier integrations (Shiprocket & Delhivery).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section 1: Store Owner WhatsApp COD Alerts */}
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                  <h4 className="text-sm font-bold font-display uppercase text-neutral-950 dark:text-white">
                    1. Owner WhatsApp Direct Order Alerts
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Active
                </span>
              </div>

              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
                Jaise hi koi customer website par <strong>Cash on Delivery (COD)</strong> ya koi bhi order place karega, uske turant baad aapke is WhatsApp number par automatic message open ho jayega jisme customer ka naam, mobile number, pura delivery address ("kahan se order kiya hai"), aur t-shirt size/price likha hoga.
              </p>

              <div className="space-y-2">
                <label className="block text-[10px] text-neutral-400 uppercase font-bold">
                  Owner's WhatsApp Number (Country code ke sath bina + ke, e.g. 919316614778)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempWhatsApp}
                    onChange={(e) => setTempWhatsApp(e.target.value)}
                    placeholder="919316614778"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono font-bold text-neutral-950 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMerchantWhatsAppPhone(tempWhatsApp);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold shrink-0 transition-colors"
                  >
                    Save Number
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">Current active number: <strong className="text-neutral-950 dark:text-white">+{merchantWhatsAppPhone || '919316614778'}</strong></span>
                <a
                  href={`https://wa.me/${merchantWhatsAppPhone || '919316614778'}?text=${encodeURIComponent('Test alert from ULEF Atelier Website')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-500 hover:underline flex items-center gap-1 font-bold"
                >
                  <ExternalLink className="w-3 h-3" /> Test Alert
                </a>
              </div>
            </div>

            {/* Section 2: Instant UPI & Custom QR Code Configuration */}
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2 text-amber-500">
                  <QrCode className="w-5 h-5" />
                  <h4 className="text-sm font-bold font-display uppercase text-neutral-950 dark:text-white">
                    2. Instant UPI & Custom QR Code (Mera UPI Code)
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Zero Commission
                </span>
              </div>

              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
                Aap apna **UPI ID** (jaise <em>9316614778@ybl</em> ya <em>store@okhdfcbank</em>) yahan set kar sakte hain, ya direct apna **PhonePe / Google Pay / Paytm QR Code photo (screenshot)** upload kar sakte hain jo checkout par customer ko scan karne ke liye dikhega.
              </p>

              {/* UPI ID & Name Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-neutral-400 uppercase font-bold">
                    Store UPI ID (VPA)
                  </label>
                  <input
                    type="text"
                    value={tempUpiId}
                    onChange={(e) => setTempUpiId(e.target.value)}
                    placeholder="9316614778@ybl ya yourname@okhdfcbank"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono font-bold text-neutral-950 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-neutral-400 uppercase font-bold">
                    Merchant / Account Name
                  </label>
                  <input
                    type="text"
                    value={tempUpiName}
                    onChange={(e) => setTempUpiName(e.target.value)}
                    placeholder="ULEF LUXURY ya Store Name"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono font-bold text-neutral-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMerchantUpiId(tempUpiId);
                    setMerchantUpiName(tempUpiName);
                  }}
                  className="px-4 py-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs shrink-0 transition-colors cursor-pointer"
                >
                  Save UPI ID & Name
                </button>
              </div>

              {/* Upload Custom QR Code Photo Card */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-950 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Mera Custom QR Code Photo (PhonePe / GPay / Paytm)</span>
                  </span>
                  {merchantUpiQrImage ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      ● Custom QR Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      Auto-Generator Active
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-neutral-500">
                  Apne PhonePe ya Google Pay Business app se QR code ka screenshot lein aur yahan upload karein. Customer checkout par wahi QR scan karega!
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* QR Image Preview */}
                  <div className="w-28 h-28 shrink-0 bg-white rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-center p-1 relative shadow-sm">
                    {merchantUpiQrImage ? (
                      <img
                        src={merchantUpiQrImage}
                        alt="Custom Store QR"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=4&data=${encodeURIComponent(`upi://pay?pa=${encodeURIComponent(merchantUpiId || 'ulef.luxury@okhdfcbank')}&pn=ULEF%20LUXURY`)}`}
                        alt="Default Generated QR"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    )}
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <input
                      type="file"
                      ref={qrFileInputRef}
                      accept="image/*"
                      onChange={handleCustomQrUpload}
                      className="hidden"
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => qrFileInputRef.current?.click()}
                        disabled={isUploadingQr}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingQr ? 'Processing...' : 'Upload Mera QR Code Photo'}</span>
                      </button>

                      {merchantUpiQrImage && (
                        <button
                          type="button"
                          onClick={() => setMerchantUpiQrImage('')}
                          className="px-3 py-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Custom QR</span>
                        </button>
                      )}
                    </div>

                    <p className="text-[10px] text-neutral-400">
                      Supports JPG, PNG, Screenshots • Auto compressed to lightweight format
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">
                  Active UPI: <strong className="text-neutral-950 dark:text-white">{merchantUpiId || 'ulef.luxury@okhdfcbank'}</strong> ({merchantUpiName || 'ULEF LUXURY'})
                </span>
                <span className="text-emerald-500 font-bold">● Live on Checkout</span>
              </div>
            </div>

            {/* Section 2B: Cash on Delivery (COD) Management (Mera COD) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Banknote className="w-5 h-5" />
                  <h4 className="text-sm font-bold font-display uppercase text-neutral-950 dark:text-white">
                    3. Cash on Delivery (Mera COD Settings)
                  </h4>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  tempCodSettings.enabled
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-neutral-500/10 text-neutral-500'
                }`}>
                  {tempCodSettings.enabled ? '● COD Active' : '○ COD Paused'}
                </span>
              </div>

              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
                Yahan se aap website par <strong>Cash on Delivery (COD)</strong> option ko control kar sakte hain. COD order aane par buyer ka pura address aur phone number direct aapke WhatsApp par aayega.
              </p>

              {/* COD Toggle & Extra Handling Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-bold text-neutral-950 dark:text-white">Enable Cash on Delivery</span>
                    <input
                      type="checkbox"
                      checked={tempCodSettings.enabled}
                      onChange={(e) => setTempCodSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                  </label>
                  <p className="text-[10px] text-neutral-400">
                    Isse checkout mein Cash on Delivery payment option visible hoga.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <label className="block text-[10px] text-neutral-400 uppercase font-bold">
                    COD Handling / Extra Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={tempCodSettings.extraFee}
                    onChange={(e) => setTempCodSettings(prev => ({ ...prev, extraFee: Math.max(0, Number(e.target.value) || 0) }))}
                    placeholder="0"
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono font-bold text-neutral-950 dark:text-white"
                  />
                  <p className="text-[10px] text-neutral-400">
                    Bina charge ke liye 0 rakhein (Free COD) ya convenience fee set karein.
                  </p>
                </div>
              </div>

              {/* Custom COD Note for customers */}
              <div className="space-y-1.5">
                <label className="block text-[10px] text-neutral-400 uppercase font-bold">
                  Customer COD Instruction Note
                </label>
                <textarea
                  rows={2}
                  value={tempCodSettings.customNote}
                  onChange={(e) => setTempCodSettings(prev => ({ ...prev, customNote: e.target.value }))}
                  placeholder="Ghar par cash de sakte hain. Delivery boy ko cash dekar parcel collect karein."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-950 dark:text-white resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setCodSettings(tempCodSettings);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Mera COD Settings</span>
                </button>

                <span className="text-[11px] text-neutral-500 font-mono">
                  Order notifications: <strong>+{merchantWhatsAppPhone || '919316614778'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Detailed Payment Gateway Guide (Razorpay / PhonePe) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <CreditCard className="w-5 h-5 text-purple-500" />
              <h4 className="text-sm font-bold font-display uppercase text-neutral-950 dark:text-white">
                Payment Lene Ke 3 Best Tarike (Comprehensive Guide)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-neutral-950 dark:text-white">Method 1: Direct UPI QR Code</strong>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">0% Charge</span>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Sabse aasan aur bina charges wala tarika. Customer QR scan karke ya Google Pay/PhonePe button daba kar direct aapke account me paise bhejta hai. Koi middleman cut nahi hota.
                </p>
                <div className="text-[10px] font-bold text-emerald-500">✓ Already Integrated & Live</div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-neutral-950 dark:text-white">Method 2: Razorpay / Cashfree PG</strong>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 font-bold">Auto Confirm</span>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Debit/Credit Cards, Netbanking, EMI, aur UPI sabhi support karta hai. Payment hote hi order automatically "Paid" mark ho jata hai.
                </p>
                <p className="text-[10px] text-neutral-400">
                  Setup: <a href="https://razorpay.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline">Razorpay.com</a> par free account banakar PAN aur Bank account submit karein (24 hours me activate).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-neutral-950 dark:text-white">Method 3: Cash on Delivery (COD)</strong>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">Customer Favorite</span>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  India mein 70% t-shirt orders COD par aate hain. Delivery boy customer se cash leta hai aur courier company (Shiprocket/Delhivery) 2-3 din mein direct aapke bank account mein paise deposit kar deti hai.
                </p>
                <div className="text-[10px] font-bold text-amber-500">✓ Integrated on ULEF Store</div>
              </div>
            </div>
          </div>

          {/* Section 4: Delivery Partner Setup (Shiprocket & Delhivery) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-2 text-blue-500">
                <Truck className="w-5 h-5" />
                <div>
                  <h4 className="text-sm font-bold font-display uppercase text-neutral-950 dark:text-white">
                    Delivery Partner Ke Liye Kya Karein (Logistics Setup)
                  </h4>
                  <span className="text-[11px] text-neutral-400">Shiprocket & Delhivery Direct Integration Guide</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://www.shiprocket.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span>Open Shiprocket.in</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://one.delhivery.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span>Delhivery One</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Step by step procedure */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">1</div>
                <h5 className="font-bold text-neutral-950 dark:text-white text-xs">Shiprocket Account Banayein</h5>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  <a href="https://www.shiprocket.in" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Shiprocket.in</a> par free account register karein. Isme ek hi jagah Delhivery, Blue Dart, DTDC, XpressBees sab mil jate hain.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">2</div>
                <h5 className="font-bold text-neutral-950 dark:text-white text-xs">Pickup Address Dalein</h5>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Apne ghar ya factory/shop ka address dalein. Courier boy parcel pick karne aapke bataye huye address par aayega.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">3</div>
                <h5 className="font-bold text-neutral-950 dark:text-white text-xs">Parcel Pack & Label Paste</h5>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  240 GSM T-shirt ko pack karein (~350 grams). Admin panel ke <strong>"Print Shipping Slip"</strong> button se label print karke packet par chipka dein.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">4</div>
                <h5 className="font-bold text-neutral-950 dark:text-white text-xs">COD Ka Paisa Bank Me</h5>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Customer se COD cash lekar delivery partner Shiprocket 2 se 3 din me paisa sidhe aapke bank account me transfer kar deta hai.
                </p>
              </div>
            </div>

            {/* Courier Rate Estimator */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-950 text-white border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold font-display uppercase tracking-wider text-amber-400">
                  Approx Courier Rates (240 GSM Luxury T-Shirt: ~350g)
                </h5>
                <span className="text-[10px] text-neutral-400">All India Coverage</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                  <span className="text-neutral-400 block">Same City / Local</span>
                  <strong className="text-white text-sm">₹29 - ₹38 / parcel</strong>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">Delivery in 24-48 Hours</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                  <span className="text-neutral-400 block">Same State / Regional</span>
                  <strong className="text-white text-sm">₹38 - ₹48 / parcel</strong>
                  <span className="text-[10px] text-blue-400 block mt-0.5">Delivery in 2-3 Days</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                  <span className="text-neutral-400 block">All-India Metro / National</span>
                  <strong className="text-white text-sm">₹49 - ₹65 / parcel</strong>
                  <span className="text-[10px] text-amber-400 block mt-0.5">Air / Surface Express (3-4 Days)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 5: WhatsApp Drop Broadcast & Customer Marketing */}
      {activeTab === 'broadcast' && (
        <div className="space-y-8 font-mono text-xs">
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-neutral-900 to-neutral-950 text-white border border-emerald-900/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider border border-emerald-500/30 flex items-center gap-1">
                  <Megaphone className="w-3 h-3" /> WhatsApp Marketing Hub
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">1-Click Customer Blast</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-white">
                New Product WhatsApp Broadcast
              </h2>
              <p className="text-neutral-400 text-xs max-w-2xl leading-relaxed">
                Aap website par jab bhi koi naya 240 GSM drop add karte hain, to yahan se 1-click mein sabhi customers ke WhatsApp par photo, description, fabric details aur direct buying link bhej sakte hain.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-2xl bg-neutral-900/90 border border-emerald-800/40 text-center">
                <span className="text-[10px] text-neutral-400 block uppercase">Total Customer Leads</span>
                <strong className="text-lg font-bold text-emerald-400">{customerContacts.length} Contacts</strong>
              </div>
            </div>
          </div>

          {/* Active Product Selector for Broadcast */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h4 className="font-bold font-display uppercase text-sm text-neutral-950 dark:text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-500" />
                  <span>Step 1: Choose Product to Broadcast (Konsa T-Shirt Bhejna Hai)</span>
                </h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Naye add kiye gaye t-shirt ya kisi bhi collection silhouette ko select karein
                </p>
              </div>

              {/* Product selector dropdown */}
              <select
                value={selectedProductForBroadcast?.id || products[0]?.id || ''}
                onChange={(e) => {
                  const found = products.find(p => p.id === e.target.value);
                  if (found) {
                    setSelectedProductForBroadcast(found);
                    setSentCustomerIds({});
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-950 dark:text-white"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.gsm} GSM - {formatPrice(p.price)})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Product Card & Preview Grid */}
            {selectedProductForBroadcast && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                {/* Left: Product Snapshot */}
                <div className="lg:col-span-5 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <div className="flex gap-3">
                    <img
                      src={selectedProductForBroadcast.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85'}
                      alt={selectedProductForBroadcast.name}
                      className="w-20 h-24 object-cover rounded-xl border border-neutral-200 dark:border-neutral-800 shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                        {selectedProductForBroadcast.category}
                      </span>
                      <h5 className="font-bold text-sm text-neutral-950 dark:text-white leading-tight">
                        {selectedProductForBroadcast.name}
                      </h5>
                      <div className="text-xs font-bold text-neutral-950 dark:text-white">
                        {formatPrice(selectedProductForBroadcast.price)}
                        {selectedProductForBroadcast.originalPrice && (
                          <span className="ml-1.5 text-neutral-400 line-through text-[10px]">
                            {formatPrice(selectedProductForBroadcast.originalPrice)}
                          </span>
                        )}
                      </div>
                      <span className="inline-block text-[10px] text-neutral-500">
                        {selectedProductForBroadcast.gsm} GSM • {selectedProductForBroadcast.fitType}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400">
                    <strong className="block text-[10px] uppercase text-neutral-400 mb-0.5">Description to Send:</strong>
                    <p className="line-clamp-3">{selectedProductForBroadcast.description}</p>
                  </div>
                </div>

                {/* Right: WhatsApp Live Chat Bubble Preview */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Message Preview
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const msg = generateNewProductBroadcastMessage(selectedProductForBroadcast, formatPrice);
                          navigator.clipboard.writeText(msg);
                          setCopiedMessage(true);
                          showToast('Message Copied', 'WhatsApp broadcast text copied to clipboard!', 'success');
                          setTimeout(() => setCopiedMessage(false), 2500);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[10px] font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedMessage ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedMessage ? 'Copied!' : 'Copy Text'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const msg = generateNewProductBroadcastMessage(selectedProductForBroadcast, formatPrice);
                          sendToWhatsApp(msg);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Share to Status / Group</span>
                      </button>
                    </div>
                  </div>

                  {/* Realistic WhatsApp Chat Bubble */}
                  <div className="p-4 rounded-2xl bg-[#0b141a] border border-[#202c33] text-[#e9edef] font-sans text-xs space-y-2 relative shadow-lg">
                    <div className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed select-text">
                      {generateNewProductBroadcastMessage(selectedProductForBroadcast, formatPrice)}
                    </div>
                    <div className="flex justify-end items-center gap-1 text-[9px] text-[#8696a0] pt-1">
                      <span>Just now</span>
                      <span className="text-emerald-400">✓✓</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Customer Directory & 1-Click Send Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h4 className="font-bold font-display uppercase text-sm text-neutral-950 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Step 2: Customer Recipients Directory ({customerContacts.length} Contacts)</span>
                </h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Sabhi order dene wale customers aur VIP club members jinhe aap message bhej sakte hain
                </p>
              </div>

              {/* Action Buttons: Copy Numbers / Webhook Trigger */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const numbers = customerContacts.map(c => c.phone.replace(/[^0-9]/g, '')).filter(Boolean);
                    navigator.clipboard.writeText(numbers.join(', '));
                    setCopiedNumbers(true);
                    showToast('Numbers Copied', `Copied ${numbers.length} customer phone numbers for WhatsApp Broadcast!`, 'success');
                    setTimeout(() => setCopiedNumbers(false), 3000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-mono text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedNumbers ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNumbers ? 'Numbers Copied!' : 'Copy Numbers for Broadcast List'}</span>
                </button>
              </div>
            </div>

            {/* Recipient Cards / Table */}
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {customerContacts.length === 0 ? (
                <div className="py-8 text-center text-neutral-400">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Abhi tak koi customer number nahi hai. Website par pehla order place hote hi customer yahan jud jayega.</p>
                </div>
              ) : (
                customerContacts.map((customer) => {
                  const isSent = !!sentCustomerIds[customer.phone];
                  const broadcastMsg = selectedProductForBroadcast
                    ? generateNewProductBroadcastMessage(selectedProductForBroadcast, formatPrice, customer.name)
                    : '';
                  const waUrl = getCustomerWhatsAppBroadcastUrl(customer.phone, broadcastMsg);

                  return (
                    <div
                      key={customer.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold font-mono text-xs">
                          {customer.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-neutral-950 dark:text-white text-xs">{customer.name}</strong>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                              {customer.source}
                            </span>
                            {customer.city && (
                              <span className="text-[10px] text-neutral-400 font-mono">📍 {customer.city}</span>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-neutral-500">
                            📱 +{customer.phone} {customer.totalSpent ? `• Lifetime: ${formatPrice(customer.totalSpent)}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* 1-Click Send Button */}
                      <div className="flex items-center gap-2">
                        {isSent ? (
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Sent Successfully
                            </span>
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-neutral-400 hover:text-neutral-200 underline"
                            >
                              Resend
                            </a>
                          </div>
                        ) : (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              setSentCustomerIds(prev => ({ ...prev, [customer.phone]: true }));
                              showToast('WhatsApp Opened', `Sending drop alert to ${customer.name}...`, 'success');
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Send WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Guide & Automation Settings: How WhatsApp Broadcasting Works */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Method A: Free WhatsApp Business Broadcast List */}
            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">1</div>
                <h5 className="font-bold uppercase text-xs text-neutral-950 dark:text-white">
                  Tareeqa 1: Free WhatsApp Business Broadcast List
                </h5>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Aapke mobile par <strong>WhatsApp Business</strong> app me ek option hota hai <strong>"New Broadcast"</strong>.
              </p>
              <ol className="list-decimal pl-4 space-y-1 text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <li>Upar diye gaye <strong>"Copy Numbers for Broadcast List"</strong> button par click karein.</li>
                <li>Apne WhatsApp Business app me <strong>New Broadcast</strong> select karke un customers ko add karein.</li>
                <li>T-Shirt ka message copy karke paste karein aur send daba dein — <strong>1 click mein sabhi ko personal message chala jayega (Bina kisi extra cost ke)</strong>!</li>
              </ol>
            </div>

            {/* Method B: 100% Automated Background API (Meta / Wati / AISensy) */}
            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">2</div>
                <h5 className="font-bold uppercase text-xs text-neutral-950 dark:text-white">
                  Tareeqa 2: Automatic Background Cloud API (Wati / AISensy)
                </h5>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Agar aap chahte hain ki jaise hi aap "Add Product" karein, aapko ek bhi click na karna pade aur sabhi 1,000 customers ke WhatsApp par server se direct message chala jaye:
              </p>
              <div className="space-y-2 pt-1">
                <label className="block text-[10px] text-neutral-400 uppercase font-bold">
                  Enter Wati / AISensy / Meta Webhook URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={tempWebhookUrl}
                    onChange={(e) => setTempWebhookUrl(e.target.value)}
                    placeholder="https://api.wati.io/api/v1/broadcast or AISensy webhook"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-950 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setBroadcastWebhookUrl(tempWebhookUrl);
                      showToast('Webhook Saved', 'Auto-broadcast webhook URL updated!', 'success');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-lg font-bold font-display uppercase tracking-tight text-neutral-950 dark:text-white">
                  Add New Drop 04 Silhouette
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-neutral-400 hover:text-neutral-950 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Vintage Acid Mineral Washed Heavyweight Tee"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white font-mono"
                    >
                      <option value="Essentials">Essentials</option>
                      <option value="Minimalist Heavyweight">Minimalist Heavyweight</option>
                      <option value="Graphic Street">Graphic Street</option>
                      <option value="Acid & Vintage Wash">Acid & Vintage Wash</option>
                      <option value="Limited Drop">Limited Drop</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Fabric GSM</label>
                    <input
                      type="number"
                      value={newProduct.gsm}
                      onChange={(e) => setNewProduct({ ...newProduct, gsm: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Selling Price ($)</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Original MSRP ($)</label>
                    <input
                      type="number"
                      value={newProduct.originalPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Product Description</label>
                  <textarea
                    rows={2}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Signature 240 GSM heavyweight combed cotton luxury t-shirt with bio-wash finish..."
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white font-mono resize-none focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono uppercase text-neutral-500 font-semibold">
                      PRODUCT IMAGES (Max 3 Images)
                    </label>
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold tracking-tight border ${
                          uploadedImages.length === 3
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                            : uploadedImages.length > 0
                            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        {uploadedImages.length}/3 images uploaded
                      </span>

                      {uploadedImages.length < 3 && (
                        <button
                          type="button"
                          onClick={() => bulkFileInputRef.current?.click()}
                          className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-mono text-[11px] font-bold transition-colors inline-flex items-center gap-1.5"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Choose Images</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Hidden Multi-file input */}
                  <input
                    ref={bulkFileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleBatchUpload(e.target.files);
                      }
                      e.target.value = '';
                    }}
                    className="hidden"
                    id="bulk-product-images-input"
                  />

                  {/* 3 Horizontal / Responsive Image Upload Boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[0, 1, 2].map((slotIdx) => {
                      const img = uploadedImages[slotIdx];
                      const slotTitles = ['Slot 1 (Cover)', 'Slot 2 (Angle)', 'Slot 3 (Fit/Detail)'];

                      return (
                        <div key={slotIdx} className="flex flex-col">
                          {/* Hidden Individual Slot File Input */}
                          <input
                            ref={slotFileInputRefs[slotIdx]}
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleSlotUpload(e.target.files[0], slotIdx);
                              }
                              e.target.value = '';
                            }}
                            className="hidden"
                            id={`slot-file-input-${slotIdx}`}
                          />

                          {img ? (
                            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-2.5 flex flex-col h-full justify-between">
                              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 group">
                                <img
                                  src={img.url}
                                  alt={`Product image ${slotIdx + 1}`}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />

                                {/* Slot indicator badge */}
                                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-white text-[9px] font-mono uppercase tracking-wider backdrop-blur-sm">
                                  {slotTitles[slotIdx]}
                                </span>

                                {/* Remove Button (X) */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImageIndex(slotIdx)}
                                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-neutral-950/80 text-white hover:bg-red-600 backdrop-blur-sm transition-colors shadow-sm"
                                  title="Remove image"
                                  aria-label={`Remove image in slot ${slotIdx + 1}`}
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Filename display under preview */}
                              <div className="pt-2 px-0.5 flex flex-col">
                                <p
                                  className="text-[11px] font-mono font-bold text-neutral-950 dark:text-white truncate"
                                  title={img.fileName}
                                >
                                  {img.fileName}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => slotFileInputRefs[slotIdx].current?.click()}
                                  className="mt-1 text-[10px] font-mono text-neutral-500 hover:text-neutral-950 dark:hover:text-white text-left inline-flex items-center gap-1 transition-colors"
                                >
                                  <Upload className="w-2.5 h-2.5" />
                                  <span>Change Photo</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                setActiveDragSlot(slotIdx);
                              }}
                              onDragLeave={() => setActiveDragSlot(null)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setActiveDragSlot(null);
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                  handleSlotUpload(e.dataTransfer.files[0], slotIdx);
                                }
                              }}
                              onClick={() => slotFileInputRefs[slotIdx].current?.click()}
                              className={`border-2 border-dashed rounded-xl aspect-square p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                                activeDragSlot === slotIdx
                                  ? 'border-neutral-950 dark:border-white bg-neutral-100 dark:bg-neutral-900'
                                  : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 hover:border-neutral-400 dark:hover:border-neutral-600'
                              }`}
                            >
                              <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 mb-2">
                                <Upload className="w-4 h-4" />
                              </div>
                              <p className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200">
                                + Add {slotTitles[slotIdx].split(' ')[0]}
                              </p>
                              <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
                                Drag & drop or click
                              </p>
                              <span className="mt-2 text-[9px] font-mono uppercase tracking-wider text-neutral-500 bg-neutral-200/60 dark:bg-neutral-800/60 px-1.5 py-0.5 rounded">
                                {slotTitles[slotIdx].split(' ')[1] || 'Photo'}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 mt-2">
                    Supports .jpg, .jpeg, .png, .webp up to 5MB each. First image serves as primary catalog cover.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-mono uppercase text-neutral-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold font-display uppercase tracking-wider text-xs"
                  >
                    Save & Publish Drop
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Change Admin Password Modal */}
        {isChangePasswordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChangePasswordOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md bg-neutral-900 text-white rounded-3xl border border-neutral-800 shadow-2xl p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                      Change Admin Password
                    </h3>
                    <p className="text-[11px] font-mono text-neutral-400">Set a new secret password for store access</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Naya Admin Password (New Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={newAdminPass}
                    onChange={(e) => {
                      setNewAdminPass(e.target.value);
                      setChangePassError('');
                    }}
                    placeholder="Enter new password (min 4 chars)..."
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Password Confirm Karein (Confirm Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmAdminPass}
                    onChange={(e) => {
                      setConfirmAdminPass(e.target.value);
                      setChangePassError('');
                    }}
                    placeholder="Re-enter new password..."
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {changePassError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{changePassError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangePasswordOpen(false);
                      setChangePassError('');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold font-display uppercase tracking-wider text-xs transition-colors cursor-pointer"
                  >
                    Save New Password
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Shipping Slip / Parcel Label Modal */}
      <AnimatePresence>
        {selectedOrderForSlip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderForSlip(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white text-neutral-900 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto z-10 font-mono"
            >
              {/* Slip Header */}
              <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-4">
                <div>
                  <h2 className="text-xl font-black font-display tracking-tight uppercase">ULEF ATELIER</h2>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-600 block">240 GSM Luxury Heavyweight Silhouettes</span>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded bg-neutral-900 text-white text-xs font-bold uppercase">
                    {selectedOrderForSlip.carrier || 'Express Dispatch'}
                  </span>
                  <span className="text-[11px] block mt-1 font-bold">AWB: {selectedOrderForSlip.trackingNumber}</span>
                </div>
              </div>

              {/* Barcode visual representation */}
              <div className="my-4 py-2 px-4 bg-neutral-50 border border-dashed border-neutral-300 rounded-xl text-center space-y-1">
                <div className="text-2xl tracking-[0.3em] font-mono font-bold select-none text-neutral-800">
                  ||||| | |||| || ||| ||||| |||| | |||||
                </div>
                <span className="text-[10px] text-neutral-500 font-bold uppercase">
                  ORDER REF: #{selectedOrderForSlip.id} • AWB: {selectedOrderForSlip.trackingNumber}
                </span>
              </div>

              {/* Sender & Consignee */}
              <div className="grid grid-cols-2 gap-4 border border-neutral-200 rounded-2xl p-4 text-[11px] my-4 bg-neutral-50">
                <div className="border-r border-neutral-200 pr-3 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block">SHIP FROM (Sender):</span>
                  <strong className="block text-neutral-900">ULEF Fulfillment Center</strong>
                  <p className="text-neutral-600 text-[10px] leading-tight">
                    Plot 12, Heavyweight Knitwear Hub, Surat Textile Zone, Gujarat, India - 395002
                  </p>
                  <p className="text-neutral-600 text-[10px]">Contact: +91 93166 14778</p>
                </div>

                <div className="pl-1 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-blue-600 block">SHIP TO (Customer / Pata):</span>
                  <strong className="block text-neutral-900 text-xs">
                    {selectedOrderForSlip.shippingAddress.firstName} {selectedOrderForSlip.shippingAddress.lastName}
                  </strong>
                  <p className="text-neutral-700 text-[10px] leading-tight">
                    {selectedOrderForSlip.shippingAddress.addressLine1}
                    {selectedOrderForSlip.shippingAddress.addressLine2 ? ', ' + selectedOrderForSlip.shippingAddress.addressLine2 : ''}
                  </p>
                  <p className="text-neutral-900 font-bold text-[10px]">
                    {selectedOrderForSlip.shippingAddress.city}, {selectedOrderForSlip.shippingAddress.state} - {selectedOrderForSlip.shippingAddress.postalCode}
                  </p>
                  <p className="text-neutral-900 font-bold text-[10px]">
                    Phone: {selectedOrderForSlip.shippingAddress.phone}
                  </p>
                </div>
              </div>

              {/* Package Content & Payment Mode */}
              <div className="border border-neutral-200 rounded-2xl overflow-hidden my-4 text-[11px]">
                <div className="bg-neutral-100 px-3 py-1.5 font-bold uppercase text-[10px] border-b border-neutral-200 flex justify-between">
                  <span>Ordered Silhouettes</span>
                  <span>Qty / Rate</span>
                </div>
                <div className="divide-y divide-neutral-100 p-2 space-y-1">
                  {selectedOrderForSlip.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px] py-1">
                      <div>
                        <span className="font-bold text-neutral-900 block">{it.product.name}</span>
                        <span className="text-neutral-500">Size {it.selectedSize} • {it.selectedColor.name} • 240 GSM Knit</span>
                      </div>
                      <span className="font-bold text-neutral-900">{it.quantity} x {formatPrice(it.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-neutral-50 p-3 border-t border-neutral-200 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-neutral-400 block">PAYMENT MODE</span>
                    <strong className={`text-xs ${selectedOrderForSlip.paymentMethod === 'cash_on_delivery' ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {selectedOrderForSlip.paymentMethod === 'cash_on_delivery' ? 'CASH ON DELIVERY (COD)' : 'PREPAID'}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-neutral-400 block">
                      {selectedOrderForSlip.paymentMethod === 'cash_on_delivery' ? 'COLLECT FROM CUSTOMER' : 'TOTAL PAID'}
                    </span>
                    <strong className="text-sm font-bold text-neutral-900">{formatPrice(selectedOrderForSlip.total)}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForSlip(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono uppercase text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Parcel Slip</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WhatsApp Drop Broadcast Modal */}
      <AnimatePresence>
        {isBroadcastModalOpen && selectedProductForBroadcast && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBroadcastModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto z-10 font-mono text-xs"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Megaphone className="w-3.5 h-3.5" /> Direct WhatsApp Drop Broadcast
                  </span>
                  <h3 className="text-lg font-bold font-display uppercase tracking-tight text-neutral-950 dark:text-white">
                    Broadcast: {selectedProductForBroadcast.name}
                  </h3>
                </div>
                <button
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-950 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Spotlight & WhatsApp Message */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-5">
                {/* Product Snapshot */}
                <div className="md:col-span-5 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <img
                    src={selectedProductForBroadcast.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85'}
                    alt={selectedProductForBroadcast.name}
                    className="w-full aspect-[4/3] object-cover rounded-xl border border-neutral-200 dark:border-neutral-800"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-neutral-950 dark:text-white">{selectedProductForBroadcast.name}</h4>
                    <p className="text-emerald-500 font-bold text-xs mt-0.5">{formatPrice(selectedProductForBroadcast.price)} • {selectedProductForBroadcast.gsm} GSM</p>
                    <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">{selectedProductForBroadcast.description}</p>
                  </div>

                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const msg = generateNewProductBroadcastMessage(selectedProductForBroadcast, formatPrice);
                        navigator.clipboard.writeText(msg);
                        setCopiedMessage(true);
                        showToast('Message Copied', 'WhatsApp message copied to clipboard!', 'success');
                        setTimeout(() => setCopiedMessage(false), 2500);
                      }}
                      className="w-full py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedMessage ? 'Copied Message!' : 'Copy Message Text'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const msg = generateNewProductBroadcastMessage(selectedProductForBroadcast, formatPrice);
                        sendToWhatsApp(msg);
                      }}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Post to Status / Group</span>
                    </button>
                  </div>
                </div>

                {/* WhatsApp Chat Preview */}
                <div className="md:col-span-7 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" /> Customer WhatsApp Message Preview:
                  </span>
                  <div className="p-4 rounded-2xl bg-[#0b141a] border border-[#202c33] text-[#e9edef] max-h-[310px] overflow-y-auto space-y-2 shadow-inner">
                    <div className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                      {generateNewProductBroadcastMessage(selectedProductForBroadcast, formatPrice)}
                    </div>
                  </div>
                  <p className="text-[10px] text-neutral-400">
                    💡 Customer ko yeh message milega jisme direct buying link aur full fabric description shamil hai.
                  </p>
                </div>
              </div>

              {/* Recipients Section */}
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <strong className="text-neutral-950 dark:text-white uppercase text-xs">
                      Send to Customers ({customerContacts.length} Available)
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const numbers = customerContacts.map(c => c.phone.replace(/[^0-9]/g, '')).filter(Boolean);
                      navigator.clipboard.writeText(numbers.join(', '));
                      setCopiedNumbers(true);
                      showToast('Numbers Copied', `Copied ${numbers.length} customer phone numbers!`, 'success');
                      setTimeout(() => setCopiedNumbers(false), 3000);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-mono text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedNumbers ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumbers ? 'Copied All Numbers!' : 'Copy Numbers (For Broadcast List)'}</span>
                  </button>
                </div>

                {/* Recipient Rows */}
                <div className="max-h-56 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-2 bg-neutral-50 dark:bg-neutral-950">
                  {customerContacts.length === 0 ? (
                    <div className="py-6 text-center text-neutral-400">
                      Koi customer contact nahi mila.
                    </div>
                  ) : (
                    customerContacts.map((c) => {
                      const isSent = !!sentCustomerIds[c.phone];
                      const msg = generateNewProductBroadcastMessage(selectedProductForBroadcast, formatPrice, c.name);
                      const url = getCustomerWhatsAppBroadcastUrl(c.phone, msg);

                      return (
                        <div key={c.id} className="py-2.5 px-2 flex items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-neutral-950 dark:text-white text-xs">{c.name}</strong>
                              <span className="text-[10px] text-neutral-400">({c.source})</span>
                            </div>
                            <span className="text-[11px] text-neutral-500 font-mono">+91 {c.phone}</span>
                          </div>

                          <div>
                            {isSent ? (
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Sent
                              </span>
                            ) : (
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                  setSentCustomerIds(prev => ({ ...prev, [c.phone]: true }));
                                  showToast('WhatsApp Opened', `Sending alert to ${c.name}...`, 'success');
                                }}
                                className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm cursor-pointer"
                              >
                                <Send className="w-3 h-3" />
                                <span>Send</span>
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-4">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold uppercase text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
