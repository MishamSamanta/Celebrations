import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ShoppingCart, CheckCircle2, Star, Search, Filter, ArrowRight, Package, Truck, ShieldCheck, Clock } from 'lucide-react';
import { PHYSICAL_GIFTS, PhysicalGift } from '../types';
import { cn } from '../lib/utils';

export default function GiftShop() {
  const [cart, setCart] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const categories = ['All', ...Array.from(new Set(PHYSICAL_GIFTS.map(g => g.category)))];

  const filteredGifts = PHYSICAL_GIFTS.filter(gift => {
    const matchesSearch = gift.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         gift.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || gift.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleCart = (id: string) => {
    setCart(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const total = cart.reduce((acc, id) => {
    const gift = PHYSICAL_GIFTS.find(g => g.id === id);
    return acc + (gift?.price || 0);
  }, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCart([]);
      alert("Order placed successfully! Your gifts are being prepared for delivery.");
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="atmosphere">
        <div className="atmosphere-blob w-[600px] h-[600px] bg-brand/5 top-[-10%] right-[-10%] animate-drift" />
        <div className="atmosphere-blob w-[500px] h-[500px] bg-purple-600/5 bottom-[-10%] left-[-10%] animate-drift-slow" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <header className="mb-12 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand/10 text-brand border border-brand/20"
              >
                <ShoppingBag size={14} />
                <span className="text-[10px] font-display font-bold uppercase tracking-widest">Official Gift Store</span>
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-heading font-black text-white">
                The <span className="text-gradient">Gift Corner</span>
              </h1>
              <p className="text-white/40 text-lg font-serif italic max-w-xl">
                Ready-made cute gifts delivered directly to your loved ones. No design needed, just pure joy.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="text" 
                  placeholder="Search gifts..."
                  className="input-field pl-12 !rounded-2xl !bg-white/5 border-white/10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-6 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                  selectedCategory === cat 
                    ? "bg-brand text-white shadow-lg shadow-brand/20" 
                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Product Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredGifts.map((gift) => {
                  const isInCart = cart.includes(gift.id);
                  return (
                    <motion.div
                      key={gift.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ y: -8 }}
                      className="glass-card group border-white/5 hover:border-brand/30 transition-all duration-500 overflow-hidden"
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <img 
                          src={gift.image} 
                          alt={gift.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-display font-bold text-white uppercase tracking-widest">
                          {gift.category}
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-heading font-bold text-white group-hover:text-brand transition-colors">{gift.name}</h3>
                            <div className="flex items-center gap-1 text-yellow-500 mt-1">
                              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                              <span className="text-[10px] text-white/20 ml-1">(4.9)</span>
                            </div>
                          </div>
                          <span className="font-mono text-xl font-bold text-brand">${gift.price.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-white/40 font-serif italic line-clamp-2">{gift.description}</p>
                        <button
                          onClick={() => toggleCart(gift.id)}
                          className={cn(
                            "w-full py-3 rounded-xl font-display font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all",
                            isInCart 
                              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                              : "bg-white/5 text-white hover:bg-brand hover:shadow-lg hover:shadow-brand/20"
                          )}
                        >
                          {isInCart ? (
                            <>
                              <CheckCircle2 size={16} />
                              Added to Cart
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={16} />
                              Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar / Cart Summary */}
          <div className="lg:col-span-4">
            <div className="glass-card p-8 sticky top-32 border-white/5 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading font-bold">Your Order</h2>
                <div className="px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-display font-bold uppercase tracking-widest">
                  {cart.length} Items
                </div>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/20">
                      <ShoppingCart size={32} />
                    </div>
                    <p className="text-sm text-white/20 font-serif italic">Your cart is empty. Pick something cute!</p>
                  </div>
                ) : (
                  cart.map(id => {
                    const gift = PHYSICAL_GIFTS.find(g => g.id === id);
                    if (!gift) return null;
                    return (
                      <div key={id} className="flex gap-4 items-center group">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                          <img src={gift.image} alt={gift.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">{gift.name}</h4>
                          <p className="text-xs text-brand font-mono">${gift.price.toFixed(2)}</p>
                        </div>
                        <button 
                          onClick={() => toggleCart(id)}
                          className="text-white/20 hover:text-red-400 transition-colors"
                        >
                          <Clock size={14} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Subtotal</span>
                  <span className="text-white font-mono">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Shipping</span>
                  <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Free</span>
                </div>
                <div className="flex justify-between text-xl font-heading font-bold pt-2">
                  <span>Total</span>
                  <span className="text-brand">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || isCheckingOut}
                className="w-full py-4 rounded-2xl bg-brand text-white font-display font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand/20 hover:shadow-brand/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col items-center gap-2 text-center">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span className="text-[8px] font-display font-bold uppercase tracking-wider text-white/20">Secure</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Truck size={16} className="text-emerald-500" />
                  <span className="text-[8px] font-display font-bold uppercase tracking-wider text-white/20">Fast</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Package size={16} className="text-emerald-500" />
                  <span className="text-[8px] font-display font-bold uppercase tracking-wider text-white/20">Tracked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader2({ className, size }: { className?: string, size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-loader-2", className)}
    >
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  );
}
