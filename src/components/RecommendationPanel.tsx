/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { RecommendationItem } from "../types";
import { CheckSquare, ArrowRight } from "lucide-react";

interface RecommendationPanelProps {
  recommendations: RecommendationItem[];
}

export default function RecommendationPanel({ recommendations }: RecommendationPanelProps) {
  
  // Return priority border + color theme tags
  const getBadgeStyle = (prio: string) => {
    switch (prio?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-700 border-red-100";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-blue-50 text-blue-700 border-blue-100";
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case "performance":
        return "⚡";
      case "seo":
        return "🔍";
      case "design":
        return "🎨";
      case "fonts":
        return "🔤";
      default:
        return "🛡️";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      id="recommendation-panel-card" 
      className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-5"
    >
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
          <CheckSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-md font-bold text-[#0F172A] font-sans">Strategic Diagnostics &amp; Roadmap</h3>
          <p className="text-xs text-[#64748B]">Step-by-step developer audits prioritizing accessibility, semantic layout, and speed optimizations.</p>
        </div>
      </div>

      {/* Recommendations cards loop list */}
      <motion.div 
        className="space-y-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08
            }
          }
        }}
      >
        {recommendations.map((rec, idx) => (
          <motion.div 
            key={idx}
            variants={{
              hidden: { opacity: 0, scale: 0.98, y: 10 },
              visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }
            }}
            whileHover={{ scale: 1.005, y: -2 }}
            className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:shadow-xs hover:bg-[#F1F5F9]/50 transition-colors duration-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="flex gap-3 items-start">
              <span className="text-xl select-none mt-0.5 shrink-0 bg-white shadow-3xs w-9 h-9 rounded-lg flex items-center justify-center border border-[#E2E8F0]">
                {getCategoryIcon(rec.category)}
              </span>
              <div>
                <span className="text-[10px] font-bold text-[#64748B] font-mono block uppercase">
                  {rec.category || "General"} IMPROVEMENT
                </span>
                <h4 className="text-sm font-extrabold text-[#0F172A] tracking-tight mt-0.5">{rec.title}</h4>
                <p className="text-xs text-[#64748B] leading-relaxed font-sans mt-1">{rec.message}</p>
              </div>
            </div>

            {/* Impact priority tag */}
            <span className={`px-2.5 py-1 text-[10px] uppercase font-mono font-bold tracking-wider rounded-lg border shrink-0 text-center self-start sm:self-center ${getBadgeStyle(rec.type)}`}>
              {rec.type || "Low"} Priority
            </span>

          </motion.div>
        ))}

        {recommendations.length === 0 && (
          <div className="text-center py-8 text-[#64748B] text-xs">No strategic improvements requested. Layout has reached optimal code scores!</div>
        )}
      </motion.div>

    </motion.div>
  );
}
