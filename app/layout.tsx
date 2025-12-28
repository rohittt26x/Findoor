"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import Link from "next/link";
import { Menu, X, Home, Search, PlusCircle, Info, LogIn, MapPin } from "lucide-react";

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
    { name: "Home", href: "/", icon: <Home size={22} /> },
    { name: "Matches", href: "/matches", icon: <Search size={22} />, highlight: true },
    { name: "Report Lost", href: "/report-lost", icon: <PlusCircle size={22} /> },
    { name: "Report Found", href: "/report-found", icon: <PlusCircle size={22} /> },
    { name: "About", href: "/about", icon: <Info size={22} /> },
  ];

  if (!mounted) return null;

  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#030712] text-white font-sans min-h-screen antialiased">
        
        {/* --- NAVIGATION BAR --- */}
        <header className="fixed top-0 left-0 w-full z-[100] border-b border-white/10 bg-[#030712]/95 backdrop-blur-2xl">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:px-10 md:py-6">
            
            {/* LOGO - Updated with White 'FIN' */}
            <Link href="/" className="flex items-center gap-2 group z-[110]">
              <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center font-black text-white">
                F
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">
                <span className="text-white">FIN</span>
                <span className="text-blue-500">DOOR</span>
              </span>
            </Link>

            {/* DESKTOP NAV */}
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

            {/* MOBILE TOGGLE */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden z-[110] p-2 text-white bg-white/10 rounded-xl border border-white/20 shadow-lg"
            >
              {isMenuOpen ? <X size={26} className="text-blue-500" /> : <Menu size={26} />}
            </button>
          </nav>

          {/* HIGH-VISIBILITY MOBILE OVERLAY */}
          <div 
            className={`fixed inset-0 z-[105] md:hidden transition-all duration-500 ease-in-out ${
              isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
            }`}
          >
            {/* Dark Gradient Background to ensure contrast against page content */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#030712] to-blue-950/20 backdrop-blur-3xl" />
            
            <div className="relative h-full flex flex-col px-8 pt-[100px] pb-10">
              <p className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.5em] mb-6 ml-2">
                Menu
              </p>
              
              <div className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.04] border border-white/10 active:bg-blue-600/30 active:border-blue-500/50 transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-active:scale-110 transition-transform">
                      {link.icon}
                    </div>
                    <span className="text-base font-black uppercase tracking-widest text-white/90">
                      {link.name}
                    </span>
                    {link.highlight && (
                      <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
                    )}
                  </Link>
                ))}
              </div>

              <div className="mt-auto space-y-6">
                <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/20 active:scale-95 transition-transform">
                  Login to Account
                </button>
                <div className="flex items-center justify-center gap-2 text-gray-500 pb-4">
                  <MapPin size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">MIT ADT Campus</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="relative z-0 pt-[85px] md:pt-[110px]">
          {children}
        </main>

      </body>
    </html>
  );
}