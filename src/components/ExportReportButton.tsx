/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AnalysisReport } from "../types";
import { Download, FileDown, ShieldCheck, Printer } from "lucide-react";

interface ExportReportButtonProps {
  report: AnalysisReport;
}

export default function ExportReportButton({ report }: ExportReportButtonProps) {
  
  // Triggers dynamic window.print() layout
  const handlePrintPdf = () => {
    window.print();
  };

  // Triggers raw JSON download file
  const handleExportJson = () => {
    const rawData = JSON.stringify(report, null, 2);
    const blob = new Blob([rawData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `sitelens-audit-${report.overview.domain}.json`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="export-report-container" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-stretch sm:items-center justify-between gap-4">
      
      <div>
        <h3 className="text-sm font-extrabold text-slate-800">Export Diagnostic Portfolio</h3>
        <p className="text-xs text-slate-400">Share or download full website audit reports in standard PDF schemas or raw telemetry JSON formats.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Print/PDF */}
        <button
          onClick={handlePrintPdf}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold leading-normal transition-all shadow-2xs hover:shadow-md hover:-translate-y-0.5"
          title="Prints current report layout as a structured PDF page"
        >
          <Printer className="w-4 h-4" />
          <span>Export PDF Report</span>
        </button>

        {/* JSON Export */}
        <button
          onClick={handleExportJson}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-250 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-extrabold transition-all shadow-3xs"
          title="Download complete telemetry data payload"
        >
          <FileDown className="w-4 h-4 text-violet-500" />
          <span>Download Telemetry JSON</span>
        </button>
      </div>

    </div>
  );
}
