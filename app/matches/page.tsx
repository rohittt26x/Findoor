"use client";

import React, { useEffect, useState } from "react";
import { ref, onValue, get } from "firebase/database";
import { database, auth } from "@/app/lib/firebase"; 
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, X, Loader2, Search, Package,
  AlertCircle, ArrowLeft, Mail, ChevronRight, Sparkles
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
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [aiMatches, setAiMatches] = useState<string[]>([]);

  useEffect(() => {
    if (view === "select") return;

    setLoading(true);
    const dbPath = view === "found" ? "found_items" : "lost_items";
    const itemsRef = ref(database, dbPath);

    const unsub = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const loaded = data
        ? Object.keys(data).map((k) => ({ id: k, ...data[k] }))
        : [];
      setItems(loaded.reverse());
      setLoading(false);
    });

    return () => unsub();
  }, [view]);

  const handleAiScan = async (lostItem: Item) => {
    if (!auth.currentUser) {
      setStatusMsg({ text: "Login required to use AI Scan.", type: "error" });
      return;
    }

    setIsScanning(true);
    setAiMatches([]);

    try {
      const snapshot = await get(ref(database, "found_items"));
      const data = snapshot.val();
      const foundItems = data
        ? Object.keys(data).map((k) => ({ id: k, ...data[k] }))
        : [];

      if (!foundItems.length) {
        setStatusMsg({ text: "No found items available.", type: "error" });
        return;
      }

      const res = await fetch("/api/gemini-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lostItem, foundItems }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "AI failed");

      if (result.matches?.length) {
        setAiMatches(result.matches);
        setStatusMsg({
          text: `AI matched ${result.matches.length} items`,
          type: "success",
        });
        setView("found");
      } else {
        setStatusMsg({ text: "No strong matches found.", type: "error" });
      }
    } catch (e) {
      console.error(e);
      setStatusMsg({ text: "AI Scan failed.", type: "error" });
    } finally {
      setIsScanning(false);
    }
  };

  const handleRequestDetails = async (item: Item) => {
    if (!auth.currentUser) {
      setStatusMsg({ text: "Login required.", type: "error" });
      return;
    }

    if (auth.currentUser.email === item.userEmail) {
      setStatusMsg({ text: "This is your own post.", type: "error" });
      return;
    }

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: item.userEmail,
          itemName: item.itemName,
          requesterName: auth.currentUser.displayName || "Student",
          requesterEmail: auth.currentUser.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Email failed");

      setStatusMsg({ text: "Email sent successfully!", type: "success" });
    } catch (e: any) {
      setStatusMsg({ text: e.message, type: "error" });
    }
  };

  const visibleItems =
    aiMatches.length > 0 ? items.filter((i) => aiMatches.includes(i.id)) : items;

  return (
    <main className="min-h-screen bg-[#030712] text-slate-200">
      <AnimatePresence>
        {isScanning && (
          <motion.div className="fixed inset-0 z-[500] bg-black/90 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" size={48} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {view === "select" ? (
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-12">Choose</h1>
            <div className="grid sm:grid-cols-2 gap-6">
              <SelectionCard title="Found Items" icon={<Search />} onClick={() => setView("found")} primary />
              <SelectionCard title="Lost Items" icon={<Package />} onClick={() => setView("lost")} />
            </div>
          </div>
        ) : (
          <>
            <button onClick={() => { setView("select"); setAiMatches([]); }} className="mb-6 flex items-center gap-2 text-sm">
              <ArrowLeft size={16} /> Back
            </button>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                visibleItems.map((item, i) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    index={i}
                    viewType={view}
                    isAiMatch={aiMatches.includes(item.id)}
                    onImageClick={(img: string | undefined) => {
  if (img) setSelectedImage(img);
}}

                    onRequest={() => handleRequestDetails(item)}
                    onAiScan={() => handleAiScan(item)}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div className="fixed inset-0 bg-black/90 flex items-center justify-center" onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} className="max-h-[90vh] rounded-xl" />
          </motion.div>
        )}

        {statusMsg && (
          <motion.div className="fixed bottom-6 right-6 bg-black px-5 py-3 rounded-xl">
            {statusMsg.text}
            <button onClick={() => setStatusMsg(null)}><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function ItemCard({ item, viewType, isAiMatch, onImageClick, onRequest, onAiScan }: any) {
  return (
    <div className={`border rounded-2xl p-4 ${isAiMatch ? "border-blue-500" : "border-white/10"}`}>
      <div onClick={() => item.imageUrl && onImageClick(item.imageUrl)}>
        {item.imageUrl ? (
          <img src={item.imageUrl} className="rounded-xl" />
        ) : (
          <AlertCircle />
        )}
      </div>
      <h3 className="mt-3 font-bold">{item.itemName}</h3>
      <p className="text-sm text-slate-400 flex gap-1"><MapPin size={14} />{item.location}</p>

      {viewType === "lost" && (
        <button onClick={onAiScan} className="mt-3 w-full bg-blue-600 py-2 rounded-lg">
          AI Match
        </button>
      )}
      <button onClick={onRequest} className="mt-2 w-full bg-white/10 py-2 rounded-lg">
        <Mail size={14} /> Contact
      </button>
    </div>
  );
}

function SelectionCard({ title, icon, onClick, primary = false }: any) {
  return (
    <button onClick={onClick} className={`p-8 rounded-2xl ${primary ? "bg-blue-600" : "bg-white/5"}`}>
      {icon}
      <h3 className="mt-4 text-xl">{title}</h3>
      <ChevronRight />
    </button>
  );
}
