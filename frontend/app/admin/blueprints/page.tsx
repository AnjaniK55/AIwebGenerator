"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import {
  FileJson,
  Search,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
}

interface Blueprint {
  _id: string;
  userId: AdminUser;
  consultationId: {
    _id: string;
    answers: {
      businessName: string;
    };
  } | null;
  status: "pending" | "completed" | "failed";
  version: number;
  blueprintData: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

interface AdminBlueprintsResponse {
  success: boolean;
  count: number;
  stats: {
    total: number;
    completed: number;
    types: Record<string, number>;
    goals: Record<string, number>;
  };
  data: Blueprint[];
}

export default function AdminBlueprintsPage() {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [stats, setStats] = useState<AdminBlueprintsResponse["stats"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBlueprints = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await apiClient<AdminBlueprintsResponse>(
        `/admin/blueprints?${params.toString()}`
      );
      if (res.success && res.data) {
        setBlueprints(res.data);
        setStats(res.stats);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load blueprints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlueprints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlueprints();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blueprint permanently?")) return;
    setDeletingId(id);
    try {
      await apiClient(`/admin/blueprints/${id}`, { method: "DELETE" });
      setBlueprints((prev) => prev.filter((b) => b._id !== id));
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
          <Clock className="h-3 w-3" /> Generating
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
          Website Blueprints (Admin)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Monitor and manage AI-generated website blueprint planning templates
        </p>
      </div>

      {/* Stats distribution cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Blueprints</span>
              <p className="font-display font-extrabold text-2xl text-white tracking-tight">{stats.total}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <FileJson className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed plans</span>
              <p className="font-display font-extrabold text-2xl text-white tracking-tight">{stats.completed}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm space-y-2 col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" /> Website Type Distribution
            </span>
            <div className="flex flex-wrap gap-2 text-[10px]">
              {Object.entries(stats.types).map(([type, count]) => (
                <span key={type} className="px-2 py-1 rounded bg-slate-800 text-slate-300">
                  {type}: <strong className="text-white">{count}</strong>
                </span>
              ))}
              {Object.keys(stats.types).length === 0 && (
                <span className="text-slate-500 italic">No types logged yet</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by client name, email, type, or goal..."
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

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : blueprints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
          <FileJson className="h-10 w-10 text-slate-600 animate-pulse" />
          <p className="text-sm font-semibold text-slate-400 font-display">No blueprints found</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 h-10">
                <th className="px-4 font-semibold">Client</th>
                <th className="px-4 font-semibold">Project</th>
                <th className="px-4 font-semibold">Version</th>
                <th className="px-4 font-semibold">Status</th>
                <th className="px-4 font-semibold">Date Created</th>
                <th className="px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blueprints.map((b) => {
                const isExpanded = expandedId === b._id;
                const businessName = b.consultationId?.answers?.businessName || "Unnamed Project";
                return (
                  <React.Fragment key={b._id}>
                    <tr className="border-b border-slate-800/40 hover:bg-slate-800/10 h-14 transition-colors">
                      <td className="px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="font-semibold text-white text-[11px]">{b.userId?.name || "Deleted User"}</p>
                            <p className="text-[9px] text-slate-500">{b.userId?.email || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 font-semibold text-slate-200">{businessName}</td>
                      <td className="px-4 text-indigo-400 font-bold">v{b.version}</td>
                      <td className="px-4">{getStatusBadge(b.status)}</td>
                      <td className="px-4 text-slate-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td className="px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : b._id)}
                            className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            title="Toggle JSON View"
                          >
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            onClick={() => handleDelete(b._id)}
                            disabled={deletingId === b._id}
                            className="p-1.5 rounded bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-40"
                            title="Delete Blueprint"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && b.blueprintData && (
                      <tr className="border-b border-slate-800/40 bg-slate-950/60">
                        <td colSpan={6} className="p-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Compiled Blueprint JSON</p>
                          <pre className="text-[10px] text-emerald-400 font-mono p-3 bg-slate-900 border border-slate-850 rounded-lg overflow-x-auto max-h-72 overflow-y-auto">
                            {JSON.stringify(b.blueprintData, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
