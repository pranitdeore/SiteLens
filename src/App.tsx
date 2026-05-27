/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, ShieldCheck, Cpu, Globe, ArrowRight, Activity, HelpCircle, FileText } from "lucide-react";
import { AnalysisReport } from "./types";
import HeroSection from "./components/HeroSection";
import LoadingScanner from "./components/LoadingScanner";
import SidebarNavigation, { TabID } from "./components/SidebarNavigation";
import OverviewCard from "./components/OverviewCard";
import ScoreCard from "./components/ScoreCard";
import SourceCodeViewer from "./components/SourceCodeViewer";
import ColorPaletteCard from "./components/ColorPaletteCard";
import FontDetectorCard from "./components/FontDetectorCard";
import ImageGrid from "./components/ImageGrid";
import TechBadges from "./components/TechBadges";
import SeoReport from "./components/SeoReport";
import PerformanceReport from "./components/PerformanceReport";
import ScreenshotMockup from "./components/ScreenshotMockup";
import RecommendationPanel from "./components/RecommendationPanel";
import ExportReportButton from "./components/ExportReportButton";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [analyzedUrl, setAnalyzedUrl] = useState("");
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [currentTab, setCurrentTab] = useState<TabID>("overview");
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const startAnalysis = async (url: string) => {
    setIsLoading(true);
    setAnalyzedUrl(url);
    setErrorStatus(null);
    setReport(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to trigger analysis scanner.");
      }

      const reportData: AnalysisReport = await response.json();
      setReport(reportData);
      setCurrentTab("overview");
    } catch (error: any) {
      console.error(error);
      setErrorStatus(error.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setAnalyzedUrl("");
    setErrorStatus(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans select-none antialiased">
      
      {/* SaaS Product top Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
            {/* Logo vector */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white font-black text-lg shadow-md">
              S
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight font-display text-[#0F172A]">SiteLens</span>
              <span className="text-[10px] text-[#64748B] font-mono block -mt-1 uppercase tracking-wider">Web Inspector</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {report && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-sans"
              >
                Scan Another URL
              </button>
            )}
            
            <a 
              href="https://fontshare.com/" 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs font-semibold text-slate-450 hover:text-blue-600 flex items-center gap-1 font-sans"
            >
              <span>Fontshare catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Areas */}
      <main className="grow">
        
        {/* Landing screen when not analyzed and not loading */}
        {!report && !isLoading && (
          <div className="animate-fade-in">
            <HeroSection onAnalyze={startAnalysis} isLoading={isLoading} />
            
            {/* Error alerts if scraping breaks */}
            {errorStatus && (
              <div className="max-w-xl mx-auto mt-6 p-4 rounded-xl border border-red-100 bg-red-50 text-red-600 text-xs flex items-start gap-2.5 font-sans leading-relaxed shadow-sm">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Analysis Scanner Halted</strong>
                  <span>{errorStatus} Check domain, and confirm it's a public landing address.</span>
                </div>
              </div>
            )}

            {/* Simulated static preview cards on landing */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-6 select-none pointer-events-none">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mb-4">🖥️</div>
                <h4 className="text-xs font-bold font-mono text-slate-400 block uppercase">1. INSPECT THE MARKS</h4>
                <p className="text-sm font-extrabold text-slate-800 mt-1 leading-tight">View-Page-Source details</p>
                <p className="text-xs text-slate-500 mt-2">Browse clean formatted raw HTML, extracted stylesheets links, and custom body script files.</p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-box">
                <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-sm mb-4">🎨</div>
                <h4 className="text-xs font-bold font-mono text-slate-400 block uppercase">2. DETECT THE SYSTEM</h4>
                <p className="text-sm font-extrabold text-slate-800 mt-1 leading-tight">Theme &amp; Brand Gradients</p>
                <p className="text-xs text-slate-500 mt-2">Review hex palettes frequencies directly and map them to standard layout components.</p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-sm mb-4">🔤</div>
                <h4 className="text-xs font-bold font-mono text-slate-400 block uppercase">3. MATCH THE FONTS</h4>
                <p className="text-sm font-extrabold text-slate-800 mt-1 leading-tight">Fontshare counterparts</p>
                <p className="text-xs text-slate-500 mt-2">Detect active typographic nodes (Google/system) and fetch free Satoshi style matches.</p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm mb-4">🔋</div>
                <h4 className="text-xs font-bold font-mono text-slate-400 block uppercase">4. AUDIT COMPLIANCE</h4>
                <p className="text-sm font-extrabold text-slate-800 mt-1 leading-tight">SEO Index &amp; Speed Scores</p>
                <p className="text-xs text-slate-500 mt-2">Generate detailed, printable checklists, layout simulators, and raw JSON download report portfolios.</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Scanner View */}
        {isLoading && (
          <div className="px-4 py-12 animate-fade-in">
            <LoadingScanner url={analyzedUrl} />
          </div>
        )}

        {/* Dashboard Report Presenter */}
        {report && !isLoading && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in select-text">
            
            {/* Upper Domain header segment */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
              <div>
                <span className="text-[10px] font-bold text-[#64748B] font-mono block uppercase tracking-wider">VERIFIED ACTIVE AUDIT SCALES</span>
                <h2 className="text-xl font-bold font-display text-[#0F172A] flex items-center gap-2 mt-0.5">
                  <Globe className="w-5 h-5 text-[#2563EB] shrink-0" />
                  <span>{report.overview.domain}</span>
                </h2>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Overall Score</span>
                  <span className="text-2xl font-black text-[#2563EB] font-display">{report.finalScore}/100</span>
                </div>
                <div 
                  className="w-10 h-10 rounded-full border-4 border-[#E2E8F0] border-t-[#2563EB] shrink-0" 
                  style={{ transform: `rotate(${report.finalScore * 3.6}deg)` }}
                />
              </div>
            </div>

            {/* Split layout: Sidebar Left, Active Tab Content Right */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              {/* Sidebar navigation */}
              <div className="md:col-span-1 print:hidden">
                <SidebarNavigation currentTab={currentTab} onChangeTab={setCurrentTab} />
              </div>

              {/* Dynamic cards depending on TabID */}
              <div className="md:col-span-3 min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTab}
                    initial={{ opacity: 0, y: 12, scale: 0.993 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.993 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    
                    {/* 1. OVERVIEW TAB */}
                    {currentTab === "overview" && (
                      <div className="space-y-6">
                        <OverviewCard overview={report.overview} />
                        <ScoreCard score={report.finalScore} seoScore={report.seo.score} perfScore={report.performance.score} />
                        <RecommendationPanel recommendations={report.recommendations} />
                      </div>
                    )}

                    {/* 2. SOURCE VIEW TAB */}
                    {currentTab === "source" && (
                      <div>
                        <SourceCodeViewer source={report.source} />
                      </div>
                    )}

                    {/* 3. BRAND THEME PALETTE TAB */}
                    {currentTab === "theme" && (
                      <div>
                        <ColorPaletteCard 
                          colors={report.theme.colors} 
                          themeType={report.theme.themeType} 
                          designStyle={report.theme.designStyle} 
                          backgroundColor={report.theme.backgroundColor}
                        />
                      </div>
                    )}

                    {/* 4. FONTS AUDIT TAB */}
                    {currentTab === "fonts" && (
                      <div>
                        <FontDetectorCard fonts={report.fonts} />
                      </div>
                    )}

                    {/* 5. IMAGE EXTRACTOR TAB */}
                    {currentTab === "images" && (
                      <div>
                        <ImageGrid images={report.images} />
                      </div>
                    )}

                    {/* 6. TECH STACK DETECTION TAB */}
                    {currentTab === "tech" && (
                      <div>
                        <TechBadges technologies={report.technologies} />
                      </div>
                    )}

                    {/* 7. SEO METADATA TAB */}
                    {currentTab === "seo" && (
                      <div>
                        <SeoReport seo={report.seo} />
                      </div>
                    )}

                    {/* 8. PERFORMANCE DIAGNOSTICS TAB */}
                    {currentTab === "performance" && (
                      <div>
                        <PerformanceReport performance={report.performance} />
                      </div>
                    )}

                    {/* 9. MOCKUPS SIMULATOR TAB */}
                    {currentTab === "mockup" && (
                      <div>
                        <ScreenshotMockup screenshots={report.screenshots} domain={report.overview.domain} />
                      </div>
                    )}

                    {/* 10. EXPORT PORTFOLIO TAB */}
                    {currentTab === "export" && (
                      <div>
                        <ExportReportButton report={report} />
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer detailing the essential disclaimer texts as strongly requested! */}
      <footer className="bg-white border-t border-slate-200 mt-20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center text-slate-400 text-xs">
          <div>
            <span className="font-extrabold text-slate-700">SiteLens Inspector Workspace</span> — Copyright &copy; 2026. All rights reversed.
          </div>
          <p className="max-w-xl text-left md:text-right text-[11px] leading-relaxed select-text">
            <strong>Disclaimer / Legal:</strong> This helper web utility analyzes publicly available client-side website elements (DOM HTML head properties, asset paths, linked CSS rules, and imagery alt descriptions) for educational, SEO debugging, and front-end design research purposes. It does not authenticate private data layers, bypass paywalls, or redistribute copyrights.
          </p>
        </div>
      </footer>

    </div>
  );
}
