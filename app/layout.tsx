"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Search,
  PlusCircle,
  Info,
  MapPin,
  Sparkles,
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

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={20} />, sub: "Dashboard" },
    {
      name: "Matches",
      href: "/matches",
      icon: <Search size={20} />,
      sub: "AI Matcher",
      highlight: true,
    },
    {
      name: "Report Lost",
      href: "/report-lost",
      icon: <PlusCircle size={20} />,
      sub: "Lost something?",
    },
    {
      name: "Report Found",
      href: "/report-found",
      icon: <PlusCircle size={20} />,
      sub: "Found something?",
    },
    {
      name: "About",
      href: "/about",
      icon: <Info size={20} />,
      sub: "Developer Info",
    },
  ];

  if (!mounted) return null;

  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#030712] text-white min-h-screen antialiased overflow-x-hidden">
        {/* ================= HEADER ================= */}
        <header className="fixed top-0 left-0 w-full z-[100] border-b border-white/5 bg-[#030712]">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:px-10">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-blue-600 w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shadow-lg">
                F
              </div>
              <span className="text-xl font-black tracking-tighter italic">
                <span className="text-white">FIN</span>
                <span className="text-blue-500">DOOR</span>
              </span>
            </Link>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all
                    ${
                      link.highlight
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                    }`}
                >
                  {link.name}
                </Link>
              ))}

              <button className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl">
                Login
              </button>
            </div>

            {/* MOBILE TOGGLE (3 LINES) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-2xl bg-white/10 border border-white/10"
            >
              {isMenuOpen ? (
                <X size={24} className="text-blue-500" />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </nav>

          {/* ================= MOBILE MENU ================= */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="fixed inset-0 z-[105] md:hidden bg-[#020617]"
              >
                <div className="flex flex-col h-full px-8 pt-[120px] pb-10">
                  {/* TITLE */}
                  <div className="flex items-center gap-2 mb-10">
                    <Sparkles size={14} className="text-blue-500" />
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                      Main Navigation
                    </p>
                  </div>

                  {/* LINKS */}
                  <div className="flex flex-col gap-4">
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
                          className={`flex items-center gap-5 p-5 rounded-[2rem] border transition-all
                            ${
                              link.highlight
                                ? "bg-blue-600/20 border-blue-500"
                                : "bg-white/10 border-white/10"
                            }`}
                        >
                          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            {link.icon}
                          </div>

                          <div>
                            <p className="font-black uppercase tracking-widest">
                              {link.name}
                            </p>
                            <p className="text-[9px] text-gray-400 uppercase tracking-widest">
                              {link.sub}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* FOOTER */}
                  <div className="mt-auto space-y-8">
                    <button className="w-full bg-blue-600 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-xl">
                      Login to Account
                    </button>

                    <div className="text-center space-y-3">
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <MapPin size={12} />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em]">
                          MIT ADT Campus
                        </span>
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">
                        Developed by{" "}
                        <span className="text-blue-500">
                          Rohit J. Pokale
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* ================= MAIN CONTENT ================= */}
        <main className="pt-[90px] md:pt-[110px]">{children}</main>
      </body>
    </html>
  );
}
