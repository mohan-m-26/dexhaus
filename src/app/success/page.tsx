import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100 dark:border-slate-800">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold font-serif text-[#112a46] dark:text-white mb-2">Order Confirmed!</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Thank you for shopping with Dexhaus. We've received your order and will start processing it immediately.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center w-full bg-[#0a2540] dark:bg-[#e2c174] text-white dark:text-[#0a2540] py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
        >
          CONTINUE SHOPPING <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
