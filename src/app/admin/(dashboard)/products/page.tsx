import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 font-serif">Products</h2>
        <Link 
          href="/admin/products/new"
          className="flex items-center rounded-lg bg-[#0a2540] px-4 py-2 text-sm font-bold text-white hover:bg-[#071b2f] transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Real data will be mapped here from Supabase */}
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                No products yet. Click "Add Product" to create your first one.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
