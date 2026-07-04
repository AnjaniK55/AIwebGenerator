"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, MessageSquare, BookOpen, HelpCircle, ArrowRight } from "lucide-react";

const cmsModules = [
  {
    href: "/admin/cms/services",
    title: "Agency Services",
    description: "Manage feature capabilities grid cards served on the landing page.",
    icon: Sparkles,
    color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
  },
  {
    href: "/admin/cms/testimonials",
    title: "Client Testimonials",
    description: "Publish ratings, reviews, and corporate client references.",
    icon: MessageSquare,
    color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  },
  {
    href: "/admin/cms/blogs",
    title: "Blogs & Articles",
    description: "Compose niche platform blogs, articles, and documentation.",
    icon: BookOpen,
    color: "text-sky-400 border-sky-500/20 bg-sky-500/5",
  },
  {
    href: "/admin/cms/faqs",
    title: "FAQs Accordion",
    description: "Maintain collapsible question cards and user onboarding guides.",
    icon: HelpCircle,
    color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
  },
];

export default function CMSOverview() {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-white text-xl tracking-tight">Content Management System (CMS)</h2>
        <p className="text-xs text-slate-400 mt-1">Publish, edit, and organize marketing contents for the landing page</p>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cmsModules.map((mod, idx) => {
          const Icon = mod.icon;
          return (
            <div
              key={idx}
              className={`rounded-2xl border p-6 flex flex-col justify-between h-56 transition-all hover:scale-[1.01] ${mod.color}`}
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-lg border border-current/20 flex items-center justify-center bg-slate-950/20">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-sm">{mod.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{mod.description}</p>
                </div>
              </div>

              <Link
                href={mod.href}
                id={`btn_admin_cms_go_${mod.title.toLowerCase().replace(/\s+/g, "_")}`}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white mt-4 hover:underline"
              >
                <span>Manage Collection</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
