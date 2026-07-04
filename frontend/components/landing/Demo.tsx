"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Play, RotateCcw, Check, Sparkles, Layout, Cpu } from "lucide-react";

type DemoStatus = "idle" | "processing" | "completed";

const samplePrompts = [
  "Create a restaurant website with booking system",
  "Create a fitness trainer portfolio with schedule",
  "Create a real estate landing page with home listings",
];

const steps = [
  { threshold: 15, message: "Analyzing prompt structure..." },
  { threshold: 40, message: "Drafting layouts & sections..." },
  { threshold: 70, message: "Writing tailwind stylesheets..." },
  { threshold: 90, message: "Compiling interactive react nodes..." },
  { threshold: 100, message: "Finalizing assets build..." },
];

export default function Demo() {
  const [prompt, setPrompt] = useState("Create a restaurant website with booking system");
  const [status, setStatus] = useState<DemoStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [stepMessage, setStepMessage] = useState("AI Engine Idle");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "processing") {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 8) + 4;
          if (next >= 100) {
            clearInterval(interval);
            setStatus("completed");
            return 100;
          }
          // Update status messages based on current progress threshold
          const currentStep = steps.find((s) => next <= s.threshold);
          if (currentStep) {
            setStepMessage(currentStep.message);
          }
          return next;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setStatus("processing");
  };

  const handleReset = () => {
    setStatus("idle");
    setProgress(0);
    setStepMessage("AI Engine Idle");
  };

  return (
    <section id="demo" className="mx-auto max-w-7xl px-6 py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h2 className="text-base font-semibold leading-7 text-primary">Interactive Preview</h2>
        <p className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          See the generator in action
        </p>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground">
          Type a custom prompt or choose one of our presets, and click Generate to see the AI website build workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Control Console */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Prompt Input</h3>
            
            <form onSubmit={handleStart} className="space-y-4">
              <textarea
                value={prompt}
                disabled={status !== "idle"}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary disabled:opacity-60 resize-none font-medium"
                placeholder="Describe your dream website..."
              />

              {status === "idle" && (
                <div className="flex flex-wrap gap-2">
                  {samplePrompts.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPrompt(p)}
                      className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-muted hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all font-semibold"
                    >
                      {p.replace("Create a ", "").split(" with")[0]}
                    </button>
                  ))}
                </div>
              )}

              {status === "idle" ? (
                <button
                  type="submit"
                  className="w-full h-11 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary/20"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Generate Website</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full h-11 rounded-lg border border-border hover:bg-muted text-foreground font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset Demo</span>
                </button>
              )}
            </form>
          </div>

          {/* AI Terminal output logs */}
          <div className="rounded-xl border border-border bg-slate-950 p-6 shadow-xl font-mono text-[11px] text-slate-300 space-y-3 min-h-[150px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 text-slate-500">
              <span className="flex items-center"><Terminal className="h-3.5 w-3.5 mr-1.5" /> Compiler Logs</span>
              <span>v1.0.0</span>
            </div>
            
            <div className="flex-1 space-y-1.5 py-2">
              <p className="text-slate-500">&gt; npm run compiler --prompt=&quot;{prompt.substring(0, 35)}...&quot;</p>
              {status === "processing" && (
                <>
                  <p className="text-primary animate-pulse">Running: {stepMessage}</p>
                  <p className="text-muted-foreground">Progress: [{Array(Math.floor(progress / 5)).fill("■").join("")}{Array(20 - Math.floor(progress / 5)).fill("░").join("")}] {progress}%</p>
                </>
              )}
              {status === "completed" && (
                <>
                  <p className="text-emerald-400">✓ Compile Success: Responsive React Nodes created.</p>
                  <p className="text-emerald-400">✓ Deployment: Build deployed on local web workspace.</p>
                </>
              )}
              {status === "idle" && (
                <p className="text-slate-500">Waiting for compiler instructions...</p>
              )}
            </div>
          </div>
        </div>

        {/* Output Screen (AI Website Assembly Viewport) */}
        <div className="lg:col-span-7 rounded-2xl border border-border bg-card shadow-2xl p-4 min-h-[420px] flex flex-col overflow-hidden">
          {/* Header controls mock */}
          <div className="h-8 border-b border-border bg-muted/20 px-3 flex items-center justify-between text-[10px] text-muted-foreground font-mono mb-4 rounded-lg">
            <span className="flex items-center space-x-1.5">
              <Layout className="h-3.5 w-3.5" />
              <span>sandbox-viewport-live.web</span>
            </span>
          </div>

          <div className="flex-grow flex items-center justify-center p-4 bg-background border border-dashed border-border rounded-xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center space-y-3 p-8"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="h-6 w-6 animate-pulse" />
                  </div>
                  <h4 className="font-display font-semibold text-foreground text-sm">Interactive Sandbox Port</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    Type a business description on the left panel and watch layout components assemble here in real-time.
                  </p>
                </motion.div>
              )}

              {/* Dynamic Step-by-Step Compilation view */}
              {status === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col justify-between space-y-6"
                >
                  {/* Step 1: 15%+ Header skeleton */}
                  {progress >= 15 && (
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="flex justify-between items-center py-2.5 border-b border-border/50 text-[10px]"
                    >
                      <div className="h-4 w-12 rounded bg-muted/60 animate-pulse" />
                      <div className="flex space-x-2">
                        <div className="h-3 w-8 rounded bg-muted/60 animate-pulse" />
                        <div className="h-3 w-8 rounded bg-muted/60 animate-pulse" />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: 40%+ Hero draft lines */}
                  {progress >= 40 && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-3 py-6"
                    >
                      <div className="h-3 w-20 rounded bg-primary/20 animate-pulse" />
                      <div className="h-6 rounded bg-muted w-3/4 animate-pulse" />
                      <div className="h-4 rounded bg-muted w-5/6 animate-pulse" />
                    </motion.div>
                  )}

                  {/* Step 3: 70%+ Tailwind details styling */}
                  {progress >= 70 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border border-primary/20 rounded-lg p-4 bg-primary/5 flex justify-between items-center text-[10px]"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-primary">Obsidian Neon Theme Loaded</p>
                        <p className="text-[9px] text-muted-foreground">Applying custom flex grids...</p>
                      </div>
                      <Cpu className="h-4 w-4 text-primary animate-spin" />
                    </motion.div>
                  )}

                  {/* Step 4: 90%+ Final compilations */}
                  {progress >= 90 && (
                    <motion.div
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="h-10 rounded border border-border bg-card animate-pulse" />
                      <div className="h-10 rounded border border-border bg-card animate-pulse" />
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Completed State */}
              {status === "completed" && (
                <motion.div
                  key="completed"
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full h-full flex flex-col justify-between space-y-6"
                >
                  {/* Styled Header */}
                  <div className="flex justify-between items-center py-2.5 border-b border-border/60 text-[10px] font-semibold text-foreground">
                    <span className="font-display font-bold">BrandLab.</span>
                    <div className="flex space-x-3 text-muted-foreground text-[9px]">
                      <span>Features</span>
                      <span>Showcase</span>
                      <span>Pricing</span>
                    </div>
                  </div>

                  {/* Styled Hero block */}
                  <div className="space-y-3.5 py-4">
                    <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">AI GENERATED</span>
                    <h4 className="font-display font-extrabold text-foreground text-sm leading-tight">
                      Elevate your SaaS analytics dashboard workspace.
                    </h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Custom responsive layout grids integrated with chart dashboards, telemetry tracking systems, and lead gen funnel automations.
                    </p>
                  </div>

                  {/* Mock Features Cards grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-border bg-card rounded-lg space-y-1">
                      <span className="font-semibold text-foreground text-[10px] flex items-center"><Check className="h-3 w-3 mr-1 text-emerald-400" /> Interactive Nodes</span>
                      <p className="text-[9px] text-muted-foreground leading-tight">Fully modular React hooks configurations.</p>
                    </div>
                    <div className="p-3 border border-border bg-card rounded-lg space-y-1">
                      <span className="font-semibold text-foreground text-[10px] flex items-center"><Check className="h-3 w-3 mr-1 text-emerald-400" /> Tailwind Styles</span>
                      <p className="text-[9px] text-muted-foreground leading-tight">Clean stylesheets compiled instantly.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
