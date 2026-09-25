import { Order, CartItem, Product } from '../types';

// Merchant WhatsApp Number & Support Email
export const DEFAULT_MERCHANT_WHATSAPP = '919316614778';
export const MERCHANT_DISPLAY_PHONE = '+91 93166 14778';
export const SUPPORT_EMAIL = 'ulef.in0@gmail.com';

export function getMerchantWhatsAppPhone(): string {
  try {
    const saved = localStorage.getItem('ulef_merchant_whatsapp');
    if (saved && saved.trim()) {
      return saved.replace(/[^0-9]/g, '');
    }
  } catch {
    // fallback
  }
  return DEFAULT_MERCHANT_WHATSAPP;
}

export const MERCHANT_WHATSAPP_PHONE = DEFAULT_MERCHANT_WHATSAPP;

/**
 * Creates formatted WhatsApp message for a completed order
 * Contains: Customer Name, Mobile Number, Delivery Address (Kahan se order kiya hai), T-Shirt Name, Price (Kitne Wali), Size, Color, Qty, Total
 */
export function generateOrderWhatsAppMessage(
  order: Order,
  formatPrice: (price: number) => string
): string {
  const customerName = `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.trim();
  const addressLine1 = order.shippingAddress.addressLine1 || '';
  const addressLine2 = order.shippingAddress.addressLine2 ? ` (${order.shippingAddress.addressLine2})` : '';
  const city = order.shippingAddress.city || '';
  const state = order.shippingAddress.state || '';
  const pincode = order.shippingAddress.postalCode || '';
  const country = order.shippingAddress.country || 'India';

  const fullAddress = `${addressLine1}${addressLine2}, ${city}, ${state} - ${pincode}, ${country}`;

  const isCOD = order.paymentMethod === 'cash_on_delivery';

  const itemsText = order.items
    .map((item, idx) => {
      const itemTotal = formatPrice(item.price * item.quantity);
      const unitPrice = formatPrice(item.price);
      return [
        `👕 *T-Shirt #${idx + 1}:* ${item.product.name}`,
        `   • *Price (Kitne Wali):* ${unitPrice} each (Total: ${itemTotal})`,
        `   • *Size (Konsi Size):* ${item.selectedSize}`,
        `   • *Color (Rang):* ${item.selectedColor.name}`,
        `   • *Quantity (Kitni T-Shirts):* ${item.quantity} Piece`,
        `   • *Fabric Quality:* 240 GSM Luxury Heavyweight Compact Cotton`
      ].join('\n');
    })
    .join('\n\n');

  return [
    `🚨 *NEW ORDER ALERT - ULEF.IN* 🚨`,
    isCOD ? `💵 *PAYMENT: CASH ON DELIVERY (COD)*` : `💳 *PAYMENT: ${order.paymentMethod.replace('_', ' ').toUpperCase()}*`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `📋 *Order ID:* #${order.id}`,
    `📅 *Order Time:* ${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}`,
    `📦 *Order Status:* ${order.status}`,
    ``,
    `👤 *CUSTOMER KI DETAILS (Kis Bande Ne Order Kiya):*`,
    `• *Naam:* ${customerName}`,
    `• *Mobile Nambar:* ${order.shippingAddress.phone}`,
    `• *Email:* ${order.shippingAddress.email}`,
    ``,
    `📍 *KAHAN SE ORDER KIYA HAI (Delivery Address):*`,
    `• *Gali / Flat / Makan:* ${addressLine1}${addressLine2}`,
    `• *Shehar (City):* ${city}`,
    `• *Rajya (State):* ${state}`,
    `• *Pincode:* ${pincode}`,
    `• *Desh (Country):* ${country}`,
    `• *Pura Pata (Full Address):* ${fullAddress}`,
    ``,
    `👕 *KONSE PRODUCT ORDER KIYE HAIN:*`,
    itemsText,
    ``,
    `💰 *BILL SUMMARY & PAYMENT:*`,
    `• *Subtotal:* ${formatPrice(order.subtotal)}`,
    order.discount > 0 ? `• *Discount Applied:* -${formatPrice(order.discount)}` : null,
    `• *Courier Delivery:* ${order.shippingFee === 0 ? 'FREE Express Delivery' : formatPrice(order.shippingFee)}`,
    `• *Total Collectable Amount:* *${formatPrice(order.total)}*`,
    isCOD ? `⚠️ *NOTE:* Customer delivery ke waqt courier boy ko cash dega (COD Amount: ${formatPrice(order.total)})` : `✅ *Payment Status:* ${order.paymentStatus}`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `*Hello ULEF Team,* Yeh order website se place hua hai. Please verify karke delivery partner (Shiprocket/Delhivery) ke through dispatch prepare karein!`
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Creates formatted WhatsApp message for direct product order / inquiry
 */
export function generateProductWhatsAppMessage(
  product: Product,
  selectedSize: string,
  selectedColorName: string,
  quantity: number,
  formatPrice: (price: number) => string
): string {
  const unitPrice = formatPrice(product.price);
  const totalPrice = formatPrice(product.price * quantity);
  return [
    `🛍️ *DIRECT T-SHIRT ORDER - ULEF.IN*`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `👕 *T-Shirt (Konsi T-Shirt):* ${product.name}`,
    `💰 *Price (Kitne Wali):* ${unitPrice} each (Total: ${totalPrice})`,
    `📏 *Size (Konsi Size):* ${selectedSize}`,
    `🎨 *Color:* ${selectedColorName}`,
    `🔢 *Quantity:* ${quantity}`,
    `⚖️ *Fabric:* 240 GSM Luxury Heavyweight Compact Cotton`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `*Customer Details (Kripya apna pata bharein):*`,
    `👤 *Naam (Name):* `,
    `📱 *Mobile Nambar:* `,
    `📍 *Pura Address (Delivery Pata):* `,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `Hello ULEF.IN team, mujhe yeh 240 GSM t-shirt direct order karni hai. Kripya mera order confirm karein aur payment/delivery details share karein!`
  ].join('\n');
}

/**
 * Creates formatted WhatsApp message for entire cart bag
 */
export function generateCartWhatsAppMessage(
  cart: CartItem[],
  total: number,
  formatPrice: (price: number) => string
): string {
  const itemsText = cart
    .map(
      (item, idx) =>
        `👕 *${idx + 1}. ${item.product.name}*\n   • *Size (Konsi Size):* ${item.selectedSize} | *Color:* ${item.selectedColor.name}\n   • *Quantity:* ${item.quantity} x ${formatPrice(item.price)} = *${formatPrice(item.price * item.quantity)}*\n   • *Fabric:* 240 GSM Cotton`
    )
    .join('\n\n');

  return [
    `🛍️ *DIRECT BAG ORDER - ULEF.IN*`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `Total Items: ${cart.length}`,
    ``,
    `👕 *ORDERED T-SHIRTS:*`,
    itemsText,
    ``,
    `💰 *Total Amount (Kitne Ka):* *${formatPrice(total)}*`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `*Customer Details:*`,
    `👤 *Naam (Name):* `,
    `📱 *Mobile Nambar:* `,
    `📍 *Pura Delivery Address:* `,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `Hello ULEF.IN team, I want to order this bag on WhatsApp. Please guide me with payment and delivery confirmation!`
  ].join('\n');
}

/**
 * Constructs universal WhatsApp link using wa.me for instant native opening on mobile and web
 */
export function getWhatsAppUrl(message: string, customPhone?: string): string {
  const phone = customPhone ? customPhone.replace(/[^0-9]/g, '') : getMerchantWhatsAppPhone();
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

/**
 * Creates direct WhatsApp message for customer dispatch/shipping update
 */
export function generateCustomerDispatchWhatsAppMessage(order: Order): string {
  const customerName = `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.trim();
  return [
    `📦 *ULEF.IN - ORDER DISPATCHED & TRACKING DETAILS*`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `Hello *${customerName}*,`,
    `Aapka ULEF 240 GSM Luxury T-shirt order #${order.id} dispatch ho gaya hai!`,
    ``,
    `🚚 *Courier Partner:* ${order.carrier}`,
    `🔢 *AWB / Tracking Number:* ${order.trackingNumber}`,
    `⏳ *Estimated Delivery:* ${order.estimatedDelivery}`,
    order.paymentMethod === 'cash_on_delivery' ? `💵 *Amount to Pay on Delivery (COD):* ${order.total}` : `✅ *Payment:* Paid`,
    ``,
    `📍 *Delivery Address:* ${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `Track your shipment on our website or reply here if you have any questions. Thank you for choosing ULEF!`
  ].join('\n');
}

/**
 * Helper to get direct support WhatsApp link
 */
export function getSupportWhatsAppUrl(subject = 'Customer Support Inquiry'): string {
  const msg = `Hello ULEF.IN Support Team,\nI have an inquiry regarding: ${subject}.\nPlease assist me!`;
  return getWhatsAppUrl(msg);
}

/**
 * Safely dispatches WhatsApp link directly
 */
export function sendToWhatsApp(message: string, customPhone?: string): void {
  const targetUrl = customPhone ? `https://wa.me/${customPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}` : getWhatsAppUrl(message);

  try {
    const link = document.createElement('a');
    link.href = targetUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 250);
  } catch {
    try {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('WhatsApp dispatch fallback:', err);
    }
  }
}

/**
 * Creates promotional broadcast WhatsApp message for new drops / products
 */
export function generateNewProductBroadcastMessage(
  product: Product,
  formatPrice: (price: number) => string,
  customerName?: string,
  storeUrl?: string
): string {
  const greeting = customerName ? `Hello ${customerName}! ✨` : `Hello Valued Customer! ✨`;
  const colorsText = product.colors.map(c => c.name).join(', ') || 'Signature Colorways';
  const siteUrl = storeUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://ulef.in');

  return [
    `🔥 *NEW LUXURY DROP ALERT - ULEF.IN* 🔥`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    greeting,
    `We just dropped an exclusive new architectural silhouette in our luxury streetwear collection:`,
    ``,
    `👕 *Product:* *${product.name}*`,
    `💰 *Exclusive Price:* *${formatPrice(product.price)}* ${product.originalPrice ? `~(MSRP: ${formatPrice(product.originalPrice)})~` : ''}`,
    `⚖️ *Fabric:* 240 GSM Signature Heavyweight Bio-Wash Cotton`,
    `✂️ *Fit Style:* ${product.fitType || 'Boxy Drop-Shoulder Oversized'}`,
    `🎨 *Available Colors:* ${colorsText}`,
    `📏 *Sizes:* XS, S, M, L, XL, XXL, XXXL`,
    ``,
    `📝 *Description & Features:*`,
    `${product.description}`,
    ``,
    `✨ *Signature Craftsmanship:*`,
    `• 100% Combed Compact Cotton with zero linting`,
    `• Anti-bacon reinforced high-density neck collar`,
    `• Pre-shrunk architectural boxy drape`,
    ``,
    `🛒 *Order Online (Cash on Delivery & Instant UPI Available):*`,
    `${siteUrl}`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `⚠️ *Limited Edition Drop:* Only limited units crafted per batch. Reply directly to this WhatsApp message to reserve your size before it sells out!`
  ].join('\n');
}

/**
 * Direct WhatsApp URL targeted to a specific customer's phone number
 */
export function getCustomerWhatsAppBroadcastUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const withCountryCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(message)}`;
}

/**
 * Creates friendly review request message to send to buyers via WhatsApp
 */
export function generateReviewRequestWhatsAppMessage(
  customerName: string,
  productName: string,
  storeUrl?: string
): string {
  const siteUrl = storeUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://ulef.in');
  return [
    `✨ *ULEF ATELIER - CLIENT REVIEW & FIT FEEDBACK* ✨`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `Namaste ${customerName || 'Valued Client'}! 🙏`,
    ``,
    `Hum umeed karte hain ki aapko aapka *${productName}* bohot pasand aaya hoga! Hamara 240 GSM heavyweight combed cotton luxury silhouette standard ke hisaab se craft kiya gaya hai.`,
    ``,
    `🌟 *Aapka Experience Kaisa Raha?*`,
    `Aapke 30 seconds hamare craftsmanship ko evaluate karne mein bohot keemti hain:`,
    `• Fabric ka weight (240 GSM) aur collar fit kaisa laga?`,
    `• Oversized silhouette drape aapke liye kaisa raha?`,
    ``,
    `⭐ *Store par apna Review & Rating share karein:*`,
    `${siteUrl}`,
    ``,
    `Aap chahein toh seedhe isi WhatsApp chat par photo ya 1-line feedback reply kar sakte hain. Thank you for choosing ULEF! 🖤`
  ].join('\n');
}


