"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types";
import {
  ArrowLeft,
  FileJson,
  Download,
  RefreshCw,
  Trash2,
  Palette,
  LayoutGrid,
  ChevronRight,
  AlertCircle,
  Accessibility,
  Laptop,
  Check,
} from "lucide-react";

interface SectionDetail {
  name: string;
  order: number;
  components: string[];
  spacing: string;
  layout: string;
  cta: string;
  images: string[];
  icons: string[];
  forms: string[];
}

interface PageWireframe {
  name: string;
  purpose: string;
  layout: {
    style: string;
    grid: string;
    spacing: string;
    containers: string;
  };
  hero: {
    headline: string;
    subheadlinePosition: string;
    buttons: string[];
    background: string;
    illustrationPosition: string;
    imagePosition: string;
    trustBadges: string[];
    statistics: string[];
  };
  sections: SectionDetail[];
  navigation: {
    placement: string;
    items: string[];
  };
  footer: {
    placement: string;
    items: string[];
  };
}

interface WireframeData {
  pages: PageWireframe[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    background: string;
    text: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    buttonFont: string;
    letterSpacing: string;
    lineHeight: string;
    fontWeight: string;
  };
  designTokens: {
    borderRadius: string;
    spacingScale: string;
    elevation: string;
    shadow: string;
    glassEffect: string;
    gradient: string;
    roundedComponents: string[];
  };
  components: Array<{
    name: string;
    structure: string;
    style: string;
  }>;
  designStyle: string;
  responsive: {
    desktop: string;
    laptop: string;
    tablet: string;
    mobile: string;
  };
  animations: {
    fade: string;
    slide: string;
    scale: string;
    hover: string;
    pageTransition: string;
    loadingAnimation: string;
    scrollAnimation: string;
  };
  accessibility: {
    contrastRatio: string;
    keyboardNavigation: string;
    ariaSuggestions: string[];
    focusOrder: string[];
    altTextRecommendations: string;
  };
}

interface WireframeHistory {
  version: number;
  wireframeData: WireframeData;
  generatedAt: string;
}

interface Wireframe {
  _id: string;
  userId: string;
  blueprintId: {
    _id: string;
    consultationId: {
      _id: string;
      answers: {
        businessName: string;
      };
    } | null;
  } | null;
  status: string;
  version: number;
  wireframeData: WireframeData | null;
  history: WireframeHistory[];
  createdAt: string;
  updatedAt: string;
}

type TabType = "pages" | "tokens" | "components" | "accessibility" | "json";

export default function WireframeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [wireframe, setWireframe] = useState<Wireframe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("pages");
  const [regenerating, setRegenerating] = useState(false);
  const [compareVersion, setCompareVersion] = useState<number | null>(null);
  const [selectedPage, setSelectedPage] = useState<string>("Home");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const fetchWireframe = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient<ApiResponse<Wireframe>>(`/wireframe/${params.id}`);
      if (res.success && res.data) {
        setWireframe(res.data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load wireframe details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchWireframe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleRegenerate = async () => {
    if (!wireframe) return;
    setRegenerating(true);
    setError(null);
    try {
      const res = await apiClient<ApiResponse<Wireframe>>("/wireframe/regenerate", {
        method: "PUT",
        body: JSON.stringify({ wireframeId: wireframe._id }),
      });
      if (res.success && res.data) {
        setWireframe(res.data);
        setCompareVersion(null); // Reset compare view
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Regeneration failed.");
    } finally {
      setRegenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!wireframe || !confirm("Delete this UI/UX wireframe design?")) return;
    try {
      await apiClient(`/wireframe/${wireframe._id}`, { method: "DELETE" });
      router.push("/dashboard/wireframe");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  const handleDownloadJSON = () => {
    if (!activeData) return;
    const blob = new Blob([JSON.stringify(activeData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const businessName =
      wireframe?.blueprintId?.consultationId?.answers?.businessName || "wireframe";
    link.href = url;
    link.download = `${businessName.toLowerCase().replace(/\s+/g, "_")}_wireframe_v${
      compareVersion || wireframe?.version
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 uppercase tracking-wider">Loading Wireframe Details...</p>
      </div>
    );
  }

  if (error || !wireframe) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <h3 className="text-white font-bold">Failed to load UI/UX Wireframe</h3>
        <p className="text-slate-400 text-xs max-w-sm">{error || "Record not found."}</p>
        <Link
          href="/dashboard/wireframe"
          className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-white border border-slate-700 hover:bg-slate-700 transition-colors"
        >
          Back to Wireframes
        </Link>
      </div>
    );
  }

  // Determine active data payload (switch history versions if active)
  const activeData =
    compareVersion && compareVersion !== wireframe.version
      ? wireframe.history.find((h) => h.version === compareVersion)?.wireframeData
      : wireframe.wireframeData;

  const projectTitle =
    wireframe.blueprintId?.consultationId?.answers?.businessName || "Unnamed Project";

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800/60">
        <div className="space-y-1">
          <Link
            href="/dashboard/wireframe"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to list
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-white text-lg tracking-tight">
              {projectTitle}
            </h1>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400">
              v{compareVersion || wireframe.version}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Design Style: <span className="text-indigo-400 font-bold">{activeData?.designStyle || "Modern"}</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Version Switcher */}
          {wireframe.history.length > 0 && (
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase px-2">History:</span>
              <select
                value={compareVersion || wireframe.version}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCompareVersion(val === wireframe.version ? null : val);
                }}
                className="bg-transparent text-xs text-white focus:outline-none pr-2 cursor-pointer font-semibold"
              >
                <option value={wireframe.version} className="bg-slate-950 text-white">
                  v{wireframe.version} (Active)
                </option>
                {wireframe.history.map((h) => (
                  <option key={h.version} value={h.version} className="bg-slate-950 text-white">
                    v{h.version} ({new Date(h.generatedAt).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="h-4 w-4" /> Download JSON
          </button>

          <button
            onClick={handleRegenerate}
            disabled={regenerating || wireframe.status === "pending"}
            className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-semibold text-white transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
            {regenerating ? "Regenerating..." : "Regenerate"}
          </button>

          <button
            onClick={handleDelete}
            className="p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-red-500/20 transition-colors"
            title="Delete Wireframe"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* ── Tab Selector ── */}
      <div className="flex border-b border-slate-800">
        {[
          { id: "pages", label: "Pages Layout", icon: LayoutGrid },
          { id: "tokens", label: "Design Tokens", icon: Palette },
          { id: "components", label: "Components & Animations", icon: Laptop },
          { id: "accessibility", label: "Accessibility & Compliance", icon: Accessibility },
          { id: "json", label: "JSON Structure", icon: FileJson },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-semibold transition-all -mb-px ${
                activeTab === tab.id
                  ? "border-indigo-500 text-white bg-indigo-500/5"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content Workspace ── */}
      <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6">
        {!activeData ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <AlertCircle className="h-10 w-10 text-amber-400 animate-pulse mb-2" />
            <p className="text-sm font-bold text-slate-300">Wireframe Generation Failed or Incomplete</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Click Regenerate above to generate layout blueprints and typography models using AI.
            </p>
          </div>
        ) : (
          <>
            {/* TAB: Pages Layout */}
            {activeTab === "pages" && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Page Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-1 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-3 tracking-wider">
                    Website Pages
                  </h3>
                  {activeData.pages.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => setSelectedPage(p.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        selectedPage === p.name
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                      }`}
                    >
                      {p.name}
                      <ChevronRight className="h-3 w-3 opacity-60" />
                    </button>
                  ))}
                </div>

                {/* Selected Page Details Panel */}
                <div className="lg:col-span-3 space-y-6">
                  {(() => {
                    const page = activeData.pages.find((p) => p.name === selectedPage);
                    if (!page) {
                      return <p className="text-xs text-slate-500">Select a page to view visual layouts.</p>;
                    }
                    return (
                      <div className="space-y-6">
                        {/* Page Meta Info */}
                        <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/50">
                          <h2 className="text-base font-bold text-white font-display mb-1">{page.name} Page</h2>
                          <p className="text-xs text-slate-400 leading-relaxed">{page.purpose}</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-800/60 text-[11px]">
                            <div>
                              <span className="text-slate-500 block uppercase font-bold tracking-wider text-[9px]">Layout Style</span>
                              <span className="text-indigo-400 font-semibold">{page.layout?.style || "Full Width"}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block uppercase font-bold tracking-wider text-[9px]">Containers</span>
                              <span className="text-white font-semibold">{page.layout?.containers || "Responsive"}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block uppercase font-bold tracking-wider text-[9px]">Spacing Scale</span>
                              <span className="text-white font-semibold">{page.layout?.spacing || "Standard"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Page Hero Section Structure */}
                        {page.hero && (
                          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/20 space-y-4">
                            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Hero Section Design</h3>
                            <div className="space-y-2">
                              <p className="text-xs font-bold text-white">Headline recommendation:</p>
                              <blockquote className="border-l-2 border-indigo-500 pl-3 py-1 text-xs italic text-slate-300">
                                &ldquo;{page.hero.headline}&rdquo;
                              </blockquote>
                              <p className="text-[11px] text-slate-400">
                                Subheadline placement: <span className="text-white">{page.hero.subheadlinePosition || "Below headline"}</span>
                              </p>
                              <p className="text-[11px] text-slate-400">
                                Background illustration: <span className="text-white">{page.hero.background}</span>
                              </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] pt-2">
                              <div>
                                <span className="text-slate-500 uppercase font-bold text-[9px]">Hero Buttons</span>
                                <ul className="list-disc pl-4 text-slate-300 mt-1 space-y-0.5">
                                  {page.hero.buttons?.map((b, i) => <li key={i}>{b}</li>)}
                                </ul>
                              </div>
                              <div>
                                <span className="text-slate-500 uppercase font-bold text-[9px]">Badges & Trust Badges</span>
                                <ul className="list-disc pl-4 text-slate-300 mt-1 space-y-0.5">
                                  {page.hero.trustBadges?.map((b, i) => <li key={i}>{b}</li>)}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Page Section Order Stack */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Sections Layout Stack</h3>
                          <div className="space-y-3">
                            {page.sections?.map((sec, idx) => (
                              <div
                                key={idx}
                                className="flex gap-4 p-4 rounded-xl border border-slate-800/80 bg-slate-900/20 text-xs"
                              >
                                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400">
                                  {sec.order || idx + 1}
                                </span>
                                <div className="space-y-2 flex-1">
                                  <div className="flex justify-between">
                                    <h4 className="font-bold text-white">{sec.name}</h4>
                                    <span className="text-[10px] text-slate-500 font-semibold">{sec.spacing}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {sec.components?.map((c, i) => (
                                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-semibold">
                                        {c}
                                      </span>
                                    ))}
                                  </div>
                                  <p className="text-[11px] text-slate-400">
                                    Grid layout: <span className="text-white">{sec.layout}</span>
                                  </p>
                                  {sec.cta && (
                                    <p className="text-[11px] text-slate-500">
                                      Action: <span className="text-emerald-400">{sec.cta}</span>
                                    </p>
                                  )}
                                  {sec.forms && sec.forms.length > 0 && (
                                    <div className="pt-1 text-[11px]">
                                      <span className="text-slate-500 font-bold block">Forms field specs:</span>
                                      <span className="text-slate-300">{sec.forms.join(", ")}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* TAB: Design Tokens */}
            {activeTab === "tokens" && (
              <div className="space-y-8">
                {/* 1. Color Palette HEX */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">HEX Design Token Colors</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {Object.entries(activeData.colors || {}).map(([key, hex]) => (
                      <div
                        key={key}
                        onClick={() => handleCopyColor(hex)}
                        className="group relative cursor-pointer p-3 rounded-xl border border-slate-800 bg-slate-950/20 text-center space-y-2 hover:border-indigo-500/40 transition-all"
                      >
                        <div
                          className="h-10 w-full rounded-lg shadow-inner"
                          style={{ backgroundColor: hex }}
                        />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 capitalize">{key}</p>
                          <p className="text-[11px] font-mono text-white font-semibold">{hex}</p>
                        </div>
                        {/* Copy Indicator */}
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                          {copiedColor === hex ? (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                              <Check className="h-3 w-3" /> Copied
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold">Click to copy</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Typography tokens */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Typography Fonts & Scales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/10 space-y-2">
                      <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wider block">Heading Font</span>
                      <p className="text-base font-bold text-white font-display">{activeData.typography?.headingFont || "Outfit"}</p>
                      <p className="text-[11px] text-slate-400">Heading typography token rules</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/10 space-y-2">
                      <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wider block">Body Font</span>
                      <p className="text-base font-bold text-white font-body">{activeData.typography?.bodyFont || "Inter"}</p>
                      <p className="text-[11px] text-slate-400">Paragraph and body text font mapping</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/10 space-y-2">
                      <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wider block">Button Font</span>
                      <p className="text-base font-bold text-white font-body">{activeData.typography?.buttonFont || "Inter"}</p>
                      <p className="text-[11px] text-slate-400">Action items text parameters</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/10 text-xs grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-400">
                    <p>Letter Spacing: <span className="text-white font-semibold">{activeData.typography?.letterSpacing}</span></p>
                    <p>Line Heights: <span className="text-white font-semibold">{activeData.typography?.lineHeight}</span></p>
                    <p>Font Weights: <span className="text-white font-semibold">{activeData.typography?.fontWeight}</span></p>
                  </div>
                </div>

                {/* 3. Design system spacing/effects */}
                {activeData.designTokens && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Spacing & Visual Effects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-400">
                      <div className="space-y-2 bg-slate-950/10 p-4 rounded-xl border border-slate-800/60">
                        <p>Border Radius: <span className="text-white font-bold">{activeData.designTokens.borderRadius}</span></p>
                        <p>Spacing Steps: <span className="text-white font-semibold">{activeData.designTokens.spacingScale}</span></p>
                        <p>Elevation (Z-Index): <span className="text-white font-semibold">{activeData.designTokens.elevation}</span></p>
                        <p>Box Shadows: <span className="text-white font-semibold">{activeData.designTokens.shadow}</span></p>
                      </div>
                      <div className="space-y-2 bg-slate-950/10 p-4 rounded-xl border border-slate-800/60">
                        <p>Glassmorphic blur: <span className="text-white font-semibold">{activeData.designTokens.glassEffect}</span></p>
                        <p>Primary gradients: <span className="text-white font-semibold">{activeData.designTokens.gradient}</span></p>
                        <div className="pt-2">
                          <span className="text-slate-500 font-bold block text-[9px] uppercase tracking-wider mb-1">Rounded Elements</span>
                          <div className="flex flex-wrap gap-1">
                            {activeData.designTokens.roundedComponents?.map((rc, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                                {rc}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Components & Animations */}
            {activeTab === "components" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual components tree */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">UI Component Structure</h3>
                  <div className="space-y-3">
                    {activeData.components?.map((c, i) => (
                      <div key={i} className="p-4 rounded-xl border border-slate-800 bg-slate-950/10 text-xs">
                        <h4 className="font-bold text-indigo-400 mb-1">{c.name}</h4>
                        <p className="text-slate-300 mb-2 leading-relaxed">{c.structure}</p>
                        <p className="text-slate-500 italic">Style rule: {c.style}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Animation details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Animations Plan</h3>
                  <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-950/10 text-xs">
                    {Object.entries(activeData.animations || {}).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-start p-4">
                        <span className="font-bold text-slate-400 capitalize">{key}</span>
                        <span className="text-white text-right max-w-xs">{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Responsive viewport layout settings */}
                  {activeData.responsive && (
                    <div className="mt-6 space-y-3">
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Viewport Responsive Breakpoints</h3>
                      <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
                        <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/80">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Desktop</span>
                          <span className="text-slate-200 mt-1 block">{activeData.responsive.desktop}</span>
                        </div>
                        <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/80">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Laptop</span>
                          <span className="text-slate-200 mt-1 block">{activeData.responsive.laptop}</span>
                        </div>
                        <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/80">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Tablet</span>
                          <span className="text-slate-200 mt-1 block">{activeData.responsive.tablet}</span>
                        </div>
                        <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/80">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Mobile</span>
                          <span className="text-slate-200 mt-1 block">{activeData.responsive.mobile}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: Accessibility & Compliance */}
            {activeTab === "accessibility" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Accessibility Specifications</h3>
                  <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/20 space-y-4">
                    <div>
                      <span className="text-slate-500 font-bold block text-[9px] uppercase tracking-wider mb-1">Contrast Ratio targets</span>
                      <p className="text-slate-200">{activeData.accessibility?.contrastRatio}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold block text-[9px] uppercase tracking-wider mb-1">Alt text recommendations</span>
                      <p className="text-slate-200">{activeData.accessibility?.altTextRecommendations}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold block text-[9px] uppercase tracking-wider mb-1">Keyboard Navigation support</span>
                      <p className="text-slate-200">{activeData.accessibility?.keyboardNavigation}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Focus order & ARIA guidelines</h3>
                  <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/20 space-y-4">
                    <div>
                      <span className="text-slate-500 font-bold block text-[9px] uppercase tracking-wider mb-2">Focus order (Interactive elements order)</span>
                      <div className="flex flex-wrap gap-1">
                        {activeData.accessibility?.focusOrder?.map((fo, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                            {idx + 1}. {fo}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold block text-[9px] uppercase tracking-wider mb-2">ARIA attributes mapping suggestions</span>
                      <ul className="list-disc pl-4 text-slate-300 space-y-1">
                        {activeData.accessibility?.ariaSuggestions?.map((sg, idx) => (
                          <li key={idx}>{sg}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: JSON Structure */}
            {activeTab === "json" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Raw Wireframe Output Payload</h3>
                  <button
                    onClick={handleDownloadJSON}
                    className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <Download className="h-3 w-3" /> Download file
                  </button>
                </div>
                <pre className="text-xs text-emerald-400 bg-slate-950 p-5 rounded-xl border border-slate-800/80 max-h-[600px] overflow-y-auto font-mono whitespace-pre-wrap">
                  {JSON.stringify(activeData, null, 2)}
                </pre>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
