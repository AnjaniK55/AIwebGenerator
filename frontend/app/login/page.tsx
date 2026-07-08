"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import Script from "next/script";
import { Sparkles, Mail, Lock, ShieldAlert, ArrowLeft } from "lucide-react";

interface GoogleAccountID {
  initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
  renderButton: (parent: HTMLElement | null, options: { theme?: string; size?: string; text?: string; shape?: string; width?: string }) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleAccountID;
      };
    };
  }
}

export default function LoginPage() {
  const { login, googleLogin, error, clearError, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    clearError();
    setFormError(null);
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setFormError("Please enter your email and password.");
      return;
    }
    setFormError(null);
    try {
      await login(email, password);
    } catch {
      // Error state captured inside AuthContext
    }
  };

  const handleGoogleCredentialResponse = useCallback(async (response: { credential: string }) => {
    try {
      await googleLogin(response.credential);
    } catch {
      // Error handled by AuthContext
    }
  }, [googleLogin]);

  useEffect(() => {
    const initGoogle = () => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (clientId && window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleBtnDiv"),
          {
            theme: "filled_blue",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
            width: "100%",
          }
        );
      }
    };

    if (window.google) {
      initGoogle();
    }
  }, [loading, handleGoogleCredentialResponse]);

  const handleMockGoogleLogin = async () => {
    try {
      await googleLogin("mock_google_token");
    } catch {
      // Error handled by AuthContext
    }
  };

  const showMockGoogle = !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

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

      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
          if (clientId && window.google) {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: handleGoogleCredentialResponse,
            });
            window.google.accounts.id.renderButton(
              document.getElementById("googleBtnDiv"),
              {
                theme: "filled_blue",
                size: "large",
                text: "signin_with",
                shape: "rectangular",
                width: "100%",
              }
            );
          }
        }}
      />

      <div className="w-full max-w-md flex flex-col gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors self-start ml-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <div className="w-full rounded-2xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl glassmorphism">
          <div className="flex flex-col items-center mb-8">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 mb-4">
            <Sparkles className="h-6 w-6" />
          </span>
          <h2 className="font-display text-2xl font-bold text-white text-center">Welcome Back</h2>
          <p className="text-sm text-slate-400 text-center mt-1">Sign in to your SaaS project dashboard</p>
        </div>

        {(error || formError) && (
          <div className="mb-6 flex items-start space-x-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <ShieldAlert className="h-5 w-5 flex-shrink-0" />
            <span>{formError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                id="login_email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
              <Link href="/forgot-password" id="link_forgot_password" className="text-xs text-indigo-400 hover:text-indigo-300">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                id="login_password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            id="btn_login_submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-950 px-2 text-slate-500">Or continue with</span>
          </div>
        </div>

        {/* Google sign-in container */}
        <div id="googleBtnDiv" className="w-full flex justify-center" />

        {showMockGoogle && (
          <button
            type="button"
            id="btn_mock_google"
            onClick={handleMockGoogleLogin}
            className="w-full h-11 border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center space-x-2 text-sm text-white mt-3"
          >
            <span className="text-indigo-400 font-semibold font-display">G</span>
            <span>Sign In with Mock Google</span>
          </button>
        )}

        <p className="text-center text-sm text-slate-400 mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/register" id="link_go_to_register" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign up
          </Link>
        </p>
      </div>
     </div>
    </div>
  );
}
