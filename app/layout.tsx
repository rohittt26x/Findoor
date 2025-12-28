"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import Link from "next/link";
import { Menu, X, Home, Search, PlusCircle, Info, LogIn, GraduationCap, MapPin } from "lucide-react";

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

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={20} /> },
    { name: "Matches", href: "/matches", icon: <Search size={20} />, highlight: true },
    { name: "Report Lost", href: "/report-lost", icon: <PlusCircle size={20} /> },
    { name: "Report Found", href: "/report-found", icon: <PlusCircle size={20} /> },
    { name: "About", href: "/about", icon: <Info size={20} /> },
  ];

  if (!mounted) return null;

  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#030712] text-white font-sans min-h-screen antialiased selection:bg-blue-500/30">
        
        {/* --- NAVIGATION BAR --- */}
        <header className="fixed top-0 left-0 w-full z-[100] border-b border-white/10 bg-[#030712]/90 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:px-10 md:py-6">
            
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 group z-[101]">
              <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                F
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">
                FIN<span className="text-blue-500">DOOR</span>
              </span>
            </Link>

            {/* DESKTOP NAV - Visible on Laptops */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${
                    link.highlight ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button className="bg-white text-black px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">
                Login
              </button>
            </div>

            {/* MOBILE TOGGLE - High Z-index to stay above overlay */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden z-[101] p-2 text-white bg-white/5 rounded-lg border border-white/10"
            >
              {isMenuOpen ? <X size={24} className="text-blue-500" /> : <Menu size={24} />}
            </button>
          </nav>

          {/* FULL SCREEN MOBILE OVERLAY */}
          <div 
            className={`fixed inset-0 bg-[#030712] z-[99] flex flex-col transition-transform duration-500 ease-in-out md:hidden ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Top spacing to avoid covering the header buttons */}
            <div className="h-[80px] w-full" /> 
            
            <div className="flex-1 px-8 py-4 flex flex-col gap-3">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-4">
                Campus Navigation
              </p>
              
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/5 active:bg-blue-600/20 transition-all"
                >
                  <span className="text-blue-500">{link.icon}</span>
                  <span className="text-base font-bold uppercase tracking-widest">
                    {link.name}
                  </span>
                  {link.highlight && (
                    <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </Link>
              ))}

              <div className="mt-auto mb-10 space-y-4">
                <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                  <LogIn size={20} /> Login to Campus
                </button>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <MapPin size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">MIT ADT Campus</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="relative z-0 pt-[80px] md:pt-[100px]">
          {children}
        </main>

      </body>
    </html>
  );
}