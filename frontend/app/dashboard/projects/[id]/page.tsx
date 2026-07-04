"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, Project } from "@/types";
import { ArrowLeft, FileText, Globe, Code, Download, Play, ShieldAlert, Sparkles, Pencil } from "lucide-react";

export default function ProjectDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "preview" | "export">("overview");

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        const response = await apiClient<ApiResponse<Project>>(`/projects/${id}`);
        if (response.success && response.data) {
          setProject(response.data);
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

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center space-y-4 py-20">
        <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground font-semibold">Reading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4 py-20">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h3 className="font-display font-bold text-foreground">Failed to load project</h3>
        <p className="text-xs text-muted-foreground">{error || "Project record not found."}</p>
        <Link
          href="/dashboard/projects"
          id="btn_details_back_fallback"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 text-xs font-semibold"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header navbar actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push("/dashboard/projects")}
            id="btn_details_back"
            className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="font-display font-bold text-foreground text-lg tracking-tight">{project.projectName}</h2>
              <Link
                href={`/dashboard/projects/${project.id}/edit`}
                id="btn_details_edit_link"
                className="inline-flex items-center space-x-1 text-xs text-primary hover:underline font-semibold"
              >
                <Pencil className="h-3 w-3" />
                <span>Edit</span>
              </Link>
              {project.status !== "Completed" && (
                <Link
                  href={`/dashboard/projects/${project.id}/generate`}
                  id="btn_details_generate_link"
                  className="inline-flex items-center space-x-1 text-xs text-indigo-400 hover:underline font-semibold"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generate AI Website</span>
                </Link>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Status: <span className="font-semibold text-primary">{project.status}</span></p>
          </div>
        </div>

        {/* Tab selectors */}
        <div className="flex rounded-lg border border-border bg-card p-1">
          {[
            { id: "overview", label: "Overview" },
            { id: "preview", label: "AI Generated Site" },
            { id: "export", label: "Export Code" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "overview" | "preview" | "export")}
              id={`tab_trigger_${tab.id}`}
              className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left detail card */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                <h3 className="font-display font-semibold text-foreground text-sm flex items-center"><FileText className="h-4 w-4 mr-2 text-primary" /> Assembled Prompt</h3>
                <div className="bg-background rounded-lg border border-border p-4 font-mono text-[11px] text-muted-foreground leading-relaxed">
                  {project.prompt}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                <h3 className="font-display font-semibold text-foreground text-sm">Niche Specification Metrics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="border border-border p-4 rounded-lg bg-background/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Business Type</span>
                    <p className="font-semibold text-foreground mt-1">{project.businessType}</p>
                  </div>
                  <div className="border border-border p-4 rounded-lg bg-background/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Website Goal</span>
                    <p className="font-semibold text-foreground mt-1">{project.websiteGoal || "Lead Capture"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right log status */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4 h-fit">
              <h3 className="font-display font-semibold text-foreground text-sm">Deployment State</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-xs">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <div className="flex-grow">
                    <p className="font-semibold text-foreground">Project Created</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(project.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <div className={`h-2 w-2 rounded-full ${project.status === "Completed" ? "bg-emerald-500" : "bg-primary animate-pulse"}`} />
                  <div className="flex-grow">
                    <p className="font-semibold text-foreground">Layout Compilation</p>
                    <p className="text-[10px] text-muted-foreground">Status: {project.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "preview" && (
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm aspect-[16/9] flex flex-col min-h-[400px]">
            <div className="h-10 border-b border-border bg-muted/40 px-4 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
              <div className="flex items-center space-x-1.5">
                <Globe className="h-3.5 w-3.5" />
                <span>https://my-site-workspace-{project.id.substring(0, 6)}.web.agency</span>
              </div>
            </div>
            
            {project.status !== "Completed" ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8 space-y-4 bg-muted/10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-foreground text-sm">AI Layout Canvas Sandbox</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Your website layout configuration has not been generated yet. Launch the compiler to structure pages and sections.
                  </p>
                </div>
                <Link
                  href={`/dashboard/projects/${project.id}/generate`}
                  id="btn_details_go_generate"
                  className="h-9 rounded bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold px-4 flex items-center justify-center"
                >
                  Launch AI Generator
                </Link>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8 space-y-4 bg-muted/10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-foreground text-sm">AI Layout Canvas Sandbox</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Aesthetics style: <span className="font-bold text-primary">{project.aiGeneratedData?.style || "Modern Neon"}</span>. Your modular layout assets are successfully compiled and stored in MongoDB.
                  </p>
                </div>
                <button
                  id="btn_details_simulate"
                  onClick={() => alert("Simulating layout compilation render outputs...")}
                  className="h-9 rounded bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold px-4 flex items-center space-x-2"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Simulate Render</span>
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "export" && (
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h3 className="font-display font-bold text-foreground text-sm flex justify-center items-center"><Code className="h-5 w-5 mr-2 text-primary" /> Code Packaging Export</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Download fully responsive build templates containing layout files, CSS styles, and assets logs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button id="btn_details_export_html" className="border border-border p-4 rounded-xl hover:border-primary/30 transition-all flex flex-col justify-between items-start text-left bg-background min-h-[120px]">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary mb-2">
                  <Download className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Static HTML / CSS Template</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Plain static build folder ready to host anywhere.</p>
                </div>
              </button>

              <button id="btn_details_export_react" className="border border-border p-4 rounded-xl hover:border-primary/30 transition-all flex flex-col justify-between items-start text-left bg-background min-h-[120px]">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary mb-2">
                  <Download className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Next.js 14 React Components</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">TypeScript modular elements package.</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
