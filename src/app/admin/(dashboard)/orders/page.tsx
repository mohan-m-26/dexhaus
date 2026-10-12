'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  RefreshCw, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChevronRight, 
  Eye, 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Package, 
  ExternalLink 
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface OrderItem {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderRecord {
  id: string;
  order_id?: string;
  customer_name?: string;
  customer_email?: string;
  phone?: string;
  address?: string;
  address_line?: string;
  city?: string;
  state?: string;
  pincode?: string;
  items?: OrderItem[];
  total_amount?: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  created_at?: string;
  stripe_session_id?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadOrders = async () => {
    setLoading(true);
    let allOrders: OrderRecord[] = [];

    // 1. Fetch from Supabase
    try {
      const { data: remoteOrders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (remoteOrders && !error) {
        allOrders = remoteOrders.map((ro: any) => ({
          id: ro.id?.toString() || ro.order_id || `DX-${Date.now().toString().slice(-4)}`,
          order_id: ro.order_id || ro.stripe_session_id || ro.id?.toString(),
          customer_name: ro.customer_name || 'Customer',
          customer_email: ro.customer_email || '—',
          phone: ro.phone || '—',
          address: ro.address || (ro.city ? `${ro.city}, ${ro.state || ''}` : '—'),
          city: ro.city || '',
          state: ro.state || '',
          pincode: ro.pincode || '',
          items: ro.items || [],
          total_amount: ro.total_amount || 0,
          status: ro.status || 'Processing',
          created_at: ro.created_at || new Date().toISOString(),
          stripe_session_id: ro.stripe_session_id,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch orders notice:', err);
    }

    // 2. Fetch from Local Storage (client orders cache)
    try {
      const localStr = localStorage.getItem('dexhaus_orders');
      if (localStr) {
        const localList: OrderRecord[] = JSON.parse(localStr);
        // Merge without duplicates
        for (const lo of localList) {
          const exists = allOrders.some(
            (o) => o.id === lo.id || (lo.order_id && o.order_id === lo.order_id) || (lo.order_id && o.id === lo.order_id)
          );
          if (!exists) {
            allOrders.push(lo);
          }
        }
      }
    } catch (e) {}

    // Sort descending by date
    allOrders.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    setOrders(allOrders);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderRecord['status']) => {
    // 1. Update local state
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId || ord.order_id === orderId ? { ...ord, status: newStatus } : ord))
    );
    if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.order_id === orderId)) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    // 2. Update localStorage
    try {
      const localStr = localStorage.getItem('dexhaus_orders');
      if (localStr) {
        const list: OrderRecord[] = JSON.parse(localStr);
        const updated = list.map((ord) =>
          ord.id === orderId || ord.order_id === orderId ? { ...ord, status: newStatus } : ord
        );
        localStorage.setItem('dexhaus_orders', JSON.stringify(updated));
      }
    } catch (e) {}

    // 3. Update Supabase
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    } catch (e) {}
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = 
      !query ||
      (order.id && order.id.toLowerCase().includes(query)) ||
      (order.order_id && order.order_id.toLowerCase().includes(query)) ||
      (order.customer_name && order.customer_name.toLowerCase().includes(query)) ||
      (order.customer_email && order.customer_email.toLowerCase().includes(query)) ||
      (order.phone && order.phone.includes(query));

    return matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
            <Truck className="w-3 h-3" /> Shipped
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest text-[#C9A45C] uppercase">Order Logistics</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              Supabase Connected
            </span>
          </div>
          <h2 className="text-3xl font-bold font-serif text-[#102F43] dark:text-white">Customer Orders</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review customer orders, dispatch parcels, and update real-time shipment milestones.
          </p>
        </div>

        <button
          onClick={loadOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Orders
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#102F43] dark:focus:border-[#C9A45C]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['all', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-[#102F43] text-white dark:bg-[#C9A45C] dark:text-[#102F43]'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {status === 'all' ? 'All Orders' : status}
            </button>
          ))}
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-[#F8F5ED] dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <ShoppingCart className="w-6 h-6" />
                      </div>
                      <p className="font-medium">No orders found.</p>
                      <p className="text-[11px] text-slate-400">When customers place orders via the storefront, they appear here instantly.</p>
                      <Link 
                        href="/" 
                        target="_blank"
                        className="mt-2 text-xs font-bold text-[#102F43] dark:text-[#C9A45C] hover:underline inline-flex items-center gap-1"
                      >
                        Visit Storefront <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const displayId = order.order_id || order.id;
                  const dateStr = order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }) : 'Recent';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-[#102F43] dark:text-[#C9A45C]">
                        #{displayId}
                        <span className="block text-[10px] font-sans font-normal text-slate-400">{dateStr}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white">{order.customer_name || 'Customer'}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{order.customer_email || order.phone || '—'}</div>
                      </td>
                      <td className="px-6 py-4 max-w-[200px] truncate text-slate-600 dark:text-slate-300">
                        {order.city ? `${order.city}${order.state ? `, ${order.state}` : ''}` : order.address || 'Pan-India Delivery'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-serif font-bold text-slate-900 dark:text-white">
                        ₹{order.total_amount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#102F43] hover:text-white dark:hover:bg-[#C9A45C] dark:hover:text-[#102F43] font-bold text-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A45C]">Order Dossier</span>
                <h3 className="text-2xl font-bold font-serif text-[#102F43] dark:text-white">
                  #{selectedOrder.order_id || selectedOrder.id}
                </h3>
              </div>
              <div className="pr-10">
                {getStatusBadge(selectedOrder.status)}
              </div>
            </div>

            {/* Change Status Control */}
            <div className="bg-[#F8F5ED] dark:bg-slate-800/60 p-4 rounded-2xl mb-6 flex flex-wrap items-center justify-between gap-3 border border-amber-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Update Order Status:</span>
                <span className="text-[10px] text-slate-500">Milestone updates appear instantly to customer.</span>
              </div>
              <div className="flex items-center gap-1.5">
                {(['Processing', 'Shipped', 'Delivered', 'Cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedOrder.status === st
                        ? 'bg-[#102F43] text-white dark:bg-[#C9A45C] dark:text-[#102F43] shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Delivery Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Customer Details</h4>
                <div className="font-bold text-sm text-slate-900 dark:text-white">{selectedOrder.customer_name || 'Customer'}</div>
                <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#C9A45C]" /> {selectedOrder.customer_email || 'No email provided'}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C9A45C]" /> {selectedOrder.phone || 'No phone provided'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Shipping Address</h4>
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#C9A45C] flex-shrink-0 mt-0.5" />
                  <div>
                    {selectedOrder.address_line && <div>{selectedOrder.address_line}</div>}
                    <div>{selectedOrder.address || 'Pan-India Domestic Address'}</div>
                    {selectedOrder.pincode && <div>PIN: {selectedOrder.pincode}</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Items Ordered */}
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Items in Parcel</h4>
                <div className="space-y-2.5">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 relative flex-shrink-0">
                          {item.image ? (
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400 m-auto mt-2.5" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{item.title}</span>
                          <span className="text-[11px] text-slate-500">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-sm text-[#102F43] dark:text-[#C9A45C]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Total Paid Amount:</span>
              <span className="text-2xl font-serif font-bold text-[#102F43] dark:text-[#C9A45C]">
                ₹{selectedOrder.total_amount || 0}
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
