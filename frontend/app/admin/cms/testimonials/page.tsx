"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types";
import { ArrowLeft, Plus, Pencil, Trash2, X, Star, AlertCircle } from "lucide-react";
import Link from "next/link";

interface TestimonialData {
  _id: string;
  name: string;
  role: string;
  review: string;
  rating: number;
}

export default function TestimonialsCMS() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const fetchTestimonials = async () => {
    try {
      const response = await apiClient<ApiResponse<TestimonialData[]>>("/admin/cms/testimonials");
      if (response.success && response.data) {
        setTestimonials(response.data);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load testimonials.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setRole("");
    setReview("");
    setRating(5);
    setModalOpen(true);
  };

  const openEditModal = (t: TestimonialData) => {
    setEditingId(t._id);
    setName(t.name);
    setRole(t.role);
    setReview(t.review);
    setRating(t.rating);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !review) return;

    try {
      const payload = { name, role, review, rating };
      let response;

      if (editingId) {
        response = await apiClient<ApiResponse<TestimonialData>>(`/admin/cms/testimonials/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        response = await apiClient<ApiResponse<TestimonialData>>("/admin/cms/testimonials", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      if (response.success) {
        fetchTestimonials();
        setModalOpen(false);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Operation failed.";
      alert(errMsg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this client testimonial?")) return;

    try {
      const response = await apiClient<ApiResponse<void>>(`/admin/cms/testimonials/${id}`, {
        method: "DELETE",
      });
      if (response.success) {
        setTestimonials(testimonials.filter((t) => t._id !== id));
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to delete testimonial.";
      alert(errMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Loading reviews board...</p>
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
            id="btn_testimonials_back"
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="font-display font-bold text-white text-lg tracking-tight">Client Testimonials</h2>
            <p className="text-xs text-slate-400 mt-1">Publish agency ratings, customer reviews, and testimonials</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          id="btn_admin_cms_create_testimonial"
          className="h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {error && (
        <div className="flex items-start space-x-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div key={t._id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm flex flex-col justify-between min-h-[180px]">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-white text-xs">{t.name}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{t.role}</p>
                </div>

                {/* Rating stars display */}
                <div className="flex space-x-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-3 w-3 ${
                        idx < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-4">&ldquo;{t.review}&rdquo;</p>
            </div>

            <div className="flex items-center space-x-2 border-t border-slate-800/60 pt-4 mt-4">
              <button
                onClick={() => openEditModal(t)}
                id={`btn_admin_edit_testimonial_${t._id}`}
                className="flex-grow inline-flex h-8 items-center justify-center rounded bg-slate-850 hover:bg-slate-800 text-white text-[11px] font-semibold transition-colors space-x-1.5"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(t._id)}
                id={`btn_admin_delete_testimonial_${t._id}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                aria-label="Delete testimonial"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="md:col-span-2 text-center text-slate-500 py-12">
            No testimonials created yet.
          </div>
        )}
      </div>

      {/* Editor Modal Popup */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="font-display font-bold text-white text-sm">
                {editingId ? "Update Testimonial" : "New Testimonial"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded bg-slate-800">
                <X className="h-4 w-4 text-slate-300" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Customer Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-4 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Role / Company</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full h-10 px-4 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Rating Scale</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value, 10) || 5)}
                    className="w-full h-10 px-4 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  >
                    {[5, 4, 3, 2, 1].map((num) => (
                      <option key={num} value={num}>
                        {num} Stars
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Feedback Review</label>
                <textarea
                  required
                  rows={4}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full px-4 py-3 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs font-medium resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                id="btn_admin_testimonial_save"
                className="w-full h-11 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
              >
                Save Testimonial
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
