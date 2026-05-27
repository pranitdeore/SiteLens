/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { TechnologyItem } from "../types";
import { Cpu, CheckCircle2, ShieldCheck, Flame } from "lucide-react";

interface TechBadgesProps {
  technologies: TechnologyItem[];
}

export default function TechBadges({ technologies }: TechBadgesProps) {
  return (
    <div id="tech-badges-card" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <Cpu className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="text-md font-bold text-slate-800 font-sans">Technology Stack Detection</h3>
          <p className="text-xs text-slate-400">Identifies frameworks, analytics, styling libraries, and server-side stacks from public markers.</p>
        </div>
      </div>

      {/* Grid of technologies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {technologies.map((tech, idx) => {
          return (
            <div 
              key={tech.name + idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wide">{tech.category}</span>
                    <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">{tech.name}</h4>
                  </div>
                  
                  {/* Dynamic colored gradient badge background directly as requested! */}
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm"
                    style={{ background: tech.badgeColor || "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
                  >
                    <span className="text-xs font-bold font-mono">{tech.name.charAt(0)}</span>
                  </div>
                </div>
              </div>

              {/* Confidence scale rating */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified Target</span>
                </span>
                <span className="font-semibold text-slate-700">Confidence: {tech.confidence}%</span>
              </div>

            </div>
          );
        })}

        {technologies.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs font-sans">
            No active technology stack markers identified inside raw header assets.
          </div>
        )}
      </div>

      {/* Footer warning statement */}
      <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex gap-2 text-[10px] text-slate-400 leading-normal font-sans">
        <Flame className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
        <span>
          <strong>Detection Scope:</strong> Tech signatures are cataloged strictly by scanning public cookies, script source paths, CSS declarations, and meta generator markup headers. Server codes remain 100% private and protected.
        </span>
      </div>

    </div>
  );
}
