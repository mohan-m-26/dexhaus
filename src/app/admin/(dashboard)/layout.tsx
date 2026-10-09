'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        setLoading(false);
      }
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) router.push('/admin/login');
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">Loading Admin...</div>;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-lg dark:shadow-none z-10"
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Image src="/Dexhaus_logo.png" alt="Dexhaus Logo" width={150} height={32} className="h-8 w-auto dark:invert dark:opacity-80 transition-all" />
        </div>
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = item.href === '/admin' 
                ? pathname === '/admin' 
                : pathname?.startsWith(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    relative group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300
                    ${isActive ? 'bg-[#0a2540] dark:bg-[#e2c174]/20 text-white dark:text-[#e2c174] shadow-[0_0_15px_rgba(10,37,64,0.3)] dark:shadow-[0_0_15px_rgba(226,193,116,0.2)]' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'}
                  `}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-white dark:text-[#e2c174]' : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'}`}
                  />
                  {item.name}
                  {isActive && (
                    <motion.div layoutId="sidebar-active" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#e2c174] rounded-r-full shadow-[0_0_10px_#e2c174]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center w-full px-3 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
          >
            {theme === 'dark' ? <Sun className="mr-3 h-5 w-5 text-yellow-500" /> : <Moon className="mr-3 h-5 w-5 text-slate-400" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 opacity-80" />
            Sign Out
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtle glow background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#e2c174]/10 dark:bg-[#e2c174]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0a2540]/10 dark:bg-[#0a2540]/20 rounded-full blur-[100px] pointer-events-none -z-10" />

        <header className="h-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-10 sticky top-0 z-20">
          <h1 className="text-2xl font-bold font-serif text-[#112a46] dark:text-slate-100 drop-shadow-sm">Admin Control Room</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Admin Status: <span className="text-green-500 font-bold drop-shadow-[0_0_5px_rgba(34,197,94,0.4)]">Online</span></span>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#0a2540] to-[#112a46] dark:from-[#e2c174] dark:to-[#b39556] flex items-center justify-center text-white dark:text-slate-900 font-bold shadow-lg cursor-pointer hover:scale-105 transition-transform">
              A
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
