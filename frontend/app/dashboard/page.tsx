"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import { Project, ApiResponse } from "@/types";
import { Folder, PlusCircle, ArrowRight, MessageSquare, CheckCircle2, Clock, FileJson } from "lucide-react";

export default function DashboardHome() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [consultationStatus, setConsultationStatus] = useState<"not_started" | "in_progress" | "completed">("not_started");
  const [blueprintStatus, setBlueprintStatus] = useState<"not_started" | "pending" | "completed">("not_started");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, consultRes, blueprintRes] = await Promise.allSettled([
          apiClient<ApiResponse<Project[]>>("/projects"),
          apiClient<ApiResponse<{ data: { status: string }[] }>>("/consultation/my"),
          apiClient<ApiResponse<{ data: { status: string }[] }>>("/blueprint/user"),
        ]);
        if (projRes.status === "fulfilled" && projRes.value.success && projRes.value.data) {
          setProjects(projRes.value.data as Project[]);
        }
        if (consultRes.status === "fulfilled" && consultRes.value.success) {
          const consultations = (consultRes.value as unknown as { data: { status: string }[] }).data;
          if (Array.isArray(consultations) && consultations.length > 0) {
            const latest = consultations[0];
            setConsultationStatus(latest.status as "not_started" | "in_progress" | "completed");
          }
        }
        if (blueprintRes.status === "fulfilled" && blueprintRes.value.success) {
          const blueprints = (blueprintRes.value as unknown as { data: { status: string }[] }).data;
          if (Array.isArray(blueprints) && blueprints.length > 0) {
            const latest = blueprints[0];
            setBlueprintStatus(latest.status as "not_started" | "pending" | "completed");
          }
        }
      } catch {
        // Handled silently
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === "Completed").length;
  const activeProjects = projects.filter((p) => p.status === "Processing").length;

  const recentProjects = projects.slice(0, 3);

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center space-y-4 py-20">
        <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground font-semibold">Gathering your workspace records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-6 rounded-2xl border border-border">
        <div>
          <h2 className="font-display font-bold text-foreground text-xl tracking-tight">
            Welcome, {user?.name}!
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Build and deploy your AI-generated layouts directly inside your portfolios workspaces.
          </p>
        </div>
        <Link
          href="/dashboard/projects/create"
          id="btn_overview_create_website"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 px-4 py-2 text-xs font-semibold shadow-lg shadow-primary/10 space-x-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create New Website</span>
        </Link>
      </div>

      {/* Stats cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Projects", val: totalProjects, desc: "Drafts + live builds" },
          { label: "Generated Sites", val: completedProjects, desc: "Successfully deployed" },
          { label: "Active Operations", val: activeProjects, desc: "Currently building" },
          {
            label: "Account Tier",
            val: user?.role === "admin" ? "Admin" : `${user?.subscriptionPlan?.toUpperCase() || "FREE"} PLAN`,
            desc: user?.role === "admin" ? "Unlimited access" : `AI Credits: ${user?.aiGenerationsUsed || 0} / ${user?.aiGenerationsLimit || 3} used`,
          },
        ].map((stat, idx) => (
          <div key={idx} className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{stat.label}</span>
            <p className="font-display text-2xl font-extrabold text-foreground">{stat.val}</p>
            <p className="text-[10px] text-muted-foreground">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Quick Action Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AI Consultation Card */}
        <Link
          href="/dashboard/ai-consultation"
          id="card_ai_consultation"
          className="flex items-center justify-between p-5 rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-violet-950/40 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">AI Consultation</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Answer 25 questions · Plan layout</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {consultationStatus === "completed" ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                <CheckCircle2 className="h-3 w-3" /> Completed
              </span>
            ) : consultationStatus === "in_progress" ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                <Clock className="h-3 w-3" /> In Progress
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Not Started
              </span>
            )}
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        {/* Website Blueprint Card */}
        <Link
          href="/dashboard/blueprint"
          id="card_website_blueprint"
          className="flex items-center justify-between p-5 rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-violet-950/40 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <FileJson className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Website Blueprint</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Explore compiled architecture blueprint</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {blueprintStatus === "completed" ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                <CheckCircle2 className="h-3 w-3" /> Ready
              </span>
            ) : blueprintStatus === "pending" ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400 uppercase tracking-wide animate-pulse">
                <Clock className="h-3 w-3" /> Generating
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Not Started
              </span>
            )}
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>

      {/* Recent Projects List */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-display font-semibold text-foreground text-sm">Recent Website Builds</h3>
          <Link href="/dashboard/projects" id="link_overview_view_all" className="text-xs text-primary hover:text-primary/90 flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <Folder className="h-10 w-10 text-muted-foreground animate-pulse" />
            <p className="text-xs font-semibold text-foreground">No websites created yet</p>
            <p className="text-[10px] text-muted-foreground max-w-xs">
              Describe your business and website goals, and watch our AI compiler structure components for you.
            </p>
            <Link
              href="/dashboard/projects/create"
              id="link_overview_create_first"
              className="text-xs text-primary font-semibold hover:underline"
            >
              Create your first layout
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                id={`link_overview_proj_${project.id}`}
                className="rounded-lg border border-border bg-background p-5 hover:border-primary/30 transition-all flex flex-col justify-between min-h-[140px]"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-display font-bold text-foreground text-xs">{project.projectName}</span>
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
                  <p className="text-[10px] text-muted-foreground line-clamp-2">{project.prompt}</p>
                </div>
                <div className="border-t border-border/50 pt-3 text-[9px] text-muted-foreground flex justify-between items-center mt-4">
                  <span>Goal: {project.websiteGoal || "General"}</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
