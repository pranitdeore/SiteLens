/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { 
  BarChart, 
  Code, 
  Palette, 
  Type, 
  Image, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Monitor, 
  Download 
} from "lucide-react";

export type TabID = "overview" | "source" | "theme" | "fonts" | "images" | "tech" | "seo" | "performance" | "mockup" | "export";

interface SidebarNavigationProps {
  currentTab: TabID;
  onChangeTab: (tab: TabID) => void;
}

interface NavItem {
  id: TabID;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Dashboard Overview", icon: BarChart },
  { id: "source", label: "Source Code Viewer", icon: Code },
  { id: "theme", label: "Theme & Brand Colors", icon: Palette },
  { id: "fonts", label: "Font Detection", icon: Type },
  { id: "images", label: "Image Extractor", icon: Image },
  { id: "tech", label: "Technology Stack", icon: Cpu },
  { id: "seo", label: "SEO Meta Diagnostics", icon: ShieldCheck },
  { id: "performance", label: "Speed & Performance", icon: Zap },
  { id: "mockup", label: "Layout Simulator", icon: Monitor },
  { id: "export", label: "Export Portfolios", icon: Download }
];

export default function SidebarNavigation({ currentTab, onChangeTab }: SidebarNavigationProps) {
  return (
    <aside id="sidebar-navigation-container" className="space-y-1.5 p-4 bg-white border border-[#E2E8F0] rounded-2xl w-full shadow-sm">
      <span className="text-[10px] font-bold text-[#64748B] font-mono tracking-widest uppercase block mb-3 px-3">SiteLens Navigator</span>
      
      <div className="flex flex-col space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`relative flex items-center px-3 py-2.5 text-xs font-semibold rounded-xl text-left cursor-pointer transition-colors duration-200 outline-none ${
                isActive 
                  ? "text-[#2563EB] font-bold" 
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50/75"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-x-0 inset-y-0 bg-blue-50/70 border border-blue-100/50 rounded-xl"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  style={{ zIndex: 0 }}
                />
              )}
              
              <span className="relative z-10 flex items-center gap-2.5 w-full">
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? "text-[#2563EB] scale-110" : "text-[#94A3B8]"}`} />
                <span>{item.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
