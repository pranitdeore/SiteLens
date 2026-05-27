/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as cheerio from "cheerio";
import { GoogleGenAI, Type } from "@google/genai";
import { 
  AnalysisReport, 
  OverviewData, 
  SourceData, 
  ThemeData, 
  FontsData, 
  ImageData, 
  TechnologyItem, 
  SeoData, 
  PerformanceData, 
  ScreenshotsData, 
  RecommendationItem,
  MetaTagInfo,
  ColorItem,
  FontInfo,
  FontshareSuggestion,
  SeoIssue
} from "../src/types.js";

// Block private IP networks and localhost
export function blockPrivateNetworkUrls(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase();

    // Protocol checks
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return true;
    }

    // Explicit localhost checks
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]") {
      return true;
    }

    // Private IP ranges (IPv4)
    // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16
    const privateIpv4Regex = /^(127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+|169\.254\.\d+\.\d+)$/;
    if (privateIpv4Regex.test(hostname)) {
      return true;
    }

    // Simple check for internal/single label local hostnames e.g. "my-server"
    if (!hostname.includes(".")) {
      return true;
    }

    return false;
  } catch (error) {
    return true; // Invalid URL
  }
}

// Normalize the input URL (ensure http/https protocol)
export function normalizeUrl(urlString: string): string {
  let trimmed = urlString.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = "https://" + trimmed;
  }
  return trimmed;
}

// Extract colors from raw HTML string
function extractHexColors(html: string): ColorItem[] {
  const hexRegex = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
  const matches = html.match(hexRegex) || [];
  
  const frequency: Record<string, number> = {};
  for (const match of matches) {
    const uppercase = match.toUpperCase();
    frequency[uppercase] = (frequency[uppercase] || 0) + 1;
  }

  // Filter out any nonsense or repetitive low ones
  const items: ColorItem[] = Object.entries(frequency)
    .map(([hex, count]) => ({
      hex,
      count,
      type: "Detected"
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // top 8 colors

  return items;
}

// Detect technologies programmatically from cheerio and HTML text
function detectTechnologiesProgrammatic(html: string, $: cheerio.CheerioAPI): TechnologyItem[] {
  const techs: TechnologyItem[] = [];
  const textVal = html.toLowerCase();

  const addTech = (name: string, category: string, confidence: number, badgeColor: string) => {
    techs.push({ name, category, confidence, badgeColor });
  };

  // 1. Next.js
  if ($("#__NEXT_DATA__").length > 0 || textVal.includes("/_next/static") || textVal.includes("next-head-count")) {
    addTech("Next.js", "Framework", 100, "linear-gradient(135deg, #000000 0%, #333333 100%)");
  }

  // 2. React
  if (textVal.includes("react-dom") || textVal.includes("data-reactroot") || textVal.includes("react.production") || techs.some(t => t.name === "Next.js")) {
    addTech("React", "Library", 95, "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)");
  }

  // 3. WordPress
  if (textVal.includes("/wp-content/") || textVal.includes("/wp-includes/") || $('meta[name="generator"]').attr('content')?.toLowerCase().includes("wordpress")) {
    addTech("WordPress", "CMS", 100, "linear-gradient(135deg, #21759B 0%, #1B5A78 100%)");
  }

  // 4. Shopify
  if (textVal.includes("shopifyPay") || textVal.includes("cdn.shopify.com") || textVal.includes("shopify-checkout")) {
    addTech("Shopify", "E-commerce", 100, "linear-gradient(135deg, #96BF48 0%, #769B2F 100%)");
  }

  // 5. Tailwind CSS
  if (textVal.includes("tailwindcss") || html.includes("space-y-") || html.includes("grid-cols-") || html.includes("focus:ring-2")) {
    addTech("Tailwind CSS", "Styling", 90, "linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)");
  }

  // 6. jQuery
  if (textVal.includes("jquery.min.js") || textVal.includes("jquery.js") || textVal.includes("jquery-")) {
    addTech("jQuery", "Library", 85, "linear-gradient(135deg, #0769AD 0%, #0B5792 100%)");
  }

  // 7. Google Analytics & GTM
  if (textVal.includes("googletagmanager.com/gtm.js") || textVal.includes("google-analytics.com") || textVal.includes("gtag(")) {
    addTech("Google Tag Manager", "Analytics", 98, "linear-gradient(135deg, #00BBC7 0%, #2563EB 100%)");
  }

  // 8. Vue
  if (textVal.includes("vue.js") || textVal.includes("vue.min.js") || textVal.includes("vue-") || textVal.includes("__vue__")) {
    addTech("Vue.js", "Framework", 95, "linear-gradient(135deg, #42B883 0%, #35495E 100%)");
  }

  // 9. Webflow
  if ($('[data-wf-page]').length > 0 || textVal.includes("webflow.js") || textVal.includes("uploads-ssl.webflow.com")) {
    addTech("Webflow", "No-Code builder", 100, "linear-gradient(135deg, #4353FF 0%, #3541C8 100%)");
  }

  // 10. Bootstrap
  if (textVal.includes("bootstrap.min.css") || textVal.includes("bootstrap.bundle") || html.includes("col-md-") || html.includes("d-flex")) {
    addTech("Bootstrap", "Styling", 80, "linear-gradient(135deg, #7952B3 0%, #563D7C 100%)");
  }

  // 11. Framer Motion
  if (textVal.includes("framer-motion") || html.includes("framer-") || textVal.includes("motion/react")) {
    addTech("Framer Motion", "Animations", 85, "linear-gradient(135deg, #FF0055 0%, #CC0044 100%)");
  }

  return techs.length > 0 ? techs : [
    { name: "Modern HTML5", category: "Language", confidence: 99, badgeColor: "linear-gradient(135deg, #E34F26 0%, #F16529 100%)" },
    { name: "Vanilla JavaScript", category: "Language", confidence: 95, badgeColor: "linear-gradient(135deg, #F7DF1E 0%, #CAB300 100%)" }
  ];
}

// Intelligent analysis via Gemini standard API call
async function runIntelligentGeminiAnalysis(
  url: string,
  overview: OverviewData,
  source: SourceData,
  detectedTechs: TechnologyItem[],
  extractedColors: ColorItem[]
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null; // Fallback
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });

    const prompt = `
You are SiteLens, a premium full-stack responsive web auditor and browser analyzer.
Given details of a scanned public website, generate highly professional, precise, responsive design audit details, custom theme palettes, Fontshare font alternative matches, and strategic improvements.

Here is the parsed metadata:
- URL: ${url}
- Title: ${overview.title}
- Description: ${overview.description}
- Script counts: Inline scripts: ${source.inlineScriptCount}, Inline styles: ${source.inlineStyleCount}
- CSS files: ${source.cssFiles.slice(0, 10).join(", ")}
- Technologies found programmatically: ${detectedTechs.map(t => t.name).join(", ")}
- Raw Hex patterns counted: ${extractedColors.map(c => `${c.hex} (x${c.count})`).join(", ")}

Generate a complete visual design and recommendation payload adhering EXACTLY to this JSON schema:
{
  "theme": {
    "colors": [
      { "hex": "#FFFFFF", "count": 100, "type": "Background", "description": "Canvas primary backdrop" },
      { "hex": "#...", "count": 75, "type": "Primary", "description": "Brand signature color" },
      { "hex": "#...", "count": 50, "type": "Secondary" },
      { "hex": "#...", "count": 25, "type": "Text" },
      { "hex": "#...", "count": 10, "type": "Accent" }
    ],
    "themeType": "Light" | "Dark" | "Minimal" | "Corporate" | "Futuristic" | "Colorful" | "Blog",
    "designStyle": "SaaS Minimalist" | "High-tech Darkism" | "Elegant Corporate" | "Editorial Classic"
  },
  "fonts": {
    "detected": [
      { "name": "Inter", "family": "sans-serif", "fallback": "system-ui, sans-serif", "source": "Google Fonts", "selector": "body", "type": "google" }
    ],
    "headingFont": "Satoshi",
    "bodyFont": "General Sans",
    "fontshareSuggestions": [
      {
        "detectedFont": "Inter",
        "alternatives": [
          { "name": "Satoshi", "description": "A modernist neo-grotesk with elegant geometric geometric counters", "downloadUrl": "https://www.fontshare.com/fonts/satoshi", "searchUrl": "https://www.fontshare.com/fonts/satoshi", "type": "body" },
          { "name": "General Sans", "description": "A sturdy modern neutral sans with clean terminal lines", "downloadUrl": "https://www.fontshare.com/fonts/general-sans", "searchUrl": "https://www.fontshare.com/fonts/general-sans", "type": "body" }
        ]
      }
    ]
  },
  "technologies": [
    { "name": "React", "category": "Framework", "confidence": 100, "badgeColor": "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)" }
  ],
  "recommendations": [
    { "category": "SEO" | "Performance" | "Design" | "Fonts", "type": "High" | "Medium" | "Low", "title": "Headline suggestion", "message": "Detailed action step" }
  ]
}

Make sure the JSON is perfectly clean, formatted, valid, has no backticks, and resolves to standard JSON. Ensure Fontshare alternatives are realistic (e.g., using fonts like Satoshi, General Sans, Supreme, Cabinet Grotesk, Clash Display, Syncrenia, Author, Chillax, Britanica, etc.).
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const jsonText = response.text || "";
    return JSON.parse(jsonText.trim());
  } catch (err) {
    console.error("Gemini Scraper AI assist failed, falling back safely:", err);
    return null; // fallback
  }
}

// Master scraping and HTML extraction pipeline
export async function analyzeWebsite(rawUrl: string, options: { timeoutMs?: number } = {}): Promise<AnalysisReport> {
  const url = normalizeUrl(rawUrl);

  if (blockPrivateNetworkUrls(url)) {
    throw new Error("Access denied: Local/private addresses are blocked for security.");
  }

  const timeout = options.timeoutMs || 10000;
  
  // Abort safety
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  let responseText = "";
  let responseStatus = 200;
  let finalUri = url;

  try {
    const fetchResponse = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SiteLensScanner/1.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      }
    });

    responseStatus = fetchResponse.status;
    finalUri = fetchResponse.url || url;
    responseText = await fetchResponse.text();
  } catch (err: any) {
    clearTimeout(id);
    throw new Error(`Failed to fetch website HTML: ${err.message || err}`);
  } finally {
    clearTimeout(id);
  }

  // Load Cheerio
  const $ = cheerio.load(responseText);

  // 1. Overview data
  const parsedDomain = new URL(finalUri).hostname;
  
  // Try OG tags if standard title/desc are missing
  const title = $("title").first().text().trim() || 
                $('meta[property="og:title"]').attr("content") || 
                $('meta[name="twitter:title"]').attr("content") || 
                parsedDomain;

  const description = $('meta[name="description"]').attr("content")?.trim() || 
                      $('meta[property="og:description"]').attr("content")?.trim() || 
                      "No overview description available. This site lacks standard HTML meta descriptions.";

  // Extract Favicon
  let favicon = $('link[rel="apple-touch-icon"]').attr("href") ||
                $('link[rel="icon"]').attr("href") ||
                $('link[rel="shortcut icon"]').attr("href") ||
                "/favicon.ico";

  // Resolve absolute path for favicon
  if (favicon && !/^https?:\/\//i.test(favicon)) {
    try {
      favicon = new URL(favicon, finalUri).href;
    } catch (_) {
      favicon = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&q=80"; // neat fallback
    }
  }

  const canonicalUrl = $('link[rel="canonical"]').attr("href") || finalUri;

  const overview: OverviewData = {
    title,
    description,
    favicon,
    domain: parsedDomain,
    canonicalUrl,
    status: responseStatus,
    finalUrl: finalUri
  };

  // 2. Source Code summary
  const cssFiles: string[] = [];
  $('link[rel="stylesheet"]').each((i, el) => {
    const href = $(el).attr("href");
    if (href) {
      try {
        cssFiles.push(new URL(href, finalUri).href);
      } catch (_) {
        cssFiles.push(href);
      }
    }
  });

  const jsFiles: string[] = [];
  $('script[src]').each((i, el) => {
    const src = $(el).attr("src");
    if (src) {
      try {
        jsFiles.push(new URL(src, finalUri).href);
      } catch (_) {
        jsFiles.push(src);
      }
    }
  });

  const metaTags: MetaTagInfo[] = [];
  $("meta").each((i, el) => {
    const name = $(el).attr("name") || "";
    const property = $(el).attr("property") || "";
    const content = $(el).attr("content") || "";
    if (name || property) {
      metaTags.push({ name, property, content });
    }
  });

  const source: SourceData = {
    html: responseText, // will show beautiful slice on UI & support viewing full
    cssFiles,
    jsFiles,
    metaTags,
    inlineStyleCount: $("style").length,
    inlineScriptCount: $("script:not([src])").length
  };

  // 3. Image extraction
  const images: ImageData[] = [];
  
  // Extract images from <img>
  $("img").each((i, el) => {
    let src = $(el).attr("src") || "";
    if (!src) return;

    // Resolve absolute URL
    try {
      if (!/^https?:\/\//i.test(src)) {
        src = new URL(src, finalUri).href;
      }
    } catch (_) {}

    const alt = $(el).attr("alt")?.trim() || "";
    const loading = $(el).attr("loading") || "eager";
    
    // Guess file type from URL
    let type = "image";
    const extensionMatches = src.match(/\.(png|jpe?g|svg|webp|gif|avif)\b/i);
    if (extensionMatches) {
      type = extensionMatches[1].toLowerCase();
    }

    images.push({
      src,
      alt,
      type,
      sourceTag: "<img>",
      broken: false,
      loading,
      warning: !alt ? "Missing descriptive alternative text (alt)." : undefined
    });
  });

  // Extract from og:image
  const ogImg = $('meta[property="og:image"]').attr("content");
  if (ogImg) {
    let src = ogImg;
    try {
      if (!/^https?:\/\//i.test(src)) {
        src = new URL(src, finalUri).href;
      }
    } catch (_) {}

    images.push({
      src,
      alt: "Open Graph Social Banner",
      type: "og-meta",
      sourceTag: "<meta og:image>",
      broken: false,
      loading: "eager"
    });
  }

  // Deduplicate images
  const seenSrcs = new Set<string>();
  const uniqueImages = images.filter(img => {
    if (seenSrcs.has(img.src)) return false;
    seenSrcs.add(img.src);
    return true;
  }).slice(0, 30); // limit 30 images to keep DOM super light and responsive

  // 4. Tech stack detection
  const detectedTechs = detectTechnologiesProgrammatic(responseText, $);

  // 5. Hex Colors extraction
  const rawColors = extractHexColors(responseText);

  // 6. Basic defaults for Fallback Theme & Font detection
  const defaultColors: ColorItem[] = [
    { hex: "#2563EB", count: 12, type: "Primary", description: "Blue brand active theme" },
    { hex: "#7C3AED", count: 8, type: "Secondary", description: "Violet decorative styling" },
    { hex: "#FFFFFF", count: 22, type: "Background", description: "White primary layout canvas" },
    { hex: "#0F172A", count: 18, type: "Text", description: "Deep charcoal modern readability" },
    { hex: "#06B6D4", count: 4, type: "Accent", description: "Cyan graphical highlight" }
  ];

  let theme: ThemeData = {
    colors: rawColors.length > 2 ? rawColors : defaultColors,
    primaryColor: rawColors[0]?.hex || "#2563EB",
    secondaryColor: rawColors[1]?.hex || "#7C3AED",
    backgroundColor: "#FFFFFF",
    textColor: "#0F172A",
    themeType: "Light Theme",
    designStyle: "SaaS Minimalist"
  };

  // Extract font definitions from style link links
  const fontsDetected: FontInfo[] = [];
  $('link[href*="fonts.googleapis.com"]').each((i, el) => {
    const href = $(el).attr("href") || "";
    const match = href.match(/family=([^&:]+)/);
    if (match) {
      const decoded = decodeURIComponent(match[1].replace(/\+/g, " "));
      fontsDetected.push({
        name: decoded,
        family: "sans-serif",
        fallback: "system-ui, sans-serif",
        source: "Google Fonts Link",
        selector: "HTML Head Imports",
        type: "google"
      });
    }
  });

  // Scrape inline style tags/font-family declarations
  const stylesText = $("style").text();
  const inlineStylesFontFamilyRegex = /font-family\s*:\s*([^;!}\n]+)/gi;
  let fontMatch;
  while ((fontMatch = inlineStylesFontFamilyRegex.exec(stylesText)) !== null && fontsDetected.length < 5) {
    const cleanFontName = fontMatch[1].replace(/['"\s]+/g, " ").trim().split(",")[0];
    if (cleanFontName && !["inherit", "sans-serif", "serif", "monospace"].includes(cleanFontName.toLowerCase())) {
      if (!fontsDetected.some(f => f.name.toLowerCase() === cleanFontName.toLowerCase())) {
        fontsDetected.push({
          name: cleanFontName,
          family: "sans-serif",
          fallback: "sans-serif",
          source: "@font-face / stylesheet",
          selector: "Global Style Blocks",
          type: "custom"
        });
      }
    }
  }

  // System fonts fallback
  if (fontsDetected.length === 0) {
    fontsDetected.push({
      name: "Inter",
      family: "sans-serif",
      fallback: "system-ui, sans-serif",
      source: "Tailwind UI Standard",
      selector: "body",
      type: "system"
    });
  }

  const defaultSuggestions: FontshareSuggestion[] = fontsDetected.map(font => ({
    detectedFont: font.name,
    alternatives: [
      {
        name: "Satoshi",
        description: "A gorgeous, modern Grotesk family paired with high-contrast geometrical structures.",
        downloadUrl: "https://www.fontshare.com/fonts/satoshi",
        searchUrl: `https://www.fontshare.com/fonts/satoshi`,
        type: "body"
      },
      {
        name: "General Sans",
        description: "A stable neo-grotesk with clean glyph endings and excellent SaaS readability.",
        downloadUrl: "https://www.fontshare.com/fonts/general-sans",
        searchUrl: `https://www.fontshare.com/fonts/general-sans`,
        type: "body"
      }
    ]
  }));

  let fonts: FontsData = {
    detected: fontsDetected,
    headingFont: fontsDetected[0]?.name || "Inter",
    bodyFont: fontsDetected[1]?.name || "Inter",
    fontshareSuggestions: defaultSuggestions
  };

  let recommendations: RecommendationItem[] = [
    {
      category: "SEO",
      type: "High",
      title: "Improve Alt attributes of website inline illustrations",
      message: "Adding descriptive text tags to image properties creates massive benefits for screen readers and accessibility audits."
    },
    {
      category: "Performance",
      type: "Medium",
      title: "Consolidate stylesheet and stylesheet bundles",
      message: "Minimize external CSS and JavaScript files or utilize critical path styles to decrease Initial Rendering limits."
    },
    {
      category: "Design",
      type: "Low",
      title: "Integrate premium web typography alternatives",
      message: "Pair heavy display fonts (like Fontshare Satoshi or Cabinet Grotesk) with standard clean system fonts to optimize aesthetic consistency."
    }
  ];

  // Call Gemini API to supercharge analysis if key is available
  const richDataJson = await runIntelligentGeminiAnalysis(finalUri, overview, source, detectedTechs, rawColors);
  if (richDataJson) {
    if (richDataJson.theme) {
      theme = {
        ...theme,
        ...richDataJson.theme,
        colors: richDataJson.theme.colors?.map((c: any) => ({
          ...c,
          count: c.count || 20,
          type: c.type || "Detected"
        })) || theme.colors
      };
    }
    if (richDataJson.fonts) {
      // Merge detected with rich suggestions
      fonts = {
        detected: richDataJson.fonts.detected || fonts.detected,
        headingFont: richDataJson.fonts.headingFont || fonts.headingFont,
        bodyFont: richDataJson.fonts.bodyFont || fonts.bodyFont,
        fontshareSuggestions: richDataJson.fonts.fontshareSuggestions || fonts.fontshareSuggestions
      };
    }
    if (richDataJson.recommendations) {
      recommendations = richDataJson.recommendations;
    }
  }

  // 7. Dynamic SEO calculations
  const passedChecks: SeoIssue[] = [];
  const issues: SeoIssue[] = [];
  const seoSuggestions: string[] = [];

  // Title check
  if (title && title.length > 5) {
    passedChecks.push({
      checkName: "Page Title",
      message: `Title exists and has viable length: "${title}" (${title.length} chars).`,
      type: "passed",
      impact: "High"
    });
  } else {
    issues.push({
      checkName: "Page Title",
      message: "The page has no title, or the title is dangerously short for SEO indexability.",
      type: "error",
      impact: "High"
    });
    seoSuggestions.push("Create a clear title tag under 60 characters with keyword relevancy.");
  }

  // Description check
  if (description && description.length > 25) {
    passedChecks.push({
      checkName: "Meta Description",
      message: `Meta description is present: ${description.slice(0, 80)}...`,
      type: "passed",
      impact: "High"
    });
  } else {
    issues.push({
      checkName: "Meta Description",
      message: "Meta Description tag is absent or too sparse to drive organic CTR click benefits.",
      type: "warning",
      impact: "High"
    });
    seoSuggestions.push("Add a descriptive <meta name='description'> containing 120-160 characters.");
  }

  // Viewport
  const viewport = $('meta[name="viewport"]').attr("content");
  if (viewport) {
    passedChecks.push({
      checkName: "Mobile Viewport Node",
      message: "A mobile-responsive viewport definition node is active.",
      type: "passed",
      impact: "High"
    });
  } else {
    issues.push({
      checkName: "Mobile Viewport Node",
      message: "Missing mobile responsive viewport viewport tags in document scope.",
      type: "error",
      impact: "High"
    });
    seoSuggestions.push("Ensure <meta name='viewport' content='width=device-width, initial-scale=1.0'> resides in document head.");
  }

  // Heading check
  const h1 = $("h1");
  if (h1.length === 1) {
    passedChecks.push({
      checkName: "H1 Heading Node Count",
      message: "Exactly one primary structural H1 heading is registered on the layout.",
      type: "passed",
      impact: "Medium"
    });
  } else if (h1.length > 1) {
    issues.push({
      checkName: "H1 Heading Node Count",
      message: `Detected multiple H1 headers (${h1.length}) which splits search crawling indexing weight.`,
      type: "warning",
      impact: "Medium"
    });
    seoSuggestions.push("Structure your layout hierarchy with exactly 1 primary H1 heading block.");
  } else {
    issues.push({
      checkName: "H1 Heading Node Count",
      message: "No standard heading element (H1 tag) found in HTML body.",
      type: "error",
      impact: "High"
    });
    seoSuggestions.push("Nest an elegant page title using an H1 header tag in early body sections.");
  }

  // H2 tags
  const h2Count = $("h2").length;
  if (h2Count > 0) {
    passedChecks.push({
      checkName: "H2 Section Nodes",
      message: `Great hierarchical organization with ${h2Count} subsection H2 tags.`,
      type: "passed",
      impact: "Low"
    });
  } else {
    issues.push({
      checkName: "H2 Section Nodes",
      message: "No H2 layout tags are defined on this document. Subsections lack clear structural separation.",
      type: "warning",
      impact: "Low"
    });
  }

  // Canonical tag check
  const canonical = $('link[rel="canonical"]').attr("href");
  if (canonical) {
    passedChecks.push({
      checkName: "Canonical URL",
      message: `Canonical link confirms correct indexing scope: "${canonical}"`,
      type: "passed",
      impact: "Medium"
    });
  } else {
    issues.push({
      checkName: "Canonical URL",
      message: "Canonical reference links are absent. Duplicate traffic paths could degrade index health.",
      type: "warning",
      impact: "Medium"
    });
  }

  // Open Graph
  const ogTitle = $('meta[property="og:title"]').attr("content");
  if (ogTitle) {
    passedChecks.push({
      checkName: "Open Graph Tags",
      message: "Social graph indexing headers (og:title / og:image) are active and configured.",
      type: "passed",
      impact: "Medium"
    });
  } else {
    issues.push({
      checkName: "Open Graph Tags",
      message: "No social Open Graph formatting configuration found.",
      type: "warning",
      impact: "Medium"
    });
  }

  // Alternative text on images ratio
  const totalImgs = $("img").length;
  let imgsWithAlt = 0;
  $("img").each((i, el) => {
    if ($(el).attr("alt")) imgsWithAlt++;
  });

  if (totalImgs === 0) {
    passedChecks.push({
      checkName: "Image ALT tags",
      message: "No visual images detected, skipping alt checks.",
      type: "passed",
      impact: "Medium"
    });
  } else {
    const ratio = Math.round((imgsWithAlt / totalImgs) * 100);
    if (ratio >= 80) {
      passedChecks.push({
        checkName: "Image ALT tags",
        message: `${ratio}% of images contain descriptive alt text tag properties. Excellent!`,
        type: "passed",
        impact: "Medium"
      });
    } else {
      issues.push({
        checkName: "Image ALT tags",
        message: `Only ${ratio}% of layout images contain alternative text tags (${imgsWithAlt}/${totalImgs}).`,
        type: "warning",
        impact: "Medium"
      });
      seoSuggestions.push("Audit inline website graphics and append custom 'alt' attributes.");
    }
  }

  // SEO score computation
  const baseSeoScore = Math.max(30, 100 - (issues.filter(i => i.impact === "High").length * 15) - (issues.filter(i => i.impact === "Medium").length * 8) - (issues.filter(i => i.impact === "Low").length * 4));

  const seo: SeoData = {
    score: baseSeoScore,
    passed: passedChecks,
    issues,
    suggestions: seoSuggestions.length > 0 ? seoSuggestions : ["Excellent indexing foundation. Continue utilizing descriptive anchor tag texts."]
  };

  // 8. Performance scoring & size estimates
  const htmlWeightKb = Math.round((responseText.length / 1024) * 10) / 10;
  
  // Custom estimated load metric (simulated cleanly)
  // Base time: 0.1s + 0.1s per external JS file + 0.05s per CSS file + html size / 150
  const calculatedLoadSec = Math.round((0.15 + (jsFiles.length * 0.08) + (cssFiles.length * 0.04) + (htmlWeightKb / 300)) * 100) / 100;

  const basePerfScore = Math.max(40, Math.min(100, Math.round(100 - (htmlWeightKb / 8) - (jsFiles.length * 4) - (cssFiles.length * 3))));

  const performance: PerformanceData = {
    score: basePerfScore,
    loadTime: `${calculatedLoadSec}s`,
    pageSize: `${htmlWeightKb} KB`,
    requestCount: uniqueImages.length + jsFiles.length + cssFiles.length + 1,
    cssFileCount: cssFiles.length,
    jsFileCount: jsFiles.length,
    imageCount: uniqueImages.length
  };

  // 9. Final global aesthetic score aggregator
  const finalScore = Math.round((seo.score + performance.score) / 2);

  // 10. Interactive Screenshot Simulator generator (SVG based Base64 vector mockups)
  const defaultPageColors = {
    primary: theme.primaryColor,
    secondary: theme.secondaryColor,
    bg: theme.backgroundColor || "#FFFFFF",
    text: theme.textColor || "#0F172A"
  };

  // Build simulated desktop mockup SVG
  const desktopSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%" style="font-family: system-ui, sans-serif;">
    <rect width="800" height="500" fill="#F1F5F9" />
    <rect x="20" y="20" width="760" height="460" rx="8" fill="${defaultPageColors.bg}" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.05))" />
    
    <!-- Titlebar Bezel -->
    <rect x="20" y="20" width="760" height="35" rx="8" fill="#F8FAFC" />
    <circle cx="40" cy="38" r="5" fill="#EF4444" />
    <circle cx="55" cy="38" r="5" fill="#F59E0B" />
    <circle cx="70" cy="38" r="5" fill="#10B981" />
    <rect x="100" y="28" width="500" height="20" rx="4" fill="#E2E8F0" />
    <text x="110" y="42" font-size="10" fill="#94A3B8">${overview.domain}</text>
    
    <!-- Mock Browser Header Layout -->
    <rect x="40" y="80" width="100" height="25" rx="4" fill="${defaultPageColors.primary}" />
    <text x="47" y="96" font-size="11" font-weight="bold" fill="#ffffff">${title.slice(0, 10)}</text>
    
    <rect x="600" y="80" width="60" height="25" rx="4" fill="#E2E8F0" />
    <rect x="670" y="80" width="80" height="25" rx="4" fill="${defaultPageColors.secondary}" />
    
    <!-- Mock Hero -->
    <text x="40" y="160" font-size="28" font-weight="bold" fill="${defaultPageColors.text}">${title.slice(0, 32)}</text>
    <text x="40" y="200" font-size="14" fill="#64748B">${description.slice(0, 75)}...</text>
    
    <rect x="40" y="240" width="140" height="40" rx="8" fill="${defaultPageColors.primary}" />
    <rect x="195" y="240" width="140" height="40" rx="8" fill="#F1F5F9" />
    
    <!-- Layout Illustration Grid -->
    <rect x="40" y="310" width="220" height="130" rx="6" fill="#F8FAFC" />
    <rect x="280" y="310" width="220" height="130" rx="6" fill="#F8FAFC" />
    <rect x="520" y="310" width="220" height="130" rx="6" fill="#F8FAFC" />
    
    <!-- Miniature Details Inside Cards -->
    <circle cx="150" cy="360" r="25" fill="${defaultPageColors.primary}" opacity="0.1" />
    <rect x="60" y="405" width="180" height="12" rx="2" fill="#E2E8F0" />
    
    <circle cx="390" cy="360" r="25" fill="${defaultPageColors.secondary}" opacity="0.1" />
    <rect x="300" y="405" width="180" height="12" rx="2" fill="#E2E8F0" />
    
    <circle cx="630" cy="360" r="25" fill="${defaultPageColors.primary}" opacity="0.05" />
    <rect x="540" y="405" width="180" height="12" rx="2" fill="#E2E8F0" />
  </svg>
  `;

  // Build simulated mobile mockup SVG
  const mobileSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 500" width="100%" height="100%" style="font-family: system-ui, sans-serif;">
    <rect width="320" height="500" fill="#E2E8F0" rx="16" />
    <rect x="10" y="10" width="300" height="480" rx="12" fill="${defaultPageColors.bg}" />
    
    <!-- Top Camera Notch Bezel -->
    <rect x="90" y="15" width="140" height="18" rx="8" fill="#1E293B" />
    <circle cx="210" cy="24" r="3" fill="#475569" />
    
    <!-- Mobile Header Navigation template -->
    <rect x="25" y="55" width="80" height="20" rx="4" fill="${defaultPageColors.primary}" />
    <rect x="260" y="55" width="30" height="18" rx="2" fill="#E2E8F0" />
    <line x1="265" y1="60" x2="285" y2="60" stroke="#64748B" stroke-width="2" />
    <line x1="265" y1="64" x2="285" y2="64" stroke="#64748B" stroke-width="2" />
    
    <!-- Mobile Hero typography -->
    <text x="25" y="120" font-size="18" font-weight="bold" fill="${defaultPageColors.text}">${title.slice(0, 24)}</text>
    <text x="25" y="150" font-size="11" fill="#64748B">${description.slice(0, 60)}...</text>
    
    <!-- Actions stack -->
    <rect x="25" y="195" width="270" height="35" rx="6" fill="${defaultPageColors.primary}" />
    <rect x="25" y="240" width="270" height="35" rx="6" fill="#F1F5F9" />
    
    <!-- Simple Mock Cards vertical -->
    <rect x="25" y="300" width="270" height="80" rx="6" fill="#F8FAFC" />
    <rect x="40" y="320" width="40" height="40" rx="4" fill="${defaultPageColors.secondary}" opacity="0.2" />
    <rect x="95" y="325" width="170" height="10" rx="2" fill="#64748B" opacity="0.4" />
    <rect x="95" y="345" width="100" height="8" rx="2" fill="#E2E8F0" />

    <rect x="25" y="395" width="270" height="80" rx="6" fill="#F8FAFC" />
    <rect x="40" y="415" width="40" height="40" rx="4" fill="${defaultPageColors.primary}" opacity="0.2" />
    <rect x="95" y="420" width="170" height="10" rx="2" fill="#64748B" opacity="0.4" />
    <rect x="95" y="440" width="100" height="8" rx="2" fill="#E2E8F0" />
  </svg>
  `;

  // Mini browser layout mockup SVG for Full Page Preview
  const fullPageSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 1000" width="100%" height="100%" style="font-family: system-ui, sans-serif;">
    <rect width="500" height="1000" fill="${defaultPageColors.bg}" />
    
    <!-- header -->
    <rect width="500" height="60" fill="#F8FAFC" />
    <rect x="20" y="18" width="80" height="24" rx="4" fill="${defaultPageColors.primary}" />
    <circle cx="450" cy="30" r="12" fill="#E2E8F0" />
    
    <!-- hero block -->
    <text x="40" y="140" font-size="28" font-weight="bold" fill="${defaultPageColors.text}">${title.slice(0, 36)}</text>
    <text x="40" y="180" font-size="14" fill="#64748B">${description.slice(0, 100)}...</text>
    <rect x="40" y="210" width="130" height="35" rx="6" fill="${defaultPageColors.primary}" />
    
    <!-- dynamic layout panels -->
    <rect x="40" y="280" width="420" height="180" rx="8" fill="#F1F5F9" />
    <rect x="60" y="300" width="380" height="20" rx="4" fill="#94A3B8" opacity="0.3" />
    <rect x="60" y="335" width="200" height="15" rx="4" fill="#CBD5E1" />
    
    <!-- widgets -->
    <rect x="40" y="490" width="200" height="150" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
    <rect x="260" y="490" width="200" height="150" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
    <rect x="40" y="660" width="420" height="150" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
    
    <!-- footer -->
    <rect y="850" width="500" height="150" fill="#1E293B" />
    <text x="40" y="900" font-size="12" fill="#94A3B8">© 2026 ${overview.domain}. All rights reserved.</text>
    <rect x="40" y="920" width="150" height="15" rx="4" fill="#334155" />
    <rect x="40" y="945" width="220" height="10" rx="2" fill="#334155" />
  </svg>
  `;

  const screenshots: ScreenshotsData = {
    desktop: `data:image/svg+xml;utf8,${encodeURIComponent(desktopSvg)}`,
    mobile: `data:image/svg+xml;utf8,${encodeURIComponent(mobileSvg)}`,
    fullPage: `data:image/svg+xml;utf8,${encodeURIComponent(fullPageSvg)}`
  };

  return {
    url,
    overview,
    source,
    theme,
    fonts,
    images: uniqueImages,
    technologies: detectedTechs,
    seo,
    performance,
    screenshots,
    finalScore,
    recommendations
  };
}
