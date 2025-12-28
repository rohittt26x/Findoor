"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, Home, Search, PlusCircle, 
  Info, LogIn, MapPin, Sparkles
} from "lucide-react"; // Note: Removed MoreHorizontal, kept Menu

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
    { name: "Home", href: "/", icon: <Home size={20} />, sub: "Dashboard" },
    { name: "Matches", href: "/matches", icon: <Search size={20} />, sub: "AI Matcher", highlight: true },
    { name: "Report Lost", href: "/report-lost", icon: <PlusCircle size={20} />, sub: "Lost something?" },
    { name: "Report Found", href: "/report-found", icon: <PlusCircle size={20} />, sub: "Found something?" },
    { name: "About", href: "/about", icon: <Info size={20} />, sub: "Developer Info" },
  ];

  if (!mounted) return null;

  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#030712] text-white font-sans min-h-screen antialiased overflow-x-hidden">
        
        {/* --- GLOBAL NAVIGATION BAR --- */}
        <header className="fixed top-0 left-0 w-full z-[100] border-b border-white/5 bg-[#030712]/95 backdrop-blur-2xl">
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

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-100 ${
                    link.highlight ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl">
                Login
              </button>
            </div>

            {/* MOBILE MENU TOGGLE - CHANGED FROM DOTS TO 3 LINES */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden z-[110] p-3 text-white bg-blue-600/10 rounded-2xl border border-blue-500/20 shadow-2xl active:scale-90 transition-all"
            >
              {isMenuOpen ? <X size={24} className="text-blue-500" /> : <Menu size={24} />}
            </button>
          </nav>

          {/* --- MOBILE FULL-SCREEN OVERLAY --- */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                // CHANGED: bg-[#080c17] (Solid dark blue/black) to ensure it's not transparent
                className="fixed inset-0 z-[105] md:hidden bg-[#080c17] flex flex-col"
              >
                {/* Decoration */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-[0.02] z-0">
                  <h1 className="text-[120px] font-black uppercase tracking-tighter italic leading-none">FINDOOR</h1>
                </div>

                <div className="relative z-10 flex flex-col h-full px-6 pt-[100px] pb-10 overflow-y-auto">
                  <div className="flex items-center gap-2 mb-8 ml-2">
                    <Sparkles size={14} className="text-blue-500" />
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Main Navigation</p>
                  </div>
                  
                  {/* Clickable Options List */}
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
                          // CHANGED: Higher opacity background for items to stand out against solid background
                          className="flex items-center gap-5 p-4 rounded-[1.5rem] bg-white/[0.05] border border-white/5 active:bg-blue-600 active:border-blue-500 transition-all group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-active:scale-110 group-active:text-white transition-transform">
                            {link.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black uppercase tracking-widest text-white">{link.name}</span>
                            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{link.sub}</span>
                          </div>
                          {link.highlight && (
                             <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer Credits */}
                  <div className="mt-10 space-y-8">
                    <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg">
                      Login to Account
                    </button>
                    
                    <div className="flex flex-col items-center gap-3 text-center opacity-60">
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin size={12} />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em]">MIT ADT Campus</span>
                      </div>
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">
                        Developed by <span className="text-blue-500">Rohit J. Pokale</span>
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