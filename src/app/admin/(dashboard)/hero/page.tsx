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
  ExternalLink,
  Upload,
  Play,
  Layers,
  Link as LinkIcon
} from 'lucide-react';
import { useSiteStore } from '@/store/siteStore';

export default function HeroAdminPage() {
  const { heroConfig, updateHeroConfig, resetHeroConfig } = useSiteStore();

  const [formData, setFormData] = useState({ ...heroConfig });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [imageUploadPreview, setImageUploadPreview] = useState<string | null>(null);
  const [videoUploadPreview, setVideoUploadPreview] = useState<string | null>(null);

  // Preset Media Options
  const IMAGE_PRESETS = [
    { label: "Curated Modern Kitchen & Living", url: "/hero-lifestyle.jpg" },
    { label: "Warm Home Lighting Showcase", url: "/hero-image.jpeg" },
    { label: "Countertop Storage Close-Up", url: "/product-kitchen-organizer.jpg" },
  ];

  const VIDEO_PRESETS = [
    { label: "Dexhaus Hero Home Video (MP4)", url: "/hero-video.mp4" },
  ];

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageUploadPreview(result);
        setFormData(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoUploadPreview(videoUrl);
      setFormData(prev => ({ ...prev, videoUrl, mediaType: 'video' }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset Header & Hero copy and media to official brand defaults?")) {
      resetHeroConfig();
      setTimeout(() => {
        setFormData({ ...heroConfig });
      }, 50);
    }
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
            Customize header background videos, lifestyle photos, brand headlines, and announcement bar.
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
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          
          {/* 1. Header Media Control (Photos & Videos) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#102F43] dark:text-white uppercase tracking-wider">
                  1. Header Visual Media
                </h3>
                <p className="text-xs text-slate-500">Choose between a hero lifestyle photo or looping video</p>
              </div>

              {/* Media Type Selector */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, mediaType: 'image' }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    formData.mediaType === 'image'
                      ? 'bg-white dark:bg-slate-900 text-[#102F43] dark:text-[#C9A45C] shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Photo
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, mediaType: 'video' }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    formData.mediaType === 'video'
                      ? 'bg-white dark:bg-slate-900 text-[#102F43] dark:text-[#C9A45C] shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" /> Video
                </button>
              </div>
            </div>

            {formData.mediaType === 'image' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Upload New Hero Photo
                  </label>
                  <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#C9A45C] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/40">
                    <Upload className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Click to upload image file (JPG, PNG, WebP)
                    </span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Or Image URL / Preset
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="/hero-lifestyle.jpg or https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2">Preset Brand Photos:</span>
                  <div className="flex flex-wrap gap-2">
                    {IMAGE_PRESETS.map((p) => (
                      <button
                        key={p.url}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: p.url }))}
                        className={`text-[11px] px-3 py-1.5 rounded-lg border transition-all ${
                          formData.imageUrl === p.url
                            ? 'border-[#C9A45C] bg-[#C9A45C]/10 text-[#102F43] dark:text-[#C9A45C] font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Upload New Header Video
                  </label>
                  <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#C9A45C] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/40">
                    <Video className="w-6 h-6 text-[#C9A45C] mb-2" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Click to upload MP4 or WebM video file
                    </span>
                    <input 
                      type="file" 
                      accept="video/mp4,video/webm"
                      onChange={handleVideoFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Or Video URL / Preset
                  </label>
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="/hero-video.mp4 or https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2">Preset Videos:</span>
                  <div className="flex flex-wrap gap-2">
                    {VIDEO_PRESETS.map((p) => (
                      <button
                        key={p.url}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, videoUrl: p.url }))}
                        className={`text-[11px] px-3 py-1.5 rounded-lg border transition-all ${
                          formData.videoUrl === p.url
                            ? 'border-[#C9A45C] bg-[#C9A45C]/10 text-[#102F43] dark:text-[#C9A45C] font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Brand Headlines & Copy */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#102F43] dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
              2. Headlines &amp; Tagline
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Brand Badge Text
              </label>
              <input
                type="text"
                value={formData.badgeText}
                onChange={(e) => setFormData(prev => ({ ...prev, badgeText: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-[#C9A45C] focus:outline-none focus:border-[#C9A45C]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Main Headline (Prefix)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-[#C9A45C]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Highlighted Word (Italic Gold)
                </label>
                <input
                  type="text"
                  value={formData.highlightText}
                  onChange={(e) => setFormData(prev => ({ ...prev, highlightText: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-[#C9A45C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Supporting Tagline
              </label>
              <textarea
                rows={2}
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-[#C9A45C] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Top Announcement Bar
              </label>
              <input
                type="text"
                value={formData.bannerAnnouncement}
                onChange={(e) => setFormData(prev => ({ ...prev, bannerAnnouncement: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-[#C9A45C]"
              />
            </div>
          </div>

          {/* 3. CTA Buttons */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#102F43] dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
              3. Call-to-Action Buttons
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={formData.primaryCtaText}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryCtaText: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Button Link
                </label>
                <input
                  type="text"
                  value={formData.primaryCtaLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryCtaLink: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={formData.secondaryCtaText}
                  onChange={(e) => setFormData(prev => ({ ...prev, secondaryCtaText: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Secondary Button Link
                </label>
                <input
                  type="text"
                  value={formData.secondaryCtaLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, secondaryCtaLink: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#102F43] dark:bg-[#C9A45C] text-white dark:text-[#102F43] font-bold text-sm shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save &amp; Publish Header
            </button>
          </div>

        </form>

        {/* Right Column: Live Interactive Store Preview Card */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Live Storefront Preview
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                Real-Time
              </span>
            </div>

            {/* Top Bar Preview */}
            <div className="bg-[#102F43] text-white text-[9px] font-medium py-1.5 px-3 rounded-t-xl truncate border-b border-[#C9A45C]/30 text-center">
              {formData.bannerAnnouncement}
            </div>

            {/* Hero Card Preview */}
            <div className="relative bg-[#102F43] rounded-b-xl overflow-hidden p-6 text-white min-h-[360px] flex flex-col justify-between">
              
              {/* Top Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[#C9A45C] text-[9px] font-bold tracking-wider uppercase w-fit">
                <Sparkles className="w-3 h-3" /> {formData.badgeText}
              </div>

              {/* Headings */}
              <div className="my-4">
                <h4 className="text-xl font-bold font-serif leading-tight">
                  {formData.title} <span className="text-[#C9A45C] italic">{formData.highlightText}</span>
                </h4>
                <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 font-light">
                  {formData.subtitle}
                </p>
              </div>

              {/* Media Preview Box */}
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/20 bg-slate-900/60 my-2">
                {formData.mediaType === 'video' ? (
                  <video
                    src={formData.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={formData.imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                )}
                
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-white flex items-center gap-1">
                  {formData.mediaType === 'video' ? (
                    <><Video className="w-2.5 h-2.5 text-[#C9A45C]" /> VIDEO HEADER</>
                  ) : (
                    <><ImageIcon className="w-2.5 h-2.5 text-[#C9A45C]" /> PHOTO HEADER</>
                  )}
                </div>
              </div>

              {/* Buttons Preview */}
              <div className="flex gap-2 mt-2">
                <div className="flex-1 py-2 bg-white text-[#102F43] rounded-full text-center text-[10px] font-bold">
                  {formData.primaryCtaText}
                </div>
                <div className="flex-1 py-2 border border-white/30 text-white rounded-full text-center text-[10px] font-bold">
                  {formData.secondaryCtaText}
                </div>
              </div>

            </div>

          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
            <strong>Instant Publishing:</strong> When you click <em>Save &amp; Publish Header</em>, changes immediately update on the storefront index without requiring a rebuild or server restart.
          </div>
        </div>

      </div>
    </div>
  );
}
