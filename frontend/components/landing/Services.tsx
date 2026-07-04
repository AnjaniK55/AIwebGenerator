"use client";

import React from "react";
import { Code, Brain, Layout, Settings, Terminal } from "lucide-react";

export default function Services() {
  const servicesList = [
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: "Website Development",
      description: "Custom high-performance web structures built using Next.js, Node, and headless CMS systems.",
    },
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "AI Solutions",
      description: "Integrating intelligent LLM pipelines, autonomous agents, and content generation inside client dashboards.",
    },
    {
      icon: <Layout className="h-6 w-6 text-primary" />,
      title: "UI/UX Design",
      description: "Stunning Figma architectures, wireframing, and custom interactive visual components for SaaS.",
    },
    {
      icon: <Settings className="h-6 w-6 text-primary" />,
      title: "Business Automation",
      description: "Configuring CRM funnels, payment routing, and workflow triggers to eliminate repetitive manual hours.",
    },
    {
      icon: <Terminal className="h-6 w-6 text-primary" />,
      title: "Custom Software",
      description: "Bespoke database architectures, custom Express microservices, and robust full-stack platforms.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28 border-t border-border bg-muted/10">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-base font-semibold leading-7 text-primary">Agency Services</h2>
        <p className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Complete engineering capabilities
        </p>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground">
          We leverage cutting-edge tech stacks to build robust, scalable business solutions customized for your growth.
        </p>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {servicesList.map((service) => (
            <div
              key={service.title}
              className="flex flex-col items-start p-6 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/30 transition-all"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 mb-5">
                {service.icon}
              </div>
              <h3 className="font-display font-semibold text-foreground text-base mb-2">
                {service.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
