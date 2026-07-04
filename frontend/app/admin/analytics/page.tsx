"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types";
import { TrendingUp, Sparkles, FolderKanban, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";

interface AnalyticsData {
  stats: {
    totalUsers: number;
    totalProjects: number;
    totalClients: number;
    completedProjects: number;
    aiGenerations: number;
  };
  userGrowth: Array<{ _id: { year: number; month: number }; count: number }>;
  projectGrowth: Array<{ _id: { year: number; month: number }; count: number }>;
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchAnalytics = async () => {
      try {
        const response = await apiClient<ApiResponse<AnalyticsData>>("/admin/analytics");
        if (response.success && response.data) {
          setData(response.data);
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Failed to load analytics.";
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  interface GrowthItem {
    _id: { year: number; month: number };
    count: number;
  }

  const formatGrowthData = (growthArray: GrowthItem[]) => {
    return growthArray.map((item) => {
      const monthLabel = monthNames[item._id.month - 1] || `${item._id.month}`;
      return {
        name: `${monthLabel} ${item._id.year.toString().slice(-2)}`,
        Count: item.count,
      };
    });
  };

  const userChartData = data ? formatGrowthData(data.userGrowth) : [];
  const projectChartData = data ? formatGrowthData(data.projectGrowth) : [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Compiling analytical data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-white text-xl tracking-tight">Platform Analytics</h2>
        <p className="text-xs text-slate-400 mt-1">Deep-dive metrics charting user registrations and website compiler completions</p>
      </div>

      {error && (
        <div className="flex items-start space-x-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Primary Analytics Charts */}
      {isMounted && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">User Registrations Tracker</h3>
              </div>
              <div className="h-72">
                {userChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                      <Line type="monotone" dataKey="Count" stroke="#6366f1" strokeWidth={2} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">No registration logs</div>
                )}
              </div>
            </div>

            {/* Project Creations */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <FolderKanban className="h-4 w-4 text-sky-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Creation rates</h3>
              </div>
              <div className="h-72">
                {projectChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projectChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                      <Area type="monotone" dataKey="Count" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.08} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">No project creation logs</div>
                )}
              </div>
            </div>
          </div>

          {/* Combined AI generation bar chart */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Compiler completions distribution</h3>
            </div>
            <div className="h-72">
              {data && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Total Users", Count: data.stats.totalUsers, fill: "#6366f1" },
                      { name: "Total Projects", Count: data.stats.totalProjects, fill: "#38bdf8" },
                      { name: "AI Compiled", Count: data.stats.aiGenerations, fill: "#fbbf24" },
                      { name: "Completed Sites", Count: data.stats.completedProjects, fill: "#10b981" },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                    <Bar dataKey="Count" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
