"use client";

import { useState } from "react";
import "./globals.css";
import Link from "next/link";
import { Menu, X, Sparkles, Home, Search, PlusCircle, Info, LogIn } from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={16} /> },
    { name: "Matches", href: "/matches", icon: <Search size={16} />, highlight: true },
    { name: "Report Lost", href: "/report-lost", icon: <PlusCircle size={16} /> },
    { name: "Report Found", href: "/report-found", icon: <PlusCircle size={16} /> },
    { name: "About", href: "/about", icon: <Info size={16} /> },
  ];

  return (
    <html lang="en" className="dark">
      <body className="bg-[#030712] text-white font-sans min-h-screen antialiased selection:bg-blue-500/30">
        
        {/* NAVIGATION BAR */}
        <header className="fixed top-0 w-full z-[100] border-b border-white/10 bg-[#030712]/80 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-4">
            
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 w-8 h-8 rounded-lg flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform">
                F
              </div>
              <span className="text-xl font-bold tracking-tighter text-white uppercase italic">
                FIN<span className="text-blue-500">DOOR</span>
              </span>
            </Link>

            {/* DESKTOP NAV - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em]">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`${link.highlight ? 'text-blue-400' : 'text-white/70'} hover:text-white transition-colors flex items-center gap-1.5`}
                >
                  {link.name}
                  {link.highlight && <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>}
                </Link>
              ))}
            </div>

            {/* RIGHT SECTION: CAMPUS TAG & HAMBURGER */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:block">
                <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest text-gray-500">
                  MIT ADT University
                </span>
              </div>
              
              {/* MOBILE MENU TOGGLE */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>

          {/* MOBILE OVERLAY MENU - Visible only on small screens when toggled */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-[#030712] border-b border-white/10 p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top duration-300">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs font-bold uppercase tracking-widest hover:bg-blue-600/10 transition-all"
                >
                  <span className="text-blue-500">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
              <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 mt-2">
                <LogIn size={16} /> Login to Campus
              </button>
            </div>
          )}
        </header>

        {/* MAIN CONTENT */}
        <main className="relative z-0 pt-20">
          {children}
        </main>

      </body>
    </html>
  );
}