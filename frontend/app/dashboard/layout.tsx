"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  User as UserIcon,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Sparkles,
  MessageSquare,
  FileJson,
  LayoutGrid,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarLinks = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: "My Projects", href: "/dashboard/projects", icon: <FolderKanban className="h-5 w-5" /> },
    { label: "Create Website", href: "/dashboard/projects/create", icon: <PlusCircle className="h-5 w-5" /> },
    { label: "AI Consultation", href: "/dashboard/ai-consultation", icon: <MessageSquare className="h-5 w-5" /> },
    { label: "Website Blueprint", href: "/dashboard/blueprint", icon: <FileJson className="h-5 w-5" /> },
    { label: "AI Wireframe", href: "/dashboard/wireframe", icon: <LayoutGrid className="h-5 w-5" /> },
    { label: "Subscription", href: "/dashboard/subscription", icon: <Sparkles className="h-5 w-5" /> },
    { label: "Profile", href: "#", icon: <UserIcon className="h-5 w-5" /> },
    { label: "Settings", href: "#", icon: <Settings className="h-5 w-5" /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignored
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card">
          <div className="h-16 flex items-center px-6 border-b border-border space-x-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="font-display font-bold text-foreground text-sm tracking-tight">
              Manju<span className="text-primary">Web</span>Workspace
            </span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1.5">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2.5 w-full rounded-lg text-xs font-semibold tracking-wide text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Workspace Content Block */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4 md:space-x-0">
              {/* Mobile Menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden text-muted-foreground hover:text-foreground"
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="font-display font-bold text-foreground text-base tracking-tight hidden md:block">
                Workspace Portal
              </h1>
            </div>

            {/* Right actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg border border-border bg-background transition-colors relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>

              <div className="flex items-center space-x-3 pl-2 border-l border-border">
                <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-display font-semibold text-sm">
                  {user?.name?.substring(0, 1).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-foreground leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Page contents */}
          <main className="flex-grow p-6 overflow-y-auto">{children}</main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-background/80 backdrop-blur-sm">
            <div className="w-64 bg-card border-r border-border flex flex-col justify-between p-6">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-foreground text-sm">
                    Manju<span className="text-primary">Web</span>
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-3 px-4 py-2.5 w-full rounded-lg text-xs font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
