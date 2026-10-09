'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, ShoppingBag, Star, Sparkles, CheckCircle2, Search, ArrowUpRight, Sun, Moon, User, Heart, Menu, ChevronRight, ChevronLeft, Mail, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useCartStore } from '@/store/cartStore';
import Cart from '@/components/Cart';
import CustomerLoginPopup from '@/components/CustomerLoginPopup';
import { supabase } from '@/lib/supabase';

// --- MOCK DATA ---
const CATEGORIES = [
  { name: "Kitchen", icon: "🍳" },
  { name: "Cleaning", icon: "🧹" },
  { name: "Bathroom", icon: "🛁" },
  { name: "Storage", icon: "📦" },
  { name: "Tech", icon: "🔌" },
  { name: "Decor", icon: "🪴" },
  { name: "Lighting", icon: "💡" },
  { name: "View All", icon: "grid" },
];

const MOCK_PRODUCTS = [
  { id: 1, title: "Multi-Purpose Kitchen Organizer", price: 899, rating: 4.8, reviews: 124, category: "Kitchen" },
  { id: 2, title: "Microfiber Cleaning Mop", price: 499, rating: 4.6, reviews: 89, category: "Cleaning" },
  { id: 3, title: "Corner Bathroom Rack", price: 649, rating: 4.9, reviews: 210, category: "Bathroom" },
  { id: 4, title: "Foldable Storage Box", price: 399, rating: 4.7, reviews: 156, category: "Storage" },
];

const COMBOS = [
  { id: 10, title: "Kitchen Space Saver Kit", items: "3 products", price: 899, originalPrice: 1199, savings: 300, bg: "bg-blue-50 dark:bg-blue-900/20" },
  { id: 11, title: "Quick Clean Combo", items: "4 products", price: 1099, originalPrice: 1499, savings: 400, bg: "bg-amber-50 dark:bg-amber-900/20" },
  { id: 12, title: "Wardrobe Space Saver", price: 749, originalPrice: 999, savings: 250, bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { id: 13, title: "Bathroom Organization", price: 1249, originalPrice: 1599, savings: 350, bg: "bg-pink-50 dark:bg-pink-900/20" },
  { id: 14, title: "Smart Living Room", price: 2499, originalPrice: 3099, savings: 600, bg: "bg-purple-50 dark:bg-purple-900/20" },
  { id: 15, title: "Ultimate Home Office", price: 1899, originalPrice: 2399, savings: 500, bg: "bg-orange-50 dark:bg-orange-900/20" },
];

const TESTIMONIALS = [
  { name: "Sarah J.", text: "Amazing quality and fast delivery! Dexhaus has become my go-to store for home upgrades.", rating: 5 },
  { name: "Michael T.", text: "Great prices, excellent customer service, and super easy returns. Highly recommend!", rating: 5 },
  { name: "Priya K.", text: "I love the variety they offer. I can find everything in one place. So convenient!", rating: 5 },
];


// --- COMPONENTS ---

const ProductCard = ({ product }: { product: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-[#112a46]/5 dark:hover:shadow-black/50 transition-all duration-500 pb-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center m-2 rounded-[1.5rem]">
        
        {/* Discount Badge */}
        <div className="absolute top-4 left-4 z-20 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
          -15%
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 z-20 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300">
          <Heart className="w-4 h-4" />
        </button>

        {/* Image/Video Layer */}
        <div className={`absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 transition-opacity duration-700 ${isHovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
           <Image src="/Dexhaus_icon.png" alt="Dexhaus Placeholder" width={80} height={80} className="opacity-10 grayscale dark:invert" />
        </div>
        
        <video 
          ref={videoRef}
          src={`/hero-video.mp4?v=${product.id}`}
          muted 
          loop 
          playsInline
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        />
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 bg-gradient-to-t from-black/50 to-transparent">
          <button 
            onClick={(e) => {
              e.preventDefault();
              addItem({ id: product.id, title: product.title, price: product.price, image: product.image || "/Dexhaus_icon.png" });
            }}
            className="w-full bg-[#112a46] dark:bg-[#e2c174] text-white dark:text-[#0a2540] py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0a1829] transition-colors shadow-xl"
          >
            <ShoppingBag className="w-4 h-4" /> ADD TO CART
          </button>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1 line-clamp-1 text-base">{product.title}</h3>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">{product.category}</p>
        
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-1 text-[#e2c174]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-slate-200 dark:fill-slate-700 text-slate-200 dark:text-slate-700'}`} />
              ))}
              <span className="text-[10px] text-slate-400 ml-1">({product.reviews})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-[#112a46] dark:text-white">₹{product.price}</span>
              <span className="text-xs text-slate-400 line-through">₹{Math.floor(product.price * 1.15)}</span>
            </div>
          </div>
          
          {/* Circular Add Button (Mobile Friendly fallback) */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              addItem({ id: product.id, title: product.title, price: product.price, image: product.image || "/Dexhaus_icon.png" });
            }}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#112a46] dark:text-[#e2c174] hover:bg-[#112a46] hover:text-white transition-colors lg:hidden"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};


// --- MAIN PAGE ---

export default function Storefront() {
  const { theme, setTheme } = useTheme();
  const { openCart, items } = useCartStore();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Carousel Ref
  const combosRef = useRef<HTMLDivElement>(null);
  const scrollCombos = (direction: 'left' | 'right') => {
    if (combosRef.current) {
      const scrollAmount = 400; // rough width of one card + gap
      combosRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-[#e2c174] selection:text-[#112a46] transition-colors duration-500 overflow-x-hidden">
      
      <CustomerLoginPopup 
        isOpen={showAuthPopup} 
        onClose={() => setShowAuthPopup(false)} 
        onSuccess={() => setShowAuthPopup(false)}
      />

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-slate-950 shadow-2xl z-[201] flex flex-col border-r border-slate-200 dark:border-slate-800 lg:hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-900">
                <Image src="/Dexhaus_logo.png" alt="Dexhaus" width={140} height={35} className="h-7 w-auto dark:invert" />
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-red-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col p-6 space-y-6 font-bold text-[#112a46] dark:text-white">
                <Link onClick={() => setMobileMenuOpen(false)} href="#categories" className="flex items-center gap-3"><Menu className="w-5 h-5 text-[#e2c174]"/> All Categories</Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="/" className="hover:text-[#e2c174]">Home</Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="#popular" className="hover:text-[#e2c174]">Shop</Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="#combos" className="hover:text-[#e2c174]">Deals</Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="#popular" className="hover:text-[#e2c174]">New Arrivals</Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="#testimonials" className="hover:text-[#e2c174]">Inspiration</Link>
              </div>
              <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-900">
                <button onClick={() => { setMobileMenuOpen(false); setShowAuthPopup(true); }} className="w-full mb-3 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-bold flex justify-center gap-2">
                  <User className="w-4 h-4"/> Customer Login
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Top Banner */}
      <div className="bg-[#112a46] text-white text-[11px] sm:text-xs font-semibold py-2.5 px-4 flex justify-center items-center gap-4 sm:gap-8 tracking-wide">
        <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#e2c174]" /> Free Shipping on Orders Over ₹999</span>
        <span className="hidden sm:flex items-center gap-1.5"><ArrowRight className="w-3.5 h-3.5 text-[#e2c174]" /> 7-Day Easy Returns</span>
        <span className="hidden md:flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#e2c174]" /> Secure Payments</span>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 w-full bg-[#faf9f6]/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 z-50 transition-all duration-500">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          
          {/* Logo (Much Bigger) */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <Image src="/Dexhaus_logo.png" alt="Dexhaus" width={260} height={60} className="h-10 sm:h-12 w-auto dark:invert transition-all hover:opacity-80" priority />
          </Link>

          {/* Center Search (Like Viva) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-12">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search products, categories, combos..." 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full py-3.5 pl-6 pr-14 text-sm focus:outline-none focus:border-[#e2c174] dark:focus:border-[#e2c174] transition-colors shadow-sm"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#112a46] dark:bg-[#e2c174] text-white dark:text-[#112a46] p-2 rounded-full hover:scale-105 transition-transform">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#112a46] dark:hover:text-[#e2c174] transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 sm:w-6 sm:h-6" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6" />}
              <span className="text-[10px] font-semibold hidden sm:block">Theme</span>
            </button>

            <div className="relative group flex flex-col items-center">
              <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#112a46] dark:hover:text-[#e2c174] transition-colors py-2">
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-[10px] font-semibold hidden sm:block">Account</span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-0 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
                <div className="p-2 flex flex-col">
                  <button 
                    onClick={() => setShowAuthPopup(true)}
                    className="text-left px-4 py-3 text-sm font-bold text-[#112a46] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Customer Login
                  </button>
                  <Link 
                    href="/admin/login" 
                    className="text-left px-4 py-3 text-sm font-bold text-slate-500 hover:text-[#e2c174] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Admin Portal
                  </Link>
                </div>
              </div>
            </div>
            
            <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#112a46] dark:hover:text-[#e2c174] transition-colors hidden sm:flex">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[10px] font-semibold">Wishlist</span>
            </button>

            <button onClick={openCart} className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#112a46] dark:hover:text-[#e2c174] transition-colors relative">
              <div className="relative">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#e2c174] text-[#0a2540] text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#faf9f6] dark:border-slate-950">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold hidden sm:block">Cart</span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex flex-col items-center gap-1 text-slate-500 hover:text-[#112a46] dark:hover:text-[#e2c174] transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Bottom Nav Links */}
        <div className="hidden lg:flex border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50">
          <div className="max-w-[1400px] mx-auto px-8 h-12 flex items-center gap-8 text-sm font-bold text-[#112a46] dark:text-slate-200">
            <Link href="/" className="hover:text-[#e2c174] transition-colors">Home</Link>
            <Link href="#popular" className="hover:text-[#e2c174] transition-colors">Shop</Link>
            <Link href="#combos" className="hover:text-[#e2c174] transition-colors">Deals</Link>
            <Link href="#popular" className="hover:text-[#e2c174] transition-colors">New Arrivals</Link>
            <Link href="#testimonials" className="hover:text-[#e2c174] transition-colors">Inspiration</Link>
            <Link href="#" className="hover:text-[#e2c174] transition-colors ml-auto flex items-center gap-1 text-slate-500">Track Order</Link>
          </div>
        </div>
      </nav>

      <Cart />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* PREMIUM CAPSULE HERO SECTION */}
        <section className="relative w-full h-[65vh] min-h-[500px] max-h-[700px] bg-[#112a46] rounded-[2rem] sm:rounded-[3rem] overflow-hidden flex items-center shadow-2xl">
          {/* Abstract Gold Background Elements */}
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-[#e2c174]/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row w-full h-full p-8 sm:p-16 lg:p-20 items-center justify-between">
            <div className="w-full md:w-1/2 flex flex-col items-start text-white max-w-xl">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e2c174] text-xs font-bold tracking-widest uppercase mb-6">
                  <Star className="w-3 h-3 fill-current" /> Premium Quality
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-serif leading-[1.05] tracking-tight mb-6 text-white drop-shadow-md">
                  Elevate Your <br/>
                  <span className="text-[#e2c174] italic">Everyday.</span>
                </h1>
                <p className="text-lg text-slate-300 mb-10 max-w-md font-light leading-relaxed">
                  Discover quality products across every category — curated to reduce effort and make your home smarter.
                </p>
                <div className="flex items-center gap-6">
                  <Link href="#popular" className="group flex items-center gap-3 bg-white text-[#112a46] px-8 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition-all">
                    Shop Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <div className="hidden sm:flex items-center gap-3 text-sm text-slate-300 font-medium border-l border-white/20 pl-6">
                    <div className="flex -space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-[#112a46]" />
                      <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-[#112a46]" />
                      <div className="w-8 h-8 rounded-full bg-[#e2c174] border-2 border-[#112a46] flex items-center justify-center text-[10px] font-bold text-[#112a46]">10K+</div>
                    </div>
                    <div>Trusted by<br/>Customers</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side Image/Video Area in Hero */}
            <div className="hidden md:flex w-1/2 h-full justify-end items-center relative">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} 
                 animate={{ opacity: 1, scale: 1 }} 
                 transition={{ duration: 1, delay: 0.2 }}
                 className="relative w-[110%] h-[120%] -right-[10%] rounded-l-[4rem] overflow-hidden bg-slate-800 shadow-2xl border-8 border-white/5"
               >
                 <Image src="/hero-image.jpeg" alt="Premium Smart Home" fill className="object-cover opacity-60" priority />
                 {/* A beautiful overlay badge mimicking the reference */}
                 <div className="absolute top-12 left-12 bg-[#112a46]/80 backdrop-blur-md border border-white/20 text-white p-6 rounded-3xl text-center transform -rotate-6 shadow-2xl">
                    <div className="text-sm font-bold tracking-widest text-[#e2c174] uppercase mb-1">Summer Sale</div>
                    <div className="text-3xl font-serif font-bold">UP TO</div>
                    <div className="text-5xl font-bold font-serif text-[#e2c174]">40%</div>
                    <div className="text-xl font-bold">OFF</div>
                 </div>
               </motion.div>
            </div>
          </div>
        </section>

        {/* Categories Circular Row */}
        <section id="categories" className="py-12 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap justify-center sm:justify-between items-center gap-4 sm:gap-8 px-4">
            {CATEGORIES.map((cat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 cursor-pointer group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center text-2xl sm:text-3xl group-hover:border-[#e2c174] group-hover:shadow-md group-hover:-translate-y-1 transition-all">
                  {cat.icon === "grid" ? <Menu className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" /> : cat.icon}
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-[#112a46] dark:group-hover:text-[#e2c174] transition-colors">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Top Picks For You (Product Grid) */}
        <section id="popular" className="py-20">
          <div className="flex justify-between items-end mb-10">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold font-serif text-[#112a46] dark:text-white">Top Picks For You</h2>
              <Sparkles className="w-6 h-6 text-[#e2c174]" />
            </div>
            <Link href="#" className="hidden sm:flex text-sm font-bold text-[#112a46] dark:text-[#e2c174] items-center gap-1 hover:underline">
              See All Deals <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Mini Promotional Banners (Carousel) */}
        <section id="combos" className="py-10 relative">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold font-serif text-[#112a46] dark:text-white">Curated Collections</h2>
            <div className="hidden md:flex gap-4">
              <button onClick={() => scrollCombos('left')} className="w-12 h-12 rounded-full border-2 border-[#e2c174] flex items-center justify-center text-[#112a46] dark:text-white hover:bg-[#e2c174] hover:text-[#112a46] transition-all shadow-sm">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={() => scrollCombos('right')} className="w-12 h-12 rounded-full border-2 border-[#e2c174] flex items-center justify-center text-[#112a46] dark:text-white hover:bg-[#e2c174] hover:text-[#112a46] transition-all shadow-sm">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div 
            ref={combosRef}
            className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {COMBOS.map((combo, idx) => (
              <motion.div 
                key={combo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`${combo.bg} rounded-[2rem] p-8 flex flex-col justify-between border border-black/5 dark:border-white/5 relative overflow-hidden group hover:shadow-xl transition-all cursor-pointer min-w-[320px] md:min-w-[400px] snap-start flex-shrink-0`}
              >
                 <div className="relative z-10 max-w-[60%]">
                   <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Save ₹{combo.savings}</div>
                   <h3 className="text-2xl font-serif font-bold text-[#112a46] dark:text-white mb-6 leading-tight">{combo.title}</h3>
                   <button className="flex items-center gap-2 text-sm font-bold text-[#112a46] dark:text-white group-hover:text-[#e2c174] dark:group-hover:text-[#e2c174] transition-colors">
                     Shop Now <ArrowRight className="w-4 h-4" />
                   </button>
                 </div>
                 
                 {/* Abstract visual representation on the right */}
                 <div className="absolute right-[-10%] bottom-[-10%] w-[60%] aspect-square bg-white/40 dark:bg-black/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute right-4 bottom-4 w-32 h-32 flex items-center justify-center opacity-30 group-hover:scale-110 transition-transform duration-500 grayscale dark:invert">
                   <Image src="/Dexhaus_icon.png" alt="Combo Image" width={100} height={100} className="object-contain" />
                 </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Loved By Thousands (Testimonials) */}
        <section id="testimonials" className="py-20">
          <div className="flex items-center gap-3 mb-10">
            <h2 className="text-3xl font-bold font-serif text-[#112a46] dark:text-white">Loved By Thousands</h2>
            <Heart className="w-6 h-6 text-red-500 fill-current" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((review, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 flex flex-shrink-0 items-center justify-center font-bold text-slate-400">
                    {review.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#112a46] dark:text-white flex items-center gap-1">
                      {review.name} <CheckCircle2 className="w-3.5 h-3.5 text-green-500 fill-current text-white" />
                    </h4>
                    <div className="flex gap-0.5 text-[#e2c174]">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">"{review.text}"</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Newsletter / Stay in the loop */}
        <section className="py-10">
          <div className="bg-[#051726] rounded-[3rem] p-10 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 z-0" />
            
            <div className="relative z-10 flex items-center gap-6 md:w-1/2 text-white">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/20">
                <Mail className="w-8 h-8 text-[#e2c174]" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold mb-2">Stay in the Loop</h3>
                <p className="text-sm text-slate-400 max-w-sm leading-relaxed">Get exclusive deals, new arrivals, and style inspiration straight to your inbox.</p>
              </div>
            </div>

            <div className="relative z-10 md:w-1/2 w-full max-w-md flex flex-col gap-3">
              <div className="relative w-full">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full bg-white/10 border border-white/20 rounded-full py-4 pl-6 pr-32 text-white placeholder-white/50 focus:outline-none focus:border-[#e2c174] transition-colors"
                />
                <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#e2c174] text-[#0a2540] px-6 rounded-full font-bold text-sm hover:bg-white transition-colors shadow-md">
                  Subscribe
                </button>
              </div>
              <p className="text-[10px] text-slate-500 flex items-center gap-1 ml-4"><ShieldCheck className="w-3 h-3 text-green-500" /> We respect your privacy. Unsubscribe anytime.</p>
            </div>
          </div>
        </section>

      </main>

      {/* Premium Footer */}
      <footer className="bg-[#112a46] text-white pt-20 pb-10 border-t-8 border-[#e2c174]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
            
            <div className="lg:col-span-2">
              <Image src="/Dexhaus_logo.png" alt="Dexhaus" width={200} height={40} className="h-10 w-auto invert mb-6" />
              <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-6">
                Your one-stop destination for quality smart home products across every category. Live better with Dexhaus.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#e2c174] hover:text-[#112a46] transition-all cursor-pointer">
                    <span className="font-serif italic font-bold">f</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 font-serif text-[#e2c174]">Shop</h4>
              <ul className="space-y-4 text-sm text-slate-300 font-medium">
                <li><Link href="#" className="hover:text-white transition-colors">All Categories</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">New Arrivals</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Best Sellers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Deals & Offers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 font-serif text-[#e2c174]">Customer Service</h4>
              <ul className="space-y-4 text-sm text-slate-300 font-medium">
                <li><Link href="#" className="hover:text-white transition-colors">Track Order</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 font-serif text-[#e2c174]">Company</h4>
              <ul className="space-y-4 text-sm text-slate-300 font-medium">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Sustainability</Link></li>
                <li><Link href="/admin/login" className="hover:text-white transition-colors text-white font-bold flex items-center gap-1"><User className="w-3 h-3"/> Admin Portal</Link></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
            <p>© 2026 Dexhaus Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
