'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Sparkles, 
  ShoppingCart, 
  LogOut, 
  Sun, 
  Moon, 
  ExternalLink,
  ShieldCheck,
  Video
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Header & Hero Media', href: '/admin/hero', icon: Sparkles },
  { name: 'Products Catalog', href: '/admin/products', icon: Package },
  { name: 'Add Product', href: '/admin/products/new', icon: PlusCircle },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState('Root Admin');

  useEffect(() => {
    // Check local root authentication
    const authStatus = localStorage.getItem('dexhaus_admin_auth');
    const user = localStorage.getItem('dexhaus_admin_user');
    
    if (authStatus !== 'authenticated') {
      router.push('/admin/login');
    } else {
      if (user) setAdminUser(user.toUpperCase());
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('dexhaus_admin_auth');
    localStorage.removeItem('dexhaus_admin_user');
    document.cookie = 'dexhaus_admin_auth=; path=/; max-age=0';
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8F5ED] dark:bg-slate-950 text-[#102F43] dark:text-[#C9A45C] gap-3">
        <div className="w-10 h-10 border-4 border-[#C9A45C] border-t-transparent rounded-full animate-spin" />
        <span className="font-serif font-bold text-sm tracking-wider">Loading Dexhaus Admin...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8F5ED]/50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm z-30"
      >
        {/* Brand Header */}
        <div className="h-20 flex flex-col justify-center px-6 border-b border-slate-200 dark:border-slate-800 bg-[#102F43] text-white">
          <Link href="/admin" className="flex flex-col">
            <span className="font-serif font-black tracking-widest text-lg text-white">DEXHAUS</span>
            <span className="text-[9px] font-bold tracking-widest text-[#C9A45C] uppercase">Admin Control Room</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6">
          <div className="px-4 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Menu</span>
          </div>
          
          <nav className="px-3 space-y-1.5">
            {navigation.map((item) => {
              const isActive = item.href === '/admin' 
                ? pathname === '/admin' 
                : pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    relative group flex items-center px-3.5 py-3 text-xs font-bold rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-[#102F43] text-white dark:bg-[#C9A45C] dark:text-[#102F43] shadow-md' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'}
                  `}
                >
                  <item.icon
                    className={`mr-3 h-4 w-4 transition-colors ${isActive ? 'text-[#C9A45C] dark:text-[#102F43]' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}
                  />
                  {item.name}
                  {item.name === 'Header & Hero Media' && (
                    <span className="ml-auto bg-[#C9A45C]/20 text-[#C9A45C] text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                      NEW
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 mt-8 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Storefront</span>
          </div>

          <div className="px-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center px-3.5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800/40 hover:text-[#102F43] dark:hover:text-[#C9A45C] transition-colors border border-dashed border-slate-200 dark:border-slate-800"
            >
              <ExternalLink className="mr-3 h-4 w-4 text-[#C9A45C]" />
              View Live Storefront
            </Link>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono">{adminUser} Active</span>
          </div>

          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center w-full px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
          >
            {theme === 'dark' ? <Sun className="mr-3 h-4 w-4 text-amber-500" /> : <Moon className="mr-3 h-4 w-4 text-slate-400" />}
            {theme === 'dark' ? 'Light Appearance' : 'Dark Appearance'}
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#C9A45C]" />
            <h1 className="text-base font-bold font-serif text-[#102F43] dark:text-white">
              Dexhaus Integrated Store Management
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 hidden sm:inline">
              Store Sync: <strong className="text-emerald-600 dark:text-emerald-400">Real-Time Active</strong>
            </span>
            <Link 
              href="/" 
              className="text-xs font-bold px-3 py-1.5 bg-[#102F43] text-white dark:bg-[#C9A45C] dark:text-[#102F43] rounded-lg hover:opacity-90 flex items-center gap-1.5"
            >
              Live Preview <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
