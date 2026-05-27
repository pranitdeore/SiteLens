/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ImageData } from "../types";
import { Image, AlertTriangle, ExternalLink, ShieldCheck, Eye, EyeOff } from "lucide-react";

interface ImageGridProps {
  images: ImageData[];
}

export default function ImageGrid({ images }: ImageGridProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div id="image-grid-card" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden space-y-6">
      
      {/* Title */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="p-2 bg-pink-50 text-pink-600 rounded-xl">
          <Image className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-md font-bold text-slate-800 font-sans">Image Extractor Gallery</h3>
          <p className="text-xs text-slate-400">Scrapes publicly accessible inline imagery, logos, assets, and metadata banners.</p>
        </div>
      </div>

      {/* Grid displaying the image objects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, idx) => {
          const hasMissingAlt = !image.alt || image.alt.trim() === "";

          return (
            <div 
              key={image.src + idx}
              className="group border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-slate-50 relative flex flex-col justify-between hover:shadow-md hover:border-slate-350 transition-all duration-300"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Image Preview Window */}
              <div className="h-44 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-150">
                <img 
                  src={image.src} 
                  alt={image.alt || "Extracted site image"} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback visual illustration icon
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80";
                  }}
                />

                {/* Overlaid preview badge */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white uppercase font-mono tracking-wider">
                    {image.type || "IMG"}
                  </span>
                  
                  {image.loading === "lazy" ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/80 backdrop-blur-xs text-[9px] font-bold text-white uppercase font-mono tracking-wider">
                      Lazy (Optimized)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-amber-500/80 backdrop-blur-xs text-[9px] font-bold text-white uppercase font-mono tracking-wider">
                      Eager
                    </span>
                  )}
                </div>

                <a
                  href={image.src}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-white/95 text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                  title="Open image in tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* metadata footer parameters */}
              <div className="p-3.5 bg-white space-y-2.5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block tracking-wide font-mono uppercase">ALT TEXT TAG</span>
                  <div className={`text-xs mt-1.5 p-2 rounded-md ${
                    hasMissingAlt ? "bg-red-50 text-red-700 font-medium" : "bg-slate-50 text-slate-700"
                  }`}>
                    {hasMissingAlt ? (
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>Missing descriptive alt attribute.</span>
                      </span>
                    ) : (
                      <span className="line-clamp-2" title={image.alt}>{image.alt}</span>
                    )}
                  </div>
                </div>

                {/* Tag source details */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                  <span>Source: {image.sourceTag || "<img>"}</span>
                  <span className="text-slate-400 capitalize">SSL Safe</span>
                </div>
              </div>

            </div>
          );
        })}

        {images.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs font-sans">
            No public images detected or extracted inside website body tags.
          </div>
        )}
      </div>

    </div>
  );
}
