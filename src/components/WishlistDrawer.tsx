'use client';

import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistDrawer() {
  const { items, isOpen, closeWishlist, removeItem } = useWishlistStore();
  const addItemToCart = useCartStore((state) => state.addItem);

  const handleMoveToCart = (item: { id: string | number; title: string; price: number; image: string }) => {
    addItemToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
    });
    removeItem(item.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWishlist}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[110]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl z-[111] flex flex-col border-l border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-900 bg-[#F8F5ED]/40 dark:bg-slate-900/50">
              <h2 className="text-xl font-bold font-serif text-[#102F43] dark:text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#C9A45C] fill-current" />
                Saved Solutions ({items.length})
              </h2>
              <button
                onClick={closeWishlist}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors"
                aria-label="Close Wishlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                  </div>
                  <h3 className="font-serif font-bold text-slate-700 dark:text-slate-200 text-lg">Your Wishlist is Empty</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                    Save items you want to review later while exploring our curated household problem-solvers.
                  </p>
                  <button
                    onClick={closeWishlist}
                    className="mt-2 px-6 py-2.5 rounded-full bg-[#102F43] text-white text-xs font-bold hover:bg-[#183f5a] transition-colors"
                  >
                    Explore Home Solutions
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 transition-all bg-white dark:bg-slate-900/50"
                  >
                    <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                            {item.category}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                            {item.title}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          title="Remove from wishlist"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="font-serif font-bold text-[#102F43] dark:text-[#C9A45C] mt-1 text-sm">
                        ₹{item.price}
                      </div>
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#102F43] dark:text-[#C9A45C] hover:text-[#C9A45C] transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/50">
                <button
                  onClick={() => {
                    items.forEach((item) => {
                      addItemToCart({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        image: item.image,
                      });
                    });
                    items.forEach((item) => removeItem(item.id));
                  }}
                  className="w-full bg-[#102F43] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#183f5a] transition-colors shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" /> Move All to Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
