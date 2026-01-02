"use client";

import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/app/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, MapPin, X, Loader2, Eye,
  AlertCircle, Info, Mail
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [contactModal, setContactModal] = useState<null | "lost" | "found">(null);

  useEffect(() => {
    onValue(ref(database, "lost_items"), (s) => {
      const d = s.val();
      setLostItems(d ? Object.keys(d).map(k => ({ id: k, ...d[k] })) : []);
    });

    onValue(ref(database, "found_items"), (s) => {
      const d = s.val();
      setFoundItems(d ? Object.keys(d).map(k => ({ id: k, ...d[k] })) : []);
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#030712] text-white pb-24">
      <section className="pt-20 pb-14 text-center">
        <h1 className="text-6xl font-black mb-4">Smart Matches</h1>
        <p className="text-gray-400">
          AI-assisted lost & found matching
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
        {/* LOST */}
        <div>
          <h2 className="text-xl font-bold mb-6">Lost Items</h2>
          <div className="space-y-6">
            {lostItems.map((item, i) => (
              <ItemCard
                key={item.id}
                item={item}
                index={i}
                type="lost"
                loadingId={loadingId}
                onImageClick={setSelectedImage}
                onContact={() => setContactModal("lost")}
              />
            ))}
          </div>
        </div>

        {/* FOUND */}
        <div>
          <h2 className="text-xl font-bold mb-6">Found Items</h2>
          <div className="space-y-6">
            {foundItems.map((item, i) => (
              <ItemCard
                key={item.id}
                item={item}
                index={i}
                type="found"
                onImageClick={setSelectedImage}
                onContact={() => setContactModal("found")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* IMAGE LIGHTBOX */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <img src={selectedImage} className="max-h-[85vh] rounded-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTACT MODAL (PLACEHOLDER – SECURE) */}
      <AnimatePresence>
        {contactModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <div
              className="absolute inset-0 bg-black/80"
              onClick={() => setContactModal(null)}
            />
            <motion.div
              className="relative bg-[#0b0f1a] p-8 rounded-3xl max-w-md w-full border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Mail /> Contact Request
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                For privacy & security, contact details are shared
                only after verification.
              </p>
              <button
                onClick={() => setContactModal(null)}
                className="w-full bg-white text-black py-3 rounded-xl font-bold"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ---------------- ITEM CARD ---------------- */

function ItemCard({
  item,
  index,
  type,
  loadingId,
  onImageClick,
  onContact,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-[#0b0f1a]/50 border border-white/10 rounded-3xl p-5"
    >
      <div
        className="relative aspect-video mb-4 rounded-2xl overflow-hidden cursor-pointer"
        onClick={() => item.imageUrl && onImageClick(item.imageUrl)}
      >
        {item.imageUrl ? (
          <img src={item.imageUrl} className="w-full h-full object-cover" />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-600">
            <AlertCircle />
          </div>
        )}
      </div>

      <h3 className="font-black uppercase">{item.itemName}</h3>
      <p className="text-xs text-gray-400 flex items-center gap-1 mb-4">
        <MapPin size={12} /> {item.location}
      </p>

      {/* 🔥 NEW BUTTONS */}
      <div className="space-y-3">
        {type === "lost" && (
          <>
            <button className="w-full py-3 bg-white text-black rounded-xl font-bold">
              AI Match Scan
            </button>
            <button
              onClick={onContact}
              className="w-full py-3 border border-white/20 rounded-xl text-sm hover:bg-white hover:text-black transition"
            >
              Get Contact Details
            </button>
          </>
        )}

        {type === "found" && (
          <button
            onClick={onContact}
            className="w-full py-3 bg-emerald-500 rounded-xl font-bold"
          >
            I Found This – Contact Owner
          </button>
        )}
      </div>
    </motion.div>
  );
}
