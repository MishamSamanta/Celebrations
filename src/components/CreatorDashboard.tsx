import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Image as ImageIcon, Music, Send, Sparkles, Trash2, Eye, Save, ChevronRight, ChevronLeft, Cake, Heart, Flame, GraduationCap, TrendingUp, Star } from 'lucide-react';
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
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            photos: [...(prev.photos || []), reader.result as string]
          }));
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

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = () => {
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
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand border border-brand/20 mb-4"
          >
            <Sparkles size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">Creator Platform</span>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            Create a <span className="text-gradient">Birthday Surprise</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Design a personalized, animated experience that tells your story and celebrates their special day.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Steps Navigation */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <nav className="space-y-4">
                {[
                  { n: 1, label: 'Basic Info', desc: 'Names & Relationship' },
                  { n: 2, label: 'The Story', desc: 'Message & Memories' },
                  { n: 3, label: 'Media', desc: 'Photos & Music' },
                  { n: 4, label: 'Settings', desc: 'Theme & Reveal' },
                ].map((s) => (
                  <button
                    key={s.n}
                    onClick={() => setStep(s.n)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl transition-all duration-300 border",
                      step === s.n 
                        ? "bg-brand/10 border-brand text-white" 
                        : "bg-transparent border-transparent text-white/40 hover:text-white/60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                        step === s.n ? "bg-brand text-white" : "bg-white/10"
                      )}>
                        {s.n}
                      </span>
                      <div>
                        <div className="font-medium">{s.label}</div>
                        <div className="text-xs opacity-60">{s.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-8"
            >
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold mb-6">What's the occasion?</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                    {OCCASIONS.map((occ) => {
                      const Icon = ICON_MAP[occ.icon] || Star;
                      return (
                        <button
                          key={occ.id}
                          onClick={() => updateField('occasion', occ.id)}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                            formData.occasion === occ.id ? "border-brand bg-brand/10 text-brand" : "border-white/10 text-white/40 hover:bg-white/5"
                          )}
                        >
                          <Icon size={24} />
                          <span className="text-xs font-bold uppercase tracking-wider">{occ.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Receiver's Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul"
                        className="input-field"
                        value={formData.receiverName || ''}
                        onChange={(e) => updateField('receiverName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Your Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Priya"
                        className="input-field"
                        value={formData.senderName || ''}
                        onChange={(e) => updateField('senderName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Relationship</label>
                      <select
                        className="input-field appearance-none"
                        value={formData.relationship || ''}
                        onChange={(e) => updateField('relationship', e.target.value)}
                      >
                        <option value="">Select relationship</option>
                        <option value="Friend">Friend</option>
                        <option value="Partner">Partner</option>
                        <option value="Family">Family</option>
                        <option value="Colleague">Colleague</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold mb-6">The Story</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Opening Text</label>
                      <input
                        type="text"
                        placeholder="e.g. Someone prepared something special for you..."
                        className="input-field"
                        value={formData.openingText || ''}
                        onChange={(e) => updateField('openingText', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Birthday Message</label>
                      <textarea
                        rows={4}
                        placeholder="Write your heart out..."
                        className="input-field resize-none"
                        value={formData.message || ''}
                        onChange={(e) => updateField('message', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Special Memories</label>
                      <textarea
                        rows={3}
                        placeholder="Recall some beautiful moments..."
                        className="input-field resize-none"
                        value={formData.memories || ''}
                        onChange={(e) => updateField('memories', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold mb-6">Media & Music</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Photos</label>
                      <div className="grid grid-cols-3 gap-4">
                        {formData.photos?.map((photo, i) => (
                          <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                            <img src={photo} alt="" className="w-full h-full object-cover" />
                            <button
                              onClick={() => removePhoto(i)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand/50 hover:bg-white/5 transition-all">
                          <Plus size={24} className="text-white/40" />
                          <span className="text-xs text-white/40">Add Photo</span>
                          <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Background Music</label>
                      <div className="space-y-2">
                        {MUSIC_OPTIONS.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => updateField('music', m.url)}
                            className={cn(
                              "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                              formData.music === m.url ? "border-brand bg-brand/10" : "border-white/10 hover:bg-white/5"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Music size={18} className={formData.music === m.url ? "text-brand" : "text-white/40"} />
                              <span className="text-sm">{m.name}</span>
                            </div>
                            {formData.music === m.url && <div className="w-2 h-2 rounded-full bg-brand" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold mb-6">Final Touches</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Animation Theme</label>
                      <div className="grid grid-cols-2 gap-4">
                        {THEMES.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => updateField('theme', t.id)}
                            className={cn(
                              "p-4 rounded-xl border text-left transition-all",
                              formData.theme === t.id ? "border-brand bg-brand/10" : "border-white/10 hover:bg-white/5"
                            )}
                          >
                            <div className="w-full h-2 rounded-full mb-3" style={{ backgroundColor: t.primary }} />
                            <div className="text-sm font-medium">{t.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Final Wish Message</label>
                      <input
                        type="text"
                        placeholder="e.g. Have a blast, buddy!"
                        className="input-field"
                        value={formData.finalWish || ''}
                        onChange={(e) => updateField('finalWish', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 glass-card">
                      <div>
                        <div className="font-medium">One-time Reveal Mode</div>
                        <div className="text-xs text-white/40">The surprise can only be opened once.</div>
                      </div>
                      <button
                        onClick={() => updateField('oneTimeReveal', !formData.oneTimeReveal)}
                        className={cn(
                          "w-12 h-6 rounded-full transition-all relative",
                          formData.oneTimeReveal ? "bg-brand" : "bg-white/10"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                          formData.oneTimeReveal ? "left-7" : "left-1"
                        )} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/10">
                <button
                  onClick={prevStep}
                  disabled={step === 1}
                  className="btn-secondary flex items-center gap-2 disabled:opacity-0"
                >
                  <ChevronLeft size={20} />
                  Back
                </button>
                {step < 4 ? (
                  <button
                    onClick={nextStep}
                    className="btn-primary flex items-center gap-2"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="btn-primary flex items-center gap-2"
                  >
                    Generate Surprise Website
                    <Send size={20} />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
