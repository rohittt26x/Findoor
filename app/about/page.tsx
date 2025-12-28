"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Cpu, 
  Users, 
  Zap, 
  Globe, 
  Database, 
  Code2, 
  Sparkles,
  Heart,
  Github,
  Linkedin,
  Instagram,
  ExternalLink
} from "lucide-react";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white px-6 py-24 relative overflow-hidden">
      {/* Background Aesthetic Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* HERO HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={12} /> The Future of Campus Security
          </div>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            FINDOOR
          </h1>
          <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-xs mb-8">
             Made by student • Made for student
          </p>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Revolutionizing university lost and found through <span className="text-white">Neural Matching</span> and <span className="text-white">Community Trust</span>.
          </p>
        </motion.div>

        {/* MISSION SECTION */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 mb-32"
        >
          <motion.div variants={itemVariants} className="bg-[#0f172a]/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 group hover:border-red-500/20 transition-all duration-500">
            <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-400 mb-6 group-hover:scale-110 transition-transform">
              <Zap size={24} />
            </div>
            <h2 className="text-2xl font-bold mb-4 tracking-tight uppercase">The Problem</h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              Traditional lost and found systems are fragmented. Items are scattered across departments, creating a disconnect that causes academic stress and financial loss for students at MIT ADT.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#0f172a]/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 group hover:border-emerald-500/20 transition-all duration-500">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <h2 className="text-2xl font-bold mb-4 tracking-tight uppercase">The Vision</h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              An intelligent ecosystem where technology serves humanity. By leveraging Gemini 2.0 AI, we ensure that every lost item has a digital roadmap back to its rightful owner.
            </p>
          </motion.div>
        </motion.div>

        {/* THE DEVELOPER SECTION (CREDIT) */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative bg-gradient-to-b from-blue-600/10 to-transparent border border-blue-500/20 rounded-[3rem] p-12 mb-32 text-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-blue-500 to-transparent" />
          <Heart className="mx-auto text-blue-500 mb-6 animate-pulse" fill="currentColor" size={32} />
          
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400 mb-2">Developed By</h3>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">Rohit J. Pokale</h2>
          
          <p className="text-gray-400 max-w-xl mx-auto mb-10 text-sm italic leading-relaxed">
            "As a student, I saw the chaos of lost belongings on campus. FINDOOR was built to bridge that gap using modern AI, ensuring no student has to lose more than just their time."
          </p>

          {/* Social Links Grid */}
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://github.com/rohittt26x" 
              target="_blank" 
              className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all group"
            >
              <Github size={16} /> GitHub <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a 
              href="https://www.linkedin.com/in/rohit-pokale-677460378" 
              target="_blank" 
              className="flex items-center gap-3 px-6 py-3 bg-[#0077b5]/10 rounded-2xl border border-[#0077b5]/20 text-[10px] font-bold uppercase tracking-widest text-[#0077b5] hover:bg-[#0077b5]/20 transition-all group"
            >
              <Linkedin size={16} /> LinkedIn <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a 
              href="https://www.instagram.com/rohittt_26x" 
              target="_blank" 
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-pink-500/20 text-[10px] font-bold uppercase tracking-widest text-pink-400 hover:from-purple-500/20 hover:to-pink-500/20 transition-all group"
            >
              <Instagram size={16} /> Instagram <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </motion.section>

        {/* FEATURES GRID */}
        <div className="mb-32">
           <h3 className="text-center text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 mb-12">Core Capabilities</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { title: "AI Comparison", desc: "Multimodal visual matching using Google Gemini 2.0 Flash.", icon: <Cpu /> },
               { title: "Campus Verified", desc: "OAuth security strictly restricted to MIT ADT community.", icon: <ShieldCheck /> },
               { title: "Cloud Database", desc: "Real-time synchronization via Firebase Cloud Firestore.", icon: <Database /> }
             ].map((f, i) => (
               <motion.div 
                 key={i}
                 whileHover={{ y: -5 }}
                 className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all group"
               >
                 <div className="text-blue-500 mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
                 <h4 className="font-bold text-lg mb-2 tracking-tight uppercase">{f.title}</h4>
                 <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
               </motion.div>
             ))}
           </div>
        </div>

        {/* TECH STACK */}
        <section className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 mb-32">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4 tracking-tighter uppercase">The Architecture</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Engineered for sub-second responses and high availability using the 2025 modern web stack.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              {[
                { name: "Next.js 15", icon: <Code2 /> },
                { name: "Firebase", icon: <Database /> },
                { name: "Gemini 2.0", icon: <Sparkles /> },
                { name: "Tailwind", icon: <Globe /> }
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                  <div className="text-blue-500 scale-75">{t.icon}</div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLOSING TAGLINE */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-gray-500 italic text-lg mb-4">"Opening the door to reconnect what matters."</p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-auto mb-8" />
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500/50">
            MIT ADT UNIVERSITY • 2026
          </p>
        </motion.div>

      </div>
    </main>
  );
}