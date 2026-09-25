import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShieldCheck, UserCheck, Lock, Mail, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, currentUser, login, logout, setActiveView, verifyAdminPassword, showToast } = useStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [adminKey, setAdminKey] = useState('');
  const [authError, setAuthError] = useState('');

  if (!isAuthOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setAuthError('');

    if (role === 'admin') {
      const ok = verifyAdminPassword(adminKey);
      if (!ok) {
        setAuthError('Galat admin password! Sirf authorized store owner hi Brand Admin ban sakte hain.');
        return;
      }
    }

    const displayName = name || email.split('@')[0];
    login(email, displayName, role);
    if (role === 'admin') {
      setActiveView('admin');
    }
  };

  const handleDemoCustomer = () => {
    login('marcus@studio.com', 'Marcus Vance', 'customer');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAuthOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-md bg-neutral-900 text-white rounded-2xl border border-neutral-800 shadow-2xl p-6 sm:p-8"
        >
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                ULEF.IN Member Portal
              </span>
              <h3 className="text-xl font-bold font-display tracking-tight text-white mt-0.5">
                {currentUser ? 'ACCOUNT PROFILE' : isRegister ? 'CREATE ACCOUNT' : 'CLIENT SIGN IN'}
              </h3>
            </div>
            <button
              onClick={() => setIsAuthOpen(false)}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {currentUser ? (
            <div className="py-6 space-y-6">
              <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center text-lg font-bold font-display text-white">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{currentUser.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                      currentUser.role === 'admin' ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-700 text-neutral-200'
                    }`}>
                      {currentUser.role}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400">{currentUser.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                {currentUser.role === 'admin' ? (
                  <button
                    onClick={() => {
                      setActiveView('admin');
                      setIsAuthOpen(false);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" /> Open Brand Admin Panel
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveView('admin');
                      setIsAuthOpen(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400/50 text-amber-400 text-xs font-mono flex items-center justify-center gap-2 transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5" /> Owner / Admin Portal Access
                  </button>
                )}
                <button
                  onClick={() => {
                    setActiveView('order-tracking');
                    setIsAuthOpen(false);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  Track Past Orders
                </button>
                <button
                  onClick={() => {
                    setActiveView('wishlist');
                    setIsAuthOpen(false);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  View Curated Wishlist
                </button>
                <button
                  onClick={logout}
                  className="w-full py-2.5 px-4 rounded-xl border border-red-900/60 hover:bg-red-950/40 text-red-400 text-xs font-semibold uppercase tracking-wider transition-colors mt-2"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="py-6 space-y-4">
              {/* Fast 1-click Demo Login shortcuts */}
              <div className="p-3 rounded-xl bg-neutral-800/40 border border-neutral-700/60 mb-4">
                <div className="text-[11px] font-medium text-neutral-400 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Instant Quick Demo Access:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('admin');
                      setEmail('admin@ulef.in');
                      setName('Store Owner');
                    }}
                    className="py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 hover:text-amber-300 text-xs font-mono font-semibold border border-neutral-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Owner Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDemoCustomer}
                    className="py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-mono font-semibold border border-neutral-700 transition-colors"
                  >
                    Demo Customer
                  </button>
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alexander Vance"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@atelier.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('customer');
                      setAuthError('');
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      role === 'customer'
                        ? 'bg-white text-neutral-950 border-white'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('admin');
                      setAuthError('');
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      role === 'admin'
                        ? 'bg-amber-400 text-neutral-950 border-amber-400'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                    }`}
                  >
                    Brand Admin
                  </button>
                </div>
              </div>

              {role === 'admin' && (
                <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Admin Security Password Required</span>
                  </div>
                  <input
                    type="password"
                    required
                    value={adminKey}
                    onChange={(e) => {
                      setAdminKey(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="Enter admin password (default: admin123)..."
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-neutral-400 block font-mono">
                    Owner access is protected to prevent customers from editing prices or inventory.
                  </span>
                </div>
              )}

              {authError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-bold font-display uppercase tracking-wider text-xs transition-colors"
              >
                {isRegister ? 'Create Luxury Account' : 'Sign In To ULEF.IN'}
              </button>

              <div className="text-center pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-xs text-neutral-400 hover:text-white transition-colors block mx-auto"
                >
                  {isRegister ? 'Already an insider? Sign In' : 'New to ULEF.IN? Create an Account'}
                </button>
                <div className="pt-2 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('admin');
                      setIsAuthOpen(false);
                    }}
                    className="text-[11px] font-mono text-neutral-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Store Owner? Go to Admin Portal</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
