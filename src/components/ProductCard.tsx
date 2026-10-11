'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Video, CheckCircle2 } from 'lucide-react';
import { Product } from '@/store/siteStore';

interface ProductCardProps {
  product: Product;
  wishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
}

export default function ProductCard({
  product,
  wishlisted,
  onToggleWishlist,
  onAddToCart
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && product.hoverVideo) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current && product.hoverVideo) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const isOutOfStock = product.inStock === false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group flex flex-col bg-white dark:bg-slate-900 rounded-[1.75rem] overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
    >
      {/* Visual Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800 m-3 rounded-2xl">
        
        {/* Hover Video Player or Image */}
        {product.hoverVideo && isHovered ? (
          <video
            ref={videoRef}
            src={product.hoverVideo}
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={(isHovered && product.hoverImage) ? product.hoverImage : product.image}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}

        {/* Video Available Badge */}
        {product.hoverVideo && !isHovered && (
          <div className="absolute top-3 left-3 z-20 bg-[#102F43]/85 backdrop-blur-md text-[#C9A45C] text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Video className="w-2.5 h-2.5" /> VIDEO
          </div>
        )}

        {/* Product Badge (e.g. Bestseller) */}
        {product.badge && (!product.hoverVideo || isHovered) && (
          <div className="absolute top-3 left-3 z-20 bg-[#C9A45C] text-[#102F43] text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={onToggleWishlist}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            wishlisted
              ? 'bg-red-50 text-red-500'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-red-500'
          }`}
          title={wishlisted ? 'Remove from saved' : 'Save for later'}
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3 z-10 bg-[#102F43]/80 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
          {product.category}
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-1 pt-2">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm line-clamp-1 mb-1.5" title={product.title}>
          {product.title}
        </h3>

        {/* Household Benefit */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {product.benefit}
        </p>

        {/* Specifications */}
        <div className="text-[11px] text-slate-400 font-mono mb-4 line-clamp-1 border-t border-slate-100 dark:border-slate-800/80 pt-2">
          {product.specs}
        </div>

        {/* Pricing and Cart Action */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Genuine Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif font-bold text-lg text-[#102F43] dark:text-[#C9A45C]">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onAddToCart}
            disabled={isOutOfStock}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              isOutOfStock 
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-[#102F43] dark:bg-[#C9A45C] text-white dark:text-[#102F43] hover:bg-[#183f5a] dark:hover:bg-[#b8924b] active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
