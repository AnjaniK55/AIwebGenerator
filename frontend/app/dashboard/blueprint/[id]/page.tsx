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
  ListTodo,
  Palette,
  LayoutGrid,
  FileSearch,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Code2,
} from "lucide-react";

interface PageDetail {
  name: string;
  purpose: string;
  sections: string[];
  components: string[];
  content: string;
  buttons: string[];
  images: string[];
  forms: string[];
  seoImportance: string;
}

interface BlueprintData {
  websiteType: string;
  websiteGoal: string;
  pages: PageDetail[];
  components: string[];
  navigation: {
    headerMenu: string[];
    footerLinks: string[];
    quickLinks: string[];
    ctaButtons: string[];
  };
  design: {
    style: string;
    icons: string;
    animations: {
      scroll: string;
      hover: string;
      transitions: string;
    };
    images: {
      style: string;
    };
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    buttonColors: {
      primary: string;
      hover: string;
    };
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    sizes: Record<string, string>;
    spacing: string;
  };
  features: string[];
  database: {
    collections: string[];
    relationships: string[];
    indexes: string[];
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    og: Record<string, string>;
    twitter: Record<string, string>;
    schema: string[];
  };
  performance: string[];
  responsive: string[];
  futureRecommendations: string[];
}

interface BlueprintHistory {
  version: number;
  blueprintData: BlueprintData;
  generatedAt: string;
}

interface Blueprint {
  _id: string;
  userId: string;
  consultationId: {
    _id: string;
    answers: {
      businessName: string;
    };
  } | null;
  status: string;
  version: number;
  blueprintData: BlueprintData | null;
  history: BlueprintHistory[];
  createdAt: string;
  updatedAt: string;
}

type TabType = "overview" | "design" | "architecture" | "strategy";

export default function BlueprintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [regenerating, setRegenerating] = useState(false);
  const [compareVersion, setCompareVersion] = useState<number | null>(null);

  const fetchBlueprint = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient<ApiResponse<Blueprint>>(`/blueprint/${params.id}`);
      if (res.success && res.data) {
        setBlueprint(res.data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load website blueprint details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchBlueprint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleDownloadJSON = () => {
    if (!blueprint?.blueprintData) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blueprint.blueprintData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `website_blueprint_${blueprint.consultationId?.answers?.businessName || "project"}_v${blueprint.version}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleRegenerate = async () => {
    if (!blueprint) return;
    setRegenerating(true);
    setError(null);
    try {
      const res = await apiClient<ApiResponse<Blueprint>>("/blueprint/regenerate", {
        method: "PUT",
        body: JSON.stringify({ blueprintId: blueprint._id }),
      });
      if (res.success && res.data) {
        setBlueprint(res.data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Regeneration request failed.");
    } finally {
      setRegenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!blueprint) return;
    if (!confirm("Delete this website blueprint permanently?")) return;
    try {
      await apiClient(`/blueprint/${blueprint._id}`, { method: "DELETE" });
      router.push("/dashboard/blueprint");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-12 w-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <p className="text-xs text-slate-400 uppercase tracking-wider">Parsing blueprint data...</p>
      </div>
    );
  }

  if (error || !blueprint || !blueprint.blueprintData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <h2 className="text-white font-bold text-lg">Load Failed</h2>
        <p className="text-slate-400 text-sm max-w-sm">{error || "No blueprint details available."}</p>
        <Link href="/dashboard/blueprint" className="text-xs text-indigo-400 font-semibold hover:underline">
          Back to blueprints
        </Link>
      </div>
    );
  }

  const data = blueprint.blueprintData;
  const businessName = blueprint.consultationId?.answers?.businessName || "Unnamed Project";

  // Comparison version select handler
  const selectedHistory = blueprint.history.find((h) => h.version === compareVersion);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/dashboard/blueprint" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Blueprints
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <FileJson className="h-5 w-5 text-white" />
            </span>
            <div>
              <h2 className="font-display font-bold text-white text-lg tracking-tight">
                {businessName}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Version: <span className="text-indigo-400 font-bold">v{blueprint.version}</span> · Status: Complete
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={handleDownloadJSON}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Download JSON
          </button>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`} /> Regenerate
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-px">
        {[
          { id: "overview", label: "Overview", icon: LayoutGrid },
          { id: "design", label: "Design & UI", icon: Palette },
          { id: "architecture", label: "Architecture", icon: Code2 },
          { id: "strategy", label: "Strategy & SEO", icon: FileSearch },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Website Type</span>
                <p className="text-sm font-semibold text-white">{data.websiteType}</p>
              </div>
              <div className="space-y-1.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Website Goal</span>
                <p className="text-sm font-semibold text-white">{data.websiteGoal}</p>
              </div>
            </div>

            {/* Sitemap & Navigation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl bg-slate-900/40 p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ListTodo className="h-4 w-4 text-indigo-400" /> Sitemap
                </h3>
                <div className="space-y-2.5">
                  {data.pages.map((p, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <ChevronRight className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white">{p.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{p.purpose}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-slate-900/40 p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <LayoutGrid className="h-4 w-4 text-indigo-400" /> Menu Navigation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <p className="font-bold text-white text-[11px]">Header Menu</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                      {data.navigation?.headerMenu?.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-bold text-white text-[11px]">CTA Buttons</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                      {data.navigation?.ctaButtons?.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DESIGN TAB */}
        {activeTab === "design" && (
          <div className="space-y-6">
            {/* Color Palette swatches */}
            <div className="rounded-xl bg-slate-900/40 p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Palette className="h-4 w-4 text-indigo-400" /> HEX Color Swatches
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[
                  { label: "Primary", color: data.colors.primary },
                  { label: "Secondary", color: data.colors.secondary },
                  { label: "Accent", color: data.colors.accent },
                  { label: "Background", color: data.colors.background },
                  { label: "Text", color: data.colors.text },
                ].map((swatch, idx) => (
                  <div key={idx} className="space-y-2 text-center bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
                    <div
                      className="h-12 w-full rounded-md shadow-sm border border-white/10"
                      style={{ backgroundColor: swatch.color || "#000" }}
                    />
                    <p className="text-[10px] font-bold text-white">{swatch.label}</p>
                    <code className="text-[9px] text-slate-500 uppercase">{swatch.color}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography & Design style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl bg-slate-900/40 p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Typography Recommendations</h3>
                <div className="space-y-2 text-xs">
                  <p className="text-slate-300">
                    Heading Font: <span className="font-bold text-white">{data.typography.headingFont}</span>
                  </p>
                  <p className="text-slate-300">
                    Body Font: <span className="font-bold text-white">{data.typography.bodyFont}</span>
                  </p>
                  <p className="text-slate-300">
                    Spacing Strategy: <span className="font-bold text-white">{data.typography.spacing}</span>
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-900/40 p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Theme Details</h3>
                <div className="space-y-2 text-xs">
                  <p className="text-slate-300">
                    Design Theme: <span className="font-bold text-white">{data.design.style}</span>
                  </p>
                  <p className="text-slate-300">
                    Icon Style: <span className="font-bold text-white">{data.design.icons}</span>
                  </p>
                  <p className="text-slate-300">
                    Animation Guide: <span className="font-bold text-white">{data.design.animations?.scroll}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ARCHITECTURE TAB */}
        {activeTab === "architecture" && (
          <div className="space-y-6">
            {/* Tech Stack recommendations */}
            <div className="rounded-xl bg-slate-900/40 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Database Planning</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/40 space-y-1">
                  <p className="font-bold text-white text-[11px] uppercase tracking-wider">Collections</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[10px]">
                    {data.database?.collections?.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/40 space-y-1">
                  <p className="font-bold text-white text-[11px] uppercase tracking-wider">Relationships</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[10px]">
                    {data.database?.relationships?.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/40 space-y-1">
                  <p className="font-bold text-white text-[11px] uppercase tracking-wider">Indexes</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[10px]">
                    {data.database?.indexes?.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* Components and Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl bg-slate-900/40 p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Essential Feature List</h3>
                <div className="flex flex-wrap gap-1.5">
                  {data.features?.map((f, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-slate-900/40 p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Reusable Components</h3>
                <div className="flex flex-wrap gap-1.5">
                  {data.components?.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-850 border border-slate-800 text-slate-300 text-[10px] font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STRATEGY TAB */}
        {activeTab === "strategy" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl bg-slate-900/40 p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">SEO Strategy</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <p className="font-semibold text-white">Meta Title:</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{data.seo.metaTitle}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Meta Description:</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{data.seo.metaDescription}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Suggested Schema.org markup:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {data.seo?.schema?.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-900/40 p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">Performance & Accessibility</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <p className="font-semibold text-white mb-1.5">Speed Plan:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                      {data.performance?.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1.5">Responsive Strategy:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                      {data.responsive?.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Version Comparison Panel ── */}
      {blueprint.history.length > 0 && (
        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="h-4.5 w-4.5 text-indigo-400" /> Compare Versions
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Compare current plan side-by-side with historical iterations</p>
            </div>
            <select
              value={compareVersion || ""}
              onChange={(e) => setCompareVersion(Number(e.target.value) || null)}
              className="bg-slate-900 border border-slate-800 text-xs text-white rounded-lg h-9 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
            >
              <option value="">Select version to compare...</option>
              {blueprint.history.map((h) => (
                <option key={h.version} value={h.version}>
                  Version {h.version} ({new Date(h.generatedAt).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {selectedHistory && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800/60 pt-4 text-xs">
              {/* Historical Version */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 space-y-3">
                <p className="font-bold text-indigo-400 text-[11px] uppercase tracking-wider">Version {selectedHistory.version}</p>
                <div className="space-y-1.5">
                  <p><span className="text-slate-500">Type:</span> <span className="text-white font-medium">{selectedHistory.blueprintData.websiteType}</span></p>
                  <p><span className="text-slate-500">Goal:</span> <span className="text-white font-medium">{selectedHistory.blueprintData.websiteGoal}</span></p>
                  <p><span className="text-slate-500">Design Theme:</span> <span className="text-white font-medium">{selectedHistory.blueprintData.design?.style}</span></p>
                  <p><span className="text-slate-500">Primary Color:</span> <span className="text-white font-medium font-mono uppercase">{selectedHistory.blueprintData.colors?.primary}</span></p>
                </div>
              </div>

              {/* Current Version */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 space-y-3">
                <p className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider">Current Version (v{blueprint.version})</p>
                <div className="space-y-1.5">
                  <p><span className="text-slate-500">Type:</span> <span className="text-white font-medium">{data.websiteType}</span></p>
                  <p><span className="text-slate-500">Goal:</span> <span className="text-white font-medium">{data.websiteGoal}</span></p>
                  <p><span className="text-slate-500">Design Theme:</span> <span className="text-white font-medium">{data.design?.style}</span></p>
                  <p><span className="text-slate-500">Primary Color:</span> <span className="text-white font-medium font-mono uppercase">{data.colors?.primary}</span></p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
