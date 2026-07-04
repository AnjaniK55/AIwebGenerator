"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types";
import { ArrowLeft, Plus, Pencil, Trash2, X, AlertCircle } from "lucide-react";
import Link from "next/link";

interface BlogData {
  _id: string;
  title: string;
  content: string;
  image: string;
  status: "draft" | "published";
  slug: string;
  author?: {
    name: string;
    email: string;
  };
}

export default function BlogsCMS() {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const fetchBlogs = async () => {
    try {
      const response = await apiClient<ApiResponse<BlogData[]>>("/admin/cms/blogs");
      if (response.success && response.data) {
        setBlogs(response.data);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load blogs catalog.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setImage("");
    setStatus("draft");
    setModalOpen(true);
  };

  const openEditModal = (b: BlogData) => {
    setEditingId(b._id);
    setTitle(b.title);
    setContent(b.content);
    setImage(b.image);
    setStatus(b.status);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const payload = { title, content, image, status };
      let response;

      if (editingId) {
        response = await apiClient<ApiResponse<BlogData>>(`/admin/cms/blogs/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        response = await apiClient<ApiResponse<BlogData>>("/admin/cms/blogs", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      if (response.success) {
        fetchBlogs();
        setModalOpen(false);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Operation failed.";
      alert(errMsg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this blog article?")) return;

    try {
      const response = await apiClient<ApiResponse<void>>(`/admin/cms/blogs/${id}`, {
        method: "DELETE",
      });
      if (response.success) {
        setBlogs(blogs.filter((b) => b._id !== id));
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to delete blog.";
      alert(errMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Loading articles list...</p>
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
            id="btn_blogs_back"
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="font-display font-bold text-white text-lg tracking-tight">Blogs & Articles</h2>
            <p className="text-xs text-slate-400 mt-1">Compose and publish blogs, announcements, and tutorials</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          id="btn_admin_cms_create_blog"
          className="h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Write Article</span>
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
        {blogs.map((b) => (
          <div key={b._id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span
                  className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    b.status === "published"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {b.status}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">slug: {b.slug}</span>
              </div>
              <h3 className="font-semibold text-white text-xs leading-snug">{b.title}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">{b.content}</p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-6">
              <span className="text-[10px] text-slate-500">
                Author: {b.author?.name || "Administrator"}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(b)}
                  id={`btn_admin_edit_blog_${b._id}`}
                  className="inline-flex h-8 items-center justify-center rounded bg-slate-850 hover:bg-slate-800 text-white text-[11px] font-semibold px-3 transition-colors space-x-1.5"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  id={`btn_admin_delete_blog_${b._id}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                  aria-label="Delete blog"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {blogs.length === 0 && (
          <div className="md:col-span-2 text-center text-slate-500 py-12">
            No articles composed yet.
          </div>
        )}
      </div>

      {/* Editor Modal Popup */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="font-display font-bold text-white text-sm">
                {editingId ? "Edit Article" : "Write Article"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded bg-slate-800">
                <X className="h-4 w-4 text-slate-300" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Article Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-10 px-4 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                    className="w-full h-10 px-4 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Featured Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full h-10 px-4 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Article Body Content</label>
                <textarea
                  required
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs font-medium resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                id="btn_admin_blog_save"
                className="w-full h-11 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
              >
                Publish Article
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
