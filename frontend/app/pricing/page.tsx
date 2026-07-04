"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Check, ArrowRight, Star } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Starter Free",
    price: "$0",
    period: "forever",
    description: "Launch your business workspace with basic AI compiler utilities.",
    features: [
      "3 AI Generation Credits",
      "Basic Dashboard Management",
      "Single Project Workspace",
      "Community Onboarding support",
    ],
    cta: "Current Plan",
    popular: false,
    color: "border-slate-800 bg-slate-900/40 text-slate-400",
  },
  {
    id: "pro",
    name: "Professional Pro",
    price: "$19",
    period: "monthly",
    description: "Scale your output with unlimited project codes and advanced export files.",
    features: [
      "50 AI Generation Credits",
      "Full Layout Export Options",
      "Priority AI Response speeds",
      "Obsidian Glassmorphic UI kits",
      "Email & Technical support",
    ],
    cta: "Upgrade to Pro",
    popular: true,
    color: "border-indigo-500/30 bg-slate-900/80 ring-2 ring-indigo-500/20 text-white",
  },
  {
    id: "agency",
    name: "Elite Agency",
    price: "$49",
    period: "monthly",
    description: "Complete agency package supporting client portals and white-label options.",
    features: [
      "200 AI Generation Credits",
      "Unlimited Project Workspaces",
      "Client Management dashboard",
      "Custom domain mappings",
      "24/7 dedicated support",
    ],
    cta: "Scale to Agency",
    popular: false,
    color: "border-slate-800 bg-slate-900/40 text-slate-400",
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") {
      router.push("/dashboard");
      return;
    }

    if (!user) {
      router.push(`/login?redirect=/pricing`);
      return;
    }

    setLoadingPlan(planId);
    try {
      const response = await apiClient<{ success: boolean; url: string }>("/payment/create-checkout", {
        method: "POST",
        body: JSON.stringify({ plan: planId }),
      });

      if (response.success && response.url) {
        // Direct redirect to Stripe billing session URL
        window.location.href = response.url;
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Failed to open Stripe billing.";
      alert(errMsg);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="relative isolate min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center px-6 py-20 lg:py-32">
      {/* Background glow blur */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#818cf8] to-[#c084fc] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl text-center space-y-4 mb-16">
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3.5 py-1 rounded-full">
          Billing Plans
        </span>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
          Flexible Pricing for Growing Agencies
        </h2>
        <p className="max-w-xl mx-auto text-sm text-slate-400 leading-relaxed">
          Upgrade your workspace to unlock advanced layouts, code export options, and client portals
        </p>
      </div>

      {/* Plans list */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((p) => {
          const isCurrent = user?.subscriptionPlan === p.id;
          return (
            <div
              key={p.id}
              className={`rounded-2xl border p-8 flex flex-col justify-between shadow-2xl relative transition-all duration-250 hover:scale-[1.01] ${p.color}`}
            >
              {p.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-bold text-[9px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg shadow-indigo-600/30 flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-white" /> <span>Most Popular</span>
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-white text-base">{p.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed h-10">{p.description}</p>
                </div>

                <div className="flex items-baseline space-x-1 border-b border-slate-800/80 pb-6">
                  <span className="font-display font-extrabold text-4xl text-white tracking-tight">{p.price}</span>
                  <span className="text-xs text-slate-400">/{p.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3.5 text-xs text-slate-300">
                  {p.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-3">
                      <Check className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSubscribe(p.id)}
                disabled={loadingPlan !== null || isCurrent}
                id={`btn_pricing_subscribe_${p.id}`}
                className={`w-full h-11 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 mt-8 ${
                  isCurrent
                    ? "bg-slate-800 text-slate-500 cursor-default"
                    : p.popular
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : "bg-slate-800 hover:bg-slate-750 text-white"
                }`}
              >
                {loadingPlan === p.id ? (
                  <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isCurrent ? "Current Plan" : p.cta}</span>
                    {!isCurrent && <ArrowRight className="h-4 w-4" />}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
