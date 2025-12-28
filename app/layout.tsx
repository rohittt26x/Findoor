"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import Link from "next/link";
import { Menu, X, Home, Search, PlusCircle, Info, LogIn, GraduationCap } from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevents hydration mismatch errors
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Matches", href: "/matches", icon: <Search size={18} />, highlight: true },
    { name: "Report Lost", href: "/report-lost", icon: <PlusCircle size={18} /> },
    { name: "Report Found", href: "/report-found", icon: <PlusCircle size={18} /> },
    { name: "About", href: "/about", icon: <Info size={18} /> },
  ];

  if (!mounted) return null;

  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#030712] text-white font-sans min-h-screen antialiased selection:bg-blue-500/30 overflow-x-hidden">
        
        {/* --- NAVIGATION BAR --- */}
        <header className="fixed top-0 left-0 w-full z-[9999] border-b border-white/10 bg-[#030712]/90 backdrop-blur-xl transition-all duration-300">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-10 py-4 md:py-5">
            
            {/* LOGO - Visual Branding */}
            <Link href="/" className="flex items-center gap-2 group transition-transform active:scale-95">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:shadow-blue-500/50 transition-all">
                F
              </div>
              <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">
                FIN<span className="text-blue-500">DOOR</span>
              </span>
            </Link>

            {/* DESKTOP NAV - Laptop Friendly */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`relative text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-200 ${
                    link.highlight ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  {link.highlight && <span className="absolute -right-3 top-0 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>}
                </Link>
              ))}
              <button className="ml-4 bg-white text-black px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all duration-300 active:scale-95 shadow-lg shadow-white/5">
                Login
              </button>
            </div>

            {/* MOBILE TOGGLE - Phone Friendly */}
            <div className="flex items-center gap-3 md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white active:bg-white/10 transition-colors"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X size={24} className="text-blue-500" /> : <Menu size={24} />}
              </button>
            </div>
          </nav>

          {/* MOBILE OVERLAY MENU - Tablet & Phone Friendly */}
          <div 
            className={`fixed inset-0 top-[72px] md:hidden bg-[#030712] transition-all duration-500 ease-in-out ${
              isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
            }`}
          >
            <div className="flex flex-col p-6 h-full space-y-3 overflow-y-auto">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-4 ml-2">Navigation</div>
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 active:bg-blue-600/20 active:border-blue-500/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-blue-500 group-active:scale-110 transition-transform">{link.icon}</span>
                    <span className="text-sm font-bold uppercase tracking-widest">{link.name}</span>
                  </div>
                  {link.highlight && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                </Link>
              ))}
              
              <div className="pt-6 mt-auto">
                <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all">
                  <LogIn size={20} /> Login to Campus
                </button>
                <div className="mt-8 text-center">
                  <span className="flex items-center justify-center gap-2 text-[9px] font-bold text-gray-600 uppercase tracking-[0.4em]">
                    <GraduationCap size={14} /> MIT ADT University
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        {/* pt-20 on mobile, pt-24 on desktop to clear the fixed navbar */}
        <main className="relative z-0 pt-[80px] md:pt-[100px] min-h-screen">
          {children}
        </main>

        {/* --- GLOBAL FOOTER - Good for "Other Platforms" Friendly --- */}
        <footer className="py-10 border-t border-white/5 text-center">
           <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
             © 2025 Findoor • Built for the MIT Campus
           </p>
        </footer>

      </body>
    </html>
  );
}