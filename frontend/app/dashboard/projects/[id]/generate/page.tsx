"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, Project } from "@/types";
import { ArrowLeft, Sparkles, AlertCircle, ShieldAlert, Layers, Cpu, Globe } from "lucide-react";
import Link from "next/link";

type GenerationState = "idle" | "generating" | "completed" | "failed";

interface GeneratedPage {
  name: string;
  sections: string[];
}

interface GeneratedComponent {
  name: string;
  purpose: string;
}

const progressSteps = [
  { threshold: 15, message: "Analyzing business parameters..." },
  { threshold: 40, message: "Structuring outline layout..." },
  { threshold: 70, message: "Compiling design tokens..." },
  { threshold: 95, message: "Structuring coding nodes..." },
  { threshold: 100, message: "Finalizing website plan..." },
];

export default function AIGeneratorConsole() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [promptText, setPromptText] = useState("");
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<GenerationState>("idle");
  const [progress, setProgress] = useState(0);
  const [stepMessage, setStepMessage] = useState("AI Engine Standby");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        const response = await apiClient<ApiResponse<Project>>(`/projects/${id}`);
        if (response.success && response.data) {
          setProject(response.data);
          setPromptText(response.data.prompt || "");
          if (response.data.generationStatus === "Completed") {
            setState("completed");
          }
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Failed to load project parameters.";
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setError(null);
    setState("generating");
    setProgress(0);
    setStepMessage("Initializing compiler...");

    // Smoothly simulate progress in the foreground while waiting for the LLM response
    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += Math.floor(Math.random() * 5) + 2;
      if (progressVal >= 92) {
        clearInterval(interval);
        return;
      }
      setProgress(progressVal);
      const currentStep = progressSteps.find((s) => progressVal <= s.threshold);
      if (currentStep) {
        setStepMessage(currentStep.message);
      }
    }, 200);

    try {
      const response = await apiClient<ApiResponse<Project>>("/ai/generate", {
        method: "POST",
        body: JSON.stringify({
          projectId: id,
          prompt: promptText,
        }),
      });

      clearInterval(interval);
      if (response.success && response.data) {
        setProgress(100);
        setStepMessage("Website compiled successfully.");
        setProject(response.data);
        setTimeout(() => {
          setState("completed");
        }, 500);
      }
    } catch (err: unknown) {
      clearInterval(interval);
      const errMsg = err instanceof Error ? err.message : "AI Compilation process failed.";
      setError(errMsg);
      setState("failed");
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center space-y-4 py-20">
        <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground font-semibold">Reading workspace settings...</p>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4 py-20">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h3 className="font-display font-bold text-foreground">Failed to load project</h3>
        <p className="text-xs text-muted-foreground">{error}</p>
        <Link
          href="/dashboard/projects"
          id="btn_gen_back_fallback"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 text-xs font-semibold"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center space-x-4 border-b border-border pb-6">
        <button
          onClick={() => router.push(`/dashboard/projects/${id}`)}
          id="btn_gen_back"
          className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="font-display font-bold text-foreground text-lg tracking-tight">AI Layout Generator</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Project: <span className="font-semibold text-primary">{project?.projectName}</span>
          </p>
        </div>
      </div>

      {state === "idle" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left instructions */}
          <div className="lg:col-span-1 rounded-xl border border-border bg-card p-6 shadow-sm space-y-4 h-fit">
            <h3 className="font-display font-semibold text-foreground text-xs uppercase tracking-wider text-slate-400">Design Directives</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Define target components, section requirements, styling preferences, or target copy parameters.
            </p>
            <div className="border-t border-border pt-4 text-[10px] text-muted-foreground space-y-2">
              <p>✓ Assembles Pages layout lists</p>
              <p>✓ Drafts Custom components</p>
              <p>✓ Configures SEO optimization tokens</p>
            </div>
          </div>

          {/* Right form input */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Assembled AI Prompt</label>
                <textarea
                  required
                  rows={6}
                  id="txt_gen_prompt"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary transition-colors text-xs font-medium resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                id="btn_gen_submit"
                className="w-full h-11 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-primary/20"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generate Layout Config</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {state === "generating" && (
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm text-center max-w-xl mx-auto space-y-6 py-16">
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-16 w-16 border-4 border-primary/25 border-t-primary rounded-full animate-spin" />
              <Cpu className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-display font-bold text-foreground text-sm">Compiling Niche Modules</h3>
            <p className="text-xs text-primary font-semibold animate-pulse">{stepMessage}</p>
          </div>
          
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">{progress}% Complete</span>
        </div>
      )}

      {state === "completed" && project?.aiGeneratedData && (
        <div className="space-y-6">
          {/* Overview display */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-border pb-4">
              <h3 className="font-display font-semibold text-foreground text-sm flex items-center">
                <Globe className="h-4 w-4 mr-2 text-primary" /> Generated Plan Overview
              </h3>
              <button
                onClick={() => setState("idle")}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold"
              >
                Re-Generate
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="border border-border p-4 rounded-lg bg-background/50 text-xs">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Website Title</span>
                <p className="font-semibold text-foreground mt-1">{project.aiGeneratedData.websiteName}</p>
              </div>

              <div className="border border-border p-4 rounded-lg bg-background/50 text-xs">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Industry</span>
                <p className="font-semibold text-foreground mt-1">{project.aiGeneratedData.industry}</p>
              </div>

              <div className="border border-border p-4 rounded-lg bg-background/50 text-xs">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Aesthetic Style</span>
                <p className="font-semibold text-foreground mt-1">{project.aiGeneratedData.style}</p>
              </div>
            </div>

            {/* SEO section */}
            {project.aiGeneratedData.seo && (
              <div className="border border-border p-4 rounded-lg bg-muted/20 text-xs space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">SEO Meta Specifications</span>
                <p className="text-foreground font-semibold">Title: <span className="font-normal text-muted-foreground">{project.aiGeneratedData.seo.title}</span></p>
                <p className="text-foreground font-semibold">Description: <span className="font-normal text-muted-foreground">{project.aiGeneratedData.seo.description}</span></p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pages list */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h4 className="font-display font-semibold text-foreground text-xs uppercase tracking-wider text-slate-400">Layout Page Outline</h4>
              <div className="space-y-3">
                {project.aiGeneratedData.pages?.map((pg: GeneratedPage, idx: number) => (
                  <div key={idx} className="border border-border rounded-lg bg-background/50 p-4 space-y-2">
                    <span className="font-bold text-foreground text-xs">{pg.name}</span>
                    <ul className="list-disc pl-4 text-[10px] text-muted-foreground space-y-1">
                      {pg.sections?.map((sec: string, sIdx: number) => (
                        <li key={sIdx}>{sec}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Components inventory */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4 h-fit">
              <h4 className="font-display font-semibold text-foreground text-xs uppercase tracking-wider text-slate-400">Target Interactive Widgets</h4>
              <div className="space-y-3.5">
                {project.aiGeneratedData.components?.map((comp: GeneratedComponent, idx: number) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="h-7 w-7 rounded bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{comp.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{comp.purpose}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {state === "failed" && (
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm text-center max-w-xl mx-auto space-y-6 py-12">
          <div className="flex justify-center text-red-500">
            <AlertCircle className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display font-bold text-foreground text-sm">Compilation Interrupted</h3>
            <p className="text-xs text-red-400 font-semibold">{error}</p>
          </div>
          
          <button
            onClick={() => setState("idle")}
            className="h-10 rounded-lg bg-primary text-primary-foreground font-semibold text-xs px-6 hover:bg-primary/95 transition-colors"
          >
            Retry Config Generation
          </button>
        </div>
      )}
    </div>
  );
}
