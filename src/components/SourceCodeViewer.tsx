/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { SourceData } from "../types";
import { Copy, Check, Search, Code, LayoutGrid, FileCode2, ExternalLink, Settings, Download } from "lucide-react";

interface SourceCodeViewerProps {
  source: SourceData;
}

type ActiveTab = "html" | "css" | "js" | "meta";

export default function SourceCodeViewer({ source }: SourceCodeViewerProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("html");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBeautified, setIsBeautified] = useState(true);

  // Beautification logic (basic spacing for readability)
  const formattedHtml = useMemo(() => {
    const raw = source.html || "";
    if (!isBeautified) return raw;

    // Very simple regex-based markup formatting for preview style
    let formatted = "";
    let indent = 0;
    const tokens = raw.split(/(<\/?[a-zA-Z0-9:-]+(?:\s+[^>]*?)?>)/).filter(Boolean);

    for (let token of tokens) {
      token = token.trim();
      if (!token) continue;

      if (token.startsWith("</")) {
        indent = Math.max(0, indent - 1);
        formatted += "  ".repeat(indent) + token + "\n";
      } else if (token.startsWith("<") && !token.endsWith("/>") && !token.startsWith("<!") && !token.startsWith("<meta") && !token.startsWith("<link") && !token.startsWith("<img") && !token.startsWith("<input") && !token.startsWith("<br") && !token.startsWith("<hr")) {
        formatted += "  ".repeat(indent) + token + "\n";
        indent += 1;
      } else if (token.startsWith("<")) {
        formatted += "  ".repeat(indent) + token + "\n";
      } else {
        formatted += "  ".repeat(indent) + token + "\n";
      }
    }
    return formatted || raw;
  }, [source.html, isBeautified]);

  const splittedLines = useMemo(() => {
    return formattedHtml.split("\n");
  }, [formattedHtml]);

  // Handle Search filtering
  const filteredLines = useMemo(() => {
    if (!searchQuery) return splittedLines;
    const lowerQuery = searchQuery.toLowerCase();
    return splittedLines.map((line) => {
      const matchIdx = line.toLowerCase().indexOf(lowerQuery);
      return {
        text: line,
        hasMatch: matchIdx !== -1,
        matchIndex: matchIdx
      };
    });
  }, [splittedLines, searchQuery]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSource = () => {
    const blob = new Blob([source.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scraped-source-sitelens.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter meta tags schema free text search
  const filteredMetaTags = useMemo(() => {
    return source.metaTags.filter(tag => {
      const query = searchQuery.toLowerCase();
      return (
        tag.name.toLowerCase().includes(query) ||
        tag.property.toLowerCase().includes(query) ||
        tag.content.toLowerCase().includes(query)
      );
    });
  }, [source.metaTags, searchQuery]);

  return (
    <div id="source-code-viewer-card" className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      
      {/* Viewer Header and Navigator Tabs */}
      <div className="flex flex-col sm:flex-row bg-slate-50 border-b border-slate-200 items-stretch sm:items-center justify-between px-4 py-3 gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => { setActiveTab("html"); setSearchQuery(""); }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold font-sans transition-all whitespace-nowrap ${
              activeTab === "html" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>HTML Source ({splittedLines.length} lines)</span>
          </button>
          
          <button
            onClick={() => { setActiveTab("meta"); setSearchQuery(""); }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold font-sans transition-all whitespace-nowrap ${
              activeTab === "meta" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Meta Tags Table ({source.metaTags.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab("css"); setSearchQuery(""); }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold font-sans transition-all whitespace-nowrap ${
              activeTab === "css" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 text-pink-500" />
            <span>CSS Stylesheets ({source.cssFiles.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab("js"); setSearchQuery(""); }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold font-sans transition-all whitespace-nowrap ${
              activeTab === "js" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-amber-500" />
            <span>JS Modules ({source.jsFiles.length})</span>
          </button>
        </div>

        {/* Global Toolbar utility filters */}
        <div className="flex items-center gap-2">
          {activeTab === "html" && (
            <button
              onClick={() => setIsBeautified(!isBeautified)}
              className="px-2.5 py-1.5 text-[10px] font-bold tracking-wide rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
            >
              {isBeautified ? "DEBEAUTIFY PREVIEW" : "FORMAT HTMLCODE"}
            </button>
          )}

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parameters..."
              className="pl-8 pr-2.5 py-1.5 text-xs bg-white text-slate-700 rounded-lg border border-slate-200 w-36 sm:w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleDownloadSource}
            title="Download full HTML payload"
            className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 rounded-lg shadow-2xs"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            title="Copy current screen bundle"
            className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 rounded-lg shadow-2xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Code viewport canvas area */}
      <div className="p-4 bg-slate-50">
        
        {/* HTML TAB SOURCE VIEW */}
        {activeTab === "html" && (
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-900 text-slate-100 font-mono text-xs shadow-xs">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 text-slate-400 font-sans border-b border-slate-700">
              <span className="text-[10px] uppercase font-bold tracking-wide">HTML VIEWPORT DETECTOR (VIEW-PAGE-SOURCE INSPIRED)</span>
              <span className="text-[10px] font-mono text-blue-400">Lines: {splittedLines.length}</span>
            </div>
            
            <div className="max-h-96 overflow-y-auto p-4 flex flex-col scrollbar-thin select-text">
              {filteredLines.map((line, idx) => {
                const lineNo = idx + 1;
                // Basic text highlighting if matching query
                const isMatch = typeof line === "object" && line.hasMatch;
                const lineText = typeof line === "object" ? line.text : line;

                return (
                  <div 
                    key={lineNo} 
                    className={`flex items-start py-0.5 leading-relaxed hover:bg-slate-800/40 rounded transition-colors ${
                      isMatch ? "bg-yellow-500/10 text-yellow-200 font-semibold" : ""
                    }`}
                  >
                    <span className="w-12 text-slate-500 text-right select-none pr-4 shrink-0 font-mono border-r border-slate-800 mr-4">
                      {lineNo}
                    </span>
                    <span className="whitespace-pre-wrap break-all pr-4 text-slate-300">
                      {lineText}
                    </span>
                  </div>
                );
              })}

              {splittedLines.length === 0 && (
                <div className="text-center py-8 text-slate-500">No public page markup available in scanner cache.</div>
              )}
            </div>
          </div>
        )}

        {/* META TAGS LIST VIEW */}
        {activeTab === "meta" && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 border-b border-slate-100 font-mono uppercase font-bold tracking-wider">
                    <th className="p-3">Attribute Name</th>
                    <th className="p-3">Attribute Property</th>
                    <th className="p-3">Extracted Content</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredMetaTags.map((tag, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono font-medium text-blue-600">{tag.name || "—"}</td>
                      <td className="p-3 font-mono text-violet-600">{tag.property || "—"}</td>
                      <td className="p-3 select-all max-w-sm truncate font-sans" title={tag.content}>{tag.content}</td>
                    </tr>
                  ))}

                  {filteredMetaTags.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-slate-400 font-sans">No matching meta elements detected in header cache.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CSS TABS LIST VIEW */}
        {activeTab === "css" && (
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono block uppercase">EXTERNAL STATIC STYLESHEET NODES FOUND</span>
            <div className="space-y-2">
              {source.cssFiles.map((cssUrl, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                      <FileCode2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-700 truncate block max-w-md font-mono">{cssUrl.split("/").pop() || "stylesheet.css"}</span>
                      <span className="text-[10px] font-mono text-slate-400 block truncate max-w-sm sm:max-w-lg">{cssUrl}</span>
                    </div>
                  </div>
                  <a
                    href={cssUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}

              {source.cssFiles.length === 0 && (
                <div className="text-center py-8 text-slate-400">No linked stylesheet tags discovered in HTML body.</div>
              )}
            </div>
          </div>
        )}

        {/* JS TAGS LIST VIEW */}
        {activeTab === "js" && (
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono block uppercase">LINKED SCRIPT PATHWAYS</span>
            <div className="space-y-2">
              {source.jsFiles.map((jsUrl, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                      <Settings className="w-4 h-4 animate-spin-slow" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-700 truncate block max-w-md font-mono">{jsUrl.split("/").pop() || "script.js"}</span>
                      <span className="text-[10px] font-mono text-slate-400 block truncate max-w-sm sm:max-w-md">{jsUrl}</span>
                    </div>
                  </div>
                  <a
                    href={jsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}

              {source.jsFiles.length === 0 && (
                <div className="text-center py-8 text-slate-400">No external JS script directories found on scan trace.</div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
