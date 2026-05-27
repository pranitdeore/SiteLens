/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SeoData } from "../types";
import { ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, TrendingUp } from "lucide-react";

interface SeoReportProps {
  seo: SeoData;
}

export default function SeoReport({ seo }: SeoReportProps) {
  // Determine color theme based on score
  const getScoreStyle = (score: number) => {
    if (score >= 90) return { text: "text-emerald-600", bg: "bg-emerald-50", progress: "from-emerald-600 to-emerald-400" };
    if (score >= 70) return { text: "text-blue-600", bg: "bg-blue-50", progress: "from-blue-600 to-blue-400" };
    if (score >= 50) return { text: "text-amber-600", bg: "bg-amber-50", progress: "from-amber-600 to-amber-400" };
    return { text: "text-red-500", bg: "bg-red-50", progress: "from-red-600 to-red-400" };
  };

  const style = getScoreStyle(seo.score);

  return (
    <div id="seo-report-component" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-md font-bold text-slate-800 font-sans">SEO Meta-Tag Diagnostics</h3>
            <p className="text-xs text-slate-400">Reviews index eligibility, semantic structure, headings hierarchy, and alternate text ratios.</p>
          </div>
        </div>

        {/* SEO Score orb */}
        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 shrink-0">
          <TrendingUp className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 font-mono">SEO Core Score:</span>
          <span className={`text-sm font-black font-mono ${style.text}`}>{seo.score} / 100</span>
        </div>
      </div>

      {/* Grid columns split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Passed tests list */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Passed Checks ({seo.passed.length})</span>
          </span>

          <div className="space-y-2">
            {seo.passed.map((check, idx) => (
              <div 
                key={idx} 
                className="p-3 bg-emerald-50/20 border border-emerald-100/50 rounded-xl flex items-start gap-2.5 text-xs text-slate-700"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block font-semibold">{check.checkName}</strong>
                  <span className="leading-tight block mt-0.5 text-slate-500">{check.message}</span>
                </div>
              </div>
            ))}

            {seo.passed.length === 0 && (
              <div className="py-6 text-center text-slate-400 text-xs">No checklist tests successfully cleared.</div>
            )}
          </div>
        </div>

        {/* Warnings and issues columns */}
        <div className="space-y-3 lg:border-l lg:border-slate-100 lg:pl-6">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono uppercase flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Identified Improvements ({seo.issues.length})</span>
          </span>

          <div className="space-y-2">
            {seo.issues.map((issue, idx) => (
              <div 
                key={idx} 
                className={`p-3 border rounded-xl flex items-start gap-2.5 text-xs text-slate-700 ${
                  issue.type === "error" 
                    ? "bg-red-50/30 border-red-100" 
                    : "bg-amber-50/30 border-amber-100"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {issue.type === "error" ? (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-800 font-semibold">{issue.checkName}</strong>
                    <span className={`px-1.5 py-0.5 text-[8px] font-bold tracking-wide rounded font-mono uppercase ${
                      issue.impact === "High" 
                        ? "bg-red-150 text-red-800" 
                        : "bg-amber-150 text-amber-800"
                    }`}>
                      {issue.impact} Impact
                    </span>
                  </div>
                  <span className="leading-tight block mt-1 text-slate-500">{issue.message}</span>
                </div>
              </div>
            ))}

            {seo.issues.length === 0 && (
              <div className="py-6 text-center text-emerald-600 bg-emerald-50/20 border border-emerald-100 rounded-xl text-xs font-semibold">
                Perfect! No structural SEO issues detected. This website is fully optimized for index crawling.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* SEO Suggestions box */}
      <div className="mt-4 p-4 rounded-xl border border-blue-50 bg-blue-50/20 space-y-2.5">
        <div className="flex items-center gap-2 text-blue-700">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Step-by-Step SEO Roadmap</h4>
        </div>
        <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed font-sans pl-1">
          {seo.suggestions.map((suggestion, sIdx) => (
            <li key={sIdx}>{suggestion}</li>
          ))}
        </ul>
      </div>

    </div>
  );
}
