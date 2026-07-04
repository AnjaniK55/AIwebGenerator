"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, User } from "@/types";
import { Trash2, Search, Award, AlertCircle, Ban, CheckCircle } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await apiClient<ApiResponse<User[]>>("/admin/users");
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load user logs.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await apiClient<ApiResponse<User>>(`/admin/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      });

      if (response.success) {
        // Update local state variables
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole as "user" | "admin" | "client" } : u)));
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to update role.";
      alert(errMsg);
    }
  };

  const handleBlock = async (userId: string) => {
    try {
      const response = await apiClient<ApiResponse<User>>(`/admin/users/${userId}/block`, {
        method: "PUT",
      });
      if (response.success) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, isBlocked: true } : u)));
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to block user.";
      alert(errMsg);
    }
  };

  const handleUnblock = async (userId: string) => {
    try {
      const response = await apiClient<ApiResponse<User>>(`/admin/users/${userId}/unblock`, {
        method: "PUT",
      });
      if (response.success) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, isBlocked: false } : u)));
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to unblock user.";
      alert(errMsg);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? All associated projects will be deleted permanently.")) {
      return;
    }

    try {
      const response = await apiClient<ApiResponse<void>>(`/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.success) {
        setUsers(users.filter((u) => u.id !== userId));
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to delete user.";
      alert(errMsg);
    }
  };

  // Search filtering
  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Loading user directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-white text-xl tracking-tight">User Management</h2>
          <p className="text-xs text-slate-400 mt-1">Manage platform registration parameters and user roles</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-xs font-medium"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start space-x-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table grid */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 h-10">
                <th className="font-semibold px-4">User Details</th>
                <th className="font-semibold px-4">Role Privileges</th>
                <th className="font-semibold px-4">Joined Date</th>
                <th className="font-semibold px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-slate-800/40 hover:bg-slate-800/20 h-14 text-slate-300">
                  {/* Name and Email */}
                  <td className="px-4">
                    <div className="flex items-center space-x-2">
                      <div>
                        <p className="font-semibold text-white text-xs">{u.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{u.email}</p>
                      </div>
                      {u.isBlocked && (
                        <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-rose-500/10 text-rose-400 uppercase tracking-wide">
                          Blocked
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Role Upgrade Selection */}
                  <td className="px-4">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-slate-500" />
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="user">User</option>
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </td>

                  {/* Created date */}
                  <td className="px-4 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  {/* Action delete */}
                  <td className="px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {u.isBlocked ? (
                        <button
                          onClick={() => handleUnblock(u.id)}
                          id={`btn_admin_unblock_user_${u.id}`}
                          className="p-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all inline-flex"
                          aria-label="Unblock user"
                          title="Unblock User"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlock(u.id)}
                          id={`btn_admin_block_user_${u.id}`}
                          className="p-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:border-amber-500/20 hover:bg-amber-500/10 hover:text-amber-400 transition-all inline-flex"
                          aria-label="Block user"
                          title="Block User"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(u.id)}
                        id={`btn_admin_delete_user_${u.id}`}
                        className="p-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 transition-all inline-flex"
                        aria-label="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr className="h-16">
                  <td colSpan={4} className="text-center text-slate-500">
                    No users matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
