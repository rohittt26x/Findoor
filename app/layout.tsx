"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, Home, Search, PlusCircle, 
  Info, LogIn, MapPin, Sparkles
} from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={20} />, sub: "Dashboard", color: "bg-gray-800" },
    { name: "Matches", href: "/matches", icon: <Search size={20} />, sub: "AI Matcher", highlight: true, color: "bg-blue-900/40" },
    { name: "Report Lost", href: "/report-lost", icon: <PlusCircle size={20} />, sub: "Lost something?", color: "bg-red-900/20" },
    { name: "Report Found", href: "/report-found", icon: <PlusCircle size={20} />, sub: "Found something?", color: "bg-green-900/20" },
    { name: "About", href: "/about", icon: <Info size={20} />, sub: "Developer Info", color: "bg-gray-800" },
  ];

  if (!mounted) return null;

  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#030712] text-white font-sans min-h-screen antialiased overflow-x-hidden">
        
        {/* --- GLOBAL NAVIGATION BAR --- */}
        <header className="fixed top-0 left-0 w-full z-[100] border-b border-white/5 bg-[#030712] backdrop-blur-2xl">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:px-10">
            
            {/* LOGO SECTION */}
            <Link href="/" className="flex items-center gap-2 group z-[110]">
              <div className="bg-blue-600 w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:rotate-6 transition-all">
                F
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">
                <span className="text-white">FIN</span>
                <span className="text-blue-500">DOOR</span>
              </span>
            </Link>

            {/* DESKTOP MENU - Added Solid Backgrounds to Links */}
            <div className="hidden md:flex items-center gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 ${
                    link.highlight 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl ml-4">
                Login
              </button>
            </div>

            {/* MOBILE MENU TOGGLE - Switched to Menu (3 lines) */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden z-[110] p-3 text-white bg-white/10 rounded-2xl border border-white/10 shadow-2xl active:scale-90 transition-all"
            >
              {isMenuOpen ? <X size={24} className="text-blue-500" /> : <Menu size={24} />}
            </button>
          </nav>

          {/* --- MOBILE FULL-SCREEN OVERLAY --- */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                // Changed to a solid background color
                className="fixed inset-0 z-[105] md:hidden bg-[#0a0f1d] flex flex-col"
              >
                <div className="relative z-10 flex flex-col h-full px-8 pt-[100px] pb-10 overflow-y-auto">
                  
                  <div className="flex items-center gap-2 mb-8 ml-2">
                    <Sparkles size={14} className="text-blue-500" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Navigation Menu</p>
                  </div>
                  
                  {/* Clickable Options List with Solid Backgrounds */}
                  <div className="flex flex-col gap-3">
                    {navLinks.map((link, i) => (
                      <motion.div
                        key={link.name}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link 
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          // Changed background to a more solid gray/blue
                          className={`flex items-center gap-5 p-4 rounded-2xl border border-white/5 transition-all active:scale-[0.98] ${link.color || 'bg-white/10'}`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-black/20 text-blue-400 flex items-center justify-center">
                            {link.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black uppercase tracking-widest text-white">{link.name}</span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{link.sub}</span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer Section */}
                  <div className="mt-auto pt-10">
                    <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] mb-8 shadow-lg">
                      Login to Account
                    </button>
                    
                    <div className="flex flex-col items-center gap-2 text-center opacity-60">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">
                        Developed by <span className="text-blue-500">Rohit J. Pokale</span>
                      </p>
                      <p className="text-[7px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                        MIT ADT Campus
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* --- MAIN PAGE CONTENT --- */}
        <main className="relative z-0 pt-[80px] md:pt-[100px]">
          {children}
        </main>

      </body>
    </html>
  );
}