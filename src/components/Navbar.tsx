import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Gift, User, LogOut, Settings, Bell, ChevronDown, CreditCard, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Don't show navbar on the surprise view page
  if (location.pathname.startsWith('/surprise/')) {
    return null;
  }

  const userEmail = "misham.samanta@gmail.com";
  const userName = "Misham Samanta";

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', onClick: () => navigate('/create') },
    { icon: Settings, label: 'Settings', onClick: () => {} },
    { icon: CreditCard, label: 'Subscription', onClick: () => {} },
    { icon: LogOut, label: 'Sign Out', onClick: () => {}, danger: true },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-6 py-3 border-white/5 bg-black/20 backdrop-blur-md">
        {/* Logo */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-purple-600 flex items-center justify-center shadow-lg shadow-brand/20 group-hover:shadow-brand/40 transition-all">
            <Gift className="text-white" size={20} />
          </div>
        </motion.div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { name: 'Home', path: '/' },
            { name: 'Create', path: '/create' },
            { name: 'Gift Shop', path: '/shop' },
            { name: 'Premium', path: '/premium' },
            { name: 'My Surprises', path: '#' },
          ].map((link) => (
            <motion.button
              key={link.name}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => link.path !== '#' && navigate(link.path)}
              className={cn(
                "text-sm font-medium transition-all hover:text-brand relative group",
                location.pathname === link.path ? "text-brand" : "text-white/60"
              )}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand rounded-full"
                />
              )}
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left opacity-50" />
            </motion.button>
          ))}
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-white/40 hover:text-white transition-colors relative hidden sm:block">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand rounded-full border-2 border-[#050505]" />
          </button>
          
          <div className="h-8 w-[1px] bg-white/10 mx-1 hidden sm:block" />

          <div className="relative" ref={dropdownRef}>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 pl-2 group cursor-pointer"
            >
              <div className="text-right hidden md:block">
                <div className="text-sm font-semibold text-white leading-none group-hover:text-brand transition-colors">{userName}</div>
                <div className="text-[10px] text-white/40 font-medium uppercase tracking-wider mt-1">{userEmail}</div>
              </div>
              <div className="relative">
                <div className={cn(
                  "w-10 h-10 rounded-full border-2 p-0.5 transition-all duration-300",
                  isProfileOpen ? "border-brand shadow-lg shadow-brand/20" : "border-brand/30 group-hover:border-brand"
                )}>
                  <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#050505] shadow-sm" />
              </div>
              <ChevronDown size={14} className={cn("text-white/40 transition-transform duration-300", isProfileOpen && "rotate-180")} />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-56 glass-card border-white/10 bg-black/80 backdrop-blur-xl p-2 shadow-2xl overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-white/5 mb-2">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Account</p>
                  </div>
                  {menuItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        item.onClick();
                        setIsProfileOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                        item.danger 
                          ? "text-red-400 hover:bg-red-400/10" 
                          : "text-white/70 hover:bg-white/5 hover:text-brand"
                      )}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
