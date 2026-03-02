import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Calendar, MessageSquare, Send, Sparkles, ArrowRight } from 'lucide-react';

export default function PremiumSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [suggestions, setSuggestions] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const userEmail = "misham.samanta@gmail.com";

  useEffect(() => {
    if (!sessionId) {
      navigate('/premium');
    }
  }, [sessionId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/premium-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          suggestions,
          deadline,
          email: userEmail
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Failed to submit request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 pt-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 max-w-xl w-full text-center space-y-8 border-brand/20 shadow-2xl shadow-brand/10"
        >
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-emerald-500" size={48} />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-display font-bold text-white">Request Received!</h2>
            <p className="text-xl text-white/60 leading-relaxed">
              Our designers have received your requirements. We'll start building your premium surprise immediately and contact you at <span className="text-brand font-bold">{userEmail}</span>.
            </p>
          </div>
          <div className="pt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="btn-primary px-8 py-4 flex items-center gap-2 mx-auto"
            >
              Back to Home
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <CheckCircle2 size={16} />
            <span className="text-sm font-bold uppercase tracking-wider">Payment Successful</span>
          </div>
          <h1 className="text-5xl font-display font-bold">Tell Us Your Vision.</h1>
          <p className="text-xl text-white/60">
            Provide your suggestions and deadline so we can build the perfect surprise for you.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass-card p-10 border-white/10 space-y-8"
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/40">
                <MessageSquare size={16} />
                Suggestions & Requirements
              </label>
              <textarea
                required
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="Describe your vision, specific themes, colors, or any special features you want us to include..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:border-brand focus:ring-1 focus:ring-brand transition-all min-h-[200px] resize-none"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/40">
                <Calendar size={16} />
                Target Deadline
              </label>
              <input
                required
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-brand focus:ring-1 focus:ring-brand transition-all"
              />
            </div>
          </div>

          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Requirements"}
              <Send size={20} />
            </motion.button>
            <p className="mt-4 text-center text-sm text-white/40 flex items-center justify-center gap-2">
              <Sparkles size={14} className="text-brand" />
              Our design team will review this within 2 hours
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
