"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="relative isolate min-h-[80vh] flex items-center justify-center px-6 py-12">
      {/* Background Glow */}
      <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#818cf8] to-[#c084fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl glassmorphism">
        <div className="flex flex-col items-center mb-8">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 mb-4">
            <Sparkles className="h-6 w-6" />
          </span>
          <h2 className="font-display text-2xl font-bold text-white text-center">Reset Password</h2>
          <p className="text-sm text-slate-400 text-center mt-1">We will send a password reset link to your email</p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center text-emerald-400">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h3 className="font-semibold text-white">Reset link sent!</h3>
            <p className="text-sm text-slate-400">
              Please check your inbox at <span className="text-white font-medium">{email}</span> for instructions.
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                id="link_back_to_login_success"
                className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  id="forgot_email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn_forgot_submit"
              className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors flex items-center justify-center"
            >
              Send Reset Instructions
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                id="link_back_to_login_form"
                className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
