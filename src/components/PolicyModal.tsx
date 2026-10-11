'use client';

import { X, Truck, RotateCcw, ShieldCheck, FileText, Headphones, Mail, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type PolicyType = 'shipping' | 'returns' | 'privacy' | 'terms' | 'support' | null;

interface PolicyModalProps {
  activePolicy: PolicyType;
  onClose: () => void;
  onSelectPolicy: (policy: PolicyType) => void;
}

export default function PolicyModal({ activePolicy, onClose, onSelectPolicy }: PolicyModalProps) {
  if (!activePolicy) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#FFFFFF] dark:bg-slate-950 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] z-10"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-900 bg-[#F8F5ED] dark:bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-[#102F43] text-white">
                {activePolicy === 'shipping' && <Truck className="w-5 h-5 text-[#C9A45C]" />}
                {activePolicy === 'returns' && <RotateCcw className="w-5 h-5 text-[#C9A45C]" />}
                {activePolicy === 'privacy' && <ShieldCheck className="w-5 h-5 text-[#C9A45C]" />}
                {activePolicy === 'terms' && <FileText className="w-5 h-5 text-[#C9A45C]" />}
                {activePolicy === 'support' && <Headphones className="w-5 h-5 text-[#C9A45C]" />}
              </span>
              <div>
                <h3 className="text-xl font-serif font-bold text-[#102F43] dark:text-white">
                  {activePolicy === 'shipping' && 'Shipping & Delivery Policy'}
                  {activePolicy === 'returns' && '7-Day Return & Refund Policy'}
                  {activePolicy === 'privacy' && 'Customer Privacy Policy'}
                  {activePolicy === 'terms' && 'Terms of Service'}
                  {activePolicy === 'support' && 'Customer Support & Contact'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  DEXHAUS Official Brand Policies & Care
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Policy Navigation Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 px-6 py-2 gap-2 text-xs font-semibold hide-scrollbar">
            <button
              onClick={() => onSelectPolicy('shipping')}
              className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                activePolicy === 'shipping'
                  ? 'bg-[#102F43] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Shipping
            </button>
            <button
              onClick={() => onSelectPolicy('returns')}
              className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                activePolicy === 'returns'
                  ? 'bg-[#102F43] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Returns & Refunds
            </button>
            <button
              onClick={() => onSelectPolicy('support')}
              className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                activePolicy === 'support'
                  ? 'bg-[#102F43] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Customer Support
            </button>
            <button
              onClick={() => onSelectPolicy('privacy')}
              className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                activePolicy === 'privacy'
                  ? 'bg-[#102F43] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onSelectPolicy('terms')}
              className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                activePolicy === 'terms'
                  ? 'bg-[#102F43] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Terms of Service
            </button>
          </div>

          {/* Modal Body Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {activePolicy === 'shipping' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#F8F5ED] dark:bg-slate-900 border border-amber-100 dark:border-slate-800">
                  <h4 className="font-bold text-[#102F43] dark:text-[#C9A45C] text-sm mb-1">
                    Free Standard Delivery
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Complimentary standard shipping applies automatically on all domestic orders valued at ₹999 or higher. For orders under ₹999, a flat delivery fee of ₹79 applies.
                  </p>
                </div>

                <h4 className="font-bold text-[#102F43] dark:text-white">Dispatch & Timelines</h4>
                <p>
                  All confirmed orders are processed and packed from our fulfillment hub within <strong>24 to 48 business hours</strong>. Delivery timelines typically range from <strong>3 to 5 business days</strong> depending on your pincode.
                </p>

                <h4 className="font-bold text-[#102F43] dark:text-white">Order Tracking</h4>
                <p>
                  As soon as your package is dispatched, you receive an automated confirmation email and SMS containing your live courier tracking link (BlueDart / Delhivery).
                </p>

                <h4 className="font-bold text-[#102F43] dark:text-white">Damaged in Transit</h4>
                <p>
                  If an item arrives damaged or compromised during transit, please photograph the package and contact our support team within 48 hours for immediate replacement.
                </p>
              </div>
            )}

            {activePolicy === 'returns' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#F8F5ED] dark:bg-slate-900 border border-amber-100 dark:border-slate-800">
                  <h4 className="font-bold text-[#102F43] dark:text-[#C9A45C] text-sm mb-1">
                    7-Day Hassle-Free Returns
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    We want every Dexhaus solution to genuinely improve your home. If a product does not fit your space or meet your expectations, return it within 7 calendar days of receipt.
                  </p>
                </div>

                <h4 className="font-bold text-[#102F43] dark:text-white">Eligibility Criteria</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <li>Items must be in original, unused condition with all original packaging, tags, and parts intact.</li>
                  <li>Proof of purchase (order confirmation ID or invoice) is required.</li>
                  <li>Customized or clearance bundle items with explicitly stated final-sale tags are non-returnable unless defective.</li>
                </ul>

                <h4 className="font-bold text-[#102F43] dark:text-white">Refund Processing</h4>
                <p>
                  Upon pickup and inspection at our facility, refunds are initiated within 48 business hours back to your original payment method (prepaid cards/UPI) or credited via bank transfer for COD orders.
                </p>
              </div>
            )}

            {activePolicy === 'support' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#102F43] text-white space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#C9A45C]" />
                    <div>
                      <span className="text-xs text-slate-300 block">Direct Support Email</span>
                      <strong className="text-white text-base">support@dexhaus.com</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                    <Clock className="w-5 h-5 text-[#C9A45C]" />
                    <div>
                      <span className="text-xs text-slate-300 block">Operational Hours</span>
                      <span className="text-white text-xs font-medium">Monday – Saturday: 9:00 AM – 6:00 PM IST</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                    <MapPin className="w-5 h-5 text-[#C9A45C]" />
                    <div>
                      <span className="text-xs text-slate-300 block">Brand Operations Office</span>
                      <span className="text-white text-xs font-medium">Dexhaus Household Solutions, Bengaluru, Karnataka 560001, India</span>
                    </div>
                  </div>
                </div>

                <h4 className="font-bold text-[#102F43] dark:text-white">How We Help</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Whether you have questions regarding dimensions before purchasing, need assistance installing an adhesive caddy, or wish to track an existing shipment, our Bengaluru-based support desk answers emails within 24 business hours.
                </p>
              </div>
            )}

            {activePolicy === 'privacy' && (
              <div className="space-y-4">
                <h4 className="font-bold text-[#102F43] dark:text-white">Commitment to Your Privacy</h4>
                <p>
                  At Dexhaus, we believe respect for your home extends to respect for your data. We collect only essential details necessary to process orders, fulfill shipments, and deliver customer support.
                </p>

                <h4 className="font-bold text-[#102F43] dark:text-white">Information We Collect</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Name, shipping address, contact phone number, and email address. We do not store credit card numbers, CVVs, or UPI PINs on our servers; all payments are processed through RBI-compliant, 256-bit SSL encrypted gateways (Stripe / Razorpay).
                </p>

                <h4 className="font-bold text-[#102F43] dark:text-white">No Third-Party Ad Brokers</h4>
                <p>
                  We strictly never rent, monetize, or sell customer personal data to third-party marketing companies. You may request account deletion or data export anytime by emailing support@dexhaus.com.
                </p>
              </div>
            )}

            {activePolicy === 'terms' && (
              <div className="space-y-4">
                <h4 className="font-bold text-[#102F43] dark:text-white">Terms of Service</h4>
                <p>
                  By accessing or purchasing from Dexhaus, you agree to standard fair terms of service. We strive to provide transparent product descriptions, accurate dimensions, and genuine pricing without hidden fees.
                </p>

                <h4 className="font-bold text-[#102F43] dark:text-white">Product Use & Care</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Dexhaus provides practical home-solutions designed for normal domestic household use. Customers are advised to adhere to recommended weight limits specified on each product card (e.g., maximum load for adhesive organizers or floating caddies).
                </p>

                <h4 className="font-bold text-[#102F43] dark:text-white">Pricing & Accuracy</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  All listed prices are in Indian Rupees (INR) and are inclusive of applicable GST taxes. In the event of an inadvertent technical display error, we reserve the right to contact the customer and rectify the order.
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-[#102F43] text-white text-xs font-bold hover:bg-[#183f5a] transition-colors"
            >
              Close Window
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
