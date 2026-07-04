"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, Client } from "@/types";
import { Calendar, AlertCircle, Link2 } from "lucide-react";
import Link from "next/link";

export default function AdminClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await apiClient<ApiResponse<Client[]>>("/admin/clients");
        if (response.success && response.data) {
          setClients(response.data);
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Failed to load clients registry.";
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Loading clients list...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-white text-xl tracking-tight">Clients Registry</h2>
        <p className="text-xs text-slate-400 mt-1">Review active client portals connected to project workspaces</p>
      </div>

      {error && (
        <div className="flex items-start space-x-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 h-10">
                <th className="font-semibold px-4">Client Name</th>
                <th className="font-semibold px-4">Email</th>
                <th className="font-semibold px-4">Status</th>
                <th className="font-semibold px-4">Project Association</th>
                <th className="font-semibold px-4">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-slate-800/40 hover:bg-slate-800/20 h-14 text-slate-300">
                  {/* Name */}
                  <td className="px-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 text-[10px] uppercase">
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-white">{c.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4">{c.email}</td>

                  {/* Status Badge */}
                  <td className="px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        c.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  {/* Project ID Ref */}
                  <td className="px-4">
                    <Link
                      href={`/dashboard/projects/${c.projectId}`}
                      className="inline-flex items-center space-x-1 text-xs text-indigo-400 hover:underline"
                    >
                      <Link2 className="h-3 w-3" />
                      <span>Workspace: {c.projectId.substring(0, 8)}...</span>
                    </Link>
                  </td>

                  {/* Created Date */}
                  <td className="px-4 text-slate-500">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr className="h-16">
                  <td colSpan={5} className="text-center text-slate-500">
                    No clients enrolled yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
