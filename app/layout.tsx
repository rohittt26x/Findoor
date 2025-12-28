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

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={20} />, sub: "Campus Dashboard" },
    { name: "Matches", href: "/matches", icon: <Search size={20} />, sub: "AI Smart Match", highlight: true },
    { name: "Report Lost", href: "/report-lost", icon: <PlusCircle size={20} />, sub: "Find your items" },
    { name: "Report Found", href: "/report-found", icon: <PlusCircle size={20} />, sub: "Help others" },
    { name: "About", href: "/about", icon: <Info size={20} />, sub: "The Developer" },
  ];

  if (!mounted) return null;

  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#030712] text-white font-sans min-h-screen antialiased overflow-x-hidden">
        
        {/* --- GLOBAL NAVIGATION BAR --- */}
        <header className="fixed top-0 left-0 w-full z-[100] border-b border-white/5 bg-[#030712]/90 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:px-10">
            
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 group z-[110]">
              <div className="bg-blue-600 w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                F
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">
                <span className="text-white">FIN</span>
                <span className="text-blue-500">DOOR</span>
              </span>
            </Link>

            {/* DESKTOP MENU (Laptop/Desktop View) */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-blue-400 ${
                    link.highlight ? 'text-blue-400' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all">
                Login
              </button>
            </div>

            {/* MOBILE TOGGLE (3 LINES / HAMBURGER MENU) */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden z-[110] p-3 text-white bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-all"
            >
              {isMenuOpen ? <X size={24} className="text-blue-500" /> : <Menu size={24} />}
            </button>
          </nav>

          {/* --- MOBILE FULL-SCREEN OVERLAY (SOLID BACKGROUND) --- */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-[105] md:hidden bg-[#030712] flex flex-col" 
              >
                {/* Visual Decoration (Background Watermark) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] z-0">
                  <h1 className="text-[120px] font-black uppercase tracking-tighter italic vertical-text">FINDOOR</h1>
                </div>

                <div className="relative z-10 flex flex-col h-full px-8 pt-[120px] pb-10">
                  <div className="flex items-center gap-2 mb-10 ml-2">
                    <Sparkles size={14} className="text-blue-500" />
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">Navigation Menu</p>
                  </div>
                  
                  {/* Clickable Links with Solid Button Backgrounds */}
                  <div className="flex flex-col gap-4">
                    {navLinks.map((link, i) => (
                      <motion.div
                        key={link.name}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link 
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-5 p-5 rounded-[2rem] bg-white/[0.04] border border-white/5 active:bg-blue-600/30 active:border-blue-500/50 transition-all"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            {link.icon}
                          </div>
                          {/* Solid color background block behind the name text */}
                          <div className="flex flex-col bg-white/[0.05] px-4 py-2 rounded-xl border border-white/5 flex-1">
                            <span className="text-base font-black uppercase tracking-widest text-white">{link.name}</span>
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{link.sub}</span>
                          </div>
                          {link.highlight && (
                             <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer Credits */}
                  <div className="mt-auto space-y-8">
                    <button className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-95 transition-all">
                      Login to Account
                    </button>
                    
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={12} />
                        <span className="text-[8px] font-black uppercase tracking-[0.4em]">MIT ADT Campus</span>
                      </div>
                      <div className="h-px w-10 bg-white/10" />
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">
                        Developed by <span className="text-blue-500">Rohit J. Pokale</span>
                      </p>
                      <p className="text-[8px] font-bold text-gray-700 uppercase tracking-[0.2em]">
                        Made by student • Made for student
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