"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Users,
  FolderKanban,
  Contact,
  LayoutGrid,
  TrendingUp,
  Settings,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  Bell,
  Sparkles,
  MessageSquare,
  FileJson,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Overview", icon: LayoutGrid },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/consultations", label: "Consultations", icon: MessageSquare },
  { href: "/admin/blueprints", label: "Blueprints", icon: FileJson },
  { href: "/admin/clients", label: "Clients", icon: Contact },
  { href: "/admin/cms", label: "CMS System", icon: Sparkles },
  { href: "/admin/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Redirect after session check completes
  useEffect(() => {
    if (loading) return; // Wait for auth check
    if (!user) {
      router.push("/login"); // Not logged in → go to login
    } else if (user.role !== "admin") {
      router.push("/dashboard"); // Logged in but not admin → go to dashboard
    }
  }, [loading, user, router]);

  // Show loading spinner while session is being validated
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 space-y-4">
        <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Validating Admin Credentials...</p>
      </div>
    );
  }

  // Don't render admin panel if not admin
  if (!user || user.role !== "admin") {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800 bg-slate-900/50 flex-shrink-0 h-screen sticky top-0">
        {/* Brand header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm tracking-tight text-white leading-none">Manju SaaS</h1>
            <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Admin Portal</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-grow p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                id={`admin_sidebar_${link.label.toLowerCase().replace(/\s+/g, "_")}`}
                className={`flex items-center space-x-3 px-4 h-10 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${active ? "text-white" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            id="btn_admin_sidebar_logout"
            className="flex items-center space-x-3 px-4 h-10 w-full rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          
          <aside className="relative flex flex-col w-64 bg-slate-900 h-full border-r border-slate-800 z-10 p-6 animate-in slide-in-from-left duration-200">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-6 w-6 text-indigo-500" />
                <span className="font-display font-bold text-sm text-white">Admin Console</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded bg-slate-800">
                <X className="h-4 w-4 text-slate-300" />
              </button>
            </div>

            <nav className="flex-grow space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    id={`admin_mobile_sidebar_${link.label.toLowerCase().replace(/\s+/g, "_")}`}
                    className={`flex items-center space-x-3 px-4 h-11 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      active
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              id="btn_admin_mobile_logout"
              className="flex items-center space-x-3 px-4 h-11 w-full rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors mt-auto"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span>Sign Out</span>
            </button>
          </aside>
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/20 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search placeholder / status */}
          <div className="hidden sm:flex items-center space-x-2 text-[10px] bg-indigo-500/10 text-indigo-400 font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            <span>Production Server Status: Active</span>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-lg border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
            </button>

            <div className="h-px bg-slate-800 w-4 hidden sm:block" />

            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{user.email}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-400 uppercase">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content canvas */}
        <main className="flex-grow p-6 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
