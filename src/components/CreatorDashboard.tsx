import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Image as ImageIcon, Music, Send, Sparkles, Trash2, Eye, Save, ChevronRight, ChevronLeft, ChevronDown, Cake, Heart, Flame, GraduationCap, TrendingUp, Star } from 'lucide-react';
import { SurpriseData, THEMES, MUSIC_OPTIONS, OCCASIONS } from '../types';
import { generateId, cn } from '../lib/utils';

const ICON_MAP: Record<string, any> = {
  Cake, Heart, Flame, GraduationCap, TrendingUp, Star
};

interface CreatorDashboardProps {
  onGenerate: (data: SurpriseData) => void;
}

export default function CreatorDashboard({ onGenerate }: CreatorDashboardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<SurpriseData>>({
    theme: 'classic',
    music: MUSIC_OPTIONS[0].url,
    occasion: 'birthday',
    photos: [],
    videos: [],
    oneTimeReveal: false,
  });

  const updateField = (field: keyof SurpriseData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Auto-update final wish if occasion changes and final wish is empty or default
      if (field === 'occasion') {
        const occasion = OCCASIONS.find(o => o.id === value);
        if (occasion && (!prev.finalWish || OCCASIONS.some(o => o.defaultWish === prev.finalWish))) {
          newData.finalWish = occasion.defaultWish;
        }
      }
      return newData;
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileList = Array.from(files);
      let processedCount = 0;
      const newPhotos: string[] = [];

      fileList.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push(reader.result as string);
          processedCount++;
          if (processedCount === fileList.length) {
            setFormData(prev => ({
              ...prev,
              photos: [...(prev.photos || []), ...newPhotos]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.receiverName || !formData.senderName || !formData.occasion) {
        alert("Please fill in the names and select an occasion.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.message) {
        alert("Please write a message for the surprise.");
        return;
      }
    }
    setStep(s => Math.min(s + 1, 4));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = () => {
    if (!formData.receiverName || !formData.senderName || !formData.message) {
      alert("Please ensure all required fields (Names and Message) are filled before generating.");
      return;
    }
    
    const finalData: SurpriseData = {
      id: generateId(),
      senderName: formData.senderName || '',
      receiverName: formData.receiverName || '',
      relationship: formData.relationship || '',
      message: formData.message || '',
      memories: formData.memories || '',
      photos: formData.photos || [],
      videos: formData.videos || [],
      music: formData.music || MUSIC_OPTIONS[0].url,
      theme: formData.theme || 'classic',
      openingText: formData.openingText || 'Someone prepared something special for you...',
      finalWish: formData.finalWish || 'Happy Birthday!',
      oneTimeReveal: formData.oneTimeReveal || false,
      ...formData
    } as SurpriseData;
    onGenerate(finalData);
  };

  return (
    <div className="min-h-screen pb-12 px-4 relative overflow-hidden">
      {/* Atmospheric Background */}
      <div className="atmosphere">
        <div className="atmosphere-blob w-[600px] h-[600px] bg-brand/10 top-[-10%] left-[-10%] animate-drift" />
        <div className="atmosphere-blob w-[500px] h-[500px] bg-purple-600/5 bottom-[-10%] right-[-10%] animate-drift-slow" />
      </div>

      <div className="max-w-5xl mx-auto">
        <header className="mb-16 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 text-white/40 border border-white/10 mb-4"
          >
            <Sparkles size={16} className="text-brand" />
            <span className="text-xs font-display font-bold uppercase tracking-[0.2em]">Creator Studio</span>
          </motion.div>
          <h1 className="text-6xl md:text-7xl font-heading font-black text-white leading-tight">
            Design Your <span className="text-gradient">Masterpiece</span>
          </h1>
          <p className="text-white/40 text-xl font-serif italic max-w-2xl mx-auto">
            Every moment deserves a story. Craft an unforgettable digital experience for someone special.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Steps Navigation */}
          <div className="lg:col-span-4">
            <div className="glass-card p-8 sticky top-32 border-white/5">
              <h3 className="text-xs font-display font-bold uppercase tracking-[0.3em] text-white/20 mb-8">Creation Progress</h3>
              <nav className="space-y-6">
                {[
                  { n: 1, label: 'The Occasion', desc: 'Who & Why' },
                  { n: 2, label: 'The Narrative', desc: 'Your Words' },
                  { n: 3, label: 'The Gallery', desc: 'Visuals & Sound' },
                  { n: 4, label: 'The Finale', desc: 'Theme & Reveal' },
                ].map((s) => (
                  <motion.button
                    key={s.n}
                    whileHover={{ x: 8 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(s.n)}
                    className={cn(
                      "w-full text-left group relative",
                      step === s.n ? "text-white" : "text-white/30 hover:text-white/50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-500",
                        step === s.n 
                          ? "bg-brand text-white shadow-lg shadow-brand/20 rotate-0" 
                          : "bg-white/5 text-white/20 rotate-12 group-hover:rotate-0"
                      )}>
                        {s.n}
                      </div>
                      <div>
                        <div className="font-heading text-lg font-bold tracking-tight">{s.label}</div>
                        <div className="text-xs font-display uppercase tracking-wider opacity-40">{s.desc}</div>
                      </div>
                    </div>
                    {step === s.n && (
                      <motion.div 
                        layoutId="active-step"
                        className="absolute -left-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-10 md:p-16 border-white/5 shadow-2xl"
              >
              {step === 1 && (
                <div className="space-y-10">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-heading font-bold">The Occasion</h2>
                    <p className="text-white/40 font-serif italic">Select the heart of your celebration</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {OCCASIONS.map((occ) => {
                      const Icon = ICON_MAP[occ.icon] || Star;
                      return (
                        <motion.button
                          key={occ.id}
                          whileHover={{ scale: 1.02, y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateField('occasion', occ.id)}
                          className={cn(
                            "flex flex-col items-center gap-4 p-6 rounded-3xl border transition-all duration-500",
                            formData.occasion === occ.id 
                              ? "border-brand bg-brand/10 text-brand shadow-xl shadow-brand/10" 
                              : "border-white/5 text-white/30 hover:bg-white/5 hover:border-white/10"
                          )}
                        >
                          <div className={cn(
                            "p-3 rounded-2xl transition-colors",
                            formData.occasion === occ.id ? "bg-brand/20" : "bg-white/5"
                          )}>
                            <Icon size={28} />
                          </div>
                          <span className="text-xs font-display font-bold uppercase tracking-[0.2em]">{occ.name}</span>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-display font-bold text-white/30 uppercase tracking-[0.3em]">Receiver's Name</label>
                      <input
                        type="text"
                        placeholder="Who is this for?"
                        className="input-field !rounded-2xl !bg-white/[0.02] border-white/5 focus:border-brand/30"
                        value={formData.receiverName || ''}
                        onChange={(e) => updateField('receiverName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-display font-bold text-white/30 uppercase tracking-[0.3em]">Your Name</label>
                      <input
                        type="text"
                        placeholder="From whom?"
                        className="input-field !rounded-2xl !bg-white/[0.02] border-white/5 focus:border-brand/30"
                        value={formData.senderName || ''}
                        onChange={(e) => updateField('senderName', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-display font-bold text-white/30 uppercase tracking-[0.3em]">Relationship</label>
                      <div className="relative">
                        <select
                          className="input-field appearance-none pr-10 cursor-pointer !rounded-2xl !bg-white/[0.02] border-white/5 focus:border-brand/30"
                          value={formData.relationship || ''}
                          onChange={(e) => updateField('relationship', e.target.value)}
                        >
                          <option value="" className="bg-[#050505]">Select relationship</option>
                          <option value="Friend" className="bg-[#050505]">Friend</option>
                          <option value="Partner" className="bg-[#050505]">Partner</option>
                          <option value="Family" className="bg-[#050505]">Family</option>
                          <option value="Colleague" className="bg-[#050505]">Colleague</option>
                          <option value="Other" className="bg-[#050505]">Other</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                          <ChevronDown size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-10">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-heading font-bold">The Narrative</h2>
                    <p className="text-white/40 font-serif italic">Put your feelings into words</p>
                  </div>
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-display font-bold text-white/30 uppercase tracking-[0.3em]">Opening Teaser</label>
                      <input
                        type="text"
                        placeholder="e.g. A little something for you..."
                        className="input-field !rounded-2xl !bg-white/[0.02] border-white/5 focus:border-brand/30"
                        value={formData.openingText || ''}
                        onChange={(e) => updateField('openingText', e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-display font-bold text-white/30 uppercase tracking-[0.3em]">The Message</label>
                      <textarea
                        rows={6}
                        placeholder="Write something heartfelt..."
                        className="input-field !rounded-3xl !bg-white/[0.02] border-white/5 focus:border-brand/30 resize-none font-serif italic text-xl"
                        value={formData.message || ''}
                        onChange={(e) => updateField('message', e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-display font-bold text-white/30 uppercase tracking-[0.3em]">Shared Memories</label>
                      <textarea
                        rows={4}
                        placeholder="Recall a beautiful moment you shared..."
                        className="input-field !rounded-3xl !bg-white/[0.02] border-white/5 focus:border-brand/30 resize-none"
                        value={formData.memories || ''}
                        onChange={(e) => updateField('memories', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-10">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-heading font-bold">The Gallery</h2>
                    <p className="text-white/40 font-serif italic">Visuals and melodies to set the mood</p>
                  </div>
                  <div className="space-y-10">
                    <div className="space-y-6">
                      <label className="text-[10px] font-display font-bold text-white/30 uppercase tracking-[0.3em]">Photo Collection</label>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                        {formData.photos?.map((photo, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square rounded-2xl overflow-hidden group border border-white/5"
                          >
                            <img src={photo} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <button
                              onClick={() => removePhoto(i)}
                              className="absolute top-2 right-2 p-2 bg-red-500/80 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </motion.div>
                        ))}
                        <label className="aspect-square rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-brand/30 hover:bg-white/[0.02] transition-all group">
                          <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-brand/10 transition-colors">
                            <Plus size={24} className="text-white/20 group-hover:text-brand" />
                          </div>
                          <span className="text-[10px] font-display font-bold uppercase tracking-wider text-white/20">Add Image</span>
                          <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <label className="text-[10px] font-display font-bold text-white/30 uppercase tracking-[0.3em]">Atmospheric Sound</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {MUSIC_OPTIONS.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => updateField('music', m.url)}
                            className={cn(
                              "flex items-center justify-between p-5 rounded-2xl border transition-all duration-500",
                              formData.music === m.url 
                                ? "border-brand bg-brand/10 shadow-lg shadow-brand/5" 
                                : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03]"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "p-2 rounded-xl transition-colors",
                                formData.music === m.url ? "bg-brand/20 text-brand" : "bg-white/5 text-white/20"
                              )}>
                                <Music size={18} />
                              </div>
                              <span className="text-sm font-heading font-bold">{m.name}</span>
                            </div>
                            {formData.music === m.url && (
                              <motion.div layoutId="active-music" className="w-2 h-2 rounded-full bg-brand" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-10">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-heading font-bold">The Finale</h2>
                    <p className="text-white/40 font-serif italic">Final touches for the perfect reveal</p>
                  </div>
                  <div className="space-y-10">
                    <div className="space-y-6">
                      <label className="text-[10px] font-display font-bold text-white/30 uppercase tracking-[0.3em]">Visual Theme</label>
                      <div className="grid grid-cols-2 gap-4">
                        {THEMES.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => updateField('theme', t.id)}
                            className={cn(
                              "p-6 rounded-3xl border text-left transition-all duration-500",
                              formData.theme === t.id 
                                ? "border-brand bg-brand/10 shadow-lg shadow-brand/5" 
                                : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03]"
                            )}
                          >
                            <div className="w-12 h-2 rounded-full mb-4" style={{ backgroundColor: t.primary }} />
                            <div className="font-heading font-bold text-lg text-white">{t.name}</div>
                            <div className="text-xs font-display uppercase tracking-wider opacity-30 mt-1">Premium Style</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-display font-bold text-white/30 uppercase tracking-[0.3em]">Final Wish</label>
                      <input
                        type="text"
                        placeholder="e.g. Have an amazing year ahead!"
                        className="input-field !rounded-2xl !bg-white/[0.02] border-white/5 focus:border-brand/30 font-heading font-bold text-xl"
                        value={formData.finalWish || ''}
                        onChange={(e) => updateField('finalWish', e.target.value)}
                      />
                    </div>
                    <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-heading font-bold text-lg text-white">One-time Reveal</div>
                        <div className="text-xs font-display uppercase tracking-wider text-white/20">Immersive single-use experience</div>
                      </div>
                      <button
                        onClick={() => updateField('oneTimeReveal', !formData.oneTimeReveal)}
                        className={cn(
                          "w-14 h-7 rounded-full transition-all relative p-1",
                          formData.oneTimeReveal ? "bg-brand" : "bg-white/10"
                        )}
                      >
                        <motion.div 
                          animate={{ x: formData.oneTimeReveal ? 28 : 0 }}
                          className="w-5 h-5 rounded-full bg-white shadow-sm" 
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-16 flex items-center justify-between pt-10 border-t border-white/5">
                <motion.button
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevStep}
                  disabled={step === 1}
                  className="btn-secondary flex items-center gap-3 !bg-transparent !border-none text-white/40 hover:text-white disabled:opacity-0"
                >
                  <ChevronLeft size={20} />
                  <span className="font-display font-bold uppercase tracking-widest text-xs">Back</span>
                </motion.button>
                {step < 4 ? (
                  <motion.button
                    whileHover={{ scale: 1.05, x: 4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextStep}
                    className="btn-primary flex items-center gap-3 px-10"
                  >
                    <span className="font-display font-bold uppercase tracking-widest text-xs">Next Step</span>
                    <ChevronRight size={20} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    className="btn-primary flex items-center gap-3 px-10 bg-gradient-to-r from-brand to-purple-600"
                  >
                    <span className="font-display font-bold uppercase tracking-widest text-xs">Generate Surprise</span>
                    <Send size={20} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
