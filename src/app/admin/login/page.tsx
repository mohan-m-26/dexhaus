'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, EyeOff, Eye, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!email || !password) {
      setError('Please enter an email and password to create an account.');
      return;
    }
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      alert('Account created! Please check your email to confirm, or if confirmation is off, try signing in.');
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-[#e2c174] selection:text-white transition-colors duration-500">
      
      {/* Left Pane - Abstract Premium Branding */}
      <div className="relative hidden w-1/2 lg:flex flex-col justify-between overflow-hidden bg-[#071321] group">
        
        {/* Animated Glowing Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[20%] w-[800px] h-[800px] rounded-full bg-[#112a46] blur-[120px] pointer-events-none mix-blend-screen"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2], x: [0, 100, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] rounded-full bg-[#e2c174]/20 blur-[150px] pointer-events-none mix-blend-screen"
        />
        
        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 z-0" />

        <div className="relative z-10 p-16 pt-20">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <Image 
              src="/Dexhaus_logo.png" 
              alt="Dexhaus Logo" 
              width={200} 
              height={40} 
              className="h-10 w-auto invert opacity-90 drop-shadow-lg"
              priority
            />
          </Link>
        </div>

        <div className="relative z-10 p-16 pb-24 text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl 2xl:text-6xl font-bold leading-[1.1] font-serif tracking-tight drop-shadow-2xl"
          >
            Smart Solutions <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e2c174] to-[#f4d898]">
              for Better Home
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 max-w-md text-lg text-slate-300 drop-shadow-md border-l-2 border-[#e2c174] pl-5 leading-relaxed font-light"
          >
            Curated products that reduce effort, save time, and make everyday living effortlessly premium.
          </motion.p>
        </div>
      </div>

      {/* Right Pane - Login Form */}
      <div className="flex w-full flex-col lg:w-1/2 relative bg-white dark:bg-slate-950 overflow-y-auto">
        
        {/* Subtle Right Side Glow */}
        <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-[#e2c174]/5 dark:from-[#e2c174]/10 to-transparent pointer-events-none" />
        
        {/* Top Header */}
        <div className="flex justify-between items-center p-8 relative z-10">
          <div className="lg:hidden block">
            <Image src="/Dexhaus_logo.png" alt="Dexhaus" width={140} height={30} className="h-7 w-auto dark:invert dark:opacity-90" />
          </div>
          <Link href="/" className="flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group ml-auto">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Store
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex flex-1 items-center justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10 pb-12">
          <div className="w-full max-w-md">
            
            {/* Welcome Text */}
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl font-bold tracking-tight text-[#112a46] dark:text-white font-serif mb-3">
                Admin Portal
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-base">
                Secure access to the Dexhaus control room.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium flex items-start">
                <span className="block sm:inline">{error}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="group">
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Email address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-[#112a46] dark:group-focus-within:text-[#e2c174] transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 py-3.5 pl-12 pr-4 text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#112a46] dark:focus:border-[#e2c174] focus:outline-none focus:ring-2 focus:ring-[#112a46]/10 dark:focus:ring-[#e2c174]/20 transition-all bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900"
                    placeholder="admin@dexhaus.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold text-[#112a46] dark:text-[#e2c174] hover:underline">Forgot?</a>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#112a46] dark:group-focus-within:text-[#e2c174] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 py-3.5 pl-12 pr-12 text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#112a46] dark:focus:border-[#e2c174] focus:outline-none focus:ring-2 focus:ring-[#112a46]/10 dark:focus:ring-[#e2c174]/20 transition-all bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700"
                    >
                      {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center rounded-xl bg-[#0a2540] dark:bg-[#e2c174] px-4 py-4 text-sm font-bold text-white dark:text-[#0a2540] hover:bg-[#071b2f] dark:hover:bg-[#d1b063] focus:outline-none focus:ring-4 focus:ring-[#0a2540]/30 dark:focus:ring-[#e2c174]/30 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 mt-4"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>SIGN IN <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
              
              {/* Quick Admin Creation */}
              <button
                type="button"
                onClick={handleCreateAccount}
                disabled={loading}
                className="w-full text-center text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#112a46] dark:hover:text-[#e2c174] transition-colors mt-2"
              >
                Or create first Admin account here
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
              <span className="mx-4 text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">OR</span>
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800 transition-all shadow-sm disabled:opacity-70"
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}
