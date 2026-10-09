'use client';

import { useCartStore } from '@/store/cartStore';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Lock } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import CustomerLoginPopup from './CustomerLoginPopup';

export default function Cart() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotal } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const proceedToCheckoutPage = () => {
    closeCart();
    window.location.href = '/checkout';
  };

  const handleCheckoutClick = async () => {
    setIsCheckingOut(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setIsCheckingOut(false);
      setShowAuthPopup(true);
      return;
    }

    proceedToCheckoutPage();
  };

  return (
    <>
      <CustomerLoginPopup 
        isOpen={showAuthPopup} 
        onClose={() => setShowAuthPopup(false)} 
        onSuccess={() => {
          setShowAuthPopup(false);
          proceedToCheckoutPage();
        }}
      />
      <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Slide-out panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl z-[101] flex flex-col border-l border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-900">
              <h2 className="text-xl font-bold font-serif text-[#112a46] dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#e2c174]" />
                Your Cart
              </h2>
              <button
                onClick={closeCart}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p>Your cart is empty.</p>
                  <button onClick={closeCart} className="text-[#b39556] font-bold hover:underline">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                      {item.image === '/hero-image.jpeg' || item.image.includes('Dexhaus_icon') ? (
                         <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                           <Image src="/Dexhaus_icon.png" alt="Dexhaus Placeholder" width={40} height={40} className="opacity-20 grayscale dark:invert" />
                        </div>
                      ) : (
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-2 pr-4">{item.title}</h3>
                        <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="font-serif font-bold text-[#112a46] dark:text-[#e2c174] mt-1">
                        ₹{item.price}
                      </div>
                      <div className="flex items-center gap-3 mt-auto">
                        <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-2 text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">₹{getTotal()}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-6 text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600 dark:text-green-500 font-semibold">Free</span>
                </div>
                <div className="flex justify-between font-serif font-bold text-2xl text-[#112a46] dark:text-white mb-6">
                  <span>Total</span>
                  <span>₹{getTotal()}</span>
                </div>
                
                <button
                  onClick={handleCheckoutClick}
                  disabled={isCheckingOut}
                  className="w-full bg-[#0a2540] dark:bg-[#e2c174] text-white dark:text-[#0a2540] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isCheckingOut ? 'PROCESSING...' : 'PROCEED TO CHECKOUT'} <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Secure checkout powered by Stripe
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
