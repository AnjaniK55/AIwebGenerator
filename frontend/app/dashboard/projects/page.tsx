"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Project, ApiResponse } from "@/types";
import { Folder, PlusCircle, Trash2, Eye, Calendar, Clock, AlertCircle, Pencil } from "lucide-react";

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const response = await apiClient<ApiResponse<Project[]>>("/projects");
      if (response.success && response.data) {
        setProjects(response.data);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load projects.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const response = await apiClient<ApiResponse<void>>(`/projects/${id}`, {
        method: "DELETE",
      });
      if (response.success) {
        setProjects(projects.filter((p) => p.id !== id));
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to delete project.";
      alert(errMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center space-y-4 py-20">
        <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground font-semibold">Gathering your website builds...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display font-bold text-foreground text-lg tracking-tight">My Projects</h2>
          <p className="text-xs text-muted-foreground mt-1">Manage and export your AI generated portfolios</p>
        </div>
        <Link
          href="/dashboard/projects/create"
          id="btn_projects_list_create"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 px-4 py-2 text-xs font-semibold shadow-lg shadow-primary/10 space-x-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Project</span>
        </Link>
      </div>

      {error && (
        <div className="flex items-start space-x-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-[300px]">
          <Folder className="h-12 w-12 text-muted-foreground animate-pulse" />
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-foreground text-sm">No website projects</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Generate a modern responsive website using your custom business niches and design preferences.
            </p>
          </div>
          <Link
            href="/dashboard/projects/create"
            id="btn_projects_list_create_empty"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 px-4 py-2 text-xs font-semibold"
          >
            Create First Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-all flex flex-col justify-between min-h-[200px]"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-display font-bold text-foreground text-sm tracking-tight">{project.projectName}</h3>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                      project.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : project.status === "Processing"
                        ? "bg-primary/10 text-primary animate-pulse"
                        : project.status === "Failed"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                
                <p className="text-[10px] text-muted-foreground line-clamp-3 mb-4 leading-relaxed">{project.prompt}</p>
              </div>

              <div className="border-t border-border pt-4 mt-auto space-y-3">
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1" /> {new Date(project.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1" /> {project.websiteGoal || "Lead Capture"}</span>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    id={`btn_proj_view_${project.id}`}
                    className="flex-grow inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted text-xs font-semibold transition-colors space-x-2"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Details</span>
                  </Link>
                  <Link
                    href={`/dashboard/projects/${project.id}/edit`}
                    id={`btn_proj_edit_${project.id}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-primary transition-all"
                    aria-label="Edit project"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    id={`btn_proj_delete_${project.id}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive transition-all"
                    aria-label="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
