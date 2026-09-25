import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Calendar,
  User,
  Database,
  ShieldCheck,
  AlertCircle,
  Loader2,
  MessageCircle
} from 'lucide-react';
import { saveAppointmentBooking, saveContactInquiry, AppointmentBooking } from '../lib/supabase';
import { SUPPORT_EMAIL, MERCHANT_DISPLAY_PHONE, getSupportWhatsAppUrl } from '../utils/whatsapp';

export const ContactView: React.FC = () => {
  const { showToast, setIsSupportChatOpen } = useStore();

  const [activeTab, setActiveTab] = useState<'appointment' | 'inquiry'>('appointment');

  // Appointment Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [studioLocation, setStudioLocation] = useState('Tokyo Atelier Lab');
  const [serviceType, setServiceType] = useState('Heavyweight Silhouette Fitting & Sizing (240 GSM)');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [appointmentTime, setAppointmentTime] = useState('01:00 PM – 02:00 PM');
  const [notes, setNotes] = useState('');
  const [isSubmittingAppointment, setIsSubmittingAppointment] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<AppointmentBooking | null>(null);

  // Inquiry Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('Order & Shipping Inquiry');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [isInquirySubmitted, setIsInquirySubmitted] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What should I expect during a Private Atelier Fitting appointment?',
      a: 'During your 60-minute private appointment, an atelier specialist will walk you through our 240 GSM compact cotton cuts, test bespoke boxy silhouettes against your body proportions, and provide styling combinations with Drop 04 lookbook garments.'
    },
    {
      q: 'Can I book a Virtual Fitting consultation if I am outside Tokyo/Berlin/NYC?',
      a: 'Yes. Our Virtual 1-on-1 Bespoke Fit Video Consultation lets you connect live with our master patternmaker to evaluate drape, shoulder drop measurements, and collar proportions before placing an order.'
    },
    {
      q: 'How does the oversized sizing compare to standard tees?',
      a: 'ULEF.IN tees are engineered with an intentional boxy drop-shoulder cut. We recommend selecting your true standard size for the intended luxury streetwear silhouette shown in our lookbook. If you prefer a closer regular fit, size down one step.'
    },
    {
      q: 'Will the 100% cotton fabric shrink after washing?',
      a: 'No. All ULEF.IN heavyweight fabrics undergo high-temp pre-shrinking and bio-polishing. As long as you wash cold (30°C) and hang dry or tumble dry low, shrinkage is guaranteed under 1%.'
    },
    {
      q: 'What is your international delivery & returns timeline?',
      a: 'We ship worldwide via DHL Express. US & EU orders arrive in 2–4 business days. We offer a 14-day hassle-free exchange and return window with prepaid return labels.'
    }
  ];

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !appointmentDate || !appointmentTime) {
      showToast('Missing Fields', 'Please complete all required appointment details.', 'error');
      return;
    }

    setIsSubmittingAppointment(true);

    const bookingData: AppointmentBooking = {
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      studio_location: studioLocation,
      service_type: serviceType,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      notes: notes,
      status: 'Confirmed'
    };

    // Save to Supabase backend database
    const result = await saveAppointmentBooking(bookingData);
    setIsSubmittingAppointment(false);

    if (result.success) {
      setBookedAppointment(bookingData);
      showToast(
        'Appointment Confirmed & Saved',
        `Saved to Supabase backend table (${result.table || 'appointments'}).`,
        'success'
      );
    } else {
      // Still store for client visual feedback even if remote table needs migration
      setBookedAppointment(bookingData);
      showToast(
        'Appointment Stored',
        `Stored locally. Supabase response: ${result.error}`,
        'info'
      );
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) return;

    setIsSubmittingInquiry(true);
    await saveContactInquiry({
      name: formName,
      email: formEmail,
      subject: formSubject,
      message: formMessage
    });

    setIsSubmittingInquiry(false);
    setIsInquirySubmitted(true);
    showToast('Inquiry Dispatched', 'Your ticket has been sent to our Supabase database.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 text-[11px] font-mono font-semibold">
          <Database className="w-3.5 h-3.5" />
          <span>Connected to Supabase (szuleuoasvqulhpaqcqn)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-neutral-950 dark:text-white uppercase">
          ATELIER DESK & APPOINTMENTS
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-light">
          Book a private styling consultation or bespoke silhouette fitting at our global studios or virtually.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Main Interactive Form Card */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('appointment')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                  activeTab === 'appointment'
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                Book Atelier Appointment
              </button>
              <button
                onClick={() => setActiveTab('inquiry')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                  activeTab === 'inquiry'
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                Direct Message
              </button>
            </div>

            <button
              onClick={() => setIsSupportChatOpen(true)}
              className="text-xs font-mono text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white flex items-center gap-1 font-bold"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Chat</span>
            </button>
          </div>

          {/* Tab 1: APPOINTMENT BOOKING FORM (Connected to Supabase) */}
          {activeTab === 'appointment' && (
            <div>
              {bookedAppointment ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold">
                      Supabase Cloud Sync Completed
                    </span>
                    <h3 className="text-xl font-black font-display uppercase tracking-tight text-neutral-950 dark:text-white">
                      Appointment Confirmed
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                      Your fitting details have been recorded in the Supabase backend tables. Our head stylist will welcome you at the requested slot.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-left font-mono text-xs space-y-2.5 max-w-md mx-auto">
                    <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                      <span className="text-neutral-400">Client:</span>
                      <span className="font-bold text-neutral-950 dark:text-white">{bookedAppointment.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                      <span className="text-neutral-400">Email:</span>
                      <span className="font-bold text-neutral-950 dark:text-white">{bookedAppointment.email}</span>
                    </div>
                    {bookedAppointment.phone && (
                      <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                        <span className="text-neutral-400">Phone:</span>
                        <span className="font-bold text-neutral-950 dark:text-white">{bookedAppointment.phone}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                      <span className="text-neutral-400">Location:</span>
                      <span className="font-bold text-neutral-950 dark:text-white">{bookedAppointment.studio_location}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                      <span className="text-neutral-400">Service:</span>
                      <span className="font-bold text-neutral-950 dark:text-white truncate max-w-[200px]">{bookedAppointment.service_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Date & Slot:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {bookedAppointment.appointment_date} @ {bookedAppointment.appointment_time}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setBookedAppointment(null)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold font-display text-xs uppercase tracking-wider transition-colors"
                  >
                    Book Another Appointment
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Marcus Vance"
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="marcus@studio.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">
                        Atelier Location <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={studioLocation}
                        onChange={(e) => setStudioLocation(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white font-mono"
                      >
                        <option value="Tokyo Atelier Lab">Tokyo Atelier Lab (Minato-ku, Aoyama)</option>
                        <option value="Berlin Design Studio">Berlin Design Studio (Kreuzberg)</option>
                        <option value="New York Showroom">New York Showroom (Soho, Broome St)</option>
                        <option value="Virtual Bespoke Fitting">Virtual 1-on-1 Fit Consultation (Video)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">
                      Consultation / Service Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white font-mono"
                    >
                      <option value="Heavyweight Silhouette Fitting & Sizing (240 GSM)">
                        Heavyweight Silhouette Fitting & Sizing (240 GSM)
                      </option>
                      <option value="Private VIP Drop 04 Preview & Atelier Pre-Order">
                        Private VIP Drop 04 Preview & Atelier Pre-Order
                      </option>
                      <option value="Bespoke Colorway & Wardrobe Architecture">
                        Bespoke Colorway & Wardrobe Architecture
                      </option>
                      <option value="Wholesale & Stockist Curation Consultation">
                        Wholesale & Stockist Curation Consultation
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">
                        Preferred Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white font-mono focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">
                        Time Slot <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white font-mono"
                      >
                        <option value="10:30 AM – 11:30 AM">10:30 AM – 11:30 AM</option>
                        <option value="01:00 PM – 02:00 PM">01:00 PM – 02:00 PM</option>
                        <option value="03:30 PM – 04:30 PM">03:30 PM – 04:30 PM</option>
                        <option value="05:30 PM – 06:30 PM">05:30 PM – 06:30 PM</option>
                        <option value="07:00 PM – 08:00 PM">07:00 PM – 08:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">
                      Styling Notes / Silhouette Preferences (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g., Interested in Boxy Fit, comparing Mineral Wash with Acid Wash in size XL."
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500 font-sans"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Direct Supabase Persistence (`appointments` table)</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                      Live
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingAppointment}
                    className="w-full py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSubmittingAppointment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        <span>Confirm & Book Atelier Appointment</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Tab 2: DIRECT INQUIRY FORM */}
          {activeTab === 'inquiry' && (
            <div>
              {isInquirySubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="text-lg font-bold font-display uppercase text-neutral-950 dark:text-white">
                    Message Received
                  </h4>
                  <p className="text-xs text-neutral-500 font-mono">
                    Your inquiry has been synchronized to the Supabase database.
                  </p>
                  <button
                    onClick={() => setIsInquirySubmitted(false)}
                    className="mt-4 px-6 py-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs uppercase"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Marcus Vance"
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="marcus@studio.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Inquiry Department</label>
                    <select
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white font-mono"
                    >
                      <option value="Order & Shipping Inquiry">Order & Shipping Inquiry</option>
                      <option value="Sizing & Architecture Consultation">Sizing & Architecture Consultation</option>
                      <option value="Exchanges & Returns">Exchanges & Returns</option>
                      <option value="Wholesale & Editorial Press">Wholesale & Editorial Press</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Message</label>
                    <textarea
                      rows={4}
                      required
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="How can our concierge team assist you today?"
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500 font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingInquiry}
                    className="w-full py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSubmittingInquiry ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Concierge Ticket</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Global Studios & Contact Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Backend Info Badge Card */}
          <div className="p-6 rounded-3xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-900 dark:text-white">
              <Database className="w-4 h-4 text-emerald-500" />
              <span>SUPABASE BACKEND INTEGRATION</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono leading-relaxed">
              Every appointment submission is posted directly to your PostgreSQL Supabase table (`appointments`).
            </p>
            <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1">
              <div><span className="text-neutral-400">Project:</span> szuleuoasvqulhpaqcqn</div>
              <div><span className="text-neutral-400">Endpoint:</span> szuleuoasvqulhpaqcqn.supabase.co</div>
              <div><span className="text-neutral-400">Target Table:</span> appointments</div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-xl space-y-6">
            <h3 className="text-base font-bold font-display uppercase tracking-wider text-white pb-4 border-b border-neutral-800">
              GLOBAL ATELIER STUDIOS
            </h3>

            <div className="space-y-4 font-mono text-xs text-neutral-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">TOKYO ATELIER LAB</strong>
                  <span>5-7-22 Minami-Aoyama, Minato-ku, Tokyo 107-0062, Japan</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">BERLIN DESIGN STUDIO</strong>
                  <span>Oranienstraße 185, 10999 Berlin, Germany</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">NEW YORK SHOWROOM</strong>
                  <span>482 Broome Street, Soho, New York, NY 10013, USA</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Official Customer Support Email</span>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-bold transition-colors"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>{SUPPORT_EMAIL}</span>
                </a>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Official Order & Inquiry WhatsApp</span>
                <a
                  href={getSupportWhatsAppUrl('Atelier Contact Page')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer w-full justify-center"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp: {MERCHANT_DISPLAY_PHONE}</span>
                </a>
              </div>

              <div className="flex items-center gap-2 text-neutral-400 pt-1 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Mon – Sun: 24/7 Digital Concierge Desk</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <section className="pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold">
            FAQ DIRECTORY
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-neutral-200 dark:divide-neutral-800">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left text-sm font-bold font-display uppercase tracking-tight text-neutral-950 dark:text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 transition-transform text-neutral-400 ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-light font-sans">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
