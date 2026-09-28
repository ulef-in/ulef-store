/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { QuickViewModal } from './components/QuickViewModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { CustomerSupportChat } from './components/CustomerSupportChat';
import { Toast } from './components/Toast';

// Views
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderConfirmationView } from './views/OrderConfirmationView';
import { AdminView } from './views/AdminView';
import { LookbookView } from './views/LookbookView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { WishlistView } from './views/WishlistView';

import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const { activeView } = useStore();

  // Scroll to top whenever the active view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  const renderCurrentView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order-confirmation':
        return <OrderConfirmationView />;
      case 'admin':
        return <AdminView />;
      case 'lookbook':
        return <LookbookView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'order-tracking':
        return <OrderTrackingView />;
      case 'wishlist':
        return <WishlistView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full max-w-[100vw] overflow-x-hidden bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900 transition-colors duration-200">
      {/* Universal Header */}
      <Header />

      {/* Main Dynamic View with Smooth Fade/Slide Animation */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-full overflow-x-hidden"
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Universal Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <CartDrawer />
      <SearchModal />
      <AuthModal />
      <QuickViewModal />
      <SizeGuideModal />
      <CustomerSupportChat />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
