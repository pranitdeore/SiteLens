/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, CheckCircle2, Circle, ShieldCheck, Sparkles, Cpu } from "lucide-react";

interface LoadingScannerProps {
  url: string;
}

const STEPS = [
  "Fetching public website source HTML...",
  "Reading DOM structural nodes...",
  "Detecting external CSS and script elements...",
  "Extracting page hex color frequencies...",
  "Analyzing image sources and alt tags...",
  "Checking SEO semantic index status...",
  "Matching font definitions with Fontshare...",
  "Synthesizing recommendations and audit score..."
];

export default function LoadingScanner({ url }: LoadingScannerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Stagger text step labels
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    // Stagger progress percentage bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 98) {
          // speed up early, slow down towards 98%
          const increment = prev < 50 ? 5 : prev < 80 ? 3 : 1;
          return prev + increment;
        }
        return prev;
      });
    }, 150);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      id="loading-scanner-container" 
      className="max-w-2xl mx-auto my-12 p-8 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl relative overflow-hidden"
    >
      {/* Laser scanline sweep effect */}
      <motion.div 
        animate={{ 
          top: ["0%", "100%", "0%"]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#06B6D4] opacity-55 pointer-events-none" 
      />

      {/* Cyber ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-50/30 rounded-full blur-3xl pointer-events-none" />
      
      <div className="text-center mb-8 relative z-10">
        <div className="relative inline-block mb-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-4 border-dashed border-blue-150 border-t-[#2563EB] flex items-center justify-center"
          >
            <Cpu className="w-6 h-6 text-[#2563EB]" />
          </motion.div>
          <motion.div 
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-blue-500/10 -z-10"
          />
        </div>

        <h3 className="text-xl font-bold text-[#0F172A] font-display">Analyzing <span className="text-[#2563EB] font-mono">{url}</span></h3>
        <p className="text-xs text-[#64748B] mt-2 font-sans max-w-md mx-auto leading-relaxed">
          SiteLens' proprietary parser and style extractors are auditing accessibility index targets, typography stacks, and assets.
        </p>
      </div>

      {/* Progress meter */}
      <div className="mb-8 relative z-10 px-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] uppercase font-bold text-[#64748B] font-mono tracking-wider">SECURE SCAN PROGRESS</span>
          <span className="text-xs font-black text-[#2563EB] font-mono">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-[#E2E8F0]">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#06B6D4]" 
            style={{ width: `${progress}%` }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Stepper list */}
      <div className="space-y-3 max-w-md mx-auto relative z-10 px-4">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isActive = idx === currentStep;

          return (
            <motion.div 
              key={step} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: isDone ? 0.5 : isActive ? 1 : 0.25, 
                x: 0,
                scale: isActive ? 1.02 : 1
              }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3.5 text-xs transition-colors duration-300 ${
                isDone ? "text-[#64748B]" : isActive ? "text-[#0F172A] font-bold" : "text-[#94A3B8]"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-[#2563EB] animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-[#E2E8F0]" />
                )}
              </div>
              <span className="font-sans leading-tight">{step}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Embedded footer note */}
      <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-center text-[11px] text-[#64748B] flex items-center justify-center gap-1.5 font-mono">
        <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] animate-pulse" />
        <span>Synthesizing real-time design metrics...</span>
      </div>
    </motion.div>
  );
}
