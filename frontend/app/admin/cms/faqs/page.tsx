"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types";
import { ArrowLeft, Plus, Pencil, Trash2, X, AlertCircle } from "lucide-react";
import Link from "next/link";

interface FaqData {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

export default function FaqsCMS() {
  const [faqs, setFaqs] = useState<FaqData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [order, setOrder] = useState(0);

  const fetchFaqs = async () => {
    try {
      const response = await apiClient<ApiResponse<FaqData[]>>("/admin/cms/faqs");
      if (response.success && response.data) {
        setFaqs(response.data);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load FAQs.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setQuestion("");
    setAnswer("");
    setOrder(0);
    setModalOpen(true);
  };

  const openEditModal = (f: FaqData) => {
    setEditingId(f._id);
    setQuestion(f.question);
    setAnswer(f.answer);
    setOrder(f.order);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;

    try {
      const payload = { question, answer, order };
      let response;

      if (editingId) {
        response = await apiClient<ApiResponse<FaqData>>(`/admin/cms/faqs/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        response = await apiClient<ApiResponse<FaqData>>("/admin/cms/faqs", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      if (response.success) {
        fetchFaqs();
        setModalOpen(false);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Operation failed.";
      alert(errMsg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this FAQ item?")) return;

    try {
      const response = await apiClient<ApiResponse<void>>(`/admin/cms/faqs/${id}`, {
        method: "DELETE",
      });
      if (response.success) {
        setFaqs(faqs.filter((f) => f._id !== id));
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to delete FAQ.";
      alert(errMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Loading FAQs accordion...</p>
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
            id="btn_faqs_back"
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="font-display font-bold text-white text-lg tracking-tight">Manage FAQs</h2>
            <p className="text-xs text-slate-400 mt-1">Configure user onboarding FAQs for the marketing landing page</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          id="btn_admin_cms_create_faq"
          className="h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      {error && (
        <div className="flex items-start space-x-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid listing */}
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq._id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm flex items-start justify-between">
            <div className="space-y-2 flex-grow">
              <div className="flex items-center space-x-3">
                <span className="text-[9px] font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded">
                  Order: {faq.order}
                </span>
                <h3 className="font-bold text-white text-xs">{faq.question}</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pr-8">{faq.answer}</p>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => openEditModal(faq)}
                id={`btn_admin_edit_faq_${faq._id}`}
                className="p-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white transition-all inline-flex"
                aria-label="Edit FAQ"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleDelete(faq._id)}
                id={`btn_admin_delete_faq_${faq._id}`}
                className="p-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 transition-all inline-flex"
                aria-label="Delete FAQ"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && (
          <div className="text-center text-slate-500 py-12">
            No FAQs compiled yet.
          </div>
        )}
      </div>

      {/* Editor Modal Popup */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="font-display font-bold text-white text-sm">
                {editingId ? "Update FAQ Card" : "New FAQ Card"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded bg-slate-850">
                <X className="h-4 w-4 text-slate-300" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Question</label>
                  <input
                    type="text"
                    required
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full h-10 px-4 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Order Weight</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full h-10 px-4 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Answer</label>
                <textarea
                  required
                  rows={5}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-4 py-3 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs font-medium resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                id="btn_admin_faq_save"
                className="w-full h-11 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
              >
                Save FAQ Card
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
