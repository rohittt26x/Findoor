"use client";

import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/app/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, MapPin, Search, X, Loader2, Eye, 
  CheckCircle, AlertCircle, TrendingUp, Info 
} from "lucide-react";

type Item = {
  id: string;
  itemName: string;
  location: string;
  description?: string;
  imageUrl?: string;
  createdAt: number;
};

export default function MatchesPage() {
  const [lostItems, setLostItems] = useState<Item[]>([]);
  const [foundItems, setFoundItems] = useState<Item[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const lostRef = ref(database, "lost_items");
    const foundRef = ref(database, "found_items");

    onValue(lostRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return setLostItems([]);
      setLostItems(Object.keys(data).map((k) => ({ id: k, ...data[k] })));
    });

    onValue(foundRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return setFoundItems([]);
      setFoundItems(Object.keys(data).map((k) => ({ id: k, ...data[k] })));
    });
  }, []);

  const checkMatch = async (lost: Item) => {
    if (foundItems.length === 0) return alert("No found items available to compare.");
    setLoadingId(lost.id);
    setResult(null);

    try {
      const res = await fetch("/api/gemini-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lostItem: lost, foundItem: foundItems[0] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI comparison failed");
      setResult(data.raw || data); 
      setShowAIModal(true);
    } catch (err: any) {
      alert("AI Match Error: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white pb-24 relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <Sparkles className="w-3 h-3" />
            AI powered
          </motion.div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
            Smart Matches
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg font-medium leading-relaxed">
            Intelligently connecting lost belongings using <span className="text-white">Gemini 2.0 Flash</span> neural vision.
          </p>
        </div>
      </section>

      {/* SYMMETRICAL DASHBOARD LAYOUT */}
      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* --- COLUMN 1: LOST REPORTS --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold flex items-center gap-3 italic uppercase tracking-tighter">
              <span className="w-1.5 h-6 bg-red-600 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
              Lost Reports
            </h2>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">{lostItems.length} Items</span>
          </div>

          <div className="space-y-6">
            {lostItems.map((item, index) => (
              <ItemCard key={item.id} item={item} index={index} type="lost" onCheck={checkMatch} loadingId={loadingId} onImageClick={setSelectedImage} />
            ))}
          </div>
        </div>

        {/* --- COLUMN 2: RECENT FINDS --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold flex items-center gap-3 italic uppercase tracking-tighter">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              Recent Finds
            </h2>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">{foundItems.length} Items</span>
          </div>

          <div className="space-y-6">
            {foundItems.map((item, index) => (
              <ItemCard key={item.id} item={item} index={index} type="found" onImageClick={setSelectedImage} />
            ))}
          </div>
        </div>
      </section>

      {/* --- LIGHTBOX & AI MODAL --- */}
      <AnimatePresence>
        {selectedImage && <ImageLightbox image={selectedImage} onClose={() => setSelectedImage(null)} />}
        {showAIModal && result && <AIModal result={result} onClose={() => setShowAIModal(false)} />}
      </AnimatePresence>
    </main>
  );
}

// --- SUB-COMPONENT: UNIFIED ITEM CARD ---
function ItemCard({ item, index, type, onCheck, loadingId, onImageClick }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
      className="group bg-[#0b0f1a]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-5 hover:border-white/20 transition-all duration-500"
    >
      <div className="relative aspect-video mb-5 overflow-hidden rounded-[1.5rem] bg-black/40 border border-white/5 group-hover:border-blue-500/20 transition-all cursor-pointer"
        onClick={() => item.imageUrl && onImageClick(item.imageUrl)}>
        {item.imageUrl ? (
          <>
            <img src={item.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt={item.itemName} />
            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
            <AlertCircle size={24} className="mb-2 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-30">No Image</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center px-1 mb-4">
        <div>
          <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors tracking-tight uppercase">{item.itemName}</h3>
          <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5 mt-1 uppercase tracking-[0.1em]">
            <MapPin size={12} className={type === "lost" ? "text-red-500" : "text-emerald-500"} /> {item.location}
          </p>
        </div>
        {type === "found" && <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/20 uppercase tracking-widest">Verified</span>}
      </div>

      {type === "lost" && (
        <button
          onClick={() => onCheck(item)}
          disabled={loadingId === item.id}
          className="w-full py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 bg-white text-black hover:bg-blue-500 hover:text-white disabled:bg-white/5 disabled:text-gray-600"
        >
          {loadingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles size={14} />}
          {loadingId === item.id ? "Analyzing..." : "AI Match Scan"}
        </button>
      )}
    </motion.div>
  );
}

// --- LIGHTBOX ---
function ImageLightbox({ image, onClose }: { image: string, onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#030712]/95 z-[500] flex items-center justify-center p-6 backdrop-blur-xl" onClick={onClose}>
      <button className="absolute top-10 right-10 text-white/40 hover:text-white hover:rotate-90 transition-all"><X size={40} /></button>
      <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={image} className="max-h-[85vh] max-w-full rounded-[2rem] shadow-2xl border border-white/10" />
    </motion.div>
  );
}

// --- AI MODAL ---
function AIModal({ result, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#030712]/90 backdrop-blur-2xl" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-[#0b0f1a] w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl border border-white/10 overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-1.5 ${result.isMatch ? 'bg-emerald-500' : 'bg-red-500'}`} />
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${result.isMatch ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}><Sparkles size={28} /></div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter uppercase">AI Analysis</h2>
              <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Neural Vision Mode</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-black ${result.isMatch ? 'text-emerald-400' : 'text-red-400'}`}>{result.confidence}%</div>
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Confidence</p>
          </div>
        </div>
        <div className="bg-white/[0.03] rounded-[2rem] p-6 mb-8 border border-white/5">
          <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2"><Info size={12} className="text-blue-500" /> Reasoning</h4>
          <p className="text-gray-200 text-lg leading-relaxed font-medium">{result.reason}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-400 hover:text-white transition-all">Dismiss</button>
          {result.isMatch && <button className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 transition-all">Initiate Claim</button>}
        </div>
      </motion.div>
    </div>
  );
}