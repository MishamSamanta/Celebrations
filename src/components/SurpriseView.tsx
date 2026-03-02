import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Gift, Heart, Music, Volume2, VolumeX, ChevronRight, Calendar, MessageCircle, Star, Sparkles } from 'lucide-react';
import { SurpriseData } from '../types';
import { cn } from '../lib/utils';

interface SurpriseViewProps {
  data: SurpriseData;
}

export default function SurpriseView({ data }: SurpriseViewProps) {
  const [stage, setStage] = useState<'loading' | 'countdown' | 'gift' | 'reveal'>('loading');
  const [countdown, setCountdown] = useState(3);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (stage === 'loading') {
      const timer = setTimeout(() => setStage('countdown'), 3000);
      return () => clearTimeout(timer);
    }
    if (stage === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setStage('gift');
      }
    }
  }, [stage, countdown]);

  const handleOpenGift = () => {
    setStage('reveal');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D946EF', '#ffffff', '#A855F7']
    });
    if (audioRef.current) {
      audioRef.current.play();
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-y-auto overflow-x-hidden text-white font-sans">
      <audio ref={audioRef} src={data.music} loop />
      
      {/* Persistent Atmospheric Background */}
      <div className="atmosphere">
        <div className="atmosphere-blob w-[600px] h-[600px] bg-brand/20 top-[-10%] left-[-10%] animate-drift" />
        <div className="atmosphere-blob w-[500px] h-[500px] bg-purple-600/10 bottom-[-10%] right-[-10%] animate-drift-slow" />
        <div className="atmosphere-blob w-[400px] h-[400px] bg-indigo-500/10 top-[40%] right-[10%] animate-drift" />
      </div>

      <AnimatePresence mode="wait">
        {stage === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-24 h-24 rounded-full bg-brand/10 flex items-center justify-center mb-8 border border-brand/20 shadow-2xl shadow-brand/20"
            >
              <Heart className="text-brand fill-brand" size={44} />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-heading italic text-white/90 max-w-2xl leading-tight">
              {data.openingText}
            </h2>
          </motion.div>
        )}

        {stage === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 2, filter: 'blur(20px)' }}
            className="h-full flex items-center justify-center"
          >
            <motion.span
              key={countdown}
              initial={{ opacity: 0, y: 40, rotateX: 90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              className="text-[12rem] md:text-[20rem] font-heading font-black text-brand drop-shadow-[0_0_40px_rgba(217,70,239,0.5)]"
            >
              {countdown}
            </motion.span>
          </motion.div>
        )}

        {stage === 'gift' && (
          <motion.div
            key="gift"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, filter: 'blur(20px)' }}
            className="h-full flex flex-col items-center justify-center p-6"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenGift}
              className="cursor-pointer group relative"
            >
              <div className="absolute inset-[-40px] bg-brand blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
              <div className="relative glass-card p-16 flex flex-col items-center gap-8 border-brand/40 shadow-2xl shadow-brand/10">
                <div className="relative">
                  <Gift size={100} className="text-brand animate-float" />
                  <Sparkles className="absolute -top-4 -right-4 text-purple-400 animate-pulse" size={32} />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-3xl md:text-4xl font-heading font-bold text-white">A Gift Awaits...</h3>
                  <p className="text-white/50 font-display uppercase tracking-[0.2em] text-sm">Click to reveal your surprise</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {stage === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-full w-full py-20 px-4 md:px-8 relative"
          >
            <button
              onClick={toggleMute}
              className="fixed top-8 right-8 z-50 p-4 glass-card rounded-full hover:bg-white/10 transition-all hover:scale-110 active:scale-90 border-white/20"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>

            <div className="max-w-5xl mx-auto space-y-40">
              {/* Hero Section */}
              <section className="text-center space-y-12 pt-20">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative"
                >
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-brand/20 blur-[80px] rounded-full -z-10" />
                  <h1 className="text-7xl md:text-[10rem] font-heading font-black mb-6 text-white leading-[0.9] tracking-tighter">
                    {data.occasion === 'birthday' ? 'Happy Birthday,' : 
                     data.occasion === 'anniversary' ? 'Happy Anniversary,' :
                     data.occasion === 'valentine' ? 'Happy Valentine\'s,' :
                     data.occasion === 'graduation' ? 'Congratulations,' :
                     data.occasion === 'promotion' ? 'Well Done,' : 'Celebrating,'} <br />
                    <span className="text-gradient drop-shadow-[0_0_30px_rgba(217,70,239,0.3)]">{data.receiverName}</span>
                  </h1>
                  <p className="text-2xl md:text-3xl font-serif italic text-white/40">With all my love, {data.senderName}</p>
                </motion.div>
              </section>

              {/* Photo Slideshow - Refined Grid */}
              {data.photos.length > 0 && (
                <section className="space-y-16">
                  <div className="flex items-center gap-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                    <h2 className="text-sm font-display font-bold uppercase tracking-[0.4em] text-white/30">Captured Moments</h2>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {data.photos.map((photo, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: i * 0.15 }}
                        className={cn(
                          "relative rounded-[2rem] overflow-hidden glass-card group",
                          i % 3 === 0 ? "md:col-span-8 aspect-video" : "md:col-span-4 aspect-[4/5]",
                          i % 5 === 0 ? "md:col-span-12 aspect-[21/9]" : ""
                        )}
                      >
                        <img src={photo} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                        <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="p-2 bg-white/10 backdrop-blur-md rounded-full">
                              <Heart size={16} className="text-white fill-white" />
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Emotional Message - Editorial Style */}
              <section className="relative py-20">
                <div className="absolute inset-0 bg-brand/5 rounded-[4rem] -rotate-1 scale-105 -z-10 blur-3xl" />
                <div className="glass-card p-12 md:p-24 relative overflow-hidden border-white/5">
                  <div className="absolute -top-10 -left-10 opacity-[0.03]">
                    <MessageCircle size={300} className="text-white" />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="relative space-y-12 max-w-3xl mx-auto text-center"
                  >
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 text-white/40 border border-white/10">
                      <Sparkles size={16} className="text-brand" />
                      <span className="text-xs font-display font-bold uppercase tracking-[0.2em]">A Heartfelt Note</span>
                    </div>
                    <p className="text-3xl md:text-5xl font-serif italic leading-tight text-white/95">
                      "{data.message}"
                    </p>
                    {data.memories && (
                      <div className="pt-12 border-t border-white/10 space-y-6">
                        <h4 className="text-sm font-display font-bold uppercase tracking-[0.3em] text-brand">Our Story</h4>
                        <p className="text-white/60 leading-relaxed text-xl font-light">
                          {data.memories}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </div>
              </section>

              {/* Final Celebration - Grand Finale */}
              <section className="text-center py-40 space-y-16 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/10 blur-[150px] rounded-full -z-10 animate-pulse" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  <h2 className="text-5xl md:text-8xl font-heading font-black text-white leading-none">
                    {data.finalWish}
                  </h2>
                  <div className="flex justify-center gap-6">
                    {[Heart, Star, Sparkles].map((Icon, i) => (
                      <motion.div 
                        key={i}
                        animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
                        className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-xl"
                      >
                        <Icon className="text-brand fill-brand/20" size={28} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                <div className="pt-32">
                  <div className="inline-block p-1 rounded-full bg-gradient-to-r from-brand/20 to-purple-500/20">
                    <div className="px-4 py-2 rounded-full bg-[#050505] border border-white/5 flex items-center justify-center">
                      <Gift className="text-brand/40" size={16} />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
