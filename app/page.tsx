"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/lib/firebase";          // ✅ FIXED
import { signInWithGoogle, logout } from "@/app/lib/auth"; // ✅ FIXED
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, PlusCircle, LogOut } from "lucide-react";

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
      
      {/* BACKGROUND */}
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Trustworthy Lost & Found
        </div>

        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
          FINDOOR
        </h1>

        <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-12">
          The smart bridge between <span className="text-white font-medium">lost items</span> and their <span className="text-white font-medium">rightful owners</span>. Simple, secure, and fast.
        </p>

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

      {/* AUTH */}
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
                Get Started with Google
              </button>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-3 mb-6 p-2 pr-4 rounded-full bg-gray-900 border border-gray-800">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs uppercase text-white">
                    {user.email?.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-300 truncate max-w-[150px]">
                    {user.email}
                  </span>
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
