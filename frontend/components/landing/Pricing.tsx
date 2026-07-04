"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      priceMonthly: 0,
      priceYearly: 0,
      description: "Ideal for testing layout generation capabilities.",
      features: [
        "3 AI layout generations / mo",
        "Responsive canvas previewer",
        "Basic Google Fonts access",
        "Local sandbox saves",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      priceMonthly: 29,
      priceYearly: 23,
      description: "Perfect for freelancers and scaling web creators.",
      features: [
        "Unlimited AI generations",
        "Clean semantic code export",
        "Domain mapping connections",
        "Priority queue processing",
        "Advanced premium copy blocks",
      ],
      cta: "Go Pro",
      popular: true,
    },
    {
      name: "Agency",
      priceMonthly: 99,
      priceYearly: 79,
      description: "Built for scaling agencies managing client portfolios.",
      features: [
        "Includes all Pro benefits",
        "Dedicated Client portal access",
        "Client branding control (white label)",
        "Collaborator accounts (up to 5)",
        "Premium support channels",
      ],
      cta: "Launch Agency",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-2xl text-center mb-10">
        <h2 className="text-base font-semibold leading-7 text-primary">SaaS Plans</h2>
        <p className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Simple, transparent pricing
        </p>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground">
          Scale your design deliverables. Start free and upgrade to unlock exports and client modules.
        </p>
      </div>

      {/* Toggle button */}
      <div className="flex justify-center items-center space-x-4 mb-16">
        <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
        <button
          onClick={() => setIsYearly(!isYearly)}
          className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary/25 transition-colors focus:outline-none"
          aria-label="Toggle Billing Frequency"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform ${
              isYearly ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className={`text-sm font-medium flex items-center ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
          Yearly
          <span className="ml-1.5 inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
            Save 20%
          </span>
        </span>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = isYearly ? plan.priceYearly : plan.priceMonthly;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col justify-between p-8 rounded-2xl border bg-card shadow-sm transition-all ${
                  plan.popular ? "border-primary glow-indigo scale-[1.02] z-10" : "border-border hover:border-primary/20"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="font-display font-bold text-foreground text-lg">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                  </div>
                  
                  <div className="my-6 flex items-baseline">
                    <span className="font-display text-4xl font-extrabold text-foreground">${price}</span>
                    <span className="text-sm font-medium text-muted-foreground ml-1">/mo</span>
                  </div>

                  <ul className="space-y-3.5 border-t border-border pt-6 text-xs text-muted-foreground">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href="/register"
                    id={`btn_pricing_select_${plan.name.toLowerCase()}`}
                    className={`w-full text-center h-10 rounded-lg font-medium text-xs transition-colors flex items-center justify-center ${
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/95 shadow shadow-primary/25"
                        : "border border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
