import { createClient } from '@supabase/supabase-js';

// Supabase configuration provided for project szuleuoasvqulhpaqcqn
const SUPABASE_PROJECT_ID = 'szuleuoasvqulhpaqcqn';
const DEFAULT_SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_7EJCZnb3WGzCbHOx9M9_7w_AsJIdLTb';

const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : {};
export const supabaseUrl = metaEnv?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const supabaseAnonKey = metaEnv?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
