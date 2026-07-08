"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import {
  FileJson,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  BarChart3,
  X,
} from "lucide-react";

interface Wireframe {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  } | null;
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
  wireframeData: Record<string, unknown> | null;
  createdAt: string;
}

interface AdminWireframesResponse {
  success: boolean;
  count: number;
  stats: {
    total: number;
    completed: number;
    styles: Record<string, number>;
    layouts: Record<string, number>;
  };
  data: Wireframe[];
}

export default function AdminWireframesPage() {
  const [wireframes, setWireframes] = useState<Wireframe[]>([]);
  const [stats, setStats] = useState<AdminWireframesResponse["stats"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedJSON, setExpandedJSON] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWireframes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await apiClient<AdminWireframesResponse>(
        `/admin/wireframes?${params.toString()}`
      );
      if (res.success && res.data) {
        setWireframes(res.data);
        setStats(res.stats);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load admin wireframes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWireframes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWireframes();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this wireframe permanently?")) return;
    setDeletingId(id);
    try {
      await apiClient(`/admin/wireframes/${id}`, { method: "DELETE" });
      setWireframes((prev) => prev.filter((w) => w._id !== id));
      if (stats) {
        setStats({
          ...stats,
          total: stats.total - 1,
        });
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Deletion failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed")
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
          <CheckCircle2 className="h-3 w-3" /> Ready
        </span>
      );
    if (status === "pending")
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20 animate-pulse">
          <Clock className="h-3 w-3" /> Designing
        </span>
      );
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-500/20">
        <AlertCircle className="h-3 w-3" /> Failed
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-white text-xl tracking-tight">
          Website Wireframes (Admin)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Monitor and manage AI-generated visual wireframes and custom design system tokens
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Wireframes</span>
              <p className="font-display font-extrabold text-2xl text-white tracking-tight">{stats.total}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <FileJson className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed Layouts</span>
              <p className="font-display font-extrabold text-2xl text-white tracking-tight">{stats.completed}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm space-y-2 col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" /> Design Styles Distribution
            </span>
            <div className="flex flex-wrap gap-2 text-[10px]">
              {Object.entries(stats.styles).map(([style, count]) => (
                <span key={style} className="px-2 py-1 rounded bg-slate-800 text-slate-300">
                  {style}: <strong className="text-white">{count}</strong>
                </span>
              ))}
              {Object.keys(stats.styles).length === 0 && (
                <span className="text-slate-500 italic">No styles logged yet</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search and filter actionbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by client name, email, or design style..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 h-9 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 h-9 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex gap-1">
          {["all", "pending", "completed", "failed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 h-9 rounded-lg text-[11px] font-semibold capitalize transition-colors ${
                statusFilter === s
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table view */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="h-8 w-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-[11px] text-slate-400 uppercase tracking-wider">Loading Wireframes list...</p>
        </div>
      ) : wireframes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
          <FileJson className="h-10 w-10 text-slate-600 animate-pulse" />
          <p className="text-sm font-semibold text-slate-400">No wireframes found</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 h-10">
                <th className="px-4 font-semibold">Client</th>
                <th className="px-4 font-semibold">Project</th>
                <th className="px-4 font-semibold">Version</th>
                <th className="px-4 font-semibold">Style</th>
                <th className="px-4 font-semibold">Status</th>
                <th className="px-4 font-semibold">Date Created</th>
                <th className="px-4 font-semibold text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {wireframes.map((wf) => {
                const clientName = wf.userId?.name || "Deleted User";
                const clientEmail = wf.userId?.email || "";
                const businessName =
                  wf.blueprintId?.consultationId?.answers?.businessName || "Unnamed Project";
                const style = (wf.wireframeData?.designStyle as string) || "Unknown";

                return (
                  <tr key={wf._id} className="hover:bg-slate-800/10 h-12">
                    <td className="px-4 font-medium">
                      <div>
                        <p className="text-white font-semibold">{clientName}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{clientEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 font-semibold text-slate-400">{businessName}</td>
                    <td className="px-4">
                      <span className="font-bold text-indigo-400">v{wf.version}</span>
                    </td>
                    <td className="px-4 capitalize text-slate-400">{style}</td>
                    <td className="px-4">{getStatusBadge(wf.status)}</td>
                    <td className="px-4 text-slate-500">
                      {new Date(wf.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        {wf.status === "completed" && wf.wireframeData && (
                          <button
                            onClick={() => setExpandedJSON(wf.wireframeData)}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                            title="Inspect JSON"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(wf._id)}
                          disabled={deletingId === wf._id}
                          className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-slate-400 hover:text-red-400 disabled:opacity-40 transition-colors"
                          title="Delete Wireframe"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* JSON Inspection Modal */}
      {expandedJSON && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <FileJson className="h-4 w-4 text-indigo-400" />
                Wireframe Output Payload Inspection
              </h3>
              <button
                onClick={() => setExpandedJSON(null)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <pre className="text-xs text-emerald-400 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-auto font-mono whitespace-pre-wrap flex-1">
              {JSON.stringify(expandedJSON, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
