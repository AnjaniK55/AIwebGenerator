"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
  const faqs = [
    {
      q: "How does AI website generation work?",
      a: "Our AI analysis system parses your prompt to map section requirements, drafts a custom Tailwind UI design theme, generates copywriting copy, and delivers a fully responsive React layout in seconds.",
    },
    {
      q: "Can I edit generated websites?",
      a: "Yes! Using our interactive editor canvas, you can customize text, rearrange sections, swap colors, update image prompts, and hook up contact form routing immediately.",
    },
    {
      q: "Can I export code?",
      a: "Absolutely. Subscribers on the Pro and Agency tiers can instantly export clean, structured HTML/CSS templates or fully modular Next.js components ready to deploy.",
    },
    {
      q: "Is it suitable for agencies?",
      a: "Yes, our Agency tier features full multi-tenant client workspace management, white-label portals, revision feedback trackers, and custom domain mapping controls designed for agency scale.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="mx-auto max-w-7xl px-6 py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-base font-semibold leading-7 text-primary">Got Questions?</h2>
        <p className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Frequently asked questions
        </p>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground">
          Learn about our website compiler, custom exports, and agency integrations.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = activeIndex === index;
          return (
            <div
              key={index}
              className="rounded-xl border border-border bg-card overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-display font-semibold text-foreground text-sm focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-5 pt-4 text-xs text-muted-foreground leading-relaxed border-t border-border/5">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
