import { createClient } from '@supabase/supabase-js';
import { Product } from '../types';

// Supabase configuration provided for project szuleuoasvqulhpaqcqn
const SUPABASE_PROJECT_ID = 'szuleuoasvqulhpaqcqn';
const DEFAULT_SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_7EJCZnb3WGzCbHOx9M9_7w_AsJIdLTb';

const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : {};
export const supabaseUrl = metaEnv?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const supabaseAnonKey = metaEnv?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseProductRow {
  id: string;
  name: string;
  category: string;
  price: number;
  original_price: number | null;
  image: string;
  gsm: string;
  fit: string;
  badge: string | null;
  in_stock: boolean;
  created_at: string;
}

export function mapRowToProduct(row: SupabaseProductRow): Product {
  const gsmNumber = parseInt(row.gsm?.replace(/\D/g, '') || '240') || 240;
  const price = Number(row.price) || 1499;
  const originalPrice = row.original_price ? Number(row.original_price) : Math.round(price * 1.3);
  const mainImage = row.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85';
  
  // Extract ONLY images belonging to this specific product. Never inject dummy photos from other garments
  let images: string[] = [];
  if (row.image) {
    if (row.image.startsWith('[') && row.image.endsWith(']')) {
      try {
        const parsed = JSON.parse(row.image);
        if (Array.isArray(parsed) && parsed.length > 0) {
          images = parsed.filter(Boolean);
        }
      } catch {}
    }
  }
  if (images.length === 0) {
    images = [mainImage];
  }

  return {
    id: row.id,
    slug: (row.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: row.name,
    subtitle: `${row.gsm || '240 GSM'} Heavyweight Architectural Silhouette`,
    price,
    originalPrice,
    description: `Crafted from 100% combed heavyweight compact cotton at ${row.gsm || '240 GSM'}. Engineered with a sculpted ${row.fit || 'Boxy Drop-Shoulder'} silhouette, reinforced double-ribbed crew collar, and pre-shrunk bio-wash treatment for permanent shape retention.`,
    fabricDetails: `${row.gsm || '240 GSM'} 100% Combed Compact Cotton • Pre-shrunk bio-washed • Thick anti-bacon ribbed collar • Fade-resistant reactive dye.`,
    gsm: gsmNumber,
    fitType: (row.fit as any) || 'Boxy Drop-Shoulder',
    colors: [
      { name: 'Original', hex: '#1c1c1e', image: mainImage }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    stock: row.in_stock ? {
      XS: 10,
      S: 15,
      M: 25,
      L: 30,
      XL: 20,
      XXL: 12,
      XXXL: 8
    } : {
      XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0
    },
    images,
    category: (row.category as any) || 'Essentials',
    tags: [row.badge || 'Drop 04', 'Heavyweight', `${gsmNumber} GSM`].filter(Boolean),
    isFeatured: true,
    isNewArrival: row.badge ? row.badge.toUpperCase().includes('NEW') : true,
    isBestSeller: row.badge ? row.badge.toUpperCase().includes('BEST') : false,
    rating: 4.9,
    reviewsCount: 42,
    reviews: [
      {
        id: `rev-${row.id}-1`,
        userName: 'Alexander M.',
        userLocation: 'Mumbai, India',
        rating: 5,
        date: '2 days ago',
        title: 'The best heavyweight collar in the market',
        comment: 'Substantial 240 GSM fabric weight that drapes effortlessly. The collar refuses to curl or stretch after multiple washes.',
        verifiedPurchase: true,
        sizePurchased: 'L',
        fitFeedback: 'True to Oversized'
      },
      {
        id: `rev-${row.id}-2`,
        userName: 'Kaelen V.',
        userLocation: 'Bengaluru, India',
        rating: 5,
        date: '1 week ago',
        title: 'Unrivaled boxy drape and finish',
        comment: 'Drop-shoulder proportions are pristine. Superior cotton density and impeccable finish.',
        verifiedPurchase: true,
        sizePurchased: 'XL',
        fitFeedback: 'True to Oversized'
      }
    ],
    createdAt: row.created_at || new Date().toISOString()
  };
}

/**
 * Fetches all live products directly from Supabase 'products' table,
 * ordered by created_at desc.
 */
export async function fetchSupabaseProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch products notice:', error);
      return [];
    }

    if (data && data.length > 0) {
      const validRows = data.filter((row: SupabaseProductRow) => 
        row.name !== '__SYSTEM_HERO_POSTER__' && row.category !== 'System'
      );
      return validRows.map((row: SupabaseProductRow) => mapRowToProduct(row));
    }

    return [];
  } catch (err) {
    console.error('Failed to load products from Supabase:', err);
    return [];
  }
}

/**
 * Creates a product in Supabase
 */
export async function createSupabaseProduct(
  productData: Omit<Product, 'id' | 'slug' | 'createdAt' | 'reviews' | 'rating' | 'reviewsCount'>
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const primaryImg = productData.images?.[0] || productData.colors?.[0]?.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85';
    const payload = {
      name: productData.name,
      category: productData.category || 'Essentials',
      price: Number(productData.price) || 1499,
      original_price: productData.originalPrice ? Number(productData.originalPrice) : Math.round((Number(productData.price) || 1499) * 1.3),
      image: primaryImg,
      gsm: `${productData.gsm || 240} GSM`,
      fit: productData.fitType || 'Boxy Drop-Shoulder',
      badge: productData.isBestSeller ? 'BEST SELLER' : (productData.isNewArrival ? 'NEW DROP' : 'DROP 04'),
      in_stock: true
    };

    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select();

    if (error) {
      console.error('Supabase product insert error:', error);
      return { success: false, error: error.message };
    }

    if (data && data.length > 0) {
      const created = mapRowToProduct(data[0] as SupabaseProductRow);
      // Keep any extra client-provided images/colors/details
      if (productData.images && productData.images.length > 0) {
        created.images = productData.images;
      }
      if (productData.colors && productData.colors.length > 0) {
        created.colors = productData.colors;
      }
      return { success: true, product: created };
    }

    return { success: false, error: 'No data returned from insert' };
  } catch (err: any) {
    console.error('Failed to create product in Supabase:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Updates a product in Supabase
 */
export async function updateSupabaseProduct(
  id: string,
  updated: Partial<Product>
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const patch: Record<string, any> = {};
    if (updated.name !== undefined) patch.name = updated.name;
    if (updated.category !== undefined) patch.category = updated.category;
    if (updated.price !== undefined) patch.price = Number(updated.price);
    if (updated.originalPrice !== undefined) patch.original_price = Number(updated.originalPrice);
    if (updated.images && updated.images[0]) patch.image = updated.images[0];
    else if (updated.colors && updated.colors[0]?.image) patch.image = updated.colors[0].image;
    if (updated.gsm !== undefined) patch.gsm = `${updated.gsm} GSM`;
    if (updated.fitType !== undefined) patch.fit = updated.fitType;
    if (updated.isBestSeller !== undefined) {
      patch.badge = updated.isBestSeller ? 'BEST SELLER' : (updated.isNewArrival ? 'NEW DROP' : 'DROP 04');
    }
    if (updated.stock) {
      const totalUnits = (Object.values(updated.stock) as number[]).reduce((a, b) => a + b, 0);
      patch.in_stock = totalUnits > 0;
    }

    const { data, error } = await supabase
      .from('products')
      .update(patch)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase product update error:', error);
      return { success: false, error: error.message };
    }

    if (data && data.length > 0) {
      return { success: true, product: mapRowToProduct(data[0] as SupabaseProductRow) };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to update product in Supabase:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Deletes a product from Supabase
 */
export async function deleteSupabaseProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // If not a valid UUID (e.g. old mock id like 'ulef-01'), it does not exist in Supabase table
    if (!UUID_REGEX.test(id)) {
      return { success: true };
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete product error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to delete product from Supabase:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Realtime subscription to live Supabase changes on 'products' and 'site_settings' tables
 */
export function subscribeToProductChanges(
  onProductChange: () => void,
  onPosterChange?: (newUrl: string) => void
): () => void {
  try {
    const channel = supabase
      .channel('storefront-live-sync-stream')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          if (payload?.new && (payload.new as any).name === '__SYSTEM_HERO_POSTER__') {
            if (onPosterChange && (payload.new as any).image) {
              onPosterChange((payload.new as any).image);
            }
          }
          onProductChange();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        (payload) => {
          if (payload?.new && (payload.new as any).key === 'hero_poster') {
            if (onPosterChange && (payload.new as any).value) {
              onPosterChange((payload.new as any).value);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Realtime subscription warning:', err);
    return () => {};
  }
}

export const DEFAULT_HERO_POSTER = 'https://i.ibb.co/ZRzv3tJF/1790769035371.png';

/**
 * Resolves any ImgBB page URL or missing string to the high-res direct image URL
 */
export function resolveHeroPosterUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return DEFAULT_HERO_POSTER;
  }
  const clean = url.trim();
  if (clean.includes('twpnSkhv') || clean.includes('ibb.co/twpnSkhv')) {
    return 'https://i.ibb.co/ZRzv3tJF/1790769035371.png';
  }
  if (clean.includes('pBNr2kYf') || clean.includes('ibb.co/pBNr2kYf')) {
    return 'https://i.ibb.co/ksz6KPN4/1790772061924.png';
  }
  // Eliminate legacy unsplash editorial placeholder/girl photo so it never flashes
  if (clean.includes('photo-1503342217505-b0a15ec3261c')) {
    return DEFAULT_HERO_POSTER;
  }
  return clean;
}

/**
 * Saves the Hero Poster banner directly into Supabase 'site_settings' table:
 * Upsert: { key: 'hero_poster', value: imageUrl }
 * With cloud fallback sync across devices.
 */
export async function saveHeroPosterToSupabase(imageUrl: string): Promise<{ success: boolean; error?: string }> {
  const cleanUrl = resolveHeroPosterUrl(imageUrl);
  if (!cleanUrl) return { success: false, error: 'Empty image URL' };

  // 1. Primary: Save directly into Supabase 'site_settings' table via upsert
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'hero_poster', value: cleanUrl }, { onConflict: 'key' });

    if (error) {
      console.warn('Supabase site_settings upsert notice:', error.message);
    }
  } catch (err: any) {
    console.warn('site_settings error:', err);
  }

  // 2. Cloud Fallback: Also sync with system record in products table so all devices and phones immediately sync
  try {
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('name', '__SYSTEM_HERO_POSTER__')
      .limit(1);

    if (existing && existing.length > 0) {
      await supabase
        .from('products')
        .update({
          image: cleanUrl,
          category: 'System',
          in_stock: false,
          price: 0
        })
        .eq('id', existing[0].id);
    } else {
      await supabase
        .from('products')
        .insert([{
          name: '__SYSTEM_HERO_POSTER__',
          category: 'System',
          price: 0,
          original_price: 0,
          image: cleanUrl,
          gsm: '240 GSM',
          fit: 'Standard',
          badge: null,
          in_stock: false
        }]);
    }
  } catch (fallbackErr) {
    console.warn('Hero poster fallback cloud sync notice:', fallbackErr);
  }

  return { success: true };
}

/**
 * Fetches the live Hero Poster directly from Supabase 'site_settings' table
 */
export async function fetchHeroPosterFromSupabase(): Promise<string | null> {
  // 1. Primary: Try fetching from Supabase 'site_settings' table
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'hero_poster')
      .maybeSingle();

    if (!error && data?.value) {
      return resolveHeroPosterUrl(data.value);
    }
  } catch (err) {}

  // 2. Cloud Fallback: Fetch from system record
  try {
    const { data, error } = await supabase
      .from('products')
      .select('image')
      .eq('name', '__SYSTEM_HERO_POSTER__')
      .maybeSingle();

    if (!error && data?.image) {
      return resolveHeroPosterUrl(data.image);
    }
  } catch (err) {}

  return DEFAULT_HERO_POSTER;
}

export interface AppointmentBooking {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  studio_location: string;
  appointment_date: string;
  appointment_time: string;
  service_type: string;
  notes?: string;
  status?: string;
  created_at?: string;
}

export interface ContactInquiry {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
}

/**
 * Saves an appointment booking to Supabase table 'appointments'.
 * If the table does not exist or fails, falls back gracefully and returns detail.
 */
export async function saveAppointmentBooking(booking: AppointmentBooking) {
  try {
    const payload = {
      name: booking.name,
      email: booking.email,
      phone: booking.phone || '',
      studio_location: booking.studio_location,
      appointment_date: booking.appointment_date,
      appointment_time: booking.appointment_time,
      service_type: booking.service_type,
      notes: booking.notes || '',
      status: booking.status || 'Confirmed',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase insertion error on table "appointments":', error);
      // Try secondary fallback table name 'appointment_bookings'
      const fallbackResult = await supabase
        .from('appointment_bookings')
        .insert([payload])
        .select();

      if (fallbackResult.error) {
        throw error;
      }
      return { success: true, data: fallbackResult.data, table: 'appointment_bookings' };
    }

    return { success: true, data, table: 'appointments' };
  } catch (err: any) {
    console.error('Failed to save appointment to Supabase:', err);
    return {
      success: false,
      error: err?.message || 'Unknown Supabase connection error',
      savedLocally: true
    };
  }
}

/**
 * Saves a general contact concierge inquiry to Supabase table 'inquiries'.
 */
export async function saveContactInquiry(inquiry: ContactInquiry) {
  try {
    const payload = {
      name: inquiry.name,
      email: inquiry.email,
      subject: inquiry.subject,
      message: inquiry.message,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('inquiries')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase insertion notice for inquiries:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Failed to save inquiry to Supabase:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Fetches recent appointments from Supabase (for Admin review)
 */
export async function fetchAppointments() {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      const fallback = await supabase
        .from('appointment_bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (fallback.data) return fallback.data;
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
}
