'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Trash2, 
  Video, 
  Image as ImageIcon, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useSiteStore, CATEGORY_OPTIONS } from '@/store/siteStore';

export default function ProductsPage() {
  const { products, deleteProduct, toggleProductStock, resetToDefaultProducts } = useSiteStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.categoryKey === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProduct(id);
    }
  };

  const handleResetCatalog = () => {
    if (confirm("Restore the default curated 8-product Dexhaus catalog? Any custom products will be reset.")) {
      resetToDefaultProducts();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#102F43] dark:text-white">
            Products Catalog
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your practical home solutions, hover video clips, categories, and inventory.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleResetCatalog}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
            title="Reset catalog to curated default set"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Catalog
          </button>
          <Link 
            href="/admin/products/new"
            className="px-5 py-2.5 rounded-xl bg-[#102F43] dark:bg-[#C9A45C] text-white dark:text-[#102F43] text-xs font-bold hover:opacity-90 flex items-center justify-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product title or benefit..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-[#C9A45C]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C9A45C]"
        >
          <option value="all">All Categories ({products.length})</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#102F43] text-white uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="px-5 py-3.5">Product &amp; Visuals</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5">Hover Media</th>
                <th className="px-4 py-3.5">Stock Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No products found matching &ldquo;{search}&rdquo;.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Visual & Title */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                          <Image
                            src={prod.image}
                            alt={prod.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="max-w-xs">
                          <span className="font-bold text-[#102F43] dark:text-white line-clamp-1 block">
                            {prod.title}
                          </span>
                          <span className="text-[10px] text-slate-400 line-clamp-1">
                            {prod.benefit}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        {prod.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#102F43] dark:text-[#C9A45C]">
                          ₹{prod.price}
                        </span>
                        {prod.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹{prod.originalPrice}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Hover Media */}
                    <td className="px-4 py-4">
                      {prod.hoverVideo ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-[10px] font-bold">
                          <Video className="w-3 h-3" /> Hover Video
                        </span>
                      ) : prod.hoverImage ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-[10px] font-bold">
                          <ImageIcon className="w-3 h-3" /> Hover Photo
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Standard Zoom</span>
                      )}
                    </td>

                    {/* Stock Status Toggle */}
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => toggleProductStock(prod.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                          prod.inStock !== false
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 hover:opacity-80'
                            : 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 hover:opacity-80'
                        }`}
                        title="Click to toggle stock status"
                      >
                        {prod.inStock !== false ? (
                          <><CheckCircle2 className="w-3 h-3" /> In Stock</>
                        ) : (
                          <><XCircle className="w-3 h-3" /> Out of Stock</>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href="/"
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View on store"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(prod.id, prod.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
