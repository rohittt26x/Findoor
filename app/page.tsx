"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./lib/firebase";
import { signInWithGoogle, logout } from "./lib/auth";
import Link from "next/link";
import { motion } from "framer-motion"; // Install this: npm install framer-motion
import { Search, PlusCircle, LogOut, ArrowRight } from "lucide-react"; // npm install lucide-react

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#030712] text-white overflow-hidden">
      
      {/* 1. SEXY BACKGROUND MESH/GRID */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-4xl px-6"
      >
        {/* 2. BADGE */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Trustworthy Lost & Found
        </div>

        {/* 3. GRADIENT TYPOGRAPHY */}
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
          FINDOOR
        </h1>

        <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-12">
          The smart bridge between <span className="text-white font-medium">lost items</span> and their <span className="text-white font-medium">rightful owners</span>. Simple, secure, and fast.
        </p>

        {/* 4. REIMAGINED CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
          <Link
            href="/report-lost"
            className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <Search className="w-5 h-5" />
            Report Lost Item
          </Link>

          <Link
            href="/report-found"
            className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gray-900/50 border border-gray-800 text-white font-semibold hover:bg-gray-800 transition-all active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            Report Found Item
          </Link>
        </div>
      </motion.section>

      {/* 5. AUTH SECTION (GLASSMORPHISM) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="p-1 rounded-2xl bg-gradient-to-b from-gray-800 to-transparent">
          <div className="bg-[#0b0f1a] rounded-[14px] p-6 text-center border border-gray-800/50 backdrop-blur-xl">
            {!user ? (
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white hover:bg-gray-100 transition rounded-xl text-black font-bold"
              >
                {/* Fixed Google SVG Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Get Started with Google
              </button>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-3 mb-6 p-2 pr-4 rounded-full bg-gray-900 border border-gray-800">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs uppercase text-white">
                    {user.email?.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-300 truncate max-w-[150px]">{user.email}</span>
                </div>
                
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}