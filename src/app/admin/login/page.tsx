'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Lock, User, ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Accepted root admin credentials
  const VALID_USERS = ['admin', 'dexhaus', 'root'];
  const VALID_PASSWORDS = ['dexhaus2026', 'admin123', 'dexhaus@admin'];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget as HTMLFormElement;
    const cleanUser = (username.trim() || (form.elements.namedItem('username') as HTMLInputElement)?.value?.trim() || '').toLowerCase();
    const cleanPass = password.trim() || (form.elements.namedItem('password') as HTMLInputElement)?.value?.trim() || '';

    if (VALID_USERS.includes(cleanUser) && VALID_PASSWORDS.includes(cleanPass)) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('dexhaus_admin_auth', 'authenticated');
        localStorage.setItem('dexhaus_admin_user', cleanUser);
        document.cookie = 'dexhaus_admin_auth=true; path=/; max-age=604800'; // 7 days
      }
      setTimeout(() => {
        router.push('/admin');
      }, 400);
    } else {
      setLoading(false);
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#F8F5ED] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">
      
      {/* Left Pane - Dexhaus Brand Luxury Presentation */}
      <div className="relative hidden w-1/2 lg:flex flex-col justify-between overflow-hidden bg-[#102F43] group p-16">
        
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-[20%] -left-[20%] w-[600px] h-[600px] rounded-full bg-[#C9A45C]/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[130px] pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 transition-transform hover:scale-105">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image 
                src="/Dexhaus_icon_transparent.png" 
                alt="DEXHAUS" 
                width={40} 
                height={40} 
                className="w-full h-full object-contain invert" 
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black tracking-widest text-2xl text-white leading-none">DEXHAUS</span>
              <span className="block text-[9px] tracking-[0.25em] text-[#C9A45C] font-bold uppercase mt-1">
                Smart Solutions. Better Living.
              </span>
            </div>
          </Link>
        </div>

        {/* Center Copy */}
        <div className="relative z-10 max-w-lg text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#C9A45C] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Dexhaus Control Center
          </div>
          
          <h1 className="text-4xl 2xl:text-5xl font-bold leading-tight font-serif tracking-tight">
            Storefront Management <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A45C] to-[#e8d5a8]">
              Portal
            </span>
          </h1>

          <p className="mt-6 text-base text-slate-300 font-light leading-relaxed border-l-2 border-[#C9A45C] pl-5">
            Authorized administrative access for managing products, header media, and store catalog operations.
          </p>

          <div className="mt-8 flex items-center gap-2 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-[#C9A45C]" />
            <span>Secure Encrypted Session</span>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="relative z-10 text-xs text-slate-400">
          Dexhaus Storefront Management Engine v2.0
        </div>
      </div>

      {/* Right Pane - Single Root Login Form */}
      <div className="flex w-full flex-col lg:w-1/2 relative bg-white dark:bg-slate-900 overflow-y-auto">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center p-8 relative z-10">
          <div className="lg:hidden flex items-center gap-2">
            <Image 
              src="/Dexhaus_icon_transparent.png" 
              alt="DEXHAUS" 
              width={28} 
              height={28} 
              className="w-7 h-7 object-contain" 
            />
            <span className="font-serif font-black tracking-wider text-xl text-[#102F43] dark:text-white">DEXHAUS</span>
          </div>
          <Link 
            href="/" 
            className="flex items-center text-xs font-bold text-slate-500 hover:text-[#102F43] dark:hover:text-[#C9A45C] transition-colors group ml-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Storefront
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex flex-1 items-center justify-center px-8 sm:px-16 lg:px-20 relative z-10 pb-12">
          <div className="w-full max-w-md">
            
            <div className="mb-8">
              <div className="w-12 h-12 bg-[#102F43] text-[#C9A45C] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold font-serif text-[#102F43] dark:text-white">
                Admin Sign In
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Enter your credentials to access the Dexhaus management dashboard.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Admin Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="admin-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-[#102F43] dark:focus:border-[#C9A45C] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="admin-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-[#102F43] dark:focus:border-[#C9A45C] dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#102F43] dark:bg-[#C9A45C] text-white dark:text-[#102F43] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#183f5a] dark:hover:bg-[#b8924b] transition-all shadow-lg active:scale-[0.99] disabled:opacity-70 mt-6"
              >
                {loading ? 'Authenticating...' : (
                  <>SIGN IN <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

          </div>
        </div>
      </div>

    </div>
  );
}
