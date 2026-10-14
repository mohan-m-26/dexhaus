'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Upload,
  Play,
  Layers,
  Link as LinkIcon,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Tag
} from 'lucide-react';
import { useSiteStore, HeroSlide } from '@/store/siteStore';

export default function HeroAdminPage() {
  const { heroConfig, updateHeroConfig, resetHeroConfig, products } = useSiteStore();

  const [formData, setFormData] = useState({ ...heroConfig });
  const [slides, setSlides] = useState<HeroSlide[]>(heroConfig.slides || []);
  const [activePreviewSlide, setActivePreviewSlide] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Preset Media Options
  const VIDEO_PRESETS = [
    { label: "Dexhaus Hero Demonstration (MP4)", url: "/hero-video.mp4" },
  ];

  const IMAGE_PRESETS = [
    { label: "Curated Modern Kitchen & Living", url: "/hero-lifestyle.jpg" },
    { label: "Warm Home Lighting Showcase", url: "/hero-image.jpeg" },
    { label: "Countertop Storage Close-Up", url: "/product-kitchen-organizer.jpg" },
    { label: "Flat Mop System Showcase", url: "/product-microfiber-mop.jpg" },
    { label: "Corner Shower Caddy", url: "/product-bathroom-rack.jpg" },
  ];

  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      badgeText: "NEW SHOWCASE • FEATURED",
      title: "Featured Practical Solution",
      highlightText: "Smart Home Innovation",
      subtitle: "Discover this curated household essential engineered to reduce friction in your daily routine.",
      mediaType: "video",
      imageUrl: "/product-kitchen-organizer.jpg",
      videoUrl: "/hero-video.mp4",
      redirectUrl: "#popular",
      ctaText: "Shop Solution"
    };
    const updated = [...slides, newSlide];
    setSlides(updated);
    setActivePreviewSlide(updated.length - 1);
  };

  const handleUpdateSlide = (index: number, field: keyof HeroSlide, value: any) => {
    setSlides(prev => prev.map((slide, i) => {
      if (i !== index) return slide;
      return { ...slide, [field]: value };
    }));
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) {
      alert("You must keep at least one hero slide.");
      return;
    }
    const updated = slides.filter((_, i) => i !== index);
    setSlides(updated);
    setActivePreviewSlide(prev => Math.min(prev, updated.length - 1));
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSlides(updated);
    setActivePreviewSlide(targetIndex);
  };

  const handleLinkProductToSlide = (index: number, productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    setSlides(prev => prev.map((s, i) => {
      if (i !== index) return s;
      return {
        ...s,
        targetProductId: prod.id,
        redirectUrl: `#${prod.id}`,
        title: prod.title,
        subtitle: prod.benefit || s.subtitle,
        imageUrl: prod.image || s.imageUrl,
        videoUrl: prod.hoverVideo || s.videoUrl || "/hero-video.mp4",
        mediaType: prod.hoverVideo ? 'video' : s.mediaType,
        ctaText: `Shop ${prod.category || 'Product'}`
      };
    }));
  };

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === 'image') {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateSlide(index, 'imageUrl', reader.result as string);
        handleUpdateSlide(index, 'mediaType', 'image');
      };
      reader.readAsDataURL(file);
    } else {
      const url = URL.createObjectURL(file);
      handleUpdateSlide(index, 'videoUrl', url);
      handleUpdateSlide(index, 'mediaType', 'video');
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateHeroConfig({
      ...formData,
      slides
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset Header & Hero showcase to official brand defaults?")) {
      resetHeroConfig();
      setTimeout(() => {
        setFormData({ ...heroConfig });
        setSlides(heroConfig.slides || []);
      }, 50);
    }
  };

  const previewSlide = slides[activePreviewSlide] || slides[0] || {
    badgeText: "YOUR HOME SOLUTIONS DESTINATION",
    title: "One Destination.",
    highlightText: "Smarter Solutions",
    subtitle: "Discover practical home solutions in one place.",
    mediaType: "video",
    videoUrl: "/hero-video.mp4",
    imageUrl: "/hero-lifestyle.jpg",
    redirectUrl: "#popular",
    ctaText: "Explore Solutions"
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#102F43] text-[#C9A45C]">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-serif text-[#102F43] dark:text-white">
              Header &amp; Hero Studio
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Add live moving video and photo poster showcases with direct product redirects, just like media showcase platforms.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#102F43] dark:bg-[#C9A45C] text-white dark:text-[#102F43] text-xs font-bold hover:opacity-90 flex items-center justify-center gap-2 shadow-md"
          >
            <Save className="w-3.5 h-3.5" /> Save Changes
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Hero &amp; Header updated! Changes are live on your storefront.</span>
        </div>
      )}

      {/* Main Grid: Form Left, Real-time Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Studio Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section: Live Moving Posters & Video Showcase */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#102F43] dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#C9A45C]" />
                  Live Video &amp; Poster Showcase ({slides.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add moving MP4 videos or photos that cycle automatically with click-through redirects.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="px-3.5 py-1.5 rounded-xl bg-[#102F43] text-[#C9A45C] text-xs font-bold hover:bg-[#153b54] flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Showcase Slide
                </button>
              </div>
            </div>

            {/* Auto-Slide Interval Setting */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200 block">Automatic Rotation Speed</span>
                <span className="text-[11px] text-slate-400">Time spent on each poster before transitioning</span>
              </div>
              <select
                value={formData.autoSlideInterval || 5}
                onChange={(e) => setFormData(prev => ({ ...prev, autoSlideInterval: Number(e.target.value) }))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#C9A45C]"
              >
                <option value={3}>3 Seconds</option>
                <option value={5}>5 Seconds (Recommended)</option>
                <option value={7}>7 Seconds</option>
                <option value={10}>10 Seconds</option>
              </select>
            </div>

            {/* List of Individual Slides */}
            <div className="space-y-5">
              {slides.map((slide, idx) => (
                <div 
                  key={slide.id || idx}
                  className={`rounded-2xl border transition-all p-5 space-y-4 ${
                    activePreviewSlide === idx
                      ? 'border-[#C9A45C] bg-[#C9A45C]/5 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30'
                  }`}
                >
                  {/* Slide Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#102F43] text-[#C9A45C] text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-[#102F43] dark:text-white line-clamp-1 max-w-[220px]">
                        {slide.title}
                      </span>
                      {slide.mediaType === 'video' ? (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          VIDEO
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                          PHOTO
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setActivePreviewSlide(idx)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          activePreviewSlide === idx 
                            ? 'bg-[#102F43] text-white' 
                            : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(idx, 'down')}
                        disabled={idx === slides.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(idx)}
                        className="p-1 text-red-400 hover:text-red-600 ml-1"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 1. Quick Link to Catalog Product */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#C9A45C]" />
                      Link to Catalog Product (Auto-Fills Details &amp; Redirect)
                    </label>
                    <select
                      value={slide.targetProductId || ''}
                      onChange={(e) => handleLinkProductToSlide(idx, e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:border-[#C9A45C]"
                    >
                      <option value="">-- Or choose a catalog product to auto-connect --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} (₹{p.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Media Type Selection & Inputs */}
                  <div className="space-y-3 p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Visual Format:
                      </span>
                      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => handleUpdateSlide(idx, 'mediaType', 'video')}
                          className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all ${
                            slide.mediaType === 'video'
                              ? 'bg-[#102F43] text-[#C9A45C] shadow-sm'
                              : 'text-slate-500'
                          }`}
                        >
                          <Video className="w-3 h-3" /> Moving Video
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateSlide(idx, 'mediaType', 'image')}
                          className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all ${
                            slide.mediaType === 'image'
                              ? 'bg-[#102F43] text-[#C9A45C] shadow-sm'
                              : 'text-slate-500'
                          }`}
                        >
                          <ImageIcon className="w-3 h-3" /> Still Photo
                        </button>
                      </div>
                    </div>

                    {slide.mediaType === 'video' ? (
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          Video URL (MP4 / WebM)
                        </label>
                        <input
                          type="text"
                          value={slide.videoUrl}
                          onChange={(e) => handleUpdateSlide(idx, 'videoUrl', e.target.value)}
                          placeholder="/hero-video.mp4 or https://..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:outline-none focus:border-[#C9A45C]"
                        />
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <label className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[10px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1">
                            <Upload className="w-3 h-3" /> Upload Video
                            <input 
                              type="file" 
                              accept="video/mp4,video/webm" 
                              onChange={(e) => handleFileUpload(idx, e, 'video')} 
                              className="hidden" 
                            />
                          </label>
                          {VIDEO_PRESETS.map((vp) => (
                            <button
                              key={vp.url}
                              type="button"
                              onClick={() => handleUpdateSlide(idx, 'videoUrl', vp.url)}
                              className="text-[10px] px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800"
                            >
                              {vp.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          Photo URL
                        </label>
                        <input
                          type="text"
                          value={slide.imageUrl}
                          onChange={(e) => handleUpdateSlide(idx, 'imageUrl', e.target.value)}
                          placeholder="/hero-lifestyle.jpg or https://..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:outline-none focus:border-[#C9A45C]"
                        />
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <label className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[10px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1">
                            <Upload className="w-3 h-3" /> Upload Image
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleFileUpload(idx, e, 'image')} 
                              className="hidden" 
                            />
                          </label>
                          {IMAGE_PRESETS.map((ip) => (
                            <button
                              key={ip.url}
                              type="button"
                              onClick={() => handleUpdateSlide(idx, 'imageUrl', ip.url)}
                              className="text-[10px] px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 truncate max-w-[140px]"
                            >
                              {ip.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Slide Copy & Redirect Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Eyebrow Badge
                      </label>
                      <input
                        type="text"
                        value={slide.badgeText}
                        onChange={(e) => handleUpdateSlide(idx, 'badgeText', e.target.value)}
                        placeholder="LIVE DEMO • CLEANING INNOVATION"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-[#C9A45C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Highlighted Text (Gold Italic)
                      </label>
                      <input
                        type="text"
                        value={slide.highlightText}
                        onChange={(e) => handleUpdateSlide(idx, 'highlightText', e.target.value)}
                        placeholder="Streak-Free Cleaning"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Main Headline Title
                    </label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => handleUpdateSlide(idx, 'title', e.target.value)}
                      placeholder="Dual-Chamber Hands-Free Flat Mop System"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Subtitle / Product Pitch
                    </label>
                    <textarea
                      rows={2}
                      value={slide.subtitle}
                      onChange={(e) => handleUpdateSlide(idx, 'subtitle', e.target.value)}
                      placeholder="Cleans tile and wood streak-free without dirtying hands or manual wringing..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none resize-none"
                    />
                  </div>

                  {/* 4. Redirect Destination & CTA Text */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1">
                        <LinkIcon className="w-3 h-3 text-[#C9A45C]" />
                        Redirect URL (When Poster Clicked)
                      </label>
                      <input
                        type="text"
                        value={slide.redirectUrl}
                        onChange={(e) => handleUpdateSlide(idx, 'redirectUrl', e.target.value)}
                        placeholder="#prod-cleaning-1 or https://..."
                        className="w-full px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-900 bg-white dark:bg-slate-900 text-xs font-mono font-bold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-200 mb-1">
                        CTA Button Label
                      </label>
                      <input
                        type="text"
                        value={slide.ctaText}
                        onChange={(e) => handleUpdateSlide(idx, 'ctaText', e.target.value)}
                        placeholder="Shop Flat Mop System"
                        className="w-full px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-900 bg-white dark:bg-slate-900 text-xs font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddSlide}
              className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#C9A45C] text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4 text-[#C9A45C]" /> Add Another Showcase Poster Slide
            </button>
          </div>

          {/* Announcement Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#102F43] dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
              Top Announcement Bar
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Announcement Message
              </label>
              <input
                type="text"
                value={formData.bannerAnnouncement}
                onChange={(e) => setFormData(prev => ({ ...prev, bannerAnnouncement: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-[#C9A45C]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-4 rounded-xl bg-[#102F43] dark:bg-[#C9A45C] text-white dark:text-[#102F43] font-bold text-sm shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save &amp; Publish Hero Showcase
            </button>
          </div>

        </div>

        {/* Right Column: Live Interactive Store Preview Card */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Live Storefront Preview
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  Real-Time
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  0{activePreviewSlide + 1}/0{slides.length}
                </span>
              </div>
            </div>

            {/* Top Bar Preview */}
            <div className="bg-[#102F43] text-white text-[9px] font-medium py-1.5 px-3 rounded-t-xl truncate border-b border-[#C9A45C]/30 text-center">
              {formData.bannerAnnouncement}
            </div>

            {/* Hero Card Preview */}
            <div className="relative bg-[#102F43] rounded-b-xl overflow-hidden p-6 text-white min-h-[380px] flex flex-col justify-between">
              
              {/* Slide Navigation in Preview */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[#D6AA55] text-[9px] font-bold tracking-wider uppercase truncate max-w-[200px]">
                  <Sparkles className="w-3 h-3" /> {previewSlide.badgeText}
                </div>

                {slides.length > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setActivePreviewSlide(prev => (prev - 1 + slides.length) % slides.length)}
                      className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
                      title="Previous"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePreviewSlide(prev => (prev + 1) % slides.length)}
                      className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
                      title="Next"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Headings */}
              <div className="my-2">
                <h4 className="text-xl font-bold font-serif leading-tight">
                  {previewSlide.title}{' '}
                  {previewSlide.highlightText && (
                    <span className="text-[#C9A45C] italic">{previewSlide.highlightText}</span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 font-light">
                  {previewSlide.subtitle}
                </p>
              </div>

              {/* Media Preview Box (Clickable Poster) */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/20 bg-slate-900/60 my-2">
                {previewSlide.mediaType === 'video' ? (
                  <video
                    key={previewSlide.videoUrl}
                    src={previewSlide.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    key={previewSlide.imageUrl}
                    src={previewSlide.imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                )}
                
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-white flex items-center gap-1">
                  {previewSlide.mediaType === 'video' ? (
                    <><Video className="w-2.5 h-2.5 text-[#C9A45C]" /> LIVE MOVING VIDEO</>
                  ) : (
                    <><ImageIcon className="w-2.5 h-2.5 text-[#C9A45C]" /> STILL PHOTO</>
                  )}
                </div>

                <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/70 backdrop-blur-md text-[10px] text-white flex items-center justify-between">
                  <span className="truncate text-slate-300">
                    Redirect: <strong className="text-[#D6AA55]">{previewSlide.redirectUrl || '#popular'}</strong>
                  </span>
                  <ExternalLink className="w-3 h-3 text-[#D6AA55] flex-shrink-0" />
                </div>
              </div>

              {/* Button Preview */}
              <div className="flex gap-2 mt-2">
                <div className="flex-1 py-2 bg-white text-[#102F43] rounded-full text-center text-[10px] font-bold">
                  {previewSlide.ctaText || "Explore Solution"}
                </div>
                <div className="flex-1 py-2 border border-white/30 text-white rounded-full text-center text-[10px] font-bold">
                  Browse Catalog
                </div>
              </div>

            </div>

          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
            <strong>Anime / Media-Style Showcase:</strong> Users can watch live looping videos or photos cycling automatically on the header. Clicking anywhere on the poster or the CTA button immediately redirects them to that product.
          </div>
        </div>

      </div>
    </div>
  );
}
