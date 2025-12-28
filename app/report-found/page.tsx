"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { ref, push } from "firebase/database";
import { database, auth } from "@/app/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, MapPin, Calendar, Tag, ArrowRight, Info,
  CheckCircle2, Loader2, Navigation, X, CheckCircle, Map as MapIcon
} from "lucide-react";

const MapControl = dynamic(() => import("@/app/components/mapcontrol"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#0f172a] animate-pulse flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">Initializing Campus Map...</div>
});

const CAMPUS_CENTER: [number, number] = [18.4912, 73.9915];

export default function ReportFound() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [locationValue, setLocationValue] = useState("");
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- REVERSE GEOCODING FUNCTION ---
  // Converts Lat/Lng into a real building name or street address
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      // We prioritize building/POI name, then fallback to full address
      const addressName = data.name || data.display_name.split(',')[0] || "Unknown Spot";
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
        alert("GPS access denied.");
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
    if (!user) { alert("Please login first"); setIsSubmitting(false); return; }

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

      await push(ref(database, "found_items"), {
        itemName: (form.elements.namedItem("itemName") as HTMLInputElement).value,
        location: locationValue,
        dateFound: (form.elements.namedItem("dateFound") as HTMLInputElement).value,
        description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
        imageUrl, userId: user.uid, campus: "MIT ADT", createdAt: Date.now(),
      });
      alert("Report Published Successfully!");
      setImagePreview(null); setLocationValue(""); form.reset();
    } catch (error) { alert("Error saving data"); } finally { setIsSubmitting(false); }
  };

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Background Aesthetic */}
      <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] bg-emerald-600/10 blur-[130px] rounded-full" />
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-2xl">
        <div className="bg-[#0f172a]/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 p-8 md:p-12">
          
          <div className="text-center mb-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <CheckCircle2 size={32} />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-white">Report Found Item</h1>
            <p className="text-gray-400 mt-2 text-[10px] uppercase tracking-[0.3em] font-black">MIT ADT Campus Repository</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Item Name */}
            <div className="group">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1 block">Item Details</label>
              <div className="relative">
                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input name="itemName" required placeholder="What did you find?" className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-14 pr-5 py-4 text-white focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all" />
              </div>
            </div>

            {/* GPS/MAP Location Section */}
            <div className="group">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1 block">Precise Location</label>
              <div className="relative space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500" size={18} />
                  <input 
                    required value={locationValue} 
                    onChange={(e) => setLocationValue(e.target.value)}
                    placeholder="Auto-detect or Pin on map" 
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-14 pr-28 py-4 text-white focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all" 
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5">
                    <button type="button" onClick={handleGetLocation} className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all">
                      {isLocating ? <Loader2 className="w-4 h-4 animate-spin text-emerald-500" /> : <Navigation size={16} />}
                    </button>
                    <button type="button" onClick={() => setShowMap(!showMap)} className={`p-2.5 rounded-xl transition-all ${showMap ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:text-blue-400'}`}>
                      <MapIcon size={16} />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {showMap && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 350, opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl relative h-[350px]">
                      <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
                        <div className="bg-emerald-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-lg">
                          MIT ADT CAMPUS VIEW
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

            {/* Date and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="group">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1 block">Date Found</label>
                  <input name="dateFound" type="date" required className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white [color-scheme:dark] outline-none focus:ring-2 focus:ring-emerald-500/20" />
               </div>
               <div className="group">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1 block">Quick Info</label>
                  <input name="description" required placeholder="Color, marks, etc." className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/20" />
               </div>
            </div>

            {/* Evidence Photo */}
            <div>
              <input type="file" ref={fileInputRef} hidden onChange={handleImageChange} id="imgF" />
              {!imagePreview ? (
                <label htmlFor="imgF" className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.02] p-10 cursor-pointer hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Camera className="text-gray-400 group-hover:text-emerald-500" size={28} /></div>
                  <p className="text-sm text-gray-300 font-bold">Attach Evidence Photo</p>
                </label>
              ) : (
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/20 bg-black">
                  <img src={imagePreview} className="w-full h-full object-cover opacity-70" alt="preview" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <CheckCircle className="text-emerald-500 mb-3" size={40} />
                    <button type="button" onClick={() => setImagePreview(null)} className="text-[10px] uppercase tracking-widest text-white font-bold bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-full transition-all">Remove Photo</button>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-500 py-5 rounded-2xl font-black text-[14px] uppercase tracking-[0.3em] text-white hover:bg-emerald-400 hover:shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3">
              {isSubmitting ? <Loader2 className="animate-spin" /> : <>Publish Report <ArrowRight size={20} /></>}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}