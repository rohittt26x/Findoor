"use client";

import React, { useEffect, useState } from "react";
import { ref, onValue, set, get } from "firebase/database";
import { database, auth } from "@/app/lib/firebase"; 
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, X, Loader2, Search, Package,
  AlertCircle, ArrowLeft, Mail, ChevronRight, Filter, Sparkles
} from "lucide-react";

type Item = {
  id: string;
  itemName: string;
  location: string;
  description?: string;
  imageUrl?: string;
  createdAt: number;
  userName: string;
  userEmail: string;
};

export default function MatchesPage() {
  const [view, setView] = useState<"select" | "lost" | "found">("select");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  
  // AI Matching States
  const [isScanning, setIsScanning] = useState(false);
  const [aiMatches, setAiMatches] = useState<string[]>([]);

  // Load items from Firebase based on the current view
  useEffect(() => {
    if (view === "select") return;
    setLoading(true);
    const dbPath = view === "found" ? "found_items" : "lost_items";
    const itemsRef = ref(database, dbPath);

    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedItems = data ? Object.keys(data).map(k => ({ id: k, ...data[k] })) : [];
      setItems(loadedItems.reverse()); // Show newest entries first
      setLoading(false);
    });
    return () => unsubscribe();
  }, [view]);

  // --- AI MATCH SCAN LOGIC USING GEMINI ---
  const handleAiScan = async (lostItem: Item) => {
    setIsScanning(true);
    setAiMatches([]);

    try {
      // 1. Fetch all Found Items to compare against the selected Lost Item
      const foundItemsRef = ref(database, "found_items");
      const snapshot = await get(foundItemsRef);
      const foundData = snapshot.val();
      const allFoundItems = foundData ? Object.keys(foundData).map(k => ({ id: k, ...foundData[k] })) : [];

      if (allFoundItems.length === 0) {
        setStatusMsg({ text: "No found items in database to match against.", type: 'error' });
        setIsScanning(false);
        return;
      }

      // 2. Call your internal Next.js API route that talks to Gemini
      const response = await fetch("/api/ai-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lostItem: lostItem,
          foundItems: allFoundItems,
        }),
      });

      const result = await response.json();

      if (result.matches && result.matches.length > 0) {
        setAiMatches(result.matches);
        setStatusMsg({ text: `Gemini found ${result.matches.length} potential matches!`, type: 'success' });
        // Automatically switch view to Found Items to show the matches
        setView("found"); 
      } else {
        setStatusMsg({ text: "Gemini couldn't find a direct match. We'll keep looking!", type: 'error' });
      }

    } catch (e) {
      console.error("AI Scan Error:", e);
      setStatusMsg({ text: "AI Scan failed. Check API configuration.", type: 'error' });
    } finally {
      setIsScanning(false);
    }
  };

  const handleRequestDetails = async (item: Item) => {
    if (!auth.currentUser) {
      setStatusMsg({ text: "Please log in to request details.", type: 'error' });
      return;
    }

    try {
      const mailRef = ref(database, `mail_requests/${Date.now()}`);
      await set(mailRef, {
        to: item.userEmail,
        message: {
          subject: `[FINDOOR] Inquiry for: ${item.itemName}`,
          text: `Hi ${item.userName}, ${auth.currentUser.displayName} is inquiring about your post. Contact: ${auth.currentUser.email}`,
        },
        requesterId: auth.currentUser.uid,
        itemId: item.id
      });
      setStatusMsg({ text: "Request sent! The owner will be notified.", type: 'success' });
    } catch (e) {
      setStatusMsg({ text: "Failed to send request.", type: 'error' });
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-slate-200 selection:bg-blue-500/30">
      
      {/* --- AI SCANNING OVERLAY --- */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-[#030712]/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative mb-8">
              <motion.div 
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-32 h-32 border-2 border-blue-500/20 border-t-blue-500 rounded-full"
              />
              <Sparkles className="absolute inset-0 m-auto text-blue-400 animate-pulse" size={40} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-white">Gemini Matching...</h2>
            <p className="text-slate-400 mt-2 max-w-xs">Analyzing descriptions and locations to find your item across campus.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN PAGE CONTENT --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        <AnimatePresence mode="wait">
          {view === "select" ? (
            /* --- 1. SELECTION VIEW --- */
            <motion.section 
              key="selection" 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                Smart Bridge Engine
              </span>
              <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight mb-8">
                What are you <span className="text-blue-500">looking</span> for?
              </h1>
              <div className="grid sm:grid-cols-2 gap-6 mt-16">
                <SelectionCard title="Found Items" desc="Browse items found on campus." icon={<Search size={32} />} onClick={() => setView("found")} primary />
                <SelectionCard title="Lost Items" desc="View items reported as lost." icon={<Package size={32} />} onClick={() => setView("lost")} />
              </div>
            </motion.section>
          ) : (
            /* --- 2. LIST VIEW (LOST OR FOUND) --- */
            <motion.section key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <button onClick={() => { setView("select"); setAiMatches([]); }} className="flex items-center gap-2 text-slate-500 hover:text-white mb-4 text-sm font-medium transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to selection
                  </button>
                  <h2 className="text-4xl font-bold text-white tracking-tight capitalize">
                    {view} <span className="text-slate-500">Database</span>
                  </h2>
                </div>
                {aiMatches.length > 0 && (
                  <button 
                    onClick={() => setAiMatches([])}
                    className="text-xs font-bold text-blue-500 border border-blue-500/30 px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white transition"
                  >
                    Clear AI Filter
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                  <Loader2 className="animate-spin text-blue-500" size={32} />
                  <p className="text-slate-500">Fetching records...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {items.map((item, i) => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      index={i} 
                      viewType={view}
                      isAiMatch={aiMatches.includes(item.id)}
                      onImageClick={setSelectedImage}
                      onRequest={() => handleRequestDetails(item)}
                      onAiScan={() => handleAiScan(item)}
                    />
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* --- OVERLAYS & TOASTS --- */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-6 backdrop-blur-sm" 
            onClick={() => setSelectedImage(null)}
          >
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={selectedImage} className="max-h-full max-w-full rounded-2xl shadow-2xl border border-white/10" />
          </motion.div>
        )}

        {statusMsg && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className={`fixed bottom-8 right-8 z-[300] px-6 py-4 rounded-2xl font-semibold shadow-2xl flex items-center gap-4 border backdrop-blur-xl ${statusMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {statusMsg.text}
            <button onClick={() => setStatusMsg(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors"><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// --- ITEM CARD SUB-COMPONENT ---
function ItemCard({ item, index, viewType, isAiMatch, onImageClick, onRequest, onAiScan }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group bg-white/[0.03] border rounded-[2rem] overflow-hidden transition-all duration-500 shadow-xl ${
        isAiMatch ? 'border-blue-500 bg-blue-500/5 ring-4 ring-blue-500/20' : 'border-white/10 hover:border-blue-500/50'
      }`}
    >
      <div className="relative aspect-[16/10] cursor-pointer overflow-hidden m-3 rounded-[1.5rem]" onClick={() => item.imageUrl && onImageClick(item.imageUrl)}>
        {isAiMatch && (
          <div className="absolute top-4 left-4 z-20 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Sparkles size={10} /> AI MATCH
          </div>
        )}
        {item.imageUrl ? (
          <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-700 gap-2"><AlertCircle size={32} /></div>
        )}
      </div>
      
      <div className="p-6 pt-2">
        <h3 className="text-xl font-bold text-white mb-1">{item.itemName}</h3>
        <div className="flex items-center gap-1.5 text-slate-500 mb-6">
          <MapPin size={14} className="text-blue-500/70" />
          <span className="text-sm font-medium">{item.location}</span>
        </div>

        <div className="space-y-2">
          {viewType === "lost" && (
            <button 
              onClick={onAiScan}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <Sparkles size={14} /> AI Match Scan
            </button>
          )}
          <button 
            onClick={onRequest}
            className="w-full py-3.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all border border-white/5 flex items-center justify-center gap-2"
          >
            <Mail size={14} /> Request Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// --- SELECTION CARD SUB-COMPONENT ---
function SelectionCard({ title, desc, icon, onClick, primary = false }: any) {
  return (
    <button 
      onClick={onClick}
      className={`group relative p-8 rounded-[2rem] border transition-all duration-500 text-left overflow-hidden ${
        primary 
        ? 'bg-blue-600 border-blue-400/50 shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:shadow-blue-600/40' 
        : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
      }`}
    >
      {primary && (
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 blur-[60px] rounded-full group-hover:bg-white/20 transition-colors" />
      )}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 ${
        primary ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-500'
      }`}>
        {icon}
      </div>
      <h3 className={`text-2xl font-bold mb-2 ${primary ? 'text-white' : 'text-slate-100'}`}>{title}</h3>
      <p className={`text-sm leading-relaxed ${primary ? 'text-blue-100' : 'text-slate-400'}`}>{desc}</p>
      <div className={`mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${primary ? 'text-white' : 'text-blue-500'}`}>
        Explore items <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
}