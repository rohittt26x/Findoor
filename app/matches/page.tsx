"use client";

import React, { useEffect, useState } from "react";
import { ref, onValue, push, set } from "firebase/database";
import { database, auth } from "@/app/lib/firebase"; 
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, MapPin, X, Loader2, Search, Package,
  AlertCircle, ArrowLeft, Mail, Phone, User as UserIcon
} from "lucide-react";

type Item = {
  id: string;
  itemName: string;
  location: string;
  description?: string;
  imageUrl?: string;
  createdAt: number;
  userName: string;   // Owner's Name
  userEmail: string;  // Owner's Email
  userPhone: string;  // Owner's Phone
};

export default function MatchesPage() {
  const [view, setView] = useState<"select" | "lost" | "found">("select");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Load items based on selection
  useEffect(() => {
    if (view === "select") return;

    setLoading(true);
    const dbPath = view === "found" ? "found_items" : "lost_items";
    const itemsRef = ref(database, dbPath);

    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedItems = data ? Object.keys(data).map(k => ({ id: k, ...data[k] })) : [];
      setItems(loadedItems);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [view]);

  // SECURE LOGIC: Send Request for Details
  const handleRequestDetails = async (item: Item) => {
    if (!auth.currentUser) {
        setStatusMsg("Please login to request details.");
        return;
    }

    try {
      // We create a "mail" document in the database
      // If you use the Firebase "Trigger Email" extension, this sends the mail automatically
      const mailRef = ref(database, `mail_requests/${Date.now()}`);
      await set(mailRef, {
        to: item.userEmail, // The owner of the item
        message: {
          subject: `FINDOOR: Someone found/lost your item (${item.itemName})`,
          text: `Hello ${item.userName}, someone is interested in your item. 
                 Contact the requester: 
                 Name: ${auth.currentUser.displayName} 
                 Email: ${auth.currentUser.email}`,
        },
        requesterId: auth.currentUser.uid,
        itemId: item.id
      });

      setStatusMsg("Request Sent! The owner will be notified by email.");
    } catch (error) {
      setStatusMsg("Failed to send request.");
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white pb-24 px-6">
      
      <AnimatePresence mode="wait">
        {/* 1. SELECTION VIEW */}
        {view === "select" ? (
          <motion.section 
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl font-black mb-12 tracking-tighter">WHAT ARE YOU LOOKING FOR?</h1>
            <div className="grid md:grid-cols-2 gap-6">
              <button 
                onClick={() => setView("found")}
                className="group p-10 rounded-[2.5rem] bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600 transition-all text-left"
              >
                <Search size={40} className="text-blue-500 group-hover:text-white mb-4" />
                <h2 className="text-2xl font-black uppercase">See Found Items</h2>
                <p className="text-gray-400 group-hover:text-blue-100 text-sm mt-2">Browse items people have found.</p>
              </button>

              <button 
                onClick={() => setView("lost")}
                className="group p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all text-left"
              >
                <Package size={40} className="text-gray-400 group-hover:text-black mb-4" />
                <h2 className="text-2xl font-black uppercase">See Lost Items</h2>
                <p className="text-gray-500 group-hover:text-gray-700 text-sm mt-2">Help others find their belongings.</p>
              </button>
            </div>
          </motion.section>
        ) : (
          /* 2. LIST VIEW */
          <motion.section 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-20 max-w-7xl mx-auto"
          >
            <button 
              onClick={() => setView("select")}
              className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 font-bold uppercase text-xs tracking-widest transition"
            >
              <ArrowLeft size={16} /> Back to Selection
            </button>

            <h2 className="text-4xl font-black uppercase mb-10">
                {view === "found" ? "Found Items" : "Lost Items"}
            </h2>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* LIGHTBOX & STATUS MESSAGES */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} className="max-h-full max-w-full rounded-2xl shadow-2xl" />
          </motion.div>
        )}

        {statusMsg && (
            <motion.div initial={{y: 50}} animate={{y: 0}} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-blue-600 px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-3">
                {statusMsg}
                <X size={18} className="cursor-pointer" onClick={() => setStatusMsg(null)} />
            </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function ItemCard({ item, index, onImageClick, onRequest }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all group"
    >
      <div className="relative aspect-video cursor-pointer overflow-hidden" onClick={() => onImageClick(item.imageUrl)}>
        {item.imageUrl ? (
            <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-700"><AlertCircle /></div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-black uppercase mb-1">{item.itemName}</h3>
        <p className="text-gray-400 text-xs flex items-center gap-1 mb-6"><MapPin size={12} /> {item.location}</p>
        
        <button 
          onClick={onRequest}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-lg shadow-blue-600/20"
        >
          Request Contact Details
        </button>
      </div>
    </motion.div>
  );
}