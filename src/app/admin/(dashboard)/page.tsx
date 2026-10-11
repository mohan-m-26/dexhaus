'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  PlusCircle, 
  ExternalLink, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  ShoppingCart,
  TrendingUp
} from 'lucide-react';
import { useSiteStore } from '@/store/siteStore';

export default function DashboardPage() {
  const { products, heroConfig } = useSiteStore();

  const inStockCount = products.filter(p => p.inStock !== false).length;
  const videoHoverCount = products.filter(p => !!p.hoverVideo).length;
  const categoriesCount = new Set(products.map(p => p.category)).size;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-[#102F43] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl border border-[#C9A45C]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A45C]/15 rounded-full blur-[90px] pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A45C] text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" /> Integrated Master Control
          </div>
          <h2 className="text-3xl font-bold font-serif mb-2 text-white">
            Dexhaus Storefront Management
          </h2>
          <p className="text-sm text-slate-200 font-light leading-relaxed">
            Manage starting header video and photos, add curated products with hover videos and category controls, and watch your changes reflect live on the storefront.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/admin/hero"
              className="px-4 py-2.5 rounded-xl bg-[#C9A45C] text-[#102F43] text-xs font-bold hover:bg-[#d8b56f] transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Header &amp; Hero Studio
            </Link>
            <Link
              href="/admin/products/new"
              className="px-4 py-2.5 rounded-xl bg-white/15 text-white text-xs font-bold hover:bg-white/25 transition-colors flex items-center gap-2 border border-white/20"
            >
              <PlusCircle className="w-4 h-4" /> Add New Product
            </Link>
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2.5 rounded-xl text-slate-300 text-xs font-bold hover:text-white transition-colors flex items-center gap-1.5 ml-auto"
            >
              View Live Store <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Products</span>
            <h3 className="text-2xl font-bold text-[#102F43] dark:text-white font-serif mt-1">
              {products.length}
            </h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              {inStockCount} In Stock
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-slate-800 flex items-center justify-center text-[#102F43] dark:text-[#C9A45C]">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Categories</span>
            <h3 className="text-2xl font-bold text-[#102F43] dark:text-white font-serif mt-1">
              {categoriesCount}
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold">
              Practical Solutions
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-slate-800 flex items-center justify-center text-sky-600">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Hero Media Mode */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hero Media Mode</span>
            <h3 className="text-base font-bold text-[#102F43] dark:text-white font-serif mt-1 flex items-center gap-1.5">
              {heroConfig.mediaType === 'video' ? (
                <><Video className="w-4 h-4 text-[#C9A45C]" /> Video Header</>
              ) : (
                <><ImageIcon className="w-4 h-4 text-[#C9A45C]" /> Photo Header</>
              )}
            </h3>
            <Link href="/admin/hero" className="text-[10px] text-[#C9A45C] font-bold hover:underline">
              Customize Studio &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-slate-800 flex items-center justify-center text-purple-600">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Hover Videos */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hover Videos</span>
            <h3 className="text-2xl font-bold text-[#102F43] dark:text-white font-serif mt-1">
              {videoHoverCount}
            </h3>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
              Interactive Previews
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-slate-800 flex items-center justify-center text-emerald-600">
            <Video className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Quick Access Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Active Hero Preview Snippet */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" /> Active Header Configuration
            </h4>
            <Link href="/admin/hero" className="text-xs font-bold text-[#C9A45C] hover:underline">
              Edit in Studio
            </Link>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800">
            {heroConfig.mediaType === 'video' ? (
              <video
                src={heroConfig.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={heroConfig.imageUrl}
                alt="Active hero visual"
                fill
                className="object-cover"
                sizes="400px"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <span className="text-[10px] font-bold text-[#C9A45C] uppercase tracking-wider">
                {heroConfig.badgeText}
              </span>
              <p className="text-sm font-bold font-serif leading-tight mt-0.5">
                {heroConfig.title} <span className="text-[#C9A45C] italic">{heroConfig.highlightText}</span>
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <p><strong>Tagline:</strong> {heroConfig.subtitle}</p>
            <p className="text-[11px] text-slate-400 font-mono truncate">
              <strong>Media:</strong> {heroConfig.mediaType === 'video' ? heroConfig.videoUrl : heroConfig.imageUrl}
            </p>
          </div>
        </div>

        {/* Right: Products Quick View */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-[#102F43] dark:text-[#C9A45C]" /> Solution Catalog Preview
            </h4>
            <Link href="/admin/products" className="text-xs font-bold text-[#C9A45C] hover:underline">
              View All ({products.length})
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.slice(0, 4).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#102F43] dark:text-white line-clamp-1">
                      {p.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {p.category} • ₹{p.price}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {p.hoverVideo ? (
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-[9px] font-bold flex items-center gap-1">
                      <Video className="w-2.5 h-2.5" /> Video
                    </span>
                  ) : null}
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    p.inStock !== false ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-red-50 text-red-600'
                  }`}>
                    {p.inStock !== false ? 'In Stock' : 'Out'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/admin/products/new"
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-[#102F43] dark:hover:border-[#C9A45C] hover:text-[#102F43] dark:hover:text-[#C9A45C] flex items-center justify-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Another Product
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
