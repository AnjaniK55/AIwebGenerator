"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types";
import { Users, FolderKanban, Sparkles, CheckCircle2, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

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
  recentUsers: Array<{ _id: string; name: string; email: string; createdAt: string; role: string }>;
}

export default function AdminOverview() {
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
        const errMsg = err instanceof Error ? err.message : "Failed to load platform analytics.";
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
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Aggregating Platform Logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center max-w-xl mx-auto space-y-4">
        <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
        <h3 className="font-display font-bold text-white text-sm">Analytics Load Failed</h3>
        <p className="text-xs text-slate-400">{error}</p>
      </div>
    );
  }

  const cards = [
    { label: "Total Registered Users", value: data?.stats.totalUsers || 0, icon: Users, color: "text-indigo-400 bg-indigo-500/10" },
    { label: "Active Website Projects", value: data?.stats.totalProjects || 0, icon: FolderKanban, color: "text-sky-400 bg-sky-500/10" },
    { label: "AI Generations Completed", value: data?.stats.aiGenerations || 0, icon: Sparkles, color: "text-amber-400 bg-amber-500/10" },
    { label: "Completed Deployments", value: data?.stats.completedProjects || 0, icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-white text-xl tracking-tight">Platform Overview</h2>
        <p className="text-xs text-slate-400 mt-1">Real-time SaaS user metrics and compiling trends</p>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{card.label}</span>
                <p className="font-display font-extrabold text-2xl text-white tracking-tight">{card.value}</p>
              </div>
              <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts section */}
      {isMounted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">User Growth (Last 6 Months)</h3>
            </div>
            <div className="h-64">
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
                <div className="h-full flex items-center justify-center text-xs text-slate-500">No user growth logs available yet</div>
              )}
            </div>
          </div>

          {/* Project growth */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-sky-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Projects Created (Last 6 Months)</h3>
            </div>
            <div className="h-64">
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
                <div className="h-full flex items-center justify-center text-xs text-slate-500">No project creation logs available yet</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent signups */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent User Registrations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 h-9">
                <th className="font-semibold px-4">Name</th>
                <th className="font-semibold px-4">Email</th>
                <th className="font-semibold px-4">Role</th>
                <th className="font-semibold px-4">Date Joined</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentUsers.map((u) => (
                <tr key={u._id} className="border-b border-slate-800/40 hover:bg-slate-800/20 h-11 text-slate-300">
                  <td className="px-4 font-semibold text-white">{u.name}</td>
                  <td className="px-4">{u.email}</td>
                  <td className="px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 uppercase tracking-wide">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!data?.recentUsers || data.recentUsers.length === 0) && (
                <tr className="h-11">
                  <td colSpan={4} className="text-center text-slate-500">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
