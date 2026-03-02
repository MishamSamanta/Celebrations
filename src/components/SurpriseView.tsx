import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Gift, Heart, Music, Volume2, VolumeX, ChevronRight, Calendar, MessageCircle, Star } from 'lucide-react';
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
    <div className="fixed inset-0 bg-[#050505] overflow-y-auto overflow-x-hidden text-white">
      <audio ref={audioRef} src={data.music} loop />
      
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
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-20 h-20 rounded-full bg-brand/20 flex items-center justify-center mb-8"
            >
              <Heart className="text-brand fill-brand" size={40} />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-display font-medium text-white/80">
              {data.openingText}
            </h2>
          </motion.div>
        )}

        {stage === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="h-full flex items-center justify-center"
          >
            <motion.span
              key={countdown}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-9xl font-display font-bold text-brand"
            >
              {countdown}
            </motion.span>
          </motion.div>
        )}

        {stage === 'gift' && (
          <motion.div
            key="gift"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 2 }}
            className="h-full flex flex-col items-center justify-center p-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenGift}
              className="cursor-pointer group relative"
            >
              <div className="absolute inset-0 bg-brand blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative glass-card p-12 flex flex-col items-center gap-6 border-brand/30">
                <Gift size={80} className="text-brand animate-float" />
                <div className="text-center">
                  <h3 className="text-2xl font-display font-bold mb-2 text-white">You have a surprise!</h3>
                  <p className="text-white/60">Click to open your gift</p>
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
            className="min-h-full w-full py-20 px-4 md:px-8"
          >
            <button
              onClick={toggleMute}
              className="fixed top-6 right-6 z-50 p-3 glass-card rounded-full hover:bg-white/10 transition-colors"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <div className="max-w-4xl mx-auto space-y-32">
              {/* Hero Section */}
              <section className="text-center space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h1 className="text-6xl md:text-8xl font-display font-bold mb-4 text-white">
                    {data.occasion === 'birthday' ? 'Happy Birthday,' : 
                     data.occasion === 'anniversary' ? 'Happy Anniversary,' :
                     data.occasion === 'valentine' ? 'Happy Valentine\'s,' :
                     data.occasion === 'graduation' ? 'Congratulations,' :
                     data.occasion === 'promotion' ? 'Well Done,' : 'Celebrating,'} <br />
                    <span className="text-gradient">{data.receiverName}</span>
                  </h1>
                  <p className="text-xl text-white/60">With love from {data.senderName}</p>
                </motion.div>
              </section>

              {/* Photo Slideshow */}
              {data.photos.length > 0 && (
                <section className="space-y-12">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-white/10" />
                    <h2 className="text-2xl font-display font-bold uppercase tracking-widest text-white/40">Captured Moments</h2>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.photos.map((photo, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                          "relative rounded-2xl overflow-hidden aspect-[4/5] glass-card",
                          i % 3 === 0 ? "md:col-span-2 aspect-video" : ""
                        )}
                      >
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Emotional Message */}
              <section className="glass-card p-8 md:p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Star size={120} className="text-brand" />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="relative space-y-8"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand border border-brand/20">
                    <MessageCircle size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">A Special Message</span>
                  </div>
                  <p className="text-2xl md:text-4xl font-serif italic leading-relaxed text-white/90">
                    "{data.message}"
                  </p>
                  <div className="pt-8 border-t border-white/10">
                    <h4 className="text-lg font-display font-bold mb-4 text-white">Our Memories</h4>
                    <p className="text-white/60 leading-relaxed text-lg">
                      {data.memories}
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* Final Celebration */}
              <section className="text-center py-20 space-y-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <h2 className="text-4xl md:text-6xl font-display font-bold text-white">
                    {data.finalWish}
                  </h2>
                  <div className="flex justify-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                      <Heart className="text-brand fill-brand" size={20} />
                    </div>
                    <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                      <Star className="text-brand fill-brand" size={20} />
                    </div>
                  </div>
                </motion.div>
                
                <div className="pt-20">
                  <p className="text-white/20 text-sm uppercase tracking-widest">Created with Surprise Moments Creator</p>
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
