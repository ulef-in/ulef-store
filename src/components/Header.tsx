import React, { useState } from 'react';
import { useStore, ViewType } from '../context/StoreContext';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Package,
  Globe,
  Sparkles,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartTotalCount,
    wishlist,
    setIsCartOpen,
    setIsAuthOpen,
    setIsSearchOpen,
    currentUser,
    theme,
    toggleTheme,
    currency,
    setCurrency,
    isAdminAuthenticated
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  const navItems: { label: string; view: ViewType; badge?: string }[] = [
    { label: 'Collections', view: 'shop' },
    { label: 'Lookbook', view: 'lookbook', badge: '04' },
    { label: 'About Atelier', view: 'about' },
    { label: 'Track Order', view: 'order-tracking' },
    { label: 'Contact', view: 'contact' },
  ];

  const currencies: { code: 'INR' | 'USD' | 'EUR' | 'GBP'; label: string; symbol: string }[] = [
    { code: 'INR', label: 'INR (₹)', symbol: '₹' },
    { code: 'USD', label: 'USD ($)', symbol: '$' },
    { code: 'EUR', label: 'EUR (€)', symbol: '€' },
    { code: 'GBP', label: 'GBP (£)', symbol: '£' },
  ];

  const handleNavClick = (view: ViewType) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full max-w-[100vw] overflow-x-hidden transition-colors duration-300">
      {/* Top Luxury Announcement Ticker */}
      <div className="bg-neutral-950 text-neutral-300 dark:bg-black dark:text-neutral-300 text-[11px] font-mono uppercase tracking-widest py-1.5 px-4 border-b border-neutral-800/80 overflow-hidden relative w-full">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="hidden sm:flex items-center gap-2 text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>DROP 04 ARCHITECTURAL OVERSIZED ESSENTIALS</span>
          </div>

          <div className="mx-auto sm:mx-0 flex items-center gap-4">
            <span className="text-white font-medium">
              USE CODE <span className="underline decoration-amber-400 font-bold">ULEF10</span> FOR 10% OFF
            </span>
            <span className="hidden md:inline text-neutral-500">•</span>
            <span className="hidden md:inline text-neutral-400">FREE GLOBAL SHIPPING OVER $100</span>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {currentUser?.role === 'admin' && isAdminAuthenticated ? (
              <button
                onClick={() => setActiveView('admin')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-400/20 text-amber-400 hover:text-amber-300 border border-amber-400/30 text-xs font-mono font-bold transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Mode (Active)</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView('admin')}
                className="flex items-center gap-1.5 text-neutral-400 hover:text-amber-400 font-mono text-[11px] transition-colors"
                title="Store Owner Admin Access"
              >
                <Lock className="w-3 h-3 text-neutral-500" />
                <span>Admin Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white/90 dark:bg-neutral-950/90 glass-nav border-b border-neutral-200 dark:border-neutral-800/80 transition-colors w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* Left Menu / Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-8 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 -ml-1 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Brand Logo */}
            <div
              onClick={() => handleNavClick('home')}
              className="cursor-pointer flex flex-col items-start group select-none shrink-0"
            >
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-display tracking-tight sm:tracking-tighter text-neutral-950 dark:text-white group-hover:opacity-80 transition-opacity">
                  ULEF<span className="text-neutral-400 dark:text-neutral-500">.IN</span>
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.2em] sm:tracking-[0.25em] uppercase text-neutral-500 dark:text-neutral-400 -mt-1 font-semibold">
                HEAVYWEIGHT ATELIER
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`relative py-1 transition-colors hover:text-neutral-950 dark:hover:text-white flex items-center gap-1.5 ${
                    activeView === item.view ? 'text-neutral-950 dark:text-white font-bold' : ''
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950">
                      {item.badge}
                    </span>
                  )}
                  {activeView === item.view && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-950 dark:bg-white"
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 text-neutral-700 dark:text-neutral-300 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 sm:px-3 sm:py-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2 text-xs font-medium"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xl:inline text-neutral-400 font-mono text-[11px]">Search (240 GSM...)</span>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              <AnimatePresence>
                {isCurrencyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-32 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden py-1 z-50"
                  >
                    {currencies.map(curr => (
                      <button
                        key={curr.code}
                        onClick={() => {
                          setCurrency(curr.code);
                          setIsCurrencyDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-xs font-mono flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                          currency === curr.code ? 'font-bold text-neutral-950 dark:text-white bg-neutral-50 dark:bg-neutral-800/50' : 'text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        <span>{curr.label}</span>
                        <span>{curr.symbol}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-800 dark:text-neutral-200 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => setActiveView('wishlist')}
              className="relative p-1.5 sm:p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${wishlist.length > 0 ? 'text-red-500 fill-red-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-red-500 text-white text-[9px] sm:text-[10px] font-bold font-mono flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="relative p-1.5 sm:p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              aria-label="User Account"
            >
              {currentUser ? (
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-display font-bold text-xs flex items-center justify-center ring-1 sm:ring-2 ring-neutral-200 dark:ring-neutral-800">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            {/* Shopping Cart Drawer Trigger (Always fully visible on right edge with bag & count) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative ml-0.5 sm:ml-1 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all flex items-center gap-1.5 sm:gap-2 shadow-sm shrink-0 cursor-pointer active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-mono font-bold">
                {cartTotalCount}
              </span>
              <span className="hidden md:inline text-[11px] font-bold tracking-wider uppercase font-display">
                BAG
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 w-4/5 max-w-sm h-full bg-neutral-950 text-white p-6 flex flex-col justify-between shadow-2xl border-r border-neutral-800"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                  <div>
                    <span className="text-2xl font-black font-display tracking-tight text-white">
                      ULEF<span className="text-neutral-500">.IN</span>
                    </span>
                    <p className="text-[10px] font-mono tracking-widest text-neutral-400">
                      HEAVYWEIGHT ATELIER
                    </p>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="py-6 space-y-4 font-display">
                  <button
                    onClick={() => handleNavClick('home')}
                    className={`w-full text-left text-xl font-bold py-2 tracking-tight transition-colors ${
                      activeView === 'home' ? 'text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    HOME
                  </button>
                  {navItems.map((item) => (
                    <button
                      key={item.view}
                      onClick={() => handleNavClick(item.view)}
                      className={`w-full text-left text-xl font-bold py-2 tracking-tight flex items-center justify-between transition-colors ${
                        activeView === item.view ? 'text-white' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>{item.label.toUpperCase()}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-white text-neutral-950">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                  {currentUser?.role === 'admin' && isAdminAuthenticated ? (
                    <button
                      onClick={() => handleNavClick('admin')}
                      className="w-full text-left text-base font-bold py-2 text-amber-400 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      <span>ADMIN DASHBOARD (UNLOCKED)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavClick('admin')}
                      className="w-full text-left text-sm font-mono py-2 text-neutral-400 hover:text-amber-400 flex items-center gap-2 transition-colors pt-3 border-t border-neutral-800/80 mt-2"
                    >
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Owner / Admin Portal</span>
                    </button>
                  )}
                </nav>
              </div>

              <div className="pt-6 border-t border-neutral-800 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>CURRENCY</span>
                  <div className="flex gap-2">
                    {currencies.map(curr => (
                      <button
                        key={curr.code}
                        onClick={() => setCurrency(curr.code)}
                        className={`px-2 py-1 rounded text-xs ${
                          currency === curr.code ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-400'
                        }`}
                      >
                        {curr.code}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>THEME</span>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-neutral-200"
                  >
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
                    <span>{theme.toUpperCase()}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
