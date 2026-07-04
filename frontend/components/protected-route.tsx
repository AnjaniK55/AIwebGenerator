"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";
import { Sparkles, ShieldAlert } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Sparkles className="h-8 w-8 text-indigo-400 animate-spin" />
        <p className="text-sm text-slate-400">Verifying session context...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-6 text-center">
        <ShieldAlert className="h-12 w-12 text-red-500" />
        <h2 className="font-display text-2xl font-bold text-white">Access Denied</h2>
        <p className="text-sm text-slate-400 max-w-sm">
          Your current account role (&quot;{user.role}&quot;) does not have the permissions required to view this module.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
