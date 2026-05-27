/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FontsData } from "../types";
import { Type, ArrowUpRight, Search, Download, HelpCircle, AlertCircle, Info } from "lucide-react";

interface FontDetectorCardProps {
  fonts: FontsData;
}

export default function FontDetectorCard({ fonts }: FontDetectorCardProps) {

  // Map font type badge styling
  const getBadgeColors = (type: string) => {
    switch (type?.toLowerCase()) {
      case "google":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "fontshare":
        return "bg-violet-50 text-violet-700 border-violet-100";
      case "system":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "adobe":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-150";
    }
  };

  return (
    <div id="font-detector-card" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden space-y-6">
      
      {/* Title block */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
          <Type className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-md font-bold text-slate-800 font-sans">Font Detection &amp; Typeface Auditing</h3>
          <p className="text-xs text-slate-400">Identifies website's active layouts, typography structures, and suggests Fontshare counterparts.</p>
        </div>
      </div>

      {/* Grid of active fonts detected */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Discovered typography summary */}
        <div className="space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">DETECTED WEB TYPOGRAPHY</span>
          
          <div className="space-y-3">
            {fonts.detected.map((font, idx) => (
              <div 
                key={font.name + idx} 
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-800 font-sans">{font.name}</span>
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-sm border ${getBadgeColors(font.type)}`}>
                      {font.type || "unknown"}
                    </span>
                    {font.name === fonts.headingFont && (
                       <span className="px-2 py-0.5 text-[9px] bg-slate-800 text-white font-bold rounded-sm uppercase tracking-widest border border-slate-900 shadow-sm">Heading Font</span>
                    )}
                    {font.name === fonts.bodyFont && (
                       <span className="px-2 py-0.5 text-[9px] bg-slate-500 text-white font-bold rounded-sm uppercase tracking-widest border border-slate-600 shadow-sm">Body Font</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-sans mt-0.5 mt-1">
                    Family: <span className="font-mono text-slate-600 font-medium">{font.family}</span> | Selector: <span className="text-blue-500 font-mono text-[11px]">{font.selector}</span>
                  </p>
                </div>
                
                <div className="text-[10px] text-slate-400 font-mono text-right shrink-0">
                  via {font.source}
                </div>
              </div>
            ))}

            {fonts.detected.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs">No active typography elements Scraped. Defaulting to standard UI fallbacks.</div>
            )}
          </div>
        </div>

        {/* Display Typography previews cards */}
        <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">LAYOUT TYPEFACE ASSIGNMENT</span>
          
          <div className="bg-slate-50/50 rounded-xl border border-slate-200 p-4 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Heading Display Font Pair</span>
              <div className="text-xl font-extrabold text-slate-800 font-sans mt-0.5 tracking-tight">
                {fonts.headingFont || "Cabinet Grotesk"}
                <span className="text-xs font-normal text-slate-400 ml-2">(Primary Titles)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Paragraph/Body Text Font</span>
              <div className="text-sm text-slate-600 font-sans mt-0.5 leading-relaxed font-sans">
                {fonts.bodyFont || "Satoshi"}
                <span className="text-[11px] text-slate-400 ml-2">(Body Copy, Content Cards, and Actions)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Fontshare similar suggestion feature block as required! */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
          <span>Premium Fontshare Free Alternatives</span>
          <span className="px-2 py-0.5 rounded bg-violet-50 text-violet-700 text-[9px] border border-violet-100 font-bold uppercase tracking-normal">DISCOVERY LINK</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fonts.fontshareSuggestions.map((suggestion, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-250 bg-white shadow-3xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs font-bold text-slate-400 block font-sans">SUGGESTIONS FOR "{suggestion.detectedFont}"</span>
                
                <div className="mt-3 divide-y divide-slate-100">
                  {suggestion.alternatives.map((alt, aIdx) => (
                    <div key={aIdx} className="py-2.5 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-slate-800">{alt.name}</span>
                        <span className="px-2 py-0.5 bg-slate-50 rounded text-[9px] text-slate-400 uppercase font-bold tracking-wide border border-slate-100 font-mono">
                          {alt.type} font
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-normal mt-1">{alt.description}</p>
                      
                      {/* Fontshare Link utilities as required! */}
                      <div className="flex items-center gap-2.5 mt-2.5">
                        <a 
                          href={alt.searchUrl || `https://www.fontshare.com/fonts/${alt.name.toLowerCase().replace(/\s+/g, "-")}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 font-sans"
                        >
                          <Search className="w-3 h-3" />
                          <span>Find similar on Fontshare</span>
                        </a>

                        <a 
                          href={alt.downloadUrl || `https://www.fontshare.com/fonts/${alt.name.toLowerCase().replace(/\s+/g, "-")}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-600 hover:text-violet-800 font-sans"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download from Fontshare</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {fonts.fontshareSuggestions.length === 0 && (
            <div className="p-4 text-center rounded-xl bg-slate-50 text-slate-400 text-xs font-sans border border-slate-200 col-span-full">
              No matching typography pairings identified. Search general similar families on Fontshare.
            </div>
          )}
        </div>
      </div>

      {/* Licensing disclaimer footnote */}
      <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex gap-2 text-[11px] text-slate-400 leading-relaxed font-sans">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          <strong>Licensing Note:</strong> Font availability depends strictly on Fontshare's specific open-source guidelines, catalogs, and license permissions. SiteLens only indexes family classifications for developer reference.
        </span>
      </div>

    </div>
  );
}
