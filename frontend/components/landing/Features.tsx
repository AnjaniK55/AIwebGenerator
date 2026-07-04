"use client";

import React from "react";
import { Sparkles, Zap, Smartphone, Search, Briefcase, Download } from "lucide-react";

export default function Features() {
  const featuresList = [
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "AI Website Generator",
      description: "Instantly draft entire layouts, content copy, custom styling, and structure components from simple prompts.",
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Fast Development",
      description: "Drastically cut prototyping time. Generate fully coded modules ready to deploy or integrate in minutes.",
    },
    {
      icon: <Smartphone className="h-6 w-6 text-primary" />,
      title: "Responsive Design",
      description: "Automatic layouts configured to scale flawlessly from mobile screens up to high-resolution desktop grids.",
    },
    {
      icon: <Search className="h-6 w-6 text-primary" />,
      title: "SEO Ready",
      description: "Clean semantic HTML structures, meta tags, and structured heading designs optimized for immediate indexing.",
    },
    {
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      title: "Agency Workflow",
      description: "Organize client workspaces, manage feedback revisions, map client accounts, and route status logs.",
    },
    {
      icon: <Download className="h-6 w-6 text-primary" />,
      title: "Export & Deploy",
      description: "Download semantic code assets as standard HTML/CSS templates or clean React hooks ready for servers.",
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-base font-semibold leading-7 text-primary">Core Advantages</h2>
        <p className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Engineered for performance & style
        </p>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground">
          Combine powerful automation with elite agency dashboard controls to build a modular developer pipeline.
        </p>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-start p-6 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/30 transition-all hover:bg-card-foreground/[0.01]"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 mb-5">
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-foreground text-base mb-2">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
