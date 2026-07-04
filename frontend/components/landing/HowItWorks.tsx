"use client";

import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Describe your website",
      description: "Type a descriptive prompt highlighting your target niche, layout features, styles, and menu options.",
    },
    {
      num: "02",
      title: "AI generates design",
      description: "Watch our machine-learning layouts engine compile responsive stylesheet tokens and content in seconds.",
    },
    {
      num: "03",
      title: "Customize website",
      description: "Fine-tune individual section texts, modify visual themes, and swap layouts in real time.",
    },
    {
      num: "04",
      title: "Publish website",
      description: "Instantly deploy your site to static CDNs or download full codebase templates directly.",
    },
  ];

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-base font-semibold leading-7 text-primary">Interactive Flow</h2>
        <p className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Four steps to launch
        </p>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground">
          Our automated pipeline manages code architecture so you can focus entirely on client relationships.
        </p>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Connector Line for Desktop */}
          <div className="absolute top-[26px] left-[10%] right-[10%] h-0.5 border-t border-dashed border-border hidden md:block z-0" />

          {steps.map((step) => (
            <div key={step.num} className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
              {/* Number Badge */}
              <div className="h-12 w-12 rounded-full border border-primary/25 bg-background text-primary flex items-center justify-center font-display font-bold text-sm shadow-lg shadow-primary/10">
                {step.num}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-display font-semibold text-foreground text-base">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
