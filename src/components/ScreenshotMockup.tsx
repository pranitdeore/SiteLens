/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ScreenshotsData } from "../types";
import { Monitor, Phone, FileText, ArrowUpRight, Sparkles } from "lucide-react";

interface ScreenshotMockupProps {
  screenshots: ScreenshotsData;
  domain: string;
}

type FrameType = "desktop" | "mobile" | "full";

export default function ScreenshotMockup({ screenshots, domain }: ScreenshotMockupProps) {
  const [activeFrame, setActiveFrame] = useState<FrameType>("desktop");

  return (
    <div id="screenshot-mockup-card" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden space-y-6">
      
      {/* Cards header panel with segment controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-md font-bold text-slate-800 font-sans">Interactive Layout Simulator</h3>
          <p className="text-xs text-slate-400">Presents an adaptive visual mockup matching brand color palettes and typography metrics.</p>
        </div>

        {/* View mode segment buttons */}
        <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 gap-1 shrink-0">
          <button
            onClick={() => setActiveFrame("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all ${
              activeFrame === "desktop" ? "bg-white text-blue-600 shadow-2xs border border-slate-200/50" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop (1280px)</span>
          </button>

          <button
            onClick={() => setActiveFrame("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all ${
              activeFrame === "mobile" ? "bg-white text-blue-600 shadow-2xs border border-slate-200/50" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Mobile (375px)</span>
          </button>

          <button
            onClick={() => setActiveFrame("full")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all ${
              activeFrame === "full" ? "bg-white text-blue-600 shadow-2xs border border-slate-200/50" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Full Layout Code</span>
          </button>
        </div>
      </div>

      {/* Frame Preview container */}
      <div className="flex justify-center items-center py-6 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden min-h-[450px]">
        
        {/* DESKTOP BROWSER FRAME MODEL */}
        {activeFrame === "desktop" && (
          <div className="w-full max-w-2xl px-4 animate-fade-in">
            <div className="bg-white rounded-2xl border border-slate-250 shadow-md overflow-hidden aspect-video relative flex flex-col">
              {/* Browser control frame */}
              <div className="h-8 bg-slate-50 px-4 border-b border-slate-150 flex items-center justify-between shrink-0 select-none">
                <div className="flex gap-1.5 items-center">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="w-2/3 h-5 bg-slate-200/60 rounded-md text-[9px] font-mono text-slate-400 flex items-center px-3 truncate">
                  {domain}
                </div>
                <div className="w-6 h-1 bg-slate-200 rounded" />
              </div>

              {/* Dynamic SVG dataURL image rendering */}
              <div className="grow overflow-hidden relative">
                <img 
                  src={screenshots.desktop} 
                  alt="Desktop Simulation" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}

        {/* MOBILE PORTRAIT DEVICE BROWSER */}
        {activeFrame === "mobile" && (
          <div className="w-full max-w-xs animate-fade-in flex justify-center">
            <div className="w-64 aspect-[9/16] bg-white rounded-[32px] border-[6px] border-slate-800 shadow-xl overflow-hidden relative flex flex-col">
              {/* Phone capsule camera Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full bg-slate-800 z-25 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-900/65" />
              </div>

              {/* Dynamic SVG renderer */}
              <div className="grow overflow-hidden relative">
                <img 
                  src={screenshots.mobile} 
                  alt="Mobile Simulation" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}

        {/* FULL PAGE OUTLINE MATRIX */}
        {activeFrame === "full" && (
          <div className="w-full max-w-md px-4 animate-fade-in">
            <div className="bg-white rounded-2xl border border-slate-250 shadow-md max-h-96 overflow-y-auto scrollbar-thin p-1">
              <img 
                src={screenshots.fullPage} 
                alt="Full Page Wireframe outline" 
                className="w-full h-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}

      </div>

      {/* Explanatory visual help cards banner */}
      <div className="p-3 bg-blue-50/20 border border-blue-50/50 rounded-xl flex items-start gap-2 text-xs text-slate-600 leading-normal font-sans">
        <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5 animate-pulse" />
        <p>
          <strong>Simulated Rendering Sandbox:</strong> Custom mockups are generated dynamically using SVG vectors formatted with actual scraped colors, typography rules, branding labels, layout divisions, and image dimensions! This runs local in browser sandboxes, avoiding rendering crashes.
        </p>
      </div>

    </div>
  );
}
