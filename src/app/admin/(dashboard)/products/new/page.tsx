'use client';

import { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Video } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Hooked up the connection

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  
  // File states
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [hoverVideo, setHoverVideo] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let mainImageUrl = '';
      let hoverVideoUrl = '';

      // 1. Upload Main Image to Supabase
      if (mainImage) {
        const fileExt = mainImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: imgData, error: imgError } = await supabase.storage
          .from('product-media')
          .upload(`images/${fileName}`, mainImage);
          
        if (imgError) throw imgError;
        mainImageUrl = supabase.storage.from('product-media').getPublicUrl(`images/${fileName}`).data.publicUrl;
      }

      // 2. Upload Hover Video to Supabase
      if (hoverVideo) {
        const fileExt = hoverVideo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: vidData, error: vidError } = await supabase.storage
          .from('product-media')
          .upload(`videos/${fileName}`, hoverVideo);
          
        if (vidError) throw vidError;
        hoverVideoUrl = supabase.storage.from('product-media').getPublicUrl(`videos/${fileName}`).data.publicUrl;
      }

      // 3. Save Product to Database
      const { error: dbError } = await supabase.from('products').insert([
        {
          title,
          description,
          price: parseFloat(price),
          stock_quantity: parseInt(stock),
          main_image_url: mainImageUrl,
          hover_video_url: hoverVideoUrl,
        }
      ]);

      if (dbError) throw dbError;

      // Success
      router.push('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 font-serif">Add New Product</h2>
        <Link href="/admin/products" className="text-sm font-semibold text-gray-500 hover:text-gray-900">
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
        
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#112a46] border-b pb-2">Basic Details</h3>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Product Title</label>
            <input 
              type="text" required 
              value={title} onChange={e => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 px-4 focus:ring-[#112a46] focus:border-[#112a46] outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea 
              rows={4} required 
              value={description} onChange={e => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 px-4 focus:ring-[#112a46] focus:border-[#112a46] outline-none resize-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
              <input 
                type="number" required min="0" step="0.01"
                value={price} onChange={e => setPrice(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2.5 px-4 focus:ring-[#112a46] focus:border-[#112a46] outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Initial Stock</label>
              <input 
                type="number" required min="0"
                value={stock} onChange={e => setStock(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2.5 px-4 focus:ring-[#112a46] focus:border-[#112a46] outline-none" 
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#112a46] border-b pb-2">Media</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative">
              <ImageIcon className="h-10 w-10 text-gray-400 mb-3" />
              <p className="text-sm font-semibold text-gray-700">{mainImage ? mainImage.name : 'Upload Main Image'}</p>
              <input 
                type="file" accept="image/*" required
                onChange={e => setMainImage(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative">
              <Video className="h-10 w-10 text-gray-400 mb-3" />
              <p className="text-sm font-semibold text-gray-700">{hoverVideo ? hoverVideo.name : 'Upload Hover Video'}</p>
              <input 
                type="file" accept="video/mp4,video/webm" required
                onChange={e => setHoverVideo(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="rounded-lg bg-[#0a2540] px-8 py-3 text-sm font-bold text-white hover:bg-[#071b2f] transition-colors disabled:opacity-70"
          >
            {loading ? 'Uploading & Saving...' : 'Save Product'}
          </button>
        </div>

      </form>
    </div>
  );
}
