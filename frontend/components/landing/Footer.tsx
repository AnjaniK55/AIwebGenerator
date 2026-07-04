"use client";

import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/40 py-12 text-center text-xs text-muted-foreground">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start space-y-2">
          <Link href="/" className="font-display text-base font-bold tracking-tight text-foreground">
            Manju<span className="text-primary">Web</span>Agency
          </Link>
          <p className="text-[10px]">AI-Powered Design & Agency Management Systems.</p>
        </div>

        <div className="flex space-x-6">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </div>

        <div>
          <p>&copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
