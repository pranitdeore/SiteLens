/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface OverviewData {
  title: string;
  description: string;
  favicon: string;
  domain: string;
  canonicalUrl: string;
  status: number;
  finalUrl: string;
}

export interface MetaTagInfo {
  name: string;
  property: string;
  content: string;
}

export interface SourceData {
  html: string;
  cssFiles: string[];
  jsFiles: string[];
  metaTags: MetaTagInfo[];
  inlineStyleCount: number;
  inlineScriptCount: number;
}

export interface ColorItem {
  hex: string;
  count: number;
  type: string; // 'Primary', 'Background', 'Text', 'Accent', or general 'Detected'
  description?: string;
}

export interface ThemeData {
  colors: ColorItem[];
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  themeType: string; // 'Light', 'Dark', 'Colorful', 'Minimal', etc.
  designStyle: string; // 'SaaS', 'Modern Corporate', 'Minimalist Editorial', etc.
}

export interface FontInfo {
  name: string;
  family: string;
  fallback: string;
  source: string; // e.g. "Google Fonts", "System font", "Stylesheet"
  selector: string; // selector where found, e.g. "body", "h1"
  type: 'system' | 'google' | 'fontshare' | 'adobe' | 'custom' | 'unknown';
}

export interface FontshareSuggestion {
  detectedFont: string;
  alternatives: {
    name: string;
    description: string;
    downloadUrl: string;
    searchUrl: string;
    type: 'heading' | 'body' | 'monospace';
  }[];
}

export interface FontsData {
  detected: FontInfo[];
  headingFont: string;
  bodyFont: string;
  fontshareSuggestions: FontshareSuggestion[];
}

export interface ImageData {
  src: string;
  alt: string;
  type: string; // e.g. "png", "svg", "jpeg"
  sourceTag: string; // e.g. "<img>", "background-image", "favicon"
  broken: boolean;
  dimensions?: string; // e.g. "800x600"
  loading?: string; // e.g. "lazy"
  warning?: string;
}

export interface TechnologyItem {
  name: string;
  category: string; // e.g. 'Framework', 'Styling', 'Analytics', 'Library'
  confidence: number; // 0-100
  badgeColor: string; // gradient CSS or Tailwind color
  icon?: string;
}

export interface SeoIssue {
  checkName: string;
  message: string;
  type: 'passed' | 'warning' | 'error';
  impact: 'High' | 'Medium' | 'Low';
}

export interface SeoData {
  score: number;
  passed: SeoIssue[];
  issues: SeoIssue[];
  suggestions: string[];
}

export interface PerformanceData {
  score: number;
  loadTime: string;
  pageSize: string;
  requestCount: number;
  cssFileCount: number;
  jsFileCount: number;
  imageCount: number;
}

export interface ScreenshotsData {
  desktop: string; // Data URL or SVG string
  mobile: string;
  fullPage: string;
}

export interface RecommendationItem {
  category: 'SEO' | 'Performance' | 'Design' | 'Fonts' | 'Security';
  type: 'High' | 'Medium' | 'Low';
  title: string;
  message: string;
}

export interface AnalysisReport {
  url: string;
  overview: OverviewData;
  source: SourceData;
  theme: ThemeData;
  fonts: FontsData;
  images: ImageData[];
  technologies: TechnologyItem[];
  seo: SeoData;
  performance: PerformanceData;
  screenshots: ScreenshotsData;
  finalScore: number;
  recommendations: RecommendationItem[];
}
