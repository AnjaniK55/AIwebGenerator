"use client";

import React, { useState } from "react";
import { Mail, User, MessageSquare, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError("Please fill out all fields.");
      return;
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setError("Please provide a valid email address.");
      return;
    }

    setError(null);
    setSending(true);

    // Simulate API delay
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-base font-semibold leading-7 text-primary">Get In Touch</h2>
        <p className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Connect with our team
        </p>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground">
          Have customized software requirements or agency inquiries? Submit details below.
        </p>
      </div>

      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          {success ? (
            <div className="text-center space-y-4 py-8">
              <div className="flex justify-center text-emerald-400">
                <CheckCircle className="h-12 w-12" />
              </div>
              <h3 className="font-display font-semibold text-white text-lg">Message Sent!</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Thank you for contacting us. Our agency support desk will get back to you shortly.
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  setName("");
                  setEmail("");
                  setMessage("");
                }}
                className="mt-6 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-background border border-border text-foreground placeholder-slate-500 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-background border border-border text-foreground placeholder-slate-500 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Message</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your project..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-slate-500 focus:outline-none focus:border-primary transition-colors text-sm resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full h-11 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-medium text-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{sending ? "Sending..." : "Submit Message"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
