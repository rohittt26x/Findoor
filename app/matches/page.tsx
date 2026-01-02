"use client";

import React, { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { database, auth } from "@/app/lib/firebase"; 
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, X, Loader2, Search, Package,
  AlertCircle, ArrowLeft, Mail, ChevronRight, Filter
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

  useEffect(() => {
    if (view === "select") return;
    setLoading(true);
    const dbPath = view === "found" ? "found_items" : "lost_items";
    const itemsRef = ref(database, dbPath);

    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedItems = data ? Object.keys(data).map(k => ({ id: k, ...data[k] })) : [];
      setItems(loadedItems.reverse()); // Show newest first
      setLoading(false);
    });
    return () => unsubscribe();
  }, [view]);

  const handleRequestDetails = async (item: Item) => {
    if (!auth.currentUser) {
      setStatusMsg({ text: "Authentication required to request details.", type: 'error' });
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
      setStatusMsg({ text: "Request sent successfully! Check your email soon.", type: 'success' });
    } catch (e) {
      setStatusMsg({ text: "Failed to send request. Try again.", type: 'error' });
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-slate-200 selection:bg-blue-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        <AnimatePresence mode="wait">
          {view === "select" ? (
            <motion.section 
              key="selection"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                Discovery Engine
              </span>
              <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight mb-8">
                What are you <span className="text-blue-500">looking</span> for?
              </h1>
              
              <div className="grid sm:grid-cols-2 gap-6 mt-16">
                <SelectionCard 
                  title="Found Items" 
                  desc="I want to see what people have found." 
                  icon={<Search size={32} />}
                  onClick={() => setView("found")}
                  primary
                />
                <SelectionCard 
                  title="Lost Items" 
                  desc="I want to help find missing belongings." 
                  icon={<Package size={32} />}
                  onClick={() => setView("lost")}
                />
              </div>
            </motion.section>
          ) : (
            <motion.section 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              {/* Header Navigation */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <button 
                    onClick={() => setView("select")}
                    className="flex items-center gap-2 text-slate-500 hover:text-white mb-4 text-sm font-medium transition-colors group"
                  >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to selection
                  </button>
                  <h2 className="text-4xl font-bold text-white tracking-tight capitalize">
                    {view} <span className="text-slate-500">Database</span>
                  </h2>
                </div>
                
                <div className="flex items-center gap-3">
                   <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 text-sm text-slate-400">
                     <Filter size={14} /> <span>Newest First</span>
                   </div>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                  <Loader2 className="animate-spin text-blue-500" size={32} />
                  <p className="text-slate-500 animate-pulse font-medium">Syncing with database...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {items.map((item, i) => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      index={i} 
                      onImageClick={setSelectedImage}
                      onRequest={() => handleRequestDetails(item)}
                    />
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox & Toast Notifications */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-6 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.img 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              src={selectedImage} className="max-h-full max-w-full rounded-2xl shadow-2xl border border-white/10" 
            />
          </motion.div>
        )}

        {statusMsg && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className={`fixed bottom-8 right-8 z-[300] px-6 py-4 rounded-2xl font-semibold shadow-2xl flex items-center gap-4 border backdrop-blur-xl ${
              statusMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {statusMsg.text}
            <button onClick={() => setStatusMsg(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// --- SUB-COMPONENTS ---

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

function ItemCard({ item, index, onImageClick, onRequest }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white/[0.03] border border-white/10 rounded-[2rem] overflow-hidden hover:bg-white/[0.06] hover:border-blue-500/50 transition-all duration-500 shadow-xl"
    >
      <div 
        className="relative aspect-[16/10] cursor-pointer overflow-hidden m-3 rounded-[1.5rem]" 
        onClick={() => item.imageUrl && onImageClick(item.imageUrl)}
      >
        {item.imageUrl ? (
            <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
            <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-700 gap-2">
              <AlertCircle size={32} />
              <span className="text-[10px] uppercase font-bold tracking-widest">No visual data</span>
            </div>
        )}
      </div>
      
      <div className="p-6 pt-2">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{item.itemName}</h3>
            <div className="flex items-center gap-1.5 text-slate-500 mt-1">
              <MapPin size={14} className="text-blue-500/70" />
              <span className="text-sm font-medium">{item.location}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onRequest}
          className="w-full py-4 bg-white/[0.05] hover:bg-blue-600 text-slate-300 hover:text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 border border-white/5 active:scale-[0.97] flex items-center justify-center gap-2 group/btn"
        >
          <Mail size={14} className="group-hover/btn:scale-110 transition-transform" />
          Request Details
        </button>
      </div>
    </motion.div>
  );
}