"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types";
import {
  MessageSquare,
  Search,
  Trash2,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileJson,
  User,
} from "lucide-react";

interface ConsultationUser {
  _id: string;
  name: string;
  email: string;
}

interface Consultation {
  _id: string;
  userId: ConsultationUser;
  status: "in_progress" | "completed";
  currentStep: number;
  messages: { role: string; content: string; createdAt?: string }[];
  answers: Record<string, string>;
  generatedJSON?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

const STATUS_FILTERS = ["all", "in_progress", "completed"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showJSON, setShowJSON] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultations = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await apiClient<ApiResponse<Consultation[]>>(
        `/admin/consultations?${params.toString()}`
      );
      if (res.success && res.data) {
        setConsultations(res.data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load consultations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchConsultations();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this consultation? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await apiClient(`/admin/consultations/${id}`, { method: "DELETE" });
      setConsultations((prev) => prev.filter((c) => c._id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const statusBadge = (status: string) => {
    if (status === "completed")
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wide border border-emerald-500/20">
          <CheckCircle2 className="h-3 w-3" /> Completed
        </span>
      );
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wide border border-amber-500/20">
        <Clock className="h-3 w-3" /> In Progress
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-white text-xl tracking-tight">
          AI Consultations
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          View and manage all client website requirement consultations
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, or business..."
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

        {/* Status filter */}
        <div className="flex gap-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 h-9 rounded-lg text-[11px] font-semibold capitalize transition-colors ${
                statusFilter === s
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : consultations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
          <MessageSquare className="h-10 w-10 text-slate-600" />
          <p className="text-sm font-semibold text-slate-400">No consultations found</p>
          <p className="text-xs text-slate-600">
            Consultations will appear here once users start them.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Stats */}
          <p className="text-xs text-slate-500">
            Showing <span className="text-white font-bold">{consultations.length}</span> consultation(s)
          </p>

          {/* Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 h-10 text-slate-400">
                    <th className="px-4 text-left font-semibold">Client</th>
                    <th className="px-4 text-left font-semibold">Business</th>
                    <th className="px-4 text-left font-semibold">Status</th>
                    <th className="px-4 text-left font-semibold">Progress</th>
                    <th className="px-4 text-left font-semibold">Date</th>
                    <th className="px-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.map((c) => (
                    <React.Fragment key={c._id}>
                      {/* Row */}
                      <tr className="border-b border-slate-800/50 h-14 hover:bg-slate-800/20 transition-colors">
                        <td className="px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                              <User className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="font-semibold text-white text-[11px]">
                                {c.userId?.name || "Unknown"}
                              </p>
                              <p className="text-slate-500 text-[10px]">{c.userId?.email || "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 text-slate-300 font-medium">
                          {c.answers?.businessName || (
                            <span className="text-slate-600 italic">Not provided</span>
                          )}
                        </td>
                        <td className="px-4">{statusBadge(c.status)}</td>
                        <td className="px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{
                                  width: `${Math.min(Math.round((c.currentStep / 25) * 100), 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-slate-500 text-[10px]">
                              {c.currentStep}/25
                            </span>
                          </div>
                        </td>
                        <td className="px-4 text-slate-500">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4">
                          <div className="flex items-center gap-1.5">
                            {/* Toggle chat history */}
                            <button
                              onClick={() => setExpanded(expanded === c._id ? null : c._id)}
                              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                              title="View chat"
                            >
                              {expanded === c._id ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <MessageSquare className="h-3.5 w-3.5" />
                              )}
                            </button>

                            {/* JSON viewer */}
                            {c.status === "completed" && c.generatedJSON && (
                              <button
                                onClick={() => setShowJSON(showJSON === c._id ? null : c._id)}
                                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                                title="View JSON"
                              >
                                <FileJson className="h-3.5 w-3.5" />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(c._id)}
                              disabled={deletingId === c._id}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-40"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded: Chat History */}
                      {expanded === c._id && (
                        <tr className="border-b border-slate-800/50">
                          <td colSpan={6} className="px-4 py-4 bg-slate-950/60">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                              Chat History ({c.messages.length} messages)
                            </p>
                            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                              {c.messages.map((msg, i) => (
                                <div
                                  key={i}
                                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                                >
                                  <span
                                    className={`flex-shrink-0 h-5 w-5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                                      msg.role === "user"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-violet-700 text-white"
                                    }`}
                                  >
                                    {msg.role === "user" ? "U" : "AI"}
                                  </span>
                                  <div
                                    className={`rounded-lg px-3 py-2 text-[11px] max-w-[80%] ${
                                      msg.role === "user"
                                        ? "bg-indigo-600/20 text-indigo-200"
                                        : "bg-slate-800 text-slate-300"
                                    }`}
                                  >
                                    {msg.content}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* Expanded: JSON */}
                      {showJSON === c._id && c.generatedJSON && (
                        <tr className="border-b border-slate-800/50">
                          <td colSpan={6} className="px-4 py-4 bg-slate-950/60">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                              Generated Requirements JSON
                            </p>
                            <pre className="text-[10px] text-emerald-400 font-mono overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto bg-slate-900 p-3 rounded-lg">
                              {JSON.stringify(c.generatedJSON, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
