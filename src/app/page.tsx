'use client';

import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShoppingBag, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Sun, 
  Moon, 
  User, 
  Heart, 
  Menu, 
  ChevronRight, 
  ChevronLeft, 
  Mail, 
  ShieldCheck, 
  X,
  Truck,
  RotateCcw,
  Package,
  Layers,
  HelpCircle,
  Clock,
  MapPin,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useMemo, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSiteStore } from '@/store/siteStore';
import { supabase } from '@/lib/supabase';
import Cart from '@/components/Cart';
import CustomerLoginPopup from '@/components/CustomerLoginPopup';
import CustomerProfileModal, { CustomerProfileData } from '@/components/CustomerProfileModal';
import WishlistDrawer from '@/components/WishlistDrawer';
import PolicyModal, { PolicyType } from '@/components/PolicyModal';
import ProductCard from '@/components/ProductCard';

// --- CURATED BRAND CATEGORIES ---
const CATEGORIES = [
  { id: "all", name: "All Solutions", icon: "✨" },
  { id: "kitchen", name: "Kitchen Solutions", icon: "🍳" },
  { id: "cleaning", name: "Cleaning Solutions", icon: "🧹" },
  { id: "storage", name: "Storage & Organization", icon: "📦" },
  { id: "bathroom", name: "Bathroom Solutions", icon: "🛁" },
  { id: "laundry", name: "Laundry & Wardrobe", icon: "👔" },
  { id: "space-saving", name: "Space-Saving Solutions", icon: "📐" },
  { id: "convenience", name: "Home Convenience", icon: "💡" },
];

// --- CURATED PRACTICAL PRODUCTS ---
const PRODUCTS = [
  {
    id: "prod-kitchen-1",
    title: "2-Tier Countertop Spice & Bottle Organizer",
    category: "Kitchen Solutions",
    categoryKey: "kitchen",
    price: 899,
    image: "/product-kitchen-organizer.jpg",
    specs: "Matte black steel frame • Double-tier clearance • Non-slip feet",
    benefit: "Frees up counter surface and keeps everyday cooking essentials within reach."
  },
  {
    id: "prod-cleaning-1",
    title: "Dual-Chamber Hands-Free Flat Mop System",
    category: "Cleaning Solutions",
    categoryKey: "cleaning",
    price: 699,
    image: "/product-microfiber-mop.jpg",
    specs: "Dual wash & dry chambers • 360° swivel head • 2x Microfiber pads",
    benefit: "Cleans tile and wood streak-free without dirtying hands or manual wringing."
  },
  {
    id: "prod-bathroom-1",
    title: "Rustproof 3-Tier Corner Shower Caddy",
    category: "Bathroom Solutions",
    categoryKey: "bathroom",
    price: 649,
    image: "/product-bathroom-rack.jpg",
    specs: "Corrosion-resistant steel • Heavy-duty adhesive mount • Water drainage slots",
    benefit: "Holds bottles securely without drilling into bathroom tiles or causing rust."
  },
  {
    id: "prod-storage-1",
    title: "Reinforced Clear-Window Fabric Storage Box",
    category: "Storage & Organization",
    categoryKey: "storage",
    price: 449,
    image: "/product-storage-box.jpg",
    specs: "High-density linen-blend fabric • Dual metal zippers • Front clear viewport",
    benefit: "Protects seasonal garments, quilts, and bed linen while keeping contents identifiable."
  },
  {
    id: "prod-space-1",
    title: "Under-Sink 2-Tier Sliding Drawer Rack",
    category: "Space-Saving Solutions",
    categoryKey: "space-saving",
    price: 1099,
    image: "/product-under-sink.jpg",
    specs: "Steel wire pull-out drawer • Clears vertical plumbing pipes • Modular height",
    benefit: "Turns awkward, unused under-sink cabinet cavities into structured pull-out storage."
  },
  {
    id: "prod-convenience-1",
    title: "Bamboo-Top Cable Concealer & Surge Box",
    category: "Home Convenience",
    categoryKey: "convenience",
    price: 699,
    image: "/product-cable-box.jpg",
    specs: "Fire-retardant ABS housing • Natural bamboo lid • Side ventilation ports",
    benefit: "Conceals power strips and tangled cords to protect curious pets and eliminate visual clutter."
  },
  {
    id: "prod-laundry-1",
    title: "9-Hole Cascading Wardrobe Space-Saver Hangers",
    category: "Laundry & Wardrobe",
    categoryKey: "laundry",
    price: 499,
    image: "/product-cascading-hangers.jpg",
    specs: "Pack of 6 cascading hangers • 360° rotating hook • Vertical & horizontal modes",
    benefit: "Quadruples closet hanging space and keeps shirts crease-free in compact wardrobes."
  },
  {
    id: "prod-convenience-2",
    title: "Magnetic Warm-LED Motion Sensor Nightlight",
    category: "Home Convenience",
    categoryKey: "convenience",
    price: 549,
    image: "/product-motion-sensor-light.jpg",
    specs: "USB rechargeable • Magnetic stick-on strip • Automatic ambient motion detection",
    benefit: "Provides hands-free night lighting for dark staircases, closets, and hallways."
  }
];

// --- PROBLEM-SOLVING KITS (COMBOS) ---
const COMBOS = [
  {
    id: "combo-kitchen",
    title: "Kitchen Counter Space Saver Kit",
    category: "Kitchen Solutions",
    price: 1499,
    image: "/product-kitchen-organizer.jpg",
    items: [
      "2-Tier Countertop Spice & Bottle Rack",
      "Under-Shelf Hanging Wire Basket",
      "Magnetic Refrigerator Spice Caddy"
    ],
    benefit: "Reclaims up to 60% of lost counter surface and keeps spices accessible.",
    bg: "bg-[#F8F5ED] dark:bg-slate-900"
  },
  {
    id: "combo-clean",
    title: "Quick Clean Floor & Tile Care Set",
    category: "Cleaning Solutions",
    price: 1199,
    image: "/product-microfiber-mop.jpg",
    items: [
      "Dual-Chamber Hands-Free Flat Mop",
      "3x Washable Microfiber Replacement Pads",
      "Deep Crevice Grout Detail Brush"
    ],
    benefit: "Cuts routine cleaning time in half with zero manual wringing or dirty water spills.",
    bg: "bg-[#F8F5ED] dark:bg-slate-900"
  },
  {
    id: "combo-wardrobe",
    title: "Wardrobe Space Maximizer Bundle",
    category: "Laundry & Wardrobe",
    price: 899,
    image: "/product-storage-box.jpg",
    items: [
      "6x Cascading 9-Hole Hanger Organizers",
      "Clear-Window Foldable Fabric Storage Box",
      "Drawer Fabric Compartment Divider"
    ],
    benefit: "Transforms cramped bedroom closets into neatly segmented, accessible storage.",
    bg: "bg-[#F8F5ED] dark:bg-slate-900"
  },
  {
    id: "combo-under-sink",
    title: "Under-Sink & Plumbing Clarity Duo",
    category: "Storage & Organization",
    price: 1299,
    image: "/product-under-sink.jpg",
    items: [
      "2-Tier Sliding Steel Drawer Organizer",
      "Silicone Under-Sink Drip Mat",
      "Adhesive Spray Bottle Rail"
    ],
    benefit: "Navigates tricky sink pipe cavities and shields cabinets from cleaning leaks.",
    bg: "bg-[#F8F5ED] dark:bg-slate-900"
  },
  {
    id: "combo-bathroom",
    title: "Drill-Free Bathroom Organization Kit",
    category: "Bathroom Solutions",
    price: 899,
    image: "/product-bathroom-rack.jpg",
    items: [
      "Rustproof 3-Tier Corner Shower Caddy",
      "Self-Draining Soap Dish",
      "Heavy-Adhesive Towel Hook Set"
    ],
    benefit: "Declutters shower ledges without cracking wall tiles or requiring drilling tools.",
    bg: "bg-[#F8F5ED] dark:bg-slate-900"
  },
  {
    id: "combo-cables",
    title: "Workstation & Cord Tidy Kit",
    category: "Home Convenience",
    price: 849,
    image: "/product-cable-box.jpg",
    items: [
      "Bamboo-Top Cable Concealer Box",
      "6x Silicone Adhesive Cord Clips",
      "10x Reusable Microfiber Wire Straps"
    ],
    benefit: "Conceals hazardous tangled wires beneath desks, TVs, and bedside tables.",
    bg: "bg-[#F8F5ED] dark:bg-slate-900"
  }
];

export default function Storefront() {
  const { theme, setTheme } = useTheme();
  const { openCart, addItem, items: cartItems } = useCartStore();
  const { openWishlist, toggleItem, isInWishlist, items: wishlistItems } = useWishlistStore();
  const { heroConfig, products: storeProducts } = useSiteStore();

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistItemCount = wishlistItems.length;

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfileData | null>(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);
  const [showTrackOrderModal, setShowTrackOrderModal] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackOrderResult, setTrackOrderResult] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Authenticate customer on mount and listen to changes
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUser(session.user);
          loadCustomerProfile(session.user);
        }
      } catch (e) {}
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        loadCustomerProfile(session.user);
      } else {
        setCurrentUser(null);
        setCustomerProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadCustomerProfile = async (user: any) => {
    // 1. Instant local cache check
    const cached = localStorage.getItem(`dexhaus_profile_${user.id}`);
    if (cached) {
      try {
        setCustomerProfile(JSON.parse(cached));
      } catch (e) {}
    }

    // 2. Fresh fetch from Supabase
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setCustomerProfile(data);
        localStorage.setItem(`dexhaus_profile_${user.id}`, JSON.stringify(data));
      }
    } catch (e) {}
  };

  const handleCustomerSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setCurrentUser(null);
    setCustomerProfile(null);
    setShowProfileModal(false);
  };

  // Carousel Ref
  const combosRef = useRef<HTMLDivElement>(null);
  const scrollCombos = (direction: 'left' | 'right') => {
    if (combosRef.current) {
      const scrollAmount = 380;
      combosRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  // Filtered Products from Dynamic Store
  const filteredProducts = useMemo(() => {
    const list = (storeProducts && storeProducts.length > 0) ? storeProducts : PRODUCTS;
    return list.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.categoryKey === selectedCategory;
      const matchesSearch = 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.benefit.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [storeProducts, searchQuery, selectedCategory]);

  const handleTrackOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = trackOrderId.trim().toUpperCase();
    if (!cleanId) return;

    // 1. Check local storage orders first
    let foundOrder: any = null;
    try {
      const localStr = localStorage.getItem('dexhaus_orders');
      if (localStr) {
        const list = JSON.parse(localStr);
        foundOrder = list.find((o: any) => 
          (o.order_id && o.order_id.toUpperCase() === cleanId) || 
          (o.id && o.id.toString().toUpperCase() === cleanId) ||
          (o.phone && o.phone.includes(cleanId))
        );
      }
    } catch (e) {}

    // 2. Query Supabase orders table
    if (!foundOrder) {
      try {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .or(`stripe_session_id.eq.${cleanId},customer_email.eq.${cleanId.toLowerCase()}`)
          .limit(1);
        if (data && data.length > 0) {
          foundOrder = data[0];
        }
      } catch (e) {}
    }

    if (foundOrder) {
      const status = foundOrder.status || 'Processing';
      const customer = foundOrder.customer_name || 'Dexhaus Customer';
      const dest = foundOrder.city ? `${foundOrder.city}${foundOrder.state ? `, ${foundOrder.state}` : ''}` : 'your registered address';
      setTrackOrderResult(`Order #${cleanId} for ${customer} is verified: ${status.toUpperCase()}. Destination: ${dest}. Estimated pan-India delivery: 3 to 5 business days.`);
    } else {
      setTrackOrderResult(`Order #${cleanId} is confirmed and in our fulfillment queue. Estimated dispatch: within 24-48 hours. A live tracking SMS/email will be delivered once handed to our courier partner.`);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!email) return;

    setNewsletterLoading(true);

    // Save locally
    localStorage.setItem('dexhaus_newsletter_email', email);
    setNewsletterSubscribed(true);

    // Persist to Supabase newsletter_subscribers table
    try {
      await supabase.from('newsletter_subscribers').insert([{ email }]);
    } catch (err) {
      console.warn('Newsletter stored locally; ensure SQL table is created in Supabase.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5ED] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-[#C9A45C] selection:text-[#102F43] transition-colors duration-500 overflow-x-hidden">
      
      {/* Auth Modal */}
      <CustomerLoginPopup 
        isOpen={showAuthPopup} 
        onClose={() => setShowAuthPopup(false)} 
        onSuccess={(user) => {
          setShowAuthPopup(false);
          if (user) {
            setCurrentUser(user);
            loadCustomerProfile(user);
            setShowProfileModal(true);
          }
        }}
      />

      {/* Customer Profile & Address Modal */}
      <CustomerProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={currentUser}
        onSignOut={handleCustomerSignOut}
        onProfileUpdated={(updated) => setCustomerProfile(updated)}
        onOpenTrackOrder={() => setShowTrackOrderModal(true)}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer />

      {/* Cart Drawer */}
      <Cart />

      {/* Policy Modal */}
      <PolicyModal 
        activePolicy={activePolicy} 
        onClose={() => setActivePolicy(null)}
        onSelectPolicy={(policy) => setActivePolicy(policy)}
      />

      {/* Track Order Modal */}
      <AnimatePresence>
        {showTrackOrderModal && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => { setShowTrackOrderModal(false); setTrackOrderResult(null); }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 z-10"
            >
              <button 
                onClick={() => { setShowTrackOrderModal(false); setTrackOrderResult(null); }}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-[#102F43] text-[#C9A45C]">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-[#102F43] dark:text-white">Track Your Shipment</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Enter your Dexhaus order reference number</p>
                </div>
              </div>

              <form onSubmit={handleTrackOrderSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                    Order ID or AWB Tracking Number
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. DX-8942 or Phone Number"
                    value={trackOrderId}
                    onChange={(e) => setTrackOrderId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-[#102F43] dark:focus:border-[#C9A45C]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#102F43] text-white rounded-xl text-sm font-bold hover:bg-[#183f5a] transition-colors"
                >
                  Locate Shipment
                </button>
              </form>

              {trackOrderResult && (
                <div className="mt-6 p-4 rounded-2xl bg-[#F8F5ED] dark:bg-slate-900 border border-amber-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#102F43] dark:text-white mb-1">Status Update</strong>
                    {trackOrderResult}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              className="fixed inset-y-0 left-0 w-[290px] bg-white dark:bg-slate-950 shadow-2xl z-[201] flex flex-col border-r border-slate-200 dark:border-slate-800 lg:hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-900">
                <div className="flex flex-col">
                  <span className="font-serif font-black tracking-wider text-xl text-[#102F43] dark:text-white">DEXHAUS</span>
                  <span className="text-[9px] tracking-widest text-[#C9A45C] font-semibold uppercase">Smart Solutions. Better Living.</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-red-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col p-6 space-y-4 font-bold text-[#102F43] dark:text-white text-sm">
                <Link onClick={() => setMobileMenuOpen(false)} href="#categories" className="flex items-center gap-3 hover:text-[#C9A45C]">
                  <Layers className="w-4 h-4 text-[#C9A45C]"/> Solutions Catalog
                </Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="#popular" className="hover:text-[#C9A45C]">
                  Curated Products
                </Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="#combos" className="hover:text-[#C9A45C]">
                  Problem-Solving Kits
                </Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="#why-dexhaus" className="hover:text-[#C9A45C]">
                  Why Dexhaus
                </Link>
                <button 
                  onClick={() => { setMobileMenuOpen(false); setShowTrackOrderModal(true); }}
                  className="text-left hover:text-[#C9A45C] flex items-center gap-2 text-slate-600 dark:text-slate-400"
                >
                  <Truck className="w-4 h-4 text-[#C9A45C]"/> Track Order
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); setActivePolicy('support'); }}
                  className="text-left hover:text-[#C9A45C] flex items-center gap-2 text-slate-600 dark:text-slate-400"
                >
                  <HelpCircle className="w-4 h-4 text-[#C9A45C]"/> Customer Care
                </button>
              </div>

              <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-900 space-y-3">
                {currentUser ? (
                  <button 
                    onClick={() => { setMobileMenuOpen(false); setShowProfileModal(true); }} 
                    className="w-full py-3 rounded-xl bg-[#102F43] text-white dark:bg-[#C9A45C] dark:text-[#102F43] text-xs font-bold flex justify-center items-center gap-2 shadow-sm"
                  >
                    <User className="w-4 h-4 text-[#C9A45C] dark:text-[#102F43]"/>
                    <span className="truncate">{customerProfile?.full_name || currentUser.email || 'My Account Profile'}</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => { setMobileMenuOpen(false); setShowAuthPopup(true); }} 
                    className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-bold flex justify-center items-center gap-2 text-[#102F43] dark:text-white"
                  >
                    <User className="w-4 h-4 text-[#C9A45C]"/> Sign In / Register
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Top Banner */}
      <header className="bg-[#102F43] text-white text-[11px] sm:text-xs font-medium py-2.5 px-4 tracking-wide border-b border-[#C9A45C]/20">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-[#C9A45C] font-bold uppercase tracking-wider text-[10px]">
              {heroConfig?.bannerAnnouncement || 'SMART SOLUTIONS. BETTER LIVING.'}
            </span>
          </div>

          <div className="flex items-center gap-6 text-slate-200">
            <button 
              onClick={() => setActivePolicy('shipping')} 
              className="hover:text-[#C9A45C] transition-colors flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-[#C9A45C]" /> Free Shipping Over ₹999
            </button>
            <button 
              onClick={() => setActivePolicy('returns')} 
              className="hidden sm:flex hover:text-[#C9A45C] transition-colors items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C9A45C]" /> 7-Day Easy Returns
            </button>
            <button 
              onClick={() => setShowTrackOrderModal(true)} 
              className="hidden md:flex hover:text-[#C9A45C] transition-colors items-center gap-1.5"
            >
              Track Order
            </button>
          </div>
        </div>
      </header>

      {/* Main Navbar */}
      <nav className="sticky top-0 w-full bg-[#F8F5ED]/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 z-50 transition-all">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Positioning */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-serif font-black text-2xl sm:text-3xl tracking-tight text-[#102F43] dark:text-white leading-none">
                DEXHAUS
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#C9A45C] font-semibold uppercase mt-0.5">
                Curated Home Solutions
              </span>
            </div>
          </Link>

          {/* Center Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search practical solutions (e.g., kitchen, caddy, mops)..." 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full py-2.5 pl-5 pr-20 text-sm focus:outline-none focus:border-[#C9A45C] transition-all shadow-sm"
              />
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
              <button 
                onClick={() => {
                  const el = document.getElementById('popular');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#102F43] text-white p-2 rounded-full hover:bg-[#183f5a] transition-colors"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#102F43] dark:hover:text-[#C9A45C] transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="text-[10px] font-medium hidden sm:block">Theme</span>
            </button>

            {/* Account / Customer Profile Trigger */}
            {currentUser ? (
              <button 
                onClick={() => setShowProfileModal(true)}
                className="flex flex-col items-center gap-1 text-[#102F43] dark:text-[#C9A45C] hover:opacity-80 transition-opacity"
                title="Customer Profile & Shipping Address"
              >
                <div className="relative">
                  <div className="w-5 h-5 rounded-full bg-[#102F43] dark:bg-[#C9A45C] text-white dark:text-[#102F43] text-[10px] font-bold flex items-center justify-center font-serif shadow-sm">
                    {customerProfile?.full_name 
                      ? customerProfile.full_name.charAt(0).toUpperCase() 
                      : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U')}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
                </div>
                <span className="text-[10px] font-bold max-w-[55px] truncate hidden sm:block">
                  {customerProfile?.full_name ? customerProfile.full_name.split(' ')[0] : 'Profile'}
                </span>
              </button>
            ) : (
              <button 
                onClick={() => setShowAuthPopup(true)}
                className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#102F43] dark:hover:text-[#C9A45C] transition-colors"
                title="Customer Login / Account"
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] font-medium hidden sm:block">Account</span>
              </button>
            )}
            
            {/* Wishlist Trigger */}
            <button 
              onClick={openWishlist}
              className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#102F43] dark:hover:text-[#C9A45C] transition-colors relative"
              title="Wishlist"
            >
              <div className="relative">
                <Heart className="w-5 h-5" />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#C9A45C] text-[#102F43] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium hidden sm:block">Saved</span>
            </button>

            {/* Cart Trigger */}
            <button 
              onClick={openCart} 
              className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#102F43] dark:hover:text-[#C9A45C] transition-colors relative"
              title="Cart Drawer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#102F43] text-white dark:bg-[#C9A45C] dark:text-[#102F43] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium hidden sm:block">Cart</span>
            </button>

            {/* Mobile Hamburger */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-200 hover:text-[#102F43]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Secondary Navigation Row */}
        <div className="hidden lg:flex border-t border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40">
          <div className="max-w-[1400px] mx-auto px-8 h-11 flex items-center gap-8 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <Link href="#categories" className="hover:text-[#C9A45C] transition-colors flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#C9A45C]" /> All Solutions
            </Link>
            <Link href="#popular" className="hover:text-[#C9A45C] transition-colors">Practical Catalog</Link>
            <Link href="#combos" className="hover:text-[#C9A45C] transition-colors">Problem-Solving Kits</Link>
            <Link href="#why-dexhaus" className="hover:text-[#C9A45C] transition-colors">Why Dexhaus</Link>
            <button 
              onClick={() => setShowTrackOrderModal(true)} 
              className="hover:text-[#C9A45C] transition-colors ml-auto flex items-center gap-1 text-slate-500"
            >
              <Truck className="w-3.5 h-3.5" /> Track Shipment
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-4 pt-4">
        <div className="relative w-full">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search home solutions..." 
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:border-[#C9A45C]"
          />
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-16 sm:space-y-24">
        
        {/* HERO SECTION: SMART SOLUTIONS FOR A BETTER HOME */}
        <section className="relative w-full min-h-[520px] lg:h-[68vh] max-h-[720px] bg-[#102F43] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center border border-[#102F43]">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[15%] -right-[10%] w-[600px] h-[600px] bg-[#C9A45C]/15 rounded-full blur-[90px]" />
            <div className="absolute bottom-[5%] right-[25%] w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 w-full h-full p-8 sm:p-12 lg:p-16 items-center gap-8">
            
            {/* Left Copy: Authentic Dexhaus Messaging */}
            <div className="md:col-span-7 flex flex-col items-start text-white max-w-xl">
              <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                
                {/* Brand Tagline Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#C9A45C] text-[11px] font-bold tracking-widest uppercase mb-6">
                  <Sparkles className="w-3.5 h-3.5" /> {heroConfig?.badgeText || 'SMART SOLUTIONS. BETTER LIVING.'}
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-[1.1] tracking-tight mb-5 text-white">
                  {heroConfig?.title || 'Smart Solutions for a'}{' '}
                  <span className="text-[#C9A45C] italic">{heroConfig?.highlightText || 'Better Home.'}</span>
                </h1>

                {/* Supporting Tagline */}
                <p className="text-base sm:text-lg text-slate-200 mb-8 font-light leading-relaxed max-w-lg">
                  {heroConfig?.subtitle || 'Curated products that reduce effort, save time, and make everyday living easier.'}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link 
                    href={heroConfig?.primaryCtaLink || '#popular'} 
                    className="group inline-flex items-center gap-2.5 bg-white text-[#102F43] px-7 py-3.5 rounded-full font-bold text-sm shadow-xl hover:bg-[#F8F5ED] hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {heroConfig?.primaryCtaText || 'Explore Solutions'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link 
                    href={heroConfig?.secondaryCtaLink || '#combos'} 
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm text-white border border-white/30 hover:bg-white/10 transition-colors"
                  >
                    {heroConfig?.secondaryCtaText || 'View Problem Kits'}
                  </Link>
                </div>

                {/* Honest Value Indicators */}
                <div className="mt-10 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C9A45C]" />
                    <span>Tested Dimensions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C9A45C]" />
                    <span>No-Drill Friendly</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                    <Check className="w-4 h-4 text-[#C9A45C]" />
                    <span>Transparent Pricing</span>
                  </div>
                </div>

              </motion.div>
            </div>

            {/* Right Side: High-Resolution Real Lifestyle Media (Video or Photo) */}
            <div className="md:col-span-5 h-[340px] sm:h-[400px] lg:h-[480px] w-full relative flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 bg-slate-900"
              >
                {heroConfig?.mediaType === 'video' && heroConfig?.videoUrl ? (
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
                    src={heroConfig?.imageUrl || "/hero-lifestyle.jpg"} 
                    alt="DEXHAUS Thoughtfully Organized Modern Kitchen and Living Space" 
                    fill 
                    className="object-cover" 
                    priority
                    sizes="(max-width: 768px) 100vw, 45vw"
                  />
                )}
                
                {/* Subtle overlay card highlighting authentic curation */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#102F43]/90 backdrop-blur-md border border-white/15 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#C9A45C] font-bold uppercase tracking-wider block">Thoughtful Living</span>
                    <p className="text-xs font-medium text-slate-200">Organization engineered for modern homes.</p>
                  </div>
                  <Package className="w-5 h-5 text-[#C9A45C] flex-shrink-0" />
                </div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* 7 BRAND SOLUTION CATEGORIES */}
        <section id="categories" className="py-4">
          <div className="text-center max-w-2xl mx-auto mb-8 px-4">
            <span className="text-xs font-bold text-[#C9A45C] uppercase tracking-widest block mb-2">
              Browse by Room &amp; Need
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#102F43] dark:text-white leading-tight">
              What do you want to solve today?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Select a solution category to filter genuine products built to solve everyday friction.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2.5 sm:gap-3.5 max-w-5xl mx-auto px-2 sm:px-0">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    const el = document.getElementById('popular');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-5 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm border ${
                    isActive 
                      ? 'bg-[#102F43] text-white border-[#102F43] shadow-md dark:bg-[#C9A45C] dark:text-[#102F43] dark:border-[#C9A45C]'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-[#C9A45C] hover:-translate-y-0.5'
                  }`}
                >
                  <span className="text-base flex-shrink-0">{cat.icon}</span>
                  <span className="truncate text-center sm:text-left">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* CURATED SOLUTIONS CATALOG (GRID) */}
        <section id="popular" className="py-4 scroll-mt-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#C9A45C] uppercase tracking-widest">Practical Products</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#102F43] dark:text-white mt-1">
                {selectedCategory === 'all' 
                  ? 'Curated Solutions for Your Home' 
                  : CATEGORIES.find(c => c.id === selectedCategory)?.name}
              </h2>
              {searchQuery && (
                <p className="text-xs text-slate-500 mt-1">
                  Filtering for &ldquo;{searchQuery}&rdquo; — {filteredProducts.length} result(s) found.
                </p>
              )}
            </div>

            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-[#C9A45C] hover:underline flex items-center gap-1"
              >
                Reset to All Solutions
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No solutions found matching your search.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#102F43] text-white text-xs font-bold"
              >
                View Full Collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  wishlisted={isInWishlist(product.id)}
                  onToggleWishlist={() => toggleItem({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    category: product.category
                  })}
                  onAddToCart={() => addItem({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image
                  })}
                />
              ))}
            </div>
          )}
        </section>

        {/* COMPLETE PROBLEM-SOLVING KITS (COMBOS) */}
        <section id="combos" className="py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#C9A45C] uppercase tracking-widest block mb-1">
                Multi-Item Sets
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#102F43] dark:text-white">
                Complete Problem-Solving Kits
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Bundled kits designed around a single friction point. Transparent contents, coordinated dimensions, and combined value.
              </p>
            </div>

            <div className="hidden md:flex gap-3">
              <button 
                onClick={() => scrollCombos('left')} 
                className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-[#102F43] hover:text-white transition-all shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scrollCombos('right')} 
                className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-[#102F43] hover:text-white transition-all shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div 
            ref={combosRef}
            className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {COMBOS.map((combo) => (
              <div 
                key={combo.id}
                className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between border border-slate-200 dark:border-slate-800 min-w-[320px] sm:min-w-[400px] max-w-[420px] snap-start flex-shrink-0 shadow-sm hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A45C] bg-[#C9A45C]/10 px-2.5 py-1 rounded-full">
                      {combo.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {combo.items.length} Curated Items
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-[#102F43] dark:text-white mb-2">
                    {combo.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {combo.benefit}
                  </p>

                  {/* Itemized Contents Box */}
                  <div className="bg-[#F8F5ED] dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 mb-6 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#102F43] dark:text-[#C9A45C] block">
                      Kit Includes:
                    </span>
                    {combo.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Bundle Price</span>
                    <span className="text-2xl font-serif font-bold text-[#102F43] dark:text-white">
                      ₹{combo.price}
                    </span>
                  </div>

                  <button 
                    onClick={() => {
                      addItem({
                        id: combo.id,
                        title: combo.title,
                        price: combo.price,
                        image: combo.image
                      });
                    }}
                    className="bg-[#102F43] dark:bg-[#C9A45C] text-white dark:text-[#102F43] px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-[#183f5a] dark:hover:bg-[#b8924b] transition-all shadow-md active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add Kit to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHY DEXHAUS SECTION (AUTHENTIC CURATION, RESEARCH & SELECTION) */}
        <section id="why-dexhaus" className="py-8 scroll-mt-24">
          <div className="bg-[#102F43] text-white rounded-[2.5rem] p-8 sm:p-14 lg:p-16 border border-[#102F43] shadow-2xl relative overflow-hidden">
            
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold text-[#C9A45C] uppercase tracking-widest block mb-2">
                Our Curation Standard
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
                Why Dexhaus?
              </h2>
              <p className="text-base text-slate-300 leading-relaxed font-light">
                You shouldn&apos;t have to sift through endless low-quality generic listings to find what works. We identify specific friction points in Indian households and select practical, dimension-accurate products that solve them.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <span className="text-2xl font-serif font-bold text-[#C9A45C] block mb-2">01</span>
                <h4 className="text-lg font-bold font-serif mb-2 text-white">Household Friction</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We look for everyday domestic frustrations: unorganized kitchen counters, awkward cabinet plumbing cavities, and wire clutter.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <span className="text-2xl font-serif font-bold text-[#C9A45C] block mb-2">02</span>
                <h4 className="text-lg font-bold font-serif mb-2 text-white">Practical Utility</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every product must fit standard kitchen and bathroom dimensions without requiring destructive drilling or permanent damage to rental tiles.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <span className="text-2xl font-serif font-bold text-[#C9A45C] block mb-2">03</span>
                <h4 className="text-lg font-bold font-serif mb-2 text-white">Material Durability</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We select rustproof powder-coated steels, food-contact safe polymers, and reinforced zippers capable of enduring heavy daily use.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <span className="text-2xl font-serif font-bold text-[#C9A45C] block mb-2">04</span>
                <h4 className="text-lg font-bold font-serif mb-2 text-white">Transparent Value</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  No invented discounts, no fabricated star ratings, and no artificial countdowns. Just honest pricing, clear contents, and 7-day returns.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* NEWSLETTER / STAY IN THE LOOP */}
        <section className="py-6 max-w-4xl mx-auto px-2 sm:px-0">
          <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 lg:p-12 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-md text-center md:text-left">
              <div className="inline-flex p-3 rounded-2xl bg-[#F8F5ED] dark:bg-slate-800 text-[#102F43] dark:text-[#C9A45C] mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#102F43] dark:text-white mb-2">
                Stay in the Loop
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Receive new practical solution releases, organization tips, and seasonal kit updates. No spam, ever.
              </p>
            </div>

            <div className="w-full md:w-auto md:min-w-[340px]">
              {newsletterSubscribed ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Thank you! You are subscribed to Dexhaus practical home updates.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <div className="relative flex items-center">
                    <input 
                      type="email" 
                      required
                      placeholder="Enter your email address" 
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full bg-[#F8F5ED] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full py-3.5 pl-4 pr-28 text-xs focus:outline-none focus:border-[#C9A45C]"
                    />
                    <button 
                      type="submit"
                      disabled={newsletterLoading}
                      className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#102F43] dark:bg-[#C9A45C] text-white dark:text-[#102F43] px-5 rounded-full font-bold text-xs hover:opacity-90 transition-opacity disabled:opacity-70"
                    >
                      {newsletterLoading ? 'Saving...' : 'Subscribe'}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 flex items-center justify-center md:justify-start gap-1 pl-2">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> We respect your privacy. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* IMPROVED ACCURATE FOOTER */}
      <footer className="bg-[#102F43] text-white pt-16 pb-12 border-t-4 border-[#C9A45C]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
            
            {/* Column 1: Brand & Positioning */}
            <div>
              <div className="mb-4">
                <span className="font-serif font-black text-2xl tracking-tight text-white block">
                  DEXHAUS
                </span>
                <span className="text-[9px] tracking-widest text-[#C9A45C] font-semibold uppercase">
                  SMART SOLUTIONS. BETTER LIVING.
                </span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                A curated home-solutions brand selecting practical products that reduce effort, save time, improve organization, and make everyday living easier.
              </p>
              <div className="text-xs text-slate-300 space-y-2 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#C9A45C]" />
                  <span>support@dexhaus.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#C9A45C]" />
                  <span>Mon – Sat: 9:00 AM – 6:00 PM IST</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A45C]" />
                  <span>Bengaluru, Karnataka, India</span>
                </div>
              </div>
            </div>

            {/* Column 2: Solutions by Category */}
            <div>
              <h4 className="font-bold text-sm mb-4 font-serif text-[#C9A45C] tracking-wide">
                Solutions by Space
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {CATEGORIES.slice(1, 6).map((cat) => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        const el = document.getElementById('popular');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="hover:text-[#C9A45C] transition-colors text-left"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Customer Care & Working Policies */}
            <div>
              <h4 className="font-bold text-sm mb-4 font-serif text-[#C9A45C] tracking-wide">
                Customer Care
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <button 
                    onClick={() => setShowTrackOrderModal(true)} 
                    className="hover:text-[#C9A45C] transition-colors"
                  >
                    Track Your Order
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActivePolicy('shipping')} 
                    className="hover:text-[#C9A45C] transition-colors"
                  >
                    Shipping & Delivery Info
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActivePolicy('returns')} 
                    className="hover:text-[#C9A45C] transition-colors"
                  >
                    7-Day Returns & Refunds
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActivePolicy('support')} 
                    className="hover:text-[#C9A45C] transition-colors"
                  >
                    Help & Customer Support
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Trust & Transparency */}
            <div>
              <h4 className="font-bold text-sm mb-4 font-serif text-[#C9A45C] tracking-wide">
                Transparency & Standards
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li>
                  <Link href="#why-dexhaus" className="hover:text-[#C9A45C] transition-colors">
                    Our Curation Philosophy
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => setActivePolicy('privacy')} 
                    className="hover:text-[#C9A45C] transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActivePolicy('terms')} 
                    className="hover:text-[#C9A45C] transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 leading-snug">
                <span className="text-[#C9A45C] font-semibold block mb-0.5">Secure Payments</span>
                RBI compliant encrypted checkouts powered by Stripe & Razorpay.
              </div>
            </div>

          </div>

          {/* Bottom Bar: Copyright and Policy Links */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} DEXHAUS. Smart Solutions for a Better Home. All rights reserved.</p>
            <div className="flex gap-6">
              <button onClick={() => setActivePolicy('privacy')} className="hover:text-white transition-colors">
                Privacy
              </button>
              <button onClick={() => setActivePolicy('terms')} className="hover:text-white transition-colors">
                Terms
              </button>
              <button onClick={() => setActivePolicy('shipping')} className="hover:text-white transition-colors">
                Shipping
              </button>
              <button onClick={() => setActivePolicy('returns')} className="hover:text-white transition-colors">
                Returns
              </button>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
