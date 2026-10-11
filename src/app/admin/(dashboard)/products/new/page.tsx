'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Upload, 
  Video, 
  Image as ImageIcon, 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  CheckCircle2, 
  Eye, 
  Package, 
  Layers
} from 'lucide-react';
import { useSiteStore, CATEGORY_OPTIONS } from '@/store/siteStore';

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct } = useSiteStore();

  const [title, setTitle] = useState('');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('kitchen');
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [specs, setSpecs] = useState('');
  const [benefit, setBenefit] = useState('');
  const [badge, setBadge] = useState('New');
  const [inStock, setInStock] = useState(true);

  // Media
  const [imageUrl, setImageUrl] = useState('/product-kitchen-organizer.jpg');
  const [hoverVideoUrl, setHoverVideoUrl] = useState('');
  const [hoverImageUrl, setHoverImageUrl] = useState('');

  // Interactive Hover Preview State
  const [previewHovered, setPreviewHovered] = useState(false);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHoverVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const vidUrl = URL.createObjectURL(file);
      setHoverVideoUrl(vidUrl);
    }
  };

  const handleHoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHoverImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) {
      alert("Please provide at least a Title and Price.");
      return;
    }

    const matchedCat = CATEGORY_OPTIONS.find(c => c.id === selectedCategoryKey);
    const categoryName = selectedCategoryKey === 'custom' 
      ? (customCategory || 'Curated Solutions') 
      : (matchedCat ? matchedCat.name : 'Home Solutions');

    addProduct({
      title,
      category: categoryName,
      categoryKey: selectedCategoryKey,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      image: imageUrl || '/product-kitchen-organizer.jpg',
      hoverVideo: hoverVideoUrl || undefined,
      hoverImage: hoverImageUrl || undefined,
      specs: specs || 'Curated dimensions • Tested home utility • Premium materials',
      benefit: benefit || 'Engineered to reduce daily effort and bring organization to your space.',
      inStock,
      badge: badge !== 'None' ? badge : undefined,
    });

    router.push('/admin/products');
  };

  const handlePreviewMouseEnter = () => {
    setPreviewHovered(true);
    if (previewVideoRef.current && hoverVideoUrl) {
      previewVideoRef.current.play().catch(() => {});
    }
  };

  const handlePreviewMouseLeave = () => {
    setPreviewHovered(false);
    if (previewVideoRef.current && hoverVideoUrl) {
      previewVideoRef.current.pause();
      previewVideoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold font-serif text-[#102F43] dark:text-white">
              Add Specific Solution Product
            </h2>
            <p className="text-xs text-slate-500">
              Configure product details, category sorting, hover video previews, and pricing.
            </p>
          </div>
        </div>

        <Link
          href="/admin/products"
          className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          Cancel
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Controls */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          
          {/* 1. Basic Details & Category */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#102F43] dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
              1. Title &amp; Category Placement
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 2-Tier Pull-Out Spice & Cabinet Rack"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-[#C9A45C]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Which Category? <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCategoryKey}
                  onChange={(e) => setSelectedCategoryKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-[#102F43] dark:text-[#C9A45C] focus:outline-none focus:border-[#C9A45C]"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                  <option value="custom">➕ Custom Category...</option>
                </select>
              </div>

              {selectedCategoryKey === 'custom' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Custom Category Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="e.g. Balcony Gardening Solutions"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Product Badge / Highlight
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
                  >
                    <option value="None">None</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Space Saver">Space Saver</option>
                    <option value="Most Practical">Most Practical</option>
                    <option value="Staff Pick">Staff Pick</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Everyday Problem-Solving Benefit <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={benefit}
                onChange={(e) => setBenefit(e.target.value)}
                placeholder="Explain the practical problem this solves (e.g. Frees up counter space and keeps daily cooking jars reachable with zero clutter)."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-[#C9A45C] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Specifications / Materials / Dimensions
              </label>
              <input
                type="text"
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
                placeholder="e.g. Matte steel frame • 2-Tier clearance • Non-slip rubber feet"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Pricing and Inventory */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#102F43] dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
              2. Pricing &amp; Stock
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="899"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-[#102F43] dark:text-[#C9A45C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Original Price (₹) <span className="text-slate-400 font-normal">Optional</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="1299"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-4 sm:pt-0">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Inventory Status
                </label>
                <button
                  type="button"
                  onClick={() => setInStock(!inStock)}
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    inStock 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400' 
                      : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400'
                  }`}
                >
                  {inStock ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                  {inStock ? 'Available in Stock' : 'Marked Out of Stock'}
                </button>
              </div>
            </div>
          </div>

          {/* 3. Media & Hover Power */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-[#102F43] dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
              3. Visuals &amp; Hover Media Power
            </h3>

            {/* Main Image */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Primary Product Image <span className="text-red-500">*</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#C9A45C] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/40">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    Upload Image File
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Or enter image URL / preset"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Presets: /product-kitchen-organizer.jpg, /product-microfiber-mop.jpg, etc.
                  </span>
                </div>
              </div>
            </div>

            {/* Hover Video Power */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#102F43] dark:text-[#C9A45C] flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#C9A45C]" /> Hover Video Preview (High Conversion Feature)
                </label>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded">
                  Plays on mouse hover
                </span>
              </div>
              
              <p className="text-[11px] text-slate-500">
                When shoppers hover over this product on your store, this video clip will automatically play on loop!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative border-2 border-dashed border-purple-200 dark:border-purple-900/60 hover:border-purple-400 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-purple-50/20 dark:bg-purple-950/20">
                  <Video className="w-5 h-5 text-purple-500 mb-1" />
                  <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                    Upload MP4 / WebM Video
                  </span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleHoverVideoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={hoverVideoUrl}
                    onChange={(e) => setHoverVideoUrl(e.target.value)}
                    placeholder="Or enter Video URL (e.g. /hero-video.mp4)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:outline-none"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setHoverVideoUrl('/hero-video.mp4')}
                      className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300 hover:text-black font-semibold"
                    >
                      Use Demo Video (/hero-video.mp4)
                    </button>
                    {hoverVideoUrl && (
                      <button
                        type="button"
                        onClick={() => setHoverVideoUrl('')}
                        className="text-[10px] px-2 py-1 text-red-500 hover:underline"
                      >
                        Clear Video
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Hover Image */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Alternate Hover Photo (Fallback if no video)
              </label>
              <input
                type="text"
                value={hoverImageUrl}
                onChange={(e) => setHoverImageUrl(e.target.value)}
                placeholder="Optional second photo shown on hover (URL or path)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:outline-none"
              />
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[#102F43] dark:bg-[#C9A45C] text-white dark:text-[#102F43] font-bold text-sm shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Publish Product to Storefront
          </button>

        </form>

        {/* Live Hover Interactive Store Card Preview */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#C9A45C]" /> Interactive Hover Preview
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Hover to test!
              </span>
            </div>

            {/* Simulated Storefront Card */}
            <div 
              onMouseEnter={handlePreviewMouseEnter}
              onMouseLeave={handlePreviewMouseLeave}
              className="group flex flex-col bg-white dark:bg-slate-900 rounded-[1.75rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              {/* Image / Video Container */}
              <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800 m-3 rounded-2xl">
                
                {/* Active Media */}
                {previewHovered && hoverVideoUrl ? (
                  <video
                    ref={previewVideoRef}
                    src={hoverVideoUrl}
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={previewHovered && hoverImageUrl ? hoverImageUrl : imageUrl}
                    alt={title || "Product preview"}
                    fill
                    className="object-cover transition-transform duration-500"
                    sizes="400px"
                  />
                )}

                {/* Heart Wishlist simulation */}
                <div className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-400 shadow-sm">
                  <Heart className="w-3.5 h-3.5" />
                </div>

                {/* Badge if present */}
                {badge && badge !== 'None' && (
                  <div className="absolute top-3 left-3 z-20 bg-[#C9A45C] text-[#102F43] text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {badge}
                  </div>
                )}

                {/* Category Pill */}
                <div className="absolute bottom-3 left-3 z-10 bg-[#102F43]/85 backdrop-blur-md text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
                  {CATEGORY_OPTIONS.find(c => c.id === selectedCategoryKey)?.name || 'Home Solutions'}
                </div>

                {/* Hover Video Indicator Pill */}
                {hoverVideoUrl && (
                  <div className="absolute bottom-3 right-3 z-10 bg-purple-900/80 backdrop-blur-md text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Video className="w-2.5 h-2.5 text-[#C9A45C]" />
                    {previewHovered ? 'PLAYING' : 'HOVER TO PLAY'}
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="p-4 flex flex-col flex-1 pt-1">
                <h4 className="font-bold text-[#102F43] dark:text-white text-xs line-clamp-1 mb-1">
                  {title || "Your Product Title Here"}
                </h4>
                
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">
                  {benefit || "Household problem-solving benefit will appear here."}
                </p>

                <div className="text-[10px] text-slate-400 font-mono mb-3 line-clamp-1 border-t border-slate-100 dark:border-slate-800 pt-1.5">
                  {specs || "Material specs and dimensions • Non-slip"}
                </div>

                <div className="mt-auto flex items-center justify-between pt-1">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Genuine Price</span>
                    <span className="font-serif font-bold text-base text-[#102F43] dark:text-[#C9A45C]">
                      ₹{price || "899"}
                      {originalPrice && (
                        <span className="text-xs text-slate-400 line-through ml-1.5 font-sans font-normal">
                          ₹{originalPrice}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="bg-[#102F43] dark:bg-[#C9A45C] text-white dark:text-[#102F43] px-3 py-1.5 rounded-xl font-bold text-[10px] flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3" /> Add
                  </div>
                </div>
              </div>

            </div>

          </div>

          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 text-[11px] text-purple-900 dark:text-purple-300 leading-relaxed">
            <strong>Hover Media Live Sync:</strong> When you publish this product, it immediately appears on the homepage under its assigned category. Hovering your mouse over it on the storefront will stream the video preview seamlessly!
          </div>
        </div>

      </div>
    </div>
  );
}
