"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Code2, Globe2, Layers, Cpu } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  // Mock SaaS startup logos for trust section
  const trustLogos = [
    { name: "Vercel", icon: <Layers className="h-4 w-4 mr-1.5 text-slate-500 group-hover:text-foreground" /> },
    { name: "Stripe", icon: <Layers className="h-4 w-4 mr-1.5 text-slate-500 group-hover:text-foreground" /> },
    { name: "Linear", icon: <Layers className="h-4 w-4 mr-1.5 text-slate-500 group-hover:text-foreground" /> },
    { name: "Supabase", icon: <Layers className="h-4 w-4 mr-1.5 text-slate-500 group-hover:text-foreground" /> },
    { name: "Framer", icon: <Layers className="h-4 w-4 mr-1.5 text-slate-500 group-hover:text-foreground" /> },
  ];

  return (
    <section className="relative isolate overflow-hidden pt-20 pb-24 sm:pb-32 bg-background">
      {/* Ambient background glow mesh */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-25 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            {/* Sparkle Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold leading-5 text-primary shadow-sm shadow-primary/5">
                <Sparkles className="h-3.5 w-3.5 mr-1 animate-pulse" />
                Next-Generation AI Website Builder
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl text-gradient leading-[1.05] max-w-3xl"
            >
              Build Professional Client Websites With AI In Minutes
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground"
            >
              Streamline your agency workflow. Generate custom Tailwind responsive layouts, write copywriting drafts, and deploy clean code structures instantly.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex items-center justify-center gap-x-4"
            >
              <Link
                href="#demo"
                id="btn_hero_generate"
                className="rounded-lg bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all flex items-center group"
              >
                Launch Sandbox
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/register"
                id="btn_hero_register"
                className="rounded-lg border border-border bg-card/50 hover:bg-muted/80 px-6 py-3 text-xs font-bold uppercase tracking-wider text-foreground transition-all"
              >
                Start Free Portal
              </Link>
            </motion.div>

            {/* SaaS Trust Section */}
            <motion.div
              variants={itemVariants}
              className="mt-12 w-full max-w-xl border-t border-border/60 pt-8"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-4">
                Trusted by modern digital builders and agencies
              </p>
              <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
                {trustLogos.map((logo) => (
                  <div
                    key={logo.name}
                    className="flex items-center text-xs font-semibold text-slate-500 hover:text-foreground cursor-pointer transition-colors group"
                  >
                    {logo.icon}
                    <span>{logo.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* High-Fidelity Browser Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
          className="mt-16 sm:mt-24 flex justify-center"
        >
          <div className="relative w-full max-w-5xl rounded-2xl bg-card border border-border p-2.5 sm:p-4 shadow-2xl overflow-hidden glow-indigo">
            <div className="rounded-xl border border-border bg-background overflow-hidden aspect-[16/10] flex flex-col">
              
              {/* Window controls bar */}
              <div className="flex h-11 sm:h-12 items-center justify-between border-b border-border bg-muted/30 px-4">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex h-6 w-52 sm:w-96 items-center justify-center rounded-lg border border-border bg-background/55 text-[10px] text-muted-foreground font-mono">
                  manjuweb.agency/dashboard/projects/new
                </div>
                <div className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Workspace Mock Content */}
              <div className="flex-grow bg-background grid grid-cols-6 text-[11px] overflow-hidden">
                {/* Left Sidebar controls */}
                <div className="col-span-1 border-r border-border bg-card/30 p-4 space-y-5 hidden md:block">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground">Style Presets</span>
                    <div className="h-7 rounded border border-primary/25 bg-primary/5 text-primary flex items-center px-2 font-semibold">
                      <Layers className="h-3.5 w-3.5 mr-1.5" /> Obsidian Neon
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground">Layout Settings</span>
                    <div className="space-y-1">
                      {["Navbar Settings", "Hero Grid", "Benefit Features", "Footer Layout"].map((item) => (
                        <div key={item} className="h-6 rounded bg-muted/40 hover:bg-muted text-muted-foreground flex items-center px-2 hover:text-foreground cursor-pointer transition-colors">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Work Canvas */}
                <div className="col-span-6 md:col-span-5 flex flex-col p-6 space-y-6 overflow-y-auto">
                  {/* Top Canvas header */}
                  <div className="flex justify-between items-center border-b border-border pb-4">
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-4 w-4 text-primary" />
                      <span className="font-display font-bold text-foreground">AeroFit Gym Website</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-500/10 text-emerald-400">Deployed</span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-7 rounded border border-border bg-card text-foreground px-3 flex items-center font-semibold text-[10px]">
                        <Code2 className="h-3.5 w-3.5 mr-1" /> Export Code
                      </div>
                      <div className="h-7 rounded bg-primary text-primary-foreground px-3 flex items-center font-semibold text-[10px]">
                        <Globe2 className="h-3.5 w-3.5 mr-1" /> Launch Live
                      </div>
                    </div>
                  </div>

                  {/* Mock Compiled Landing Preview */}
                  <div className="flex-grow border border-border rounded-xl bg-card p-6 flex flex-col space-y-8 relative overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground pb-4 border-b border-border/50">
                      <span className="font-bold text-foreground">AeroFit.</span>
                      <div className="flex space-x-3">
                        <span>Classes</span>
                        <span>Schedule</span>
                        <span>Pricing</span>
                      </div>
                    </div>

                    {/* Hero */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center py-6">
                      <div className="space-y-3">
                        <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">New Classes Open</span>
                        <h4 className="font-display font-extrabold text-foreground text-lg leading-tight">Forge your ultimate physical structure.</h4>
                        <p className="text-[10px] text-muted-foreground">AI-configured coaching, progress metrics calendars, and custom nutritional guidance packages.</p>
                      </div>
                      <div className="rounded-xl border border-border bg-background p-4 aspect-[4/3] flex flex-col justify-between">
                        <div className="flex justify-between items-center border-b border-border pb-2 text-[9px] text-muted-foreground font-mono">
                          <span>Live Memberships</span>
                          <span>Active Now</span>
                        </div>
                        <div className="flex items-baseline space-x-1.5 py-2">
                          <span className="font-display font-extrabold text-2xl text-foreground">1,240</span>
                          <span className="text-[9px] text-emerald-400 font-bold">+15% this wk</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
