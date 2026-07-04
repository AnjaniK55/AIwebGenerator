"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, Project } from "@/types";
import { Search, Folder, Calendar, AlertCircle, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AdminProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sorting and Pagination State
  const [sortBy, setSortBy] = useState<"projectName" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination on filter query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.append("status", statusFilter);
        if (searchQuery) params.append("search", searchQuery);

        const response = await apiClient<ApiResponse<Project[]>>(`/admin/projects?${params.toString()}`);
        if (response.success && response.data) {
          setProjects(response.data);
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Failed to load project directories.";
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [searchQuery, statusFilter]);

  const statuses = [
    { value: "", label: "All Statuses" },
    { value: "Draft", label: "Draft" },
    { value: "Processing", label: "Processing" },
    { value: "Completed", label: "Completed" },
    { value: "Failed", label: "Failed" },
  ];

  // Client-side sorting logic
  const sortedProjects = [...projects].sort((a, b) => {
    let aVal: string | number = sortBy === "projectName" ? a.projectName : a.createdAt;
    let bVal: string | number = sortBy === "projectName" ? b.projectName : b.createdAt;

    if (sortBy === "createdAt") {
      aVal = new Date(a.createdAt).getTime();
      bVal = new Date(b.createdAt).getTime();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const itemsPerPage = 10;
  const totalPages = Math.max(Math.ceil(sortedProjects.length / itemsPerPage), 1);
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (field: "projectName" | "createdAt") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const renderSortIcon = (field: "projectName" | "createdAt") => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 ml-1 inline" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 ml-1 inline" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-white text-xl tracking-tight">Project Registry</h2>
          <p className="text-xs text-slate-400 mt-1">Review website workspaces generated across the platform</p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search project name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 h-10 pl-10 pr-4 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-xs font-medium"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg h-10 px-4 text-xs font-medium text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            {statuses.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-start space-x-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-20">
          <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Loading project logs...</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 h-10 select-none">
                  <th
                    className="font-semibold px-4 cursor-pointer hover:text-white transition-colors"
                    onClick={() => toggleSort("projectName")}
                  >
                    <span>Project Details</span>
                    {renderSortIcon("projectName")}
                  </th>
                  <th className="font-semibold px-4">Workspace Owner</th>
                  <th className="font-semibold px-4">Status</th>
                  <th
                    className="font-semibold px-4 cursor-pointer hover:text-white transition-colors"
                    onClick={() => toggleSort("createdAt")}
                  >
                    <span>Created Date</span>
                    {renderSortIcon("createdAt")}
                  </th>
                  <th className="font-semibold px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProjects.map((proj) => (
                  <tr key={proj.id} className="border-b border-slate-800/40 hover:bg-slate-800/20 h-14 text-slate-300">
                    {/* Project name */}
                    <td className="px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded bg-slate-800 flex items-center justify-center text-slate-400">
                          <Folder className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-xs">{proj.projectName}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{proj.businessType}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4">
                      {proj.userId ? (
                        <div>
                          <p className="font-semibold text-slate-300 text-xs">
                            {(proj.userId as unknown as { name: string }).name}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {(proj.userId as unknown as { email: string }).email}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Unknown User</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          proj.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : proj.status === "Processing"
                            ? "bg-indigo-500/10 text-indigo-400 animate-pulse"
                            : proj.status === "Failed"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {proj.status}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="px-4 text-slate-500">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        <span>{new Date(proj.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* View project Details */}
                    <td className="px-4 text-right">
                      <Link
                        href={`/dashboard/projects/${proj.id}`}
                        id={`btn_admin_view_project_${proj.id}`}
                        className="inline-flex h-8 items-center justify-center rounded bg-slate-850 hover:bg-slate-800 text-white px-3 font-semibold transition-colors"
                      >
                        Open Workspace
                      </Link>
                    </td>
                  </tr>
                ))}
                {paginatedProjects.length === 0 && (
                  <tr className="h-16">
                    <td colSpan={5} className="text-center text-slate-500">
                      No project workspaces found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-6">
              <span className="text-[10px] text-slate-500 font-medium">
                Showing Page {currentPage} of {totalPages} ({sortedProjects.length} total projects)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
