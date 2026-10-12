'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Truck, Package, Copy, Check, ShieldCheck } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get('order_id');
  const [order, setOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const lastOrderStr = localStorage.getItem('dexhaus_last_order');
      if (lastOrderStr) {
        const parsed = JSON.parse(lastOrderStr);
        setOrder(parsed);
      }
    } catch (e) {}
  }, []);

  const displayOrderId = queryOrderId || order?.order_id || order?.id || 'DX-CONFIRMED';

  const handleCopy = () => {
    navigator.clipboard.writeText(displayOrderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-slate-950 flex flex-col items-center justify-center p-4 py-12">
      <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#e2c174]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100 dark:border-emerald-800/40">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold font-serif text-[#112a46] dark:text-white mb-2">
          Order Confirmed!
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Thank you for choosing Dexhaus. Your order has been placed successfully and dispatched to our fulfillment center.
        </p>

        {/* Order Reference Box */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 mb-6 border border-slate-200 dark:border-slate-700 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Order Reference</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#112a46] dark:text-[#e2c174] hover:opacity-80 transition-opacity"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="font-mono text-lg font-bold text-[#112a46] dark:text-white">
            #{displayOrderId}
          </div>

          {order && (
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Customer:</span>
                <strong className="text-slate-900 dark:text-white">{order.customer_name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Destination:</span>
                <span className="truncate max-w-[200px] text-right font-medium">{order.city}, {order.state}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <strong className="text-[#112a46] dark:text-[#e2c174] font-serif font-bold">₹{order.total_amount}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Guarantee Info */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs mb-8 text-left">
          <Truck className="w-5 h-5 flex-shrink-0 text-[#C9A45C]" />
          <span>Estimated delivery: <strong>3 to 5 business days</strong> with pan-India parcel insurance.</span>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Link 
            href={`/?track=${encodeURIComponent(displayOrderId)}#track-order`}
            className="inline-flex items-center justify-center w-full bg-[#112a46] dark:bg-[#e2c174] text-white dark:text-[#112a46] py-3.5 rounded-xl font-bold text-sm hover:scale-[1.01] active:scale-[0.99] transition-transform shadow-lg gap-2"
          >
            <Truck className="w-4 h-4" /> Track This Shipment
          </Link>
          
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 rounded-xl font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Back to Storefront <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Dexhaus Verified Purchase Guarantee</span>
        </div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf9f6] dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#112a46] dark:border-[#e2c174] border-t-transparent rounded-full" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
