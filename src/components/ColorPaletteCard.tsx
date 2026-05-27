/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ColorItem } from "../types";
import { 
  Copy, 
  Check, 
  Palette, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  Eye, 
  Activity,
  Layers,
  ArrowRight
} from "lucide-react";

interface ColorPaletteCardProps {
  colors: ColorItem[];
  themeType: string;
  designStyle: string;
  backgroundColor?: string;
}

// -------------------------------------------------------------
// Helper functions for WCAG 2 contrast calculations
// -------------------------------------------------------------
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace(/^#/, "").trim();
  if (cleanHex.length === 3 || cleanHex.length === 4) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return { r, g, b };
  } else if (cleanHex.length >= 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return { r, g, b };
  }
  return null;
}

function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const raw = [rgb.r, rgb.g, rgb.b].map((c) => c / 255);
  const processed = raw.map((c) => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * processed[0] + 0.7152 * processed[1] + 0.0722 * processed[2];
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Math.round(ratio * 100) / 100;
}

interface ContrastResult {
  ratio: number;
  level: "AAA" | "AA" | "AA_LARGE" | "FAIL";
  textClass: string;
  bgClass: string;
  colorBorderClass: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

function determineContrastLevel(ratio: number): ContrastResult {
  if (ratio >= 7) {
    return {
      ratio,
      level: "AAA",
      textClass: "text-emerald-700 bg-emerald-50 border-emerald-200/50",
      bgClass: "bg-emerald-50 border border-emerald-100 text-emerald-700",
      colorBorderClass: "ring-emerald-200/50 border-emerald-300",
      label: "AAA Pass",
      description: "Excellent. Perfect readability for standard & large text.",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
    };
  } else if (ratio >= 4.5) {
    return {
      ratio,
      level: "AA",
      textClass: "text-blue-700 bg-blue-50 border-blue-200/50",
      bgClass: "bg-blue-50/70 border border-blue-100 text-blue-700",
      colorBorderClass: "ring-blue-100 border-blue-300",
      label: "AA Pass",
      description: "Good. Safe for main body text, links, and long paragraphs.",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
    };
  } else if (ratio >= 3) {
    return {
      ratio,
      level: "AA_LARGE",
      textClass: "text-amber-800 bg-amber-50 border-amber-200/50",
      bgClass: "bg-amber-50/70 border border-amber-100 text-amber-800",
      colorBorderClass: "ring-amber-100 border-amber-300",
      label: "Conditional (AA Large)",
      description: "Decent. Only readable for headers (>=18px) or active icons.",
      icon: <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
    };
  } else {
    return {
      ratio,
      level: "FAIL",
      textClass: "text-rose-700 bg-rose-50 border-rose-200/50",
      bgClass: "bg-rose-50/70 border border-rose-100 text-rose-700",
      colorBorderClass: "ring-rose-100 border-rose-300",
      label: "Contrast Fail",
      description: "Warning. Below minimum accessibility guidelines.",
      icon: <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
    };
  }
}

export default function ColorPaletteCard({ colors = [], themeType, designStyle, backgroundColor }: ColorPaletteCardProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Default contrast comparative page background selection
  const detectedBg = backgroundColor || "#FFFFFF";
  const [contrastBg, setContrastBg] = useState<string>(detectedBg);
  const [customBgInput, setCustomBgInput] = useState<string>("");
  const [invalidInput, setInvalidInput] = useState<boolean>(false);

  // Sync with prop updates
  useEffect(() => {
    if (backgroundColor) {
      setContrastBg(backgroundColor);
    }
  }, [backgroundColor]);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleCustomInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let val = customBgInput.trim();
    if (val === "") return;
    if (!val.startsWith("#")) {
      val = "#" + val;
    }
    const isHex = /^#[0-9A-Fa-f]{3}$|^#[0-9A-Fa-f]{6}$/.test(val);
    if (isHex) {
      setContrastBg(val.toUpperCase());
      setInvalidInput(false);
    } else {
      setInvalidInput(true);
      setTimeout(() => setInvalidInput(false), 2000);
    }
  };

  const passCount = colors.filter(
    (c) => getContrastRatio(c.hex, contrastBg) >= 4.5
  ).length;

  const totalColors = colors.length;
  const passPercentage = totalColors > 0 ? Math.round((passCount / totalColors) * 100) : 100;

  return (
    <div id="color-palette-card" className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm relative overflow-hidden font-sans">
      
      {/* Header element */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between pb-5 border-b border-[#E2E8F0] mb-6 gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-blue-50 text-[#2563EB] rounded-xl shrink-0">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-md font-bold text-[#0F172A] font-display">Brand Theme &amp; Color Palette</h3>
            <p className="text-xs text-[#64748B]">Captured from style definitions, markup rendering properties, and document assets.</p>
          </div>
        </div>

        {/* Info pill labels */}
        <div className="flex flex-wrap items-center gap-2 self-start xl:self-center">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] flex items-center gap-1.5 shadow-3xs">
            <span>🎨 Layout Style:</span>
            <span className="text-[#0F172A] font-bold">{themeType || "Standard Light"}</span>
          </span>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md border border-blue-50 bg-blue-50/30 text-[#2563EB] flex items-center gap-1.5">
            <span>✨ Profile:</span>
            <span className="font-bold">{designStyle || "Modern Corporate"}</span>
          </span>
        </div>
      </div>

      {/* WCAG Interactive Auditor Area */}
      <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-5 mb-6">
        <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
          <Activity className="w-4 h-4 text-[#2563EB]" />
          <span>WCAG 2.1 Contrast Testing Sandbox</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Reference selection controls */}
          <div className="md:col-span-8 space-y-3">
            <p className="text-xs text-[#64748B] leading-relaxed">
              Define the comparison <strong className="text-[#0F172A]">contrast background</strong> parameters. Standard body text requires at least <strong className="text-[#2563EB]">4.5:1</strong> ratio to conform to Web Accessibility (AA) requirements, while larger headings need <strong className="text-amber-600">3.0:1</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-[#0F172A] mr-1">Compare Against:</span>

              {/* Page Background pill */}
              <button
                type="button"
                onClick={() => setContrastBg(detectedBg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                  contrastBg === detectedBg
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm font-semibold"
                    : "bg-white hover:bg-slate-50 border-[#E2E8F0] text-[#0F172A]"
                }`}
              >
                <span 
                  className="w-3 h-3 rounded-full border border-black/10 inline-block shrink-0"
                  style={{ backgroundColor: detectedBg }}
                />
                <span>Detected Bg ({detectedBg})</span>
              </button>

              {/* Pure White pill */}
              <button
                type="button"
                onClick={() => setContrastBg("#FFFFFF")}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                  contrastBg === "#FFFFFF"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm font-semibold"
                    : "bg-white hover:bg-slate-50 border-[#E2E8F0] text-[#0F172A]"
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-white border border-slate-300 inline-block shrink-0" />
                <span>White (#FFFFFF)</span>
              </button>

              {/* Pure Dark pill */}
              <button
                type="button"
                onClick={() => setContrastBg("#0F172A")}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                  contrastBg === "#0F172A"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm font-semibold"
                    : "bg-white hover:bg-slate-50 border-[#E2E8F0] text-[#0F172A]"
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-[#0F172A] border border-black/20 inline-block shrink-0" />
                <span>Slate Dark (#0F172A)</span>
              </button>
            </div>

            {/* Form for manual comparative custom hex input */}
            <form onSubmit={handleCustomInputSubmit} className="flex items-center gap-2 max-w-xs pt-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={customBgInput}
                  onChange={(e) => setCustomBgInput(e.target.value)}
                  placeholder="Paste custom HEX (e.g. #F3F4F6)"
                  className={`w-full h-8 px-2.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono ${
                    invalidInput ? "border-rose-400 focus:ring-rose-500" : "border-[#E2E8F0]"
                  }`}
                />
                {invalidInput && (
                  <span className="absolute right-2 top-1.5 text-[9px] font-bold text-rose-500 animate-pulse">
                    Invalid RGB
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="h-8 px-3 bg-white hover:bg-slate-100 border border-[#E2E8F0] text-[#0F172A] hover:text-[#2563EB] text-xs font-medium rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Apply</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </form>
          </div>

          {/* Quick diagnostics health indicator */}
          <div className="md:col-span-4 bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col items-center text-center justify-center space-y-1.5 shadow-3xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] font-mono">
              Contrast Audit Health
            </span>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-black font-display ${passPercentage >= 60 ? "text-emerald-600" : "text-amber-500"}`}>
                {passPercentage}%
              </span>
              <span className="text-xs text-[#64748B] font-mono">pass rate</span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-snug">
              <strong>{passCount}</strong> out of <strong>{totalColors}</strong> Colors conform to WCAG Level AA guidelines against contrast bg (<strong>{contrastBg}</strong>).
            </p>
          </div>
        </div>
      </div>

      {/* Grid containing palette elements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {colors.map((color, idx) => {
          const isCopied = copiedHex === color.hex;
          const contrastRatio = getContrastRatio(color.hex, contrastBg);
          const audit = determineContrastLevel(contrastRatio);
          
          // Determine text color for overlay readability on top of the swatch background itself
          const swatchLuminance = getLuminance(color.hex);
          const overlayTextColor = swatchLuminance > 0.179 ? "#0F172A" : "#FFFFFF";

          return (
            <div 
              key={color.hex + "-" + idx} 
              className="border border-[#E2E8F0] rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col justify-between bg-white"
            >
              {/* Actual physical color swatch card segment */}
              <div 
                className="h-28 w-full relative transition-transform duration-300 overflow-hidden flex flex-col items-center justify-center" 
                style={{ backgroundColor: color.hex }}
              >
                {/* Visual indicator of the contrast color on the swatch color */}
                <span 
                  className="px-2.5 py-1 text-[10px] font-bold tracking-wide rounded-md backdrop-blur-xs select-none shadow-3xs transition-all opacity-95 group-hover:scale-105 border border-black/5"
                  style={{ 
                    color: overlayTextColor, 
                    backgroundColor: overlayTextColor === "#FFFFFF" ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.7)" 
                  }}
                >
                  {color.type || "Element Swatch"}
                </span>

                <div className="absolute bottom-2 right-2">
                  <span className="text-[9px] font-mono tracking-tighter opacity-75" style={{ color: overlayTextColor }}>
                    Ref: {color.count || 1}x
                  </span>
                </div>
              </div>

              {/* Data labels, contrast metrics and simulators */}
              <div className="p-3.5 space-y-3 bg-white border-t border-[#E2E8F0]">
                {/* 1. Hex spec label */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#0F172A] font-mono tracking-wider select-all select-text">
                    {color.hex}
                  </span>
                  
                  <button
                    onClick={() => handleCopy(color.hex)}
                    className="p-1 hover:bg-[#F1F5F9] rounded-lg text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer"
                    title="Copy HEX color code"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* 2. Calculated WCAG contrast score bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] font-mono">
                      WCAG Contrast:
                    </span>
                    <span className="text-xs font-black text-[#0F172A] font-mono">
                      {contrastRatio}:1
                    </span>
                  </div>

                  {/* Level tag */}
                  <div className={`p-1.5 rounded-lg flex items-center gap-1.5 text-[10px] leading-tight ${audit.bgClass}`}>
                    {audit.icon}
                    <div className="min-w-0">
                      <p className="font-bold">{audit.label}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Text simulation box using contrast reference */}
                <div 
                  className="p-2 rounded-lg border transition-all duration-300"
                  style={{ 
                    backgroundColor: contrastBg, 
                    borderColor: contrastBg.toLowerCase() === '#ffffff' ? '#E2E8F0' : 'transparent' 
                  }}
                >
                  <span 
                    className="text-[8px] font-black uppercase tracking-wider block mb-1 opacity-60" 
                    style={{ color: getLuminance(contrastBg) > 0.179 ? '#64748B' : '#94A3B8' }}
                  >
                    Simulated Text readability:
                  </span>
                  
                  <div className="text-center py-1 rounded-md" style={{ color: color.hex }}>
                    <p className="text-xs font-extrabold leading-none font-display">Aa Satoshi Bold</p>
                    <p className="text-[10px] mt-1 font-medium leading-none font-sans">Body text preview</p>
                  </div>
                </div>

                {/* Tiny explanation sentence */}
                <p className="text-[9px] text-[#94A3B8] leading-tight prose">
                  {audit.description}
                </p>
              </div>
            </div>
          );
        })}

        {colors.length === 0 && (
          <div className="col-span-full py-10 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
            <Palette className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs text-[#64748B]">No brand colors identified in website inline-styles hierarchy.</p>
          </div>
        )}
      </div>

      {/* Explanatory visual banner */}
      <div className="mt-6 p-4 rounded-xl border border-blue-100 bg-blue-50/20 flex items-start gap-3 text-xs text-slate-600">
        <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1">
          <p className="font-bold text-[#0F172A]">Intelligent Contrast Engine Details</p>
          <p className="text-[11px] text-[#64748B] leading-relaxed">
            Checks are computed live using relative luminance algorithms based on the W3C WCAG 2.1 standard relative weightings (21.26% Red, 71.52% Green, 7.22% Blue filters). Accessibilities are calculated on-the-fly when switching reference backgrounds.
          </p>
        </div>
      </div>

    </div>
  );
}
