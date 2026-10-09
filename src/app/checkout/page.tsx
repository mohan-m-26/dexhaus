'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { ChevronLeft, ShieldCheck, CreditCard, Truck, MapPin, Phone, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Pass both items and customer data to our backend checkout API
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customerDetails: formData }),
      });
      const data = await res.json();
      
      // If Stripe returns a URL, go there. Otherwise (simulation mode), go to success.
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error", error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f6] dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold font-serif text-[#112a46] dark:text-white mb-4">Your cart is empty</h1>
        <Link href="/" className="text-[#e2c174] font-bold hover:underline flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      
      {/* Checkout Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image src="/Dexhaus_logo.png" alt="Dexhaus" width={180} height={40} className="h-8 w-auto dark:invert" />
          </Link>
          <div className="flex items-center gap-2 text-sm font-bold text-green-600 dark:text-green-500">
            <ShieldCheck className="w-5 h-5" /> Secure Checkout
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 flex flex-col lg:flex-row gap-10">
        
        {/* Left Side: Forms */}
        <div className="flex-1 space-y-8">
          
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
            
            {/* Shipping Address Section */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold font-serif text-[#112a46] dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#e2c174]" /> Shipping Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input required type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e2c174]" />
                <input required type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e2c174]" />
              </div>
              
              <div className="relative mb-4">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input required type="tel" name="phone" placeholder="Phone Number (For Delivery Updates)" value={formData.phone} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#e2c174]" />
              </div>
              
              <div className="mb-4">
                <input required type="text" name="address" placeholder="Full Street Address" value={formData.address} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e2c174]" />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <input required type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} className="col-span-1 sm:col-span-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e2c174]" />
                <input required type="text" name="state" placeholder="State" value={formData.state} onChange={handleInputChange} className="col-span-1 sm:col-span-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e2c174]" />
                <input required type="text" name="pincode" placeholder="PIN Code" value={formData.pincode} onChange={handleInputChange} className="col-span-2 sm:col-span-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e2c174]" />
              </div>
            </div>

            {/* Payment Method Preview */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 opacity-60">
               <h2 className="text-xl font-bold font-serif text-[#112a46] dark:text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#e2c174]" /> Payment Method
              </h2>
              <div className="p-4 rounded-xl border-2 border-[#e2c174] bg-[#e2c174]/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-[#112a46] dark:text-[#e2c174]" />
                  <span className="font-bold">Secure Online Payment</span>
                </div>
                <div className="flex gap-2">
                   {/* Dummy card icons */}
                   <div className="w-8 h-5 bg-slate-200 rounded"></div>
                   <div className="w-8 h-5 bg-slate-200 rounded"></div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4">You will be securely redirected to Stripe to complete your payment.</p>
            </div>

          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 sticky top-8">
            <h2 className="text-xl font-bold font-serif text-[#112a46] dark:text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                    {item.image === '/hero-image.jpeg' || item.image.includes('Dexhaus_icon') ? (
                       <div className="absolute inset-0 flex items-center justify-center">
                         <Image src="/Dexhaus_icon.png" alt="Dexhaus Placeholder" width={30} height={30} className="opacity-20 grayscale dark:invert" />
                      </div>
                    ) : (
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 justify-center">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-2">{item.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
                      <span className="font-serif font-bold text-[#112a46] dark:text-[#e2c174]">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 mt-6 pt-6 space-y-3">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>₹{getTotal()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-3 flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                <span className="text-2xl font-serif font-bold text-[#112a46] dark:text-[#e2c174]">₹{getTotal()}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full mt-8 bg-[#112a46] dark:bg-[#e2c174] text-white dark:text-[#112a46] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-xl disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'PLACE ORDER & PAY'}
            </button>
            
            <div className="mt-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex gap-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border border-slate-100 dark:border-slate-800">
              <Truck className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <p>Your order will be processed immediately. Expect delivery within 3-5 business days.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
