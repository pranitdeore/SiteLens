/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { OverviewData } from "../types";
import { Globe, AlertCircle, ShieldAlert, Link as LinkIcon, Badge, Activity, HelpCircle } from "lucide-react";

interface OverviewCardProps {
  overview: OverviewData;
}

export default function OverviewCard({ overview }: OverviewCardProps) {
  // Guess site categories based on description or title
  const guessPageType = () => {
    const combined = (overview.title + " " + overview.description).toLowerCase();
    if (combined.includes("shop") || combined.includes("store") || combined.includes("ecommerce") || combined.includes("buy")) {
      return { label: "E-Commerce", color: "bg-emerald-50 text-emerald-700 border-emerald-100" };
    }
    if (combined.includes("blog") || combined.includes("news") || combined.includes("article") || combined.includes("magazine")) {
      return { label: "Editorial / Blog", color: "bg-amber-50 text-amber-700 border-amber-100" };
    }
    if (combined.includes("portfolio") || combined.includes("creative") || combined.includes("designer") || combined.includes("illustration")) {
      return { label: "Creative Portfolio", color: "bg-pink-50 text-pink-700 border-pink-100" };
    }
    if (combined.includes("api") || combined.includes("saas") || combined.includes("cloud") || combined.includes("platform") || combined.includes("software")) {
      return { label: "SaaS / Tech Platform", color: "bg-blue-50 text-blue-700 border-blue-100" };
    }
    return { label: "Corporate Website", color: "bg-slate-100 text-slate-700 border-slate-200" };
  };

  const pageType = guessPageType();

  return (
    <div id="overview-card" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
      {/* Visual background gradient accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between pb-6 border-b border-slate-100 mb-6">
        <div className="flex gap-4 items-center">
          {/* Web favicon orb */}
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2.5 shadow-2xs shrink-0 overflow-hidden">
            {overview.favicon ? (
              <img 
                src={overview.favicon} 
                alt="Favicon" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&q=80";
                }}
              />
            ) : (
              <Globe className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{overview.domain}</h2>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${pageType.color}`}>
                {pageType.label}
              </span>
            </div>
            <p className="text-sm text-slate-400 font-mono mt-0.5 truncate max-w-lg">{overview.finalUrl}</p>
          </div>
        </div>

        {/* Audit health indicators */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>HTTP {overview.status}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl border border-blue-100 bg-blue-50/50 flex items-center gap-1.5 text-xs font-bold text-blue-700">
            <Globe className="w-3.5 h-3.5" />
            <span>Public Domain</span>
          </div>
        </div>
      </div>

      {/* Overview Metadata parameters grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">SCOPED TITLE TAG</span>
            <div className="mt-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium leading-tight">
              {overview.title || "No page title detected."}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">META DESCRIPTION</span>
            <div className="mt-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-sm leading-relaxed">
              {overview.description || "The webpage contains no descriptive content descriptors."}
            </div>
          </div>
        </div>

        {/* Secondary specifications panel */}
        <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono block">ROUTING SPECIFICATIONS</span>
          
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide font-mono block">CANONICAL SPECIFIER</span>
              <div className="flex items-center gap-1.5 mt-1 text-slate-700 text-xs">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate font-mono" title={overview.canonicalUrl}>{overview.canonicalUrl}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide font-mono block">SECURED PROTOCOL</span>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                {overview.finalUrl.startsWith("https") ? (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-sm font-semibold font-mono">HTTPS SSL Verified</span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-sm font-semibold font-mono">HTTP Standard</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide font-mono block">ANALYZER LEVEL</span>
              <div className="text-xs text-slate-600 font-sans mt-0.5">
                Client Public Node Scraping + Gemini Auditor
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
