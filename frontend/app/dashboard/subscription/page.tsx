"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types";
import { Sparkles, Calendar, CreditCard, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface SubscriptionDetails {
  subscription: {
    _id: string;
    plan: "free" | "pro" | "agency";
    status: string;
    startDate: string;
    endDate: string;
  } | null;
  usage: {
    plan: "free" | "pro" | "agency";
    status: string;
    expiry: string | null;
    used: number;
    limit: number;
  };
}

export default function SubscriptionDashboard() {
  const [data, setData] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);

  const fetchSubscription = async () => {
    try {
      const response = await apiClient<ApiResponse<SubscriptionDetails>>("/subscription");
      if (response.success && response.data) {
        setData(response.data);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load subscription.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleCancelRenewal = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription renewal? Your premium features will remain active until the end of your billing cycle.")) {
      return;
    }

    setCanceling(true);
    try {
      const response = await apiClient<ApiResponse<void>>("/subscription/cancel", {
        method: "POST",
      });
      if (response.success) {
        alert("Subscription renewal canceled successfully.");
        fetchSubscription();
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to cancel renewal.";
      alert(errMsg);
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Loading subscription dashboard...</p>
      </div>
    );
  }

  const usage = data?.usage;
  const isCanceled = usage?.status === "canceled";
  const isFree = usage?.plan === "free";

  // Calculate progress percentage
  const used = usage?.used || 0;
  const limit = usage?.limit || 3;
  const percent = Math.min((used / limit) * 100, 100);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-white text-xl tracking-tight">Subscription Dashboard</h2>
        <p className="text-xs text-slate-400 mt-1">Manage billing plans and monitor AI compiling credits usage</p>
      </div>

      {error && (
        <div className="flex items-start space-x-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier Details Card */}
        <div className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
            <CreditCard className="h-5 w-5 text-indigo-400" />
            <h3 className="font-display font-bold text-white text-sm">Billing Details</h3>
          </div>

          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Current Plan Tier</span>
              <p className="font-display font-extrabold text-xl text-white tracking-tight uppercase">
                {usage?.plan} Membership
              </p>
              <div className="flex items-center space-x-1.5 mt-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Status: {usage?.status || "inactive"}
                </span>
              </div>
            </div>

            <div className="text-right">
              {!isFree && usage?.expiry && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-end">
                    <Calendar className="h-3 w-3 mr-1" /> {isCanceled ? "Expires On" : "Next Renewal Date"}
                  </span>
                  <p className="text-xs font-semibold text-white">
                    {new Date(usage.expiry).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-850">
            {isFree ? (
              <Link
                href="/pricing"
                id="btn_dashboard_pricing_upgrade"
                className="h-10 px-5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Upgrade Plan Tiers</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/pricing"
                  id="btn_dashboard_pricing_upgrade"
                  className="h-10 px-5 rounded bg-slate-850 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span>Modify Plan Tiers</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                {!isCanceled && (
                  <button
                    onClick={handleCancelRenewal}
                    disabled={canceling}
                    id="btn_dashboard_pricing_cancel"
                    className="h-10 px-5 rounded border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 font-semibold text-xs transition-colors flex items-center justify-center"
                  >
                    {canceling ? "Canceling renewal..." : "Cancel Renewal"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* AI Generations Limit details */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <h3 className="font-display font-bold text-white text-xs">AI Compiler Credits</h3>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Credits Remaining</span>
              <p className="font-display font-extrabold text-2xl text-white tracking-tight">
                {limit - used} <span className="text-xs text-slate-500 font-normal">/ {limit} left</span>
              </p>
            </div>

            {/* Progress indicators bar */}
            <div className="space-y-2">
              <div className="h-2 w-full rounded bg-slate-950 overflow-hidden">
                <div
                  className="h-full rounded bg-indigo-500 transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-semibold text-slate-500 uppercase">
                <span>{used} Used</span>
                <span>{percent.toFixed(0)}%</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 leading-normal mt-6">
            AI credits reset monthly. Unused credits do not roll over to the subsequent billing cycle.
          </p>
        </div>
      </div>
    </div>
  );
}
