"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, Project } from "@/types";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CreateProject() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("lead-generation");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type || !description || !goal) {
      setError("Please fill out all fields.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await apiClient<ApiResponse<Project>>("/projects", {
        method: "POST",
        body: JSON.stringify({
          projectName: name,
          businessType: type,
          description,
          websiteGoal: goal,
        }),
      });

      if (response.success && response.data) {
        router.push(`/dashboard/projects/${response.data.id}`);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to create project.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const goals = [
    { value: "lead-generation", label: "Lead Generation Form" },
    { value: "appointment-booking", label: "Appointment Scheduling" },
    { value: "portfolio-showcase", label: "Professional Portfolio" },
    { value: "product-sales", label: "Product Sales Grid" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/projects"
          id="btn_create_back_list"
          className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="font-display font-bold text-foreground text-lg tracking-tight">Create Website Project</h2>
          <p className="text-xs text-muted-foreground mt-1">Configure layout, details, and prompts parameters</p>
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
                id="create_proj_name"
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
                id="create_proj_type"
                placeholder="e.g. Fitness Coaching"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-background border border-border text-foreground placeholder-slate-500 focus:outline-none focus:border-primary transition-colors text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Primary Goal</label>
            <select
              value={goal}
              id="create_proj_goal"
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Niche Description</label>
            <textarea
              required
              rows={4}
              id="create_proj_desc"
              placeholder="Describe your target audience, services, hours, location, and aesthetic preferences..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-slate-500 focus:outline-none focus:border-primary transition-colors text-xs font-medium resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            id="btn_create_proj_submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{loading ? "Constructing Website..." : "Generate AI Website"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
