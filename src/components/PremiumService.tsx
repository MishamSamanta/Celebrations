import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Zap, Clock, MessageSquare, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

export default function PremiumService() {
  const [loading, setLoading] = useState(false);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const userEmail = "misham.samanta@gmail.com";

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.publishableKey) {
          setStripePromise(loadStripe(data.publishableKey));
        } else {
          setConfigError("Stripe publishable key is missing. Please configure it in the environment variables.");
        }
      })
      .catch(err => {
        console.error("Failed to fetch config:", err);
        setConfigError("Failed to load configuration.");
      });
  }, []);

  const handleCheckout = async () => {
    if (!stripePromise) {
      alert("Stripe is not configured yet. Please check your environment variables.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const session = await response.json();
      const stripe = await stripePromise;

      if (stripe && session.id) {
        const { error } = await (stripe as any).redirectToCheckout({
          sessionId: session.id,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(`Checkout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 text-brand">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-bold uppercase tracking-wider">Premium Custom Build</span>
          </div>

          <h1 className="text-6xl font-display font-bold leading-tight">
            Let Us Build Your <br />
            <span className="text-gradient">Dream Surprise.</span>
          </h1>

          <p className="text-xl text-white/60 leading-relaxed">
            Don't have time or want something truly unique? Our expert designers will craft a 
            one-of-a-kind surprise website tailored exactly to your vision.
          </p>

          <div className="space-y-4">
            {[
              { icon: Sparkles, text: "Fully custom animations & transitions" },
              { icon: MessageSquare, text: "Unlimited suggestions & revisions" },
              { icon: Clock, text: "Guaranteed delivery by your deadline" },
              { icon: ShieldCheck, text: "Priority support & hosting" },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white/80">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-brand">
                  <feature.icon size={18} />
                </div>
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            {configError && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold">Configuration Required</p>
                  <p className="opacity-80">{configError}</p>
                </div>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheckout}
              disabled={loading || !!configError}
              className="btn-primary px-10 py-5 text-xl flex items-center gap-3 shadow-2xl shadow-brand/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Get Premium Build — $49"}
              <ArrowRight size={24} />
            </motion.button>
            <p className="mt-4 text-sm text-white/40 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Secure one-time payment via Stripe
            </p>
          </div>
        </motion.div>

        {/* Right Content - Visual Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-brand/20 blur-[100px] rounded-full -z-10" />
          <div className="glass-card p-8 border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <Zap size={40} className="text-brand opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>

              <div className="space-y-4">
                <div className="h-4 w-2/3 bg-white/10 rounded-full animate-pulse" />
                <div className="h-32 w-full bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center">
                  <Sparkles size={32} className="text-white/10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-white/5 rounded-xl" />
                  <div className="h-20 bg-white/5 rounded-xl" />
                </div>
                <div className="h-4 w-full bg-white/10 rounded-full animate-pulse" />
                <div className="h-4 w-1/2 bg-white/10 rounded-full animate-pulse" />
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-white/10 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="Avatar" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Crafted by Experts</span>
              </div>
            </div>
          </div>

          {/* Floating Stats */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 glass-card p-4 border-white/10 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">24h Delivery</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest">Average Turnaround</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
