import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, Share2, Copy, Check, ExternalLink, ArrowRight, ShoppingCart } from 'lucide-react';
import CreatorDashboard from './components/CreatorDashboard';
import SurpriseView from './components/SurpriseView';
import GiftShop from './components/GiftShop';
import Navbar from './components/Navbar';
import PremiumService from './components/PremiumService';
import PremiumSuccess from './components/PremiumSuccess';
import { SurpriseData } from './types';
import { cn } from './lib/utils';
import LightRays from './components/LightRays';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 pt-24 text-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 mb-4">
          <Sparkles size={16} className="text-brand" />
          <span className="text-sm font-medium">The Ultimate Surprise Experience</span>
        </div>
        
        <h1 className="text-7xl md:text-8xl font-display font-bold tracking-tight text-white">
          Celebrate Every <br />
          <span className="text-gradient">Moment.</span>
        </h1>
        
        <p className="text-xl text-white/60 max-w-xl mx-auto leading-relaxed">
          Create a personalized, animated surprise website for birthdays, anniversaries, or any special occasion. 
          Now with a <b>Gift Corner</b> to send real physical gifts!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/create')}
            className="btn-primary flex items-center gap-2 text-lg px-8 py-4 w-full sm:w-auto shadow-xl shadow-brand/20"
          >
            Start Creating
            <ArrowRight size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/premium')}
            className="btn-secondary flex items-center gap-2 text-lg px-8 py-4 w-full sm:w-auto border-brand/20 text-brand"
          >
            Get Expert Build
            <Sparkles size={20} />
          </motion.button>
        </div>

        <div className="pt-20 grid grid-cols-1 md:grid-cols-4 gap-8 opacity-60 hover:opacity-100 transition-all duration-500">
          <div className="flex flex-col items-center gap-2">
            <Gift size={24} className="text-brand" />
            <span className="text-xs font-bold uppercase tracking-widest">Personalized</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Sparkles size={24} className="text-brand" />
            <span className="text-xs font-bold uppercase tracking-widest">Animated</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Share2 size={24} className="text-brand" />
            <span className="text-xs font-bold uppercase tracking-widest">Shareable</span>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1, y: -4 }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => navigate('/shop')}
          >
            <ShoppingCart size={24} className="text-brand" />
            <span className="text-xs font-bold uppercase tracking-widest">Gift Corner</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function CreatePage() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (data: SurpriseData) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/surprises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setGeneratedId(data.id);
      }
    } catch (error) {
      console.error('Failed to generate surprise:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareUrl = `${window.location.origin}/surprise/${generatedId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (generatedId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 max-w-xl w-full text-center space-y-8"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
            <Check className="text-green-500" size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-bold text-white">Surprise Created!</h2>
            <p className="text-white/60">Your personalized surprise is ready to be shared.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between gap-4">
              <span className="text-sm text-white/40 truncate flex-1 text-left">{shareUrl}</span>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-brand"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open(shareUrl, '_blank')}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                Preview
                <ExternalLink size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="btn-primary"
              >
                Done
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative pt-24">
      {isGenerating && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full"
          />
          <p className="text-xl font-display font-medium text-white/80">Generating your surprise website...</p>
        </div>
      )}
      <CreatorDashboard onGenerate={handleGenerate} />
    </div>
  );
}

function SurprisePage() {
  const { id } = useParams();
  const [data, setData] = useState<SurpriseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/surprises/${id}`);
        if (response.ok) {
          const json = await response.json();
          setData(json);
        } else {
          setError('Surprise not found');
        }
      } catch (err) {
        setError('Failed to load surprise');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
       <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-12 h-12 bg-brand/20 rounded-full flex items-center justify-center"
        >
          <Gift className="text-brand" size={24} />
        </motion.div>
    </div>
  );
  
  if (error || !data) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-display font-bold mb-4">Oops!</h2>
      <p className="text-white/60 mb-8">{error || 'Something went wrong'}</p>
      <button onClick={() => window.location.href = '/'} className="btn-primary">Go Home</button>
    </div>
  );

  return <SurpriseView data={data} />;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#050505] text-white relative bg-[radial-gradient(circle_at_50%_-20%,rgba(168,85,247,0.15),transparent_70%)]">
        <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
          <LightRays
            raysOrigin="top-center"
            raysColor="#a855f7"
            raysSpeed={0.6}
            lightSpread={0.8}
            rayLength={1.5}
            followMouse={true}
            mouseInfluence={0.2}
            noiseAmount={0.05}
            distortion={0.1}
            className="custom-rays"
            pulsating={true}
            fadeDistance={1.2}
            saturation={1.2}
          />
        </div>
        <Navbar />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/shop" element={<GiftShop />} />
            <Route path="/surprise/:id" element={<SurprisePage />} />
            <Route path="/premium" element={<PremiumService />} />
            <Route path="/premium/success" element={<PremiumSuccess />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
