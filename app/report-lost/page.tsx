"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { ref, push } from "firebase/database";
import { database, auth } from "@/app/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, MapPin, Calendar, Tag, ArrowRight, Info,
  AlertCircle, Loader2, Navigation, X, CheckCircle, Map as MapIcon
} from "lucide-react";

// DYNAMIC IMPORT: Fixes the 'window is not defined' error
const MapControl = dynamic(() => import("@/app/components/mapcontrol"), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#0f172a] animate-pulse flex flex-col items-center justify-center text-gray-500 gap-2">
      <Loader2 className="animate-spin w-5 h-5" />
      <span className="text-[10px] font-bold uppercase tracking-widest">Calibrating Campus Map...</span>
    </div>
  )
});

const CAMPUS_CENTER: [number, number] = [18.4912, 73.9915];

export default function ReportLost() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [locationValue, setLocationValue] = useState("");
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- REVERSE GEOCODING LOGIC ---
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      // Prioritizes building names/landmarks known on campus
      const addressName = data.name || data.display_name.split(',')[0] || "Campus Area";
      const fullText = `${addressName} (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      setLocationValue(fullText);
    } catch (error) {
      setLocationValue(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setMarkerPos([lat, lng]);
    fetchAddress(lat, lng);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) return alert("GPS not supported");
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setMarkerPos([latitude, longitude]);
        await fetchAddress(latitude, longitude);
        setIsLocating(false);
      },
      () => {
        alert("GPS access denied. Please enable location permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const user = auth.currentUser;
    if (!user) { alert("Please login to submit"); setIsSubmitting(false); return; }

    const form = e.currentTarget;
    let imageUrl = "";

    try {
      if (fileInputRef.current?.files?.[0]) {
        const formData = new FormData();
        formData.append("file", fileInputRef.current.files[0]);
        formData.append("upload_preset", "findoor_unsigned");
        const res = await fetch("https://api.cloudinary.com/v1_1/dei1h4mfn/image/upload", { method: "POST", body: formData });
        const result = await res.json();
        imageUrl = result.secure_url;
      }

      await push(ref(database, "lost_items"), {
        itemName: (form.elements.namedItem("itemName") as HTMLInputElement).value,
        location: locationValue,
        dateLost: (form.elements.namedItem("dateLost") as HTMLInputElement).value,
        description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
        imageUrl, userId: user.uid, campus: "MIT ADT", createdAt: Date.now(),
      });
      alert("Lost report published to MIT ADT feed!");
      setImagePreview(null); setLocationValue(""); form.reset();
    } catch (err) { alert("Submission failed"); } finally { setIsSubmitting(false); }
  };

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Dynamic Search Glows */}
      <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-red-600/10 blur-[130px] rounded-full" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full" />
      
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-2xl">
        <div className="bg-[#0f172a]/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 p-8 md:p-12">
          
          <div className="text-center mb-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-indigo-600 shadow-lg text-white">
              <AlertCircle size={32} />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-white">Report Lost Item</h1>
            <p className="text-gray-400 mt-2 text-[10px] uppercase tracking-[0.3em] font-black">MIT ADT Campus Search Portal</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Item Name */}
            <div className="group">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1 block">Lost Item Name</label>
              <div className="relative">
                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-400 transition-colors" size={18} />
                <input name="itemName" required placeholder="What are you looking for?" className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-14 pr-5 py-4 text-white focus:ring-2 focus:ring-red-500/30 outline-none transition-all placeholder:text-gray-600" />
              </div>
            </div>

            {/* Smart Campus Location Selection */}
            <div className="group">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1 block">Last Known Location</label>
              <div className="relative space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-400 transition-colors" size={18} />
                  <input 
                    required value={locationValue} 
                    onChange={(e) => setLocationValue(e.target.value)}
                    placeholder="Auto-detect GPS or Pin on map" 
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-14 pr-28 py-4 text-white focus:ring-2 focus:ring-red-500/30 outline-none transition-all placeholder:text-gray-600" 
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5">
                    <button type="button" onClick={handleGetLocation} className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      {isLocating ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Navigation size={16} />}
                    </button>
                    <button type="button" onClick={() => setShowMap(!showMap)} className={`p-2.5 rounded-xl transition-all ${showMap ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400'}`}>
                      <MapIcon size={16} />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {showMap && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 350, opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl relative h-[350px]">
                      <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
                        <div className="bg-red-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-lg">
                          MIT ADT SEARCH AREA
                        </div>
                      </div>
                      <MapControl 
                        center={markerPos || CAMPUS_CENTER} 
                        markerPos={markerPos} 
                        onLocationSelect={handleLocationSelect} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Grid Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="group">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1 block">Approximate Date</label>
                  <input name="dateLost" type="date" required className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white [color-scheme:dark] outline-none focus:ring-2 focus:ring-red-500/20" />
               </div>
               <div className="group">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1 block">Description</label>
                  <input name="description" required placeholder="Color, brand, unique details..." className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none focus:ring-2 focus:ring-red-500/20" />
               </div>
            </div>

            {/* Photo Preview Area */}
            <div>
              <input type="file" ref={fileInputRef} hidden onChange={handleImageChange} id="imgLost" />
              {!imagePreview ? (
                <label htmlFor="imgLost" className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.02] p-10 cursor-pointer hover:border-red-500/40 hover:bg-red-500/5 transition-all group">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Camera className="text-gray-400 group-hover:text-red-500" size={28} />
                  </div>
                  <p className="text-sm text-gray-300 font-bold">Upload Reference Photo</p>
                </label>
              ) : (
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/20 bg-black">
                  <img src={imagePreview} className="w-full h-full object-cover opacity-60" alt="preview" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <CheckCircle className="text-emerald-500 mb-3" size={40} />
                    <button type="button" onClick={() => setImagePreview(null)} className="text-[10px] uppercase tracking-widest text-white font-bold bg-red-500/80 hover:bg-red-600 px-5 py-2.5 rounded-full transition-all">Remove & Discard</button>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full group relative bg-white py-5 rounded-2xl font-black text-[15px] uppercase tracking-[0.4em] text-black hover:bg-gray-200 hover:shadow-[0_10px_30px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-3">
              {isSubmitting ? <Loader2 className="animate-spin" /> : <>Start Search <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}