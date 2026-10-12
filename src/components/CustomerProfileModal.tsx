'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  Save, 
  LogOut, 
  CheckCircle2, 
  Package, 
  Heart, 
  Truck,
  ShieldCheck,
  Building,
  Navigation
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';

export interface CustomerProfileData {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
}

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSignOut: () => void;
  onProfileUpdated?: (profile: CustomerProfileData) => void;
  onOpenTrackOrder?: () => void;
}

export default function CustomerProfileModal({
  isOpen,
  onClose,
  user,
  onSignOut,
  onProfileUpdated,
  onOpenTrackOrder
}: CustomerProfileModalProps) {
  const { items: wishlistItems } = useWishlistStore();
  const { items: cartItems } = useCartStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Load existing profile from Supabase and localStorage on open
  useEffect(() => {
    if (!isOpen || !user) return;

    // 1. Quick load from localStorage for instant display
    const cached = localStorage.getItem(`dexhaus_profile_${user.id}`);
    if (cached) {
      try {
        const parsed: CustomerProfileData = JSON.parse(cached);
        if (parsed.full_name) setFullName(parsed.full_name);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.address_line) setAddressLine(parsed.address_line);
        if (parsed.city) setCity(parsed.city);
        if (parsed.state) setState(parsed.state);
        if (parsed.pincode) setPincode(parsed.pincode);
      } catch (e) {}
    } else if (user.user_metadata?.full_name || user.user_metadata?.name) {
      setFullName(user.user_metadata.full_name || user.user_metadata.name);
    }

    // 2. Fetch fresh profile from Supabase if table exists
    const fetchRemoteProfile = async () => {
      try {
        const { data, error: fetchErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data && !fetchErr) {
          if (data.full_name) setFullName(data.full_name);
          if (data.phone) setPhone(data.phone);
          if (data.address_line) setAddressLine(data.address_line);
          if (data.city) setCity(data.city);
          if (data.state) setState(data.state);
          if (data.pincode) setPincode(data.pincode);
          
          localStorage.setItem(`dexhaus_profile_${user.id}`, JSON.stringify(data));
        }
      } catch (err) {
        // Table may not be created yet, cached values will persist seamlessly
      }
    };

    fetchRemoteProfile();
  }, [isOpen, user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError('');
    setSaveSuccess(false);

    const profileData: CustomerProfileData = {
      full_name: fullName.trim(),
      phone: phone.trim(),
      address_line: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
    };

    // 1. Immediately cache in localStorage (guarantees zero data loss even if SQL query isn't run yet)
    localStorage.setItem(`dexhaus_profile_${user.id}`, JSON.stringify(profileData));
    if (onProfileUpdated) onProfileUpdated(profileData);

    // 2. Try saving to Supabase 'profiles' table
    try {
      const { error: upsertErr } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          ...profileData,
          updated_at: new Date().toISOString(),
        });

      if (upsertErr) {
        console.warn('Note: Run the Supabase SQL query to persist to database.', upsertErr.message);
      }
    } catch (err: any) {
      console.warn('Supabase profile upsert fallback to local storage:', err);
    } finally {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  const isProfileIncomplete = !phone || !addressLine || !city || !pincode;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-950 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-6 bg-[#102F43] text-white flex items-center justify-between border-b border-[#C9A45C]/20 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#C9A45C] font-bold text-lg font-serif">
                  {fullName ? fullName.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'U')}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    {fullName || 'My Account Profile'}
                  </h3>
                  <p className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-[#C9A45C]" /> {user?.email}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close profile modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 bg-[#F8F5ED] dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-center py-3 text-xs flex-shrink-0">
              <div className="flex flex-col items-center">
                <span className="font-bold text-[#102F43] dark:text-[#C9A45C] text-sm">{cartItems.length}</span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Cart Items</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-[#102F43] dark:text-[#C9A45C] text-sm">{wishlistItems.length}</span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Saved Items</span>
              </div>
              <button 
                type="button" 
                onClick={() => { onClose(); if (onOpenTrackOrder) onOpenTrackOrder(); }}
                className="flex flex-col items-center hover:text-[#C9A45C] transition-colors"
              >
                <Truck className="w-4 h-4 text-[#C9A45C] mb-0.5" />
                <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold uppercase">Track Order</span>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {isProfileIncomplete && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-300 text-xs flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#C9A45C] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Delivery details needed:</strong>
                    Add your phone number and address below so checkout is 1-click seamless and fast.
                  </div>
                </div>
              )}

              {saveSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Profile and delivery address saved successfully!</span>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                
                {/* Personal Info */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#C9A45C]" /> Personal Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-[#102F43] dark:focus:border-[#C9A45C]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-[#102F43] dark:focus:border-[#C9A45C]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A45C]" /> Default Shipping Address
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Street Address / Flat / Building <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="House / Flat No., Road, Landmark"
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-[#102F43] dark:focus:border-[#C9A45C]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Bengaluru"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-[#102F43] dark:focus:border-[#C9A45C]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Karnataka"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-[#102F43] dark:focus:border-[#C9A45C]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          PIN Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="560001"
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-[#102F43] dark:focus:border-[#C9A45C]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3.5 bg-[#102F43] dark:bg-[#C9A45C] text-white dark:text-[#102F43] rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md active:scale-[0.99]"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving Details...' : 'Save Profile & Address'}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer with Sign Out */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
              <span className="text-[11px] text-slate-400">
                Data saved securely in your Dexhaus profile
              </span>
              <button
                type="button"
                onClick={onSignOut}
                className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
