"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, Project } from "@/types";
import { ArrowLeft, Save, AlertCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("lead-generation");
  const [status, setStatus] = useState<"Draft" | "Processing" | "Completed" | "Failed">("Draft");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        const response = await apiClient<ApiResponse<Project>>(`/projects/${id}`);
        if (response.success && response.data) {
          setName(response.data.projectName);
          setType(response.data.businessType);
          setDescription(response.data.description);
          setGoal(response.data.websiteGoal);
          setStatus(response.data.status);
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Failed to load project details.";
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type || !description || !goal) {
      setError("Please fill out all fields.");
      return;
    }

    setError(null);
    setSaving(true);

    try {
      const response = await apiClient<ApiResponse<Project>>(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          projectName: name,
          businessType: type,
          description,
          websiteGoal: goal,
          status,
        }),
      });

      if (response.success) {
        router.push(`/dashboard/projects/${id}`);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to update project.";
      setError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  const goals = [
    { value: "lead-generation", label: "Lead Generation Form" },
    { value: "appointment-booking", label: "Appointment Scheduling" },
    { value: "portfolio-showcase", label: "Professional Portfolio" },
    { value: "product-sales", label: "Product Sales Grid" },
  ];

  const statuses = [
    { value: "Draft", label: "Draft" },
    { value: "Processing", label: "Processing" },
    { value: "Completed", label: "Completed" },
    { value: "Failed", label: "Failed" },
  ];

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center space-y-4 py-20">
        <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground font-semibold">Reading project details...</p>
      </div>
    );
  }

  if (error && !name) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4 py-20">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h3 className="font-display font-bold text-foreground">Failed to load project</h3>
        <p className="text-xs text-muted-foreground">{error}</p>
        <Link
          href="/dashboard/projects"
          id="btn_edit_back_fallback"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 text-xs font-semibold"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push(`/dashboard/projects/${id}`)}
          id="btn_edit_back"
          className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="font-display font-bold text-foreground text-lg tracking-tight">Edit Website Project</h2>
          <p className="text-xs text-muted-foreground mt-1">Modify your layout prompt specifications</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
        {error && (
          <div className="mb-6 flex items-start space-x-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Project Name</label>
              <input
                type="text"
                required
                id="edit_proj_name"
                placeholder="e.g. AeroFit Studios"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-background border border-border text-foreground placeholder-slate-500 focus:outline-none focus:border-primary transition-colors text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Business Type</label>
              <input
                type="text"
                required
                id="edit_proj_type"
                placeholder="e.g. Fitness Coaching"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-background border border-border text-foreground placeholder-slate-500 focus:outline-none focus:border-primary transition-colors text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Primary Goal</label>
              <select
                value={goal}
                id="edit_proj_goal"
                onChange={(e) => setGoal(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary transition-colors text-xs font-medium"
              >
                {goals.map((g) => (
                  <option key={g.value} value={g.value} className="bg-card text-foreground">
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Status</label>
              <select
                value={status}
                id="edit_proj_status"
                onChange={(e) => setStatus(e.target.value as "Draft" | "Processing" | "Completed" | "Failed")}
                className="w-full h-11 px-4 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary transition-colors text-xs font-medium"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value} className="bg-card text-foreground">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Niche Description</label>
            <textarea
              required
              rows={4}
              id="edit_proj_desc"
              placeholder="Describe your target audience, services, hours, location..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-slate-500 focus:outline-none focus:border-primary transition-colors text-xs font-medium resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            id="btn_edit_proj_submit"
            disabled={saving}
            className="w-full h-11 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving changes..." : "Save Changes"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
