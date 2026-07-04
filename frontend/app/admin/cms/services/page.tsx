"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types";
import { ArrowLeft, Plus, Pencil, Trash2, X, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ServiceData {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export default function ServicesCMS() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Layers");
  const [order, setOrder] = useState(0);

  const fetchServices = async () => {
    try {
      const response = await apiClient<ApiResponse<ServiceData[]>>("/admin/cms/services");
      if (response.success && response.data) {
        setServices(response.data);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load services.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setIcon("Layers");
    setOrder(0);
    setModalOpen(true);
  };

  const openEditModal = (svc: ServiceData) => {
    setEditingId(svc._id);
    setTitle(svc.title);
    setDescription(svc.description);
    setIcon(svc.icon);
    setOrder(svc.order);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      const payload = { title, description, icon, order };
      let response;

      if (editingId) {
        // Edit update
        response = await apiClient<ApiResponse<ServiceData>>(`/admin/cms/services/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        // Create new
        response = await apiClient<ApiResponse<ServiceData>>("/admin/cms/services", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      if (response.success) {
        fetchServices();
        setModalOpen(false);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Operation failed.";
      alert(errMsg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this service item?")) return;

    try {
      const response = await apiClient<ApiResponse<void>>(`/admin/cms/services/${id}`, {
        method: "DELETE",
      });
      if (response.success) {
        setServices(services.filter((s) => s._id !== id));
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to delete service.";
      alert(errMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Loading services catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header navbar links */}
      <div className="flex items-center space-x-4 border-b border-slate-800 pb-6 justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/cms"
            id="btn_services_back"
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="font-display font-bold text-white text-lg tracking-tight">Manage Services</h2>
            <p className="text-xs text-slate-400 mt-1">Structure core features grid cards on the marketing landing page</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          id="btn_admin_cms_create_service"
          className="h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
        </button>
      </div>

      {error && (
        <div className="flex items-start space-x-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Services Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <div key={svc._id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm flex flex-col justify-between h-48">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded">
                  Order: {svc.order}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Icon: {svc.icon}</span>
              </div>
              <h3 className="font-semibold text-white text-xs">{svc.title}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">{svc.description}</p>
            </div>

            <div className="flex items-center space-x-2 border-t border-slate-800/60 pt-4 mt-auto">
              <button
                onClick={() => openEditModal(svc)}
                id={`btn_admin_edit_service_${svc._id}`}
                className="flex-grow inline-flex h-8 items-center justify-center rounded bg-slate-850 hover:bg-slate-800 text-white text-[11px] font-semibold transition-colors space-x-1.5"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(svc._id)}
                id={`btn_admin_delete_service_${svc._id}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                aria-label="Delete service"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <div className="lg:col-span-3 text-center text-slate-500 py-12">
            No service catalog entries created yet.
          </div>
        )}
      </div>

      {/* Editor Modal Popup */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="font-display font-bold text-white text-sm">
                {editingId ? "Update Service Card" : "New Service Card"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded bg-slate-800">
                <X className="h-4 w-4 text-slate-300" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Service Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-10 px-4 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Lucide Icon Class</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full h-10 px-4 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Ordering Weight</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full h-10 px-4 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Service Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs font-medium resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                id="btn_admin_service_save"
                className="w-full h-11 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
              >
                Save Catalog Card
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
