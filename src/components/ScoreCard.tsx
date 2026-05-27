/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle2, AlertTriangle, Lightbulb, TrendingUp, Cpu, Award, Zap, ShieldAlert } from "lucide-react";

interface ScoreCardProps {
  seoScore: number;
  perfScore: number;
}

// Custom counter hook/component for smooth ticker incrementation
function AnimatedNumber({ value }: { value: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end <= 0) {
      setCurrent(0);
      return;
    }

    const duration = 800; // ms
    const increment = Math.ceil(end / (duration / 16)); // Target ~60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCurrent(end);
        clearInterval(timer);
      } else {
        setCurrent(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <>{current}</>;
}

export default function ScoreCard({ seoScore, perfScore }: ScoreCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      id="score-card" 
      className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm relative overflow-hidden"
    >
      {/* Visual background ambient gradient node */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/20 rounded-full blur-3xl pointer-events-none" />

      {/* Strengths & Roadmap indicators */}
      <div className="flex flex-col justify-between py-1">
        <div>
          <h3 className="text-sm font-bold text-[#64748B] uppercase tracking-wider mb-4 font-mono flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#2563EB]" />
            <span>Interactive Operational Breakdown</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SEO Meter */}
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:shadow-xs transition-shadow duration-200">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-[#0F172A] font-sans">SEO Quality Index</span>
                <span className="text-xs font-extrabold text-[#2563EB] font-mono">
                  <AnimatedNumber value={seoScore} />/100
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden border border-black/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${seoScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
                />
              </div>
            </div>

            {/* Performance Meter */}
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:shadow-xs transition-shadow duration-200">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-[#0F172A] font-sans">Performance Speed</span>
                <span className="text-xs font-extrabold text-[#7C3AED] font-mono">
                  <AnimatedNumber value={perfScore} />/100
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden border border-black/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${perfScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#7C3AED] to-pink-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic highlights based on scores */}
        <div className="space-y-3 mt-6">
          <div className="flex items-start gap-2.5 text-xs text-[#64748B]">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#0F172A]">Metadata Security:</strong> Page structure loads and handles HTTPS connections perfectly with standard index rules.
            </p>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-[#64748B]">
            {perfScore >= 80 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            <p>
              <strong className="text-[#0F172A]">Dependency Load Weight:</strong> {perfScore >= 80 ? "Light asset size limits initial page paint blocking intervals wonderfully." : "Linked scripts and layout sizes might increase mobile parser delay times."}
            </p>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-[#64748B]">
            <Lightbulb className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#0F172A]">Typography recommendation:</strong> Consider pairing the page’s body text with a geometric Fontshare replacement face like Satoshi to foster unified premium visual branding.
            </p>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
