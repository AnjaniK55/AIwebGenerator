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

interface Consultation {
  _id: string;
  status: string;
  answers: {
    businessName: string;
  };
}

interface Blueprint {
  _id: string;
  consultationId: {
    _id: string;
    answers: {
      businessName: string;
    };
    status: string;
  } | null;
  status: "pending" | "completed" | "failed";
  version: number;
  createdAt: string;
  updatedAt: string;
}

export default function UserBlueprintsPage() {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [blueprintRes, consultRes] = await Promise.all([
        apiClient<ApiResponse<Blueprint[]>>("/blueprint/user"),
        apiClient<ApiResponse<Consultation[]>>("/consultation/my"),
      ]);

      if (blueprintRes.success && blueprintRes.data) {
        setBlueprints(blueprintRes.data);
      }
      if (consultRes.success && consultRes.data) {
        setConsultations(consultRes.data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load blueprints & consultations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerate = async (consultationId: string) => {
    setGeneratingId(consultationId);
    setError(null);
    try {
      const res = await apiClient<ApiResponse<Blueprint>>("/blueprint/generate", {
        method: "POST",
        body: JSON.stringify({ consultationId }),
      });
      if (res.success && res.data) {
        setBlueprints((prev) => [res.data!, ...prev]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Blueprint generation failed.");
    } finally {
      setGeneratingId(null);
    }
  };

  const handleRegenerate = async (blueprintId: string) => {
    setRegeneratingId(blueprintId);
    setError(null);
    try {
      const res = await apiClient<ApiResponse<Blueprint>>("/blueprint/regenerate", {
        method: "PUT",
        body: JSON.stringify({ blueprintId }),
      });
      if (res.success && res.data) {
        setBlueprints((prev) =>
          prev.map((b) => (b._id === blueprintId ? res.data! : b))
        );
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Regeneration failed.");
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this website blueprint?")) return;
    setDeletingId(id);
    try {
      await apiClient(`/blueprint/${id}`, { method: "DELETE" });
      setBlueprints((prev) => prev.filter((b) => b._id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete blueprint.");
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
            <Clock className="h-3 w-3" /> Generating
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

  // Find consultations that do NOT have a blueprint yet
  const eligibleConsultations = consultations.filter(
    (c) =>
      c.status === "completed" &&
      !blueprints.some((b) => b.consultationId?._id === c._id)
  );

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-white text-xl tracking-tight">
          Website Blueprints
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Explore and download architectural planning blueprints generated by AI for your websites
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
          <p className="text-xs text-slate-400 uppercase tracking-wider">Loading Blueprints...</p>
        </div>
      ) : (
        <>
          {/* Generation needed panel */}
          {eligibleConsultations.length > 0 && (
            <div className="p-6 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Generate Website Blueprints</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    You have completed consultations ready to be compiled into interactive plans.
                  </p>
                </div>
              </div>
              <div className="divide-y divide-slate-800/40">
                {eligibleConsultations.map((c) => (
                  <div
                    key={c._id}
                    className="flex justify-between items-center py-3 first:pt-0 last:pb-0"
                  >
                    <span className="text-xs font-semibold text-white">
                      {c.answers?.businessName || "Unnamed Business"}
                    </span>
                    <button
                      onClick={() => handleGenerate(c._id)}
                      disabled={generatingId === c._id}
                      className="flex items-center gap-1.5 px-3 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-[11px] font-bold text-white transition-colors"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      {generatingId === c._id ? "Generating..." : "Generate Plan"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blueprints List */}
          {blueprints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 border border-slate-800 bg-slate-900/10 rounded-2xl">
              <FileJson className="h-12 w-12 text-slate-600 animate-pulse" />
              <div>
                <p className="text-sm font-bold text-slate-400">No blueprints available yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Complete the AI website requirement consultation session first to compile your blueprint plan.
                </p>
              </div>
              <Link
                href="/dashboard/ai-consultation"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition-colors"
              >
                Go to AI Consultation
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blueprints.map((blueprint) => {
                const businessName =
                  blueprint.consultationId?.answers?.businessName || "Unnamed Project";
                return (
                  <div
                    key={blueprint._id}
                    className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <h4 className="font-display font-bold text-sm text-white line-clamp-1">
                          {businessName}
                        </h4>
                        {getStatusBadge(blueprint.status)}
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-400 mb-6">
                        <p>
                          Version: <span className="text-indigo-400 font-bold">v{blueprint.version}</span>
                        </p>
                        <p>Generated: {new Date(blueprint.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-slate-800/60 pt-4 mt-auto">
                      {blueprint.status === "completed" && (
                        <Link
                          href={`/dashboard/blueprint/${blueprint._id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[11px] font-bold text-white transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Plan
                        </Link>
                      )}
                      <button
                        onClick={() => handleRegenerate(blueprint._id)}
                        disabled={regeneratingId === blueprint._id || blueprint.status === "pending"}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
                        title="Regenerate Blueprint"
                      >
                        <RefreshCw className={`h-4 w-4 ${regeneratingId === blueprint._id ? "animate-spin" : ""}`} />
                      </button>
                      <button
                        onClick={() => handleDelete(blueprint._id)}
                        disabled={deletingId === blueprint._id}
                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-slate-400 hover:text-red-400 disabled:opacity-40 transition-colors"
                        title="Delete Blueprint"
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
