/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Globe, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function HeroSection({ onAnalyze, isLoading }: HeroSectionProps) {
  const [urlInput, setUrlInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = urlInput.trim();
    if (!trimmed) {
      setErrorMsg("Please enter a valid website URL to analyze.");
      return;
    }

    // Basic URL validation pattern
    try {
      // Normalize briefly for parsing check
      const checks = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
      new URL(checks);
    } catch (_) {
      setErrorMsg("The URL format seems invalid. Enter e.g. 'google.com' or 'https://github.com'");
      return;
    }

    onAnalyze(trimmed);
  };

  return (
    <div id="hero-section" className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#F8FAFC] border-b border-[#E2E8F0]">
      {/* Decorative top ambient grids with dynamic blur circles */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1.5px,transparent_1.5px),linear-gradient(to_bottom,#e2e8f0_1.5px,transparent_1.5px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_75%,transparent_100%)] opacity-35 pointer-events-none" />
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-24 right-1/4 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-4xl mx-auto text-center mt-6"
      >
        {/* Soft elegant badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-[#2563EB] border border-blue-100/70 mb-8 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB] animate-pulse" />
          <span>Intelligent Web Inspector Tool</span>
        </motion.div>

        {/* Display title with beautiful gradient text */}
        <motion.h1 
          variants={itemVariants}
          className="text-4xl sm:text-6xl font-black text-[#0F172A] tracking-tight leading-none mb-6 font-display"
        >
          Analyze Any Website<span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent"> Like a Developer</span>
        </motion.h1>

        {/* Elegant paragraph description */}
        <motion.p 
          variants={itemVariants}
          className="text-md sm:text-lg text-[#64748B] max-w-2xl mx-auto mb-10 leading-relaxed font-sans"
        >
          Discover the public source structure, design system typography, custom brand colors, asset images, technology stacks, SEO diagnostics, and rendering performance of any public domain in seconds.
        </motion.p>

        {/* Floating Input Box with premium glow borders */}
        <motion.div 
          variants={itemVariants}
          className="max-w-xl mx-auto mb-8"
        >
          <form 
            onSubmit={handleSubmit} 
            className="relative flex items-center p-1.5 bg-white rounded-2xl border border-[#E2E8F0] shadow-md focus-within:ring-4 focus-within:ring-[#2563EB]/10 focus-within:border-[#2563EB] transition-all duration-300"
          >
            <div className="absolute left-4 text-[#94A3B8]">
              <Search className="w-5 h-5 animate-pulse" />
            </div>
            
            <input
              type="text"
              id="website-url-input"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter public website URL (e.g. stripe.com)..."
              disabled={isLoading}
              className="w-full pl-11 pr-4 py-3.5 bg-transparent text-[#0F172A] placeholder-[#94A3B8] font-sans focus:outline-none"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              id="analyze-website-btn"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-95 font-bold text-white transition-opacity duration-200 shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              <span>{isLoading ? "Scanning..." : "Analyze Website"}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mt-3.5 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 text-xs font-semibold text-left"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Feature quick badges */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 text-slate-500 text-xs font-mono mb-8"
        >
          <span className="px-3 py-1.5 bg-white rounded-xl border border-slate-205 shadow-3xs flex items-center gap-1.5">
            <span className="text-[#2563EB]">🖥️</span> HTML Source
          </span>
          <span className="px-3 py-1.5 bg-white rounded-xl border border-slate-205 shadow-3xs flex items-center gap-1.5">
            <span className="text-[#7C3AED]">🎨</span> Brand Colors
          </span>
          <span className="px-3 py-1.5 bg-white rounded-xl border border-slate-205 shadow-3xs flex items-center gap-1.5">
            <span className="text-[#06B6D4]">🔤</span> Fontshare Match
          </span>
          <span className="px-3 py-1.5 bg-white rounded-xl border border-slate-205 shadow-3xs flex items-center gap-1.5">
            <span className="text-amber-500">⚙️</span> Tech Stacks
          </span>
          <span className="px-3 py-1.5 bg-white rounded-xl border border-slate-205 shadow-3xs flex items-center gap-1.5">
            <span className="text-emerald-500">📈</span> SEO Index
          </span>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="flex justify-center items-center gap-1.5 text-xs text-[#94A3B8]"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Analyzes public HTML metadata structures safely. No authentication required.</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
