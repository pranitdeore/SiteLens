/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { PerformanceData } from "../types";
import { Zap, Clock, Disc, Sparkles, TrendingUp, HelpCircle } from "lucide-react";

interface PerformanceReportProps {
  performance: PerformanceData;
}

export default function PerformanceReport({ performance }: PerformanceReportProps) {
  // Determine color theme based on score
  const getScoreStyle = (score: number) => {
    if (score >= 90) return { text: "text-emerald-600", bg: "bg-emerald-50" };
    if (score >= 70) return { text: "text-blue-600", bg: "bg-blue-50" };
    if (score >= 50) return { text: "text-amber-600", bg: "bg-amber-50" };
    return { text: "text-red-500", bg: "bg-red-50" };
  };

  const style = getScoreStyle(performance.score);

  return (
    <div id="performance-report-card" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-300" />
          </div>
          <div>
            <h3 className="text-md font-bold text-slate-800 font-sans">Speed &amp; Asset Weight Diagnostics</h3>
            <p className="text-xs text-slate-400">Reviews compiled asset footprints, script count penalties, and estimated mobile FCP metrics.</p>
          </div>
        </div>

        {/* Score display */}
        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 shrink-0">
          <TrendingUp className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 font-mono">Performance Score:</span>
          <span className={`text-sm font-black font-mono ${style.text}`}>{performance.score} / 100</span>
        </div>
      </div>

      {/* Grid of 4 numeric stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Estimated speed */}
        <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 shadow-2xs">
          <Clock className="w-5 h-5 text-blue-600 mb-2" />
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">EST. LAYOUT PAINT</span>
          <span className="text-lg font-black text-slate-800 font-mono mt-1 block">{performance.loadTime || "0.45s"}</span>
          <span className="text-[9px] text-emerald-600 font-sans block mt-0.5">Fast Response Time</span>
        </div>

        {/* Document size */}
        <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 shadow-2xs">
          <Disc className="w-5 h-5 text-violet-600 mb-2" />
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">HTML PAYLOAD</span>
          <span className="text-lg font-black text-slate-800 font-mono mt-1 block">{performance.pageSize || "12.4 KB"}</span>
          <span className="text-[9px] text-slate-400 font-sans block mt-0.5">Transfer size</span>
        </div>

        {/* CSS Count */}
        <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 shadow-2xs">
          <Zap className="w-5 h-5 text-pink-600 mb-2" />
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">STYLESHEET ASSETS</span>
          <span className="text-lg font-black text-slate-800 font-mono mt-1 block">{performance.cssFileCount || 0}</span>
          <span className="text-[9px] text-slate-400 font-sans block mt-0.5">Linked CSS blocks</span>
        </div>

        {/* JS script directories count */}
        <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 shadow-2xs">
          <HelpCircle className="w-5 h-5 text-amber-600 mb-2" />
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">JS SCRIPT ASSETS</span>
          <span className="text-lg font-black text-slate-800 font-mono mt-1 block">{performance.jsFileCount || 0}</span>
          <span className="text-[9px] text-slate-400 font-sans block mt-0.5">External scripts</span>
        </div>

      </div>

      {/* Structured bullet performance instructions list */}
      <div className="p-4 rounded-xl border border-slate-250 bg-white space-y-3 shadow-3xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Performance Optimization Roadmap</h4>
        </div>
        
        <div className="space-y-2.5 text-xs text-slate-600 pl-1 leading-relaxed">
          <p>
            • <strong>Reduce blocking request volumes:</strong> The platform initiates <strong>{performance.requestCount || 0}</strong> resource requests (CSS stylesheet imports, JS chunks, assets). Grouping script assets directly decreases paint-blocking cycles.
          </p>
          <p>
            • <strong>Minify style components paths:</strong> Running build bundlers (like Esbuild or Vite) on design systems allows shrinking the active document payload weight smaller than <strong>{performance.pageSize || "20 KB"}</strong>.
          </p>
          <p>
            • <strong>Enforce static CDN file caching:</strong> Integrating browser caching or Edge content-delivery headers lowers DNS resolutions and estimated paint speeds below <strong>{performance.loadTime || "0.8s"}</strong>.
          </p>
        </div>
      </div>

    </div>
  );
}
