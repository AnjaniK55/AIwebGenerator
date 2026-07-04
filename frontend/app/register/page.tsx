"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { Sparkles, Mail, Lock, User, ShieldAlert } from "lucide-react";

export default function RegisterPage() {
  const { register, error, clearError, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    clearError();
    setFormError(null);
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setFormError("Please fill in all registration fields.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    setFormError(null);
    try {
      await register(name, email, password, confirmPassword);
    } catch {
      // Error state captured inside AuthContext
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
          <h2 className="font-display text-2xl font-bold text-white text-center">Create Account</h2>
          <p className="text-sm text-slate-400 text-center mt-1">Get started with a free agency client portal</p>
        </div>

        {(error || formError) && (
          <div className="mb-6 flex items-start space-x-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <ShieldAlert className="h-5 w-5 flex-shrink-0" />
            <span>{formError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                id="register_name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
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
                id="register_email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                id="register_password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                id="register_confirm_password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            id="btn_register_submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors flex items-center justify-center disabled:opacity-50 mt-2"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-8">
          Already have an account?{" "}
          <Link href="/login" id="link_go_to_login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
