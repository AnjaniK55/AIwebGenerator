"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { ShieldCheck, ToggleLeft, ToggleRight, Save, Key } from "lucide-react";

export default function AdminSettings() {
  const { user } = useAuth();
  
  // Toggles state variables
  const [maintenance, setMaintenance] = useState(false);
  const [allowSignups, setAllowSignups] = useState(true);
  const [enableAI, setEnableAI] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-white text-xl tracking-tight">System Settings</h2>
        <p className="text-xs text-slate-400 mt-1">Configure global SaaS limits and administrator profile preferences</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <ShieldCheck className="h-5 w-5 text-indigo-400" />
          <h3 className="font-display font-bold text-white text-sm">Platform Parameters</h3>
        </div>

        {success && (
          <div className="flex items-start space-x-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-400">
            <span>✓ System parameters updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Toggles */}
          <div className="space-y-4">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between p-4 border border-slate-800 rounded-lg bg-slate-950/20">
              <div>
                <p className="text-xs font-bold text-white">System Maintenance Mode</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Restrict client and project portal actions to admins only.</p>
              </div>
              <button
                type="button"
                onClick={() => setMaintenance(!maintenance)}
                className="text-slate-400 hover:text-white"
                aria-label="Toggle maintenance mode"
              >
                {maintenance ? (
                  <ToggleRight className="h-8 w-8 text-indigo-500" />
                ) : (
                  <ToggleLeft className="h-8 w-8 text-slate-600" />
                )}
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between p-4 border border-slate-800 rounded-lg bg-slate-950/20">
              <div>
                <p className="text-xs font-bold text-white">Allow Public Signups</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Open signup routes `/register` for new agency users.</p>
              </div>
              <button
                type="button"
                onClick={() => setAllowSignups(!allowSignups)}
                className="text-slate-400 hover:text-white"
                aria-label="Toggle user registrations"
              >
                {allowSignups ? (
                  <ToggleRight className="h-8 w-8 text-indigo-500" />
                ) : (
                  <ToggleLeft className="h-8 w-8 text-slate-600" />
                )}
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="flex items-center justify-between p-4 border border-slate-800 rounded-lg bg-slate-950/20">
              <div>
                <p className="text-xs font-bold text-white">Enable Claude AI Compiler</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Allow website workspace generation calls to Anthropic servers.</p>
              </div>
              <button
                type="button"
                onClick={() => setEnableAI(!enableAI)}
                className="text-slate-400 hover:text-white"
                aria-label="Toggle AI compilation"
              >
                {enableAI ? (
                  <ToggleRight className="h-8 w-8 text-indigo-500" />
                ) : (
                  <ToggleLeft className="h-8 w-8 text-slate-600" />
                )}
              </button>
            </div>
          </div>

          {/* Admin particulars display */}
          <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/40 text-xs space-y-2.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 flex items-center">
              <Key className="h-3 w-3 mr-1" /> Active Session Credentials
            </span>
            <p className="text-slate-300 font-semibold">Account Identity: <span className="font-normal text-slate-500">{user?.name}</span></p>
            <p className="text-slate-300 font-semibold">Email Domain: <span className="font-normal text-slate-500">{user?.email}</span></p>
            <p className="text-slate-300 font-semibold">Permission Level: <span className="font-bold text-indigo-400 uppercase tracking-wide">{user?.role}</span></p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full h-11 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center justify-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving settings..." : "Save Settings"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
