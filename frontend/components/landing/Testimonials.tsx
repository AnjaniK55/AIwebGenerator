"use client";

import React from "react";
import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Marcus Aurelius",
      role: "CEO at Roman Design Co.",
      review: "Manju Web Agency's AI builder has completely transformed how we prototype. We generate beautiful, ready-to-customize layouts in seconds. It has cut our delivery cycles in half!",
      rating: 5,
    },
    {
      name: "Serena Williams",
      role: "Marketing Manager at Sportly",
      review: "The ease of use is unparalleled. I needed a landing page for our new sports drinks campaign, and the generator created a modern, fully responsive layout that fits our brand beautifully.",
      rating: 5,
    },
    {
      name: "Ken Thompson",
      role: "Lead Architect at Unix Labs",
      review: "Unlike other AI code builders that output messy, unreadable code, the code generated here is clean, structural, and uses modular Next.js components. High engineering standard.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-6 py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-base font-semibold leading-7 text-primary">Client Reviews</h2>
        <p className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          What creators say about us
        </p>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground">
          See how designers, freelancers, and full-scale agencies leverage our layouts generator.
        </p>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="flex flex-col justify-between p-6 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/20 transition-all"
            >
              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex space-x-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  &ldquo;{review.review}&rdquo;
                </p>
              </div>

              <div className="mt-6 border-t border-border pt-4 flex items-center space-x-3">
                <div className="h-9 w-9 rounded-full bg-primary/15 text-primary font-bold text-xs flex items-center justify-center font-display uppercase">
                  {review.name.substring(0, 2)}
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground text-xs">{review.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
