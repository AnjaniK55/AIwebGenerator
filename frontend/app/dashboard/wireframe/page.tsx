"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types";
import {
  FileJson,
  PlusCircle,
  Eye,
  RefreshCw,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

interface Blueprint {
  _id: string;
  consultationId: {
    _id: string;
    answers: {
      businessName: string;
    };
    status: string;
  } | null;
  status: string;
  version: number;
}

interface Wireframe {
  _id: string;
  blueprintId: {
    _id: string;
    consultationId: {
      _id: string;
      answers: {
        businessName: string;
      };
      status: string;
    } | null;
  } | null;
  status: "pending" | "completed" | "failed";
  version: number;
  createdAt: string;
  updatedAt: string;
}

export default function UserWireframesPage() {
  const [wireframes, setWireframes] = useState<Wireframe[]>([]);
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [wireframeRes, blueprintRes] = await Promise.all([
        apiClient<ApiResponse<Wireframe[]>>("/wireframe/user"),
        apiClient<ApiResponse<Blueprint[]>>("/blueprint/user"),
      ]);

      if (wireframeRes.success && wireframeRes.data) {
        setWireframes(wireframeRes.data);
      }
      if (blueprintRes.success && blueprintRes.data) {
        setBlueprints(blueprintRes.data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load wireframes & blueprints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerate = async (blueprintId: string) => {
    setGeneratingId(blueprintId);
    setError(null);
    try {
      const res = await apiClient<ApiResponse<Wireframe>>("/wireframe/generate", {
        method: "POST",
        body: JSON.stringify({ blueprintId }),
      });
      if (res.success && res.data) {
        setWireframes((prev) => [res.data!, ...prev]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Wireframe generation failed.");
    } finally {
      setGeneratingId(null);
    }
  };

  const handleRegenerate = async (wireframeId: string) => {
    setRegeneratingId(wireframeId);
    setError(null);
    try {
      const res = await apiClient<ApiResponse<Wireframe>>("/wireframe/regenerate", {
        method: "PUT",
        body: JSON.stringify({ wireframeId }),
      });
      if (res.success && res.data) {
        setWireframes((prev) =>
          prev.map((w) => (w._id === wireframeId ? res.data! : w))
        );
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Regeneration failed.");
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this UI/UX wireframe?")) return;
    setDeletingId(id);
    try {
      await apiClient(`/wireframe/${id}`, { method: "DELETE" });
      setWireframes((prev) => prev.filter((w) => w._id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete wireframe.");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 className="h-3 w-3" /> Ready
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider animate-pulse">
            <Clock className="h-3 w-3" /> Designing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase tracking-wider">
            <AlertCircle className="h-3 w-3" /> Failed
          </span>
        );
    }
  };

  // Find completed blueprints that do NOT have a wireframe generated yet
  const eligibleBlueprints = blueprints.filter(
    (b) =>
      b.status === "completed" &&
      !wireframes.some((w) => w.blueprintId?._id === b._id)
  );

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-white text-xl tracking-tight">
          AI UI/UX Wireframes
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Explore visual layouts, accessibility mapping, and custom UI design tokens generated from your blueprints.
        </p>
      </div>

      {/* Error notification */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-400 uppercase tracking-wider">Loading Wireframes...</p>
        </div>
      ) : (
        <>
          {/* Generation needed panel */}
          {eligibleBlueprints.length > 0 && (
            <div className="p-6 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Generate UI/UX Wireframes</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your website blueprints are ready to be structured into layout wireframes and typography tokens.
                  </p>
                </div>
              </div>
              <div className="divide-y divide-slate-800/40">
                {eligibleBlueprints.map((b) => (
                  <div
                    key={b._id}
                    className="flex justify-between items-center py-3 first:pt-0 last:pb-0"
                  >
                    <span className="text-xs font-semibold text-white">
                      {b.consultationId?.answers?.businessName || "Unnamed Project"}
                    </span>
                    <button
                      onClick={() => handleGenerate(b._id)}
                      disabled={generatingId === b._id}
                      className="flex items-center gap-1.5 px-3 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-[11px] font-bold text-white transition-colors"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      {generatingId === b._id ? "Generating..." : "Generate Wireframe"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wireframes List */}
          {wireframes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 border border-slate-800 bg-slate-900/10 rounded-2xl">
              <FileJson className="h-12 w-12 text-slate-600 animate-pulse" />
              <div>
                <p className="text-sm font-bold text-slate-400">No wireframes available yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Generate website blueprints first so you can compile visual layout wireframes and custom typography tokens.
                </p>
              </div>
              <Link
                href="/dashboard/blueprint"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition-colors"
              >
                Go to Blueprints
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wireframes.map((wireframe) => {
                const businessName =
                  wireframe.blueprintId?.consultationId?.answers?.businessName || "Unnamed Project";
                return (
                  <div
                    key={wireframe._id}
                    className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <h4 className="font-display font-bold text-sm text-white line-clamp-1">
                          {businessName}
                        </h4>
                        {getStatusBadge(wireframe.status)}
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-400 mb-6">
                        <p>
                          Version: <span className="text-indigo-400 font-bold">v{wireframe.version}</span>
                        </p>
                        <p>Generated: {new Date(wireframe.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-slate-800/60 pt-4 mt-auto">
                      {wireframe.status === "completed" && (
                        <Link
                          href={`/dashboard/wireframe/${wireframe._id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[11px] font-bold text-white transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Wireframe
                        </Link>
                      )}
                      <button
                        onClick={() => handleRegenerate(wireframe._id)}
                        disabled={regeneratingId === wireframe._id || wireframe.status === "pending"}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
                        title="Regenerate Wireframe"
                      >
                        <RefreshCw className={`h-4 w-4 ${regeneratingId === wireframe._id ? "animate-spin" : ""}`} />
                      </button>
                      <button
                        onClick={() => handleDelete(wireframe._id)}
                        disabled={deletingId === wireframe._id}
                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-slate-400 hover:text-red-400 disabled:opacity-40 transition-colors"
                        title="Delete Wireframe"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
