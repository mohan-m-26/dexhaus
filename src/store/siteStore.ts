import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  title: string;
  category: string;
  categoryKey: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverVideo?: string;
  hoverImage?: string;
  specs: string;
  benefit: string;
  inStock?: boolean;
  badge?: string;
}

export interface HeroSlide {
  id: string;
  badgeText: string;
  title: string;
  highlightText: string;
  subtitle: string;
  mediaType: 'image' | 'video';
  imageUrl: string;
  videoUrl: string;
  redirectUrl: string;
  ctaText: string;
  targetProductId?: string;
}

export interface HeroConfig {
  badgeText: string;
  title: string;
  highlightText: string;
  subtitle: string;
  mediaType: 'image' | 'video';
  imageUrl: string;
  videoUrl: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  bannerAnnouncement: string;
  slides: HeroSlide[];
  autoSlideInterval?: number; // In seconds, default 5
}

export const INITIAL_HERO_CONFIG: HeroConfig = {
  badgeText: "YOUR HOME SOLUTIONS DESTINATION",
  title: "One Destination.",
  highlightText: "Smarter Solutions",
  subtitle: "Discover practical home solutions in one place. From kitchen organization and effortless cleaning to space-saving storage and everyday convenience, Dexhaus brings useful products together to make better living easier.",
  mediaType: 'image',
  imageUrl: "/hero-lifestyle.jpg",
  videoUrl: "/hero-video.mp4",
  primaryCtaText: "Explore Solutions",
  primaryCtaLink: "#popular",
  secondaryCtaText: "View Problem Kits",
  secondaryCtaLink: "#combos",
  bannerAnnouncement: "YOUR HOME SOLUTIONS DESTINATION • FREE PAN-INDIA DELIVERY ON ORDERS OVER ₹999",
  autoSlideInterval: 5,
  slides: [
    {
      id: "slide-mop",
      badgeText: "LIVE DEMO • CLEANING INNOVATION",
      title: "Dual-Chamber Hands-Free Flat Mop System",
      highlightText: "Streak-Free Cleaning",
      subtitle: "Cleans tile and hardwood effortlessly without manual wringing or dirty hands. Complete with 360° swivel head and dual microfiber pads.",
      mediaType: "video",
      imageUrl: "/product-microfiber-mop.jpg",
      videoUrl: "/hero-video.mp4",
      redirectUrl: "#prod-cleaning-1",
      ctaText: "Shop Flat Mop System",
      targetProductId: "prod-cleaning-1"
    },
    {
      id: "slide-kitchen",
      badgeText: "BESTSELLER • KITCHEN ORGANIZATION",
      title: "2-Tier Countertop Spice & Bottle Organizer",
      highlightText: "Double Your Counter Space",
      subtitle: "Heavy-duty matte black steel with non-slip feet. Keep cooking oils, spices, and jars neatly organized and within instant reach.",
      mediaType: "image",
      imageUrl: "/product-kitchen-organizer.jpg",
      videoUrl: "/hero-video.mp4",
      redirectUrl: "#prod-kitchen-1",
      ctaText: "Get Countertop Rack",
      targetProductId: "prod-kitchen-1"
    },
    {
      id: "slide-bathroom",
      badgeText: "POPULAR • NO-DRILL BATHROOM",
      title: "Rustproof 3-Tier Corner Shower Caddy",
      highlightText: "Zero Tile Damage",
      subtitle: "High-capacity corrosion-resistant steel rack with rapid drainage and ultra-strong adhesive mounting. No tools or drilling required.",
      mediaType: "video",
      imageUrl: "/product-bathroom-rack.jpg",
      videoUrl: "/hero-video.mp4",
      redirectUrl: "#prod-bathroom-1",
      ctaText: "Order Shower Caddy",
      targetProductId: "prod-bathroom-1"
    },
    {
      id: "slide-storage",
      badgeText: "SPACE SAVER • SMART STORAGE",
      title: "Reinforced Clear-Window Fabric Storage Box",
      highlightText: "Effortless Identification",
      subtitle: "High-density linen-blend fabric with dual metal zippers and clear front window for easy visibility of quilts, clothes, and seasonal linens.",
      mediaType: "image",
      imageUrl: "/product-storage-box.jpg",
      videoUrl: "/hero-video.mp4",
      redirectUrl: "#prod-storage-1",
      ctaText: "View Storage Solutions",
      targetProductId: "prod-storage-1"
    }
  ]
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-kitchen-1",
    title: "2-Tier Countertop Spice & Bottle Organizer",
    category: "Kitchen Solutions",
    categoryKey: "kitchen",
    price: 899,
    originalPrice: 1299,
    image: "/product-kitchen-organizer.jpg",
    hoverVideo: "/hero-video.mp4",
    hoverImage: "",
    specs: "Matte black steel frame • Double-tier clearance • Non-slip feet",
    benefit: "Frees up counter surface and keeps everyday cooking essentials within reach.",
    inStock: true,
    badge: "Bestseller",
  },
  {
    id: "prod-cleaning-1",
    title: "Dual-Chamber Hands-Free Flat Mop System",
    category: "Cleaning Solutions",
    categoryKey: "cleaning",
    price: 699,
    originalPrice: 999,
    image: "/product-microfiber-mop.jpg",
    hoverVideo: "/hero-video.mp4",
    hoverImage: "",
    specs: "Dual wash & dry chambers • 360° swivel head • 2x Microfiber pads",
    benefit: "Cleans tile and wood streak-free without dirtying hands or manual wringing.",
    inStock: true,
    badge: "Most Practical",
  },
  {
    id: "prod-bathroom-1",
    title: "Rustproof 3-Tier Corner Shower Caddy",
    category: "Bathroom Solutions",
    categoryKey: "bathroom",
    price: 649,
    originalPrice: 899,
    image: "/product-bathroom-rack.jpg",
    hoverVideo: "/hero-video.mp4",
    hoverImage: "",
    specs: "Corrosion-resistant steel • Heavy-duty adhesive mount • Water drainage slots",
    benefit: "Holds bottles securely without drilling into bathroom tiles or causing rust.",
    inStock: true,
  },
  {
    id: "prod-storage-1",
    title: "Reinforced Clear-Window Fabric Storage Box",
    category: "Storage & Organization",
    categoryKey: "storage",
    price: 449,
    originalPrice: 699,
    image: "/product-storage-box.jpg",
    hoverVideo: "",
    hoverImage: "",
    specs: "High-density linen-blend fabric • Dual metal zippers • Front clear viewport",
    benefit: "Protects seasonal garments, quilts, and bed linen while keeping contents identifiable.",
    inStock: true,
    badge: "Essential",
  },
  {
    id: "prod-space-1",
    title: "Under-Sink 2-Tier Sliding Drawer Rack",
    category: "Space-Saving Solutions",
    categoryKey: "space-saving",
    price: 1099,
    originalPrice: 1599,
    image: "/product-under-sink.jpg",
    hoverVideo: "",
    hoverImage: "",
    specs: "Steel wire pull-out drawer • Clears vertical plumbing pipes • Modular height",
    benefit: "Turns awkward, unused under-sink cabinet cavities into structured pull-out storage.",
    inStock: true,
  },
  {
    id: "prod-convenience-1",
    title: "Bamboo-Top Cable Concealer & Surge Box",
    category: "Home Convenience",
    categoryKey: "convenience",
    price: 699,
    originalPrice: 999,
    image: "/product-cable-box.jpg",
    hoverVideo: "",
    hoverImage: "",
    specs: "Fire-retardant ABS housing • Natural bamboo lid • Side ventilation ports",
    benefit: "Conceals power strips and tangled cords to protect curious pets and eliminate visual clutter.",
    inStock: true,
  },
  {
    id: "prod-laundry-1",
    title: "9-Hole Cascading Wardrobe Space-Saver Hangers",
    category: "Laundry & Wardrobe",
    categoryKey: "laundry",
    price: 499,
    originalPrice: 799,
    image: "/product-cascading-hangers.jpg",
    hoverVideo: "",
    hoverImage: "",
    specs: "Pack of 6 cascading hangers • 360° rotating hook • Vertical & horizontal modes",
    benefit: "Quadruples closet hanging space and keeps shirts crease-free in compact wardrobes.",
    inStock: true,
  },
  {
    id: "prod-convenience-2",
    title: "Magnetic Warm-LED Motion Sensor Nightlight",
    category: "Home Convenience",
    categoryKey: "convenience",
    price: 549,
    originalPrice: 799,
    image: "/product-motion-sensor-light.jpg",
    hoverVideo: "",
    hoverImage: "",
    specs: "USB rechargeable • Magnetic stick-on strip • Automatic ambient motion detection",
    benefit: "Provides hands-free night lighting for dark staircases, closets, and hallways.",
    inStock: true,
    badge: "Smart Home",
  }
];

export const CATEGORY_OPTIONS = [
  { id: "kitchen", name: "Kitchen Solutions", icon: "🍳" },
  { id: "cleaning", name: "Cleaning Solutions", icon: "🧹" },
  { id: "storage", name: "Storage & Organization", icon: "📦" },
  { id: "bathroom", name: "Bathroom Solutions", icon: "🛁" },
  { id: "laundry", name: "Laundry & Wardrobe", icon: "👔" },
  { id: "space-saving", name: "Space-Saving Solutions", icon: "📐" },
  { id: "convenience", name: "Home Convenience", icon: "💡" },
];

interface SiteStore {
  heroConfig: HeroConfig;
  products: Product[];
  updateHeroConfig: (config: Partial<HeroConfig>) => void;
  resetHeroConfig: () => void;
  addProduct: (product: Omit<Product, 'id'> & { id?: string }) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  resetToDefaultProducts: () => void;
}

export const useSiteStore = create<SiteStore>()(
  persist(
    (set) => ({
      heroConfig: INITIAL_HERO_CONFIG,
      products: INITIAL_PRODUCTS,

      updateHeroConfig: (newConfig) => {
        set((state) => ({
          heroConfig: { ...state.heroConfig, ...newConfig }
        }));
      },

      resetHeroConfig: () => {
        set({ heroConfig: INITIAL_HERO_CONFIG });
      },

      addProduct: (newProd) => {
        const id = newProd.id || `prod-custom-${Date.now()}`;
        const product: Product = {
          ...newProd,
          id,
          inStock: newProd.inStock !== undefined ? newProd.inStock : true,
        };
        set((state) => ({
          products: [product, ...state.products]
        }));
      },

      updateProduct: (id, updatedFields) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updatedFields } : p
          )
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id)
        }));
      },

      toggleProductStock: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, inStock: !p.inStock } : p
          )
        }));
      },

      resetToDefaultProducts: () => {
        set({ products: INITIAL_PRODUCTS });
      }
    }),
    {
      name: 'dexhaus_site_data_v3',
    }
  )
);
