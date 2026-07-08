"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types";
import { ChatBubble } from "@/components/consultation/ChatBubble";
import { TypingIndicator } from "@/components/consultation/TypingIndicator";
import { ConsultationProgressBar } from "@/components/consultation/ConsultationProgressBar";
import {
  Send,
  SkipForward,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  FileJson,
  X,
  ArrowLeft,
} from "lucide-react";

const TOTAL_QUESTIONS = 25;

const ANSWER_KEYS = [
  "businessName",
  "businessType",
  "websiteGoal",
  "targetAudience",
  "brandPersonality",
  "colorPreference",
  "typographyStyle",
  "sectionsNeeded",
  "hasLogo",
  "logoUrl",
  "primaryFeatures",
  "integrations",
  "multilingual",
  "ecommerceSupport",
  "paymentGateways",
  "contentStrategy",
  "blogRequired",
  "portfolioRequired",
  "socialLinks",
  "seoKeywords",
  "contactMethod",
  "budgetRange",
  "timelinePreference",
  "hostingPreference",
  "notes"
];

interface Message {
  _id?: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

interface Consultation {
  _id: string;
  status: "not_started" | "in_progress" | "completed";
  currentStep: number;
  messages: Message[];
  answers: Record<string, string>;
  generatedJSON?: Record<string, unknown>;
}

interface ConsultationResponse {
  data: Consultation;
  resumed?: boolean;
}

export default function AIConsultationPage() {
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showJSON, setShowJSON] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [consultation?.messages, isTyping, scrollToBottom]);

  // Start or resume consultation
  const startConsultation = async () => {
    setStarting(true);
    setError(null);
    try {
      const res = await apiClient<ApiResponse<ConsultationResponse>>("/consultation/start", {
        method: "POST",
      });
      if (res.success && res.data) {
        setConsultation((res.data as unknown as ConsultationResponse).data ?? (res.data as unknown as Consultation));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to start consultation.");
    } finally {
      setStarting(false);
    }
  };

  // Auto-start on mount
  useEffect(() => {
    startConsultation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async (messageText?: string) => {
    const msg = (messageText ?? input).trim();
    if (!msg || !consultation || loading) return;

    setInput("");
    setLoading(true);
    setIsTyping(true);
    setError(null);

    // Optimistic: add user message immediately
    setConsultation((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, { role: "user", content: msg }],
          }
        : prev
    );

    // Simulate AI "thinking" delay
    await new Promise((r) => setTimeout(r, 900));

    try {
      const res = await apiClient<ApiResponse<ConsultationResponse>>("/consultation/message", {
        method: "POST",
        body: JSON.stringify({ consultationId: consultation._id, message: msg }),
      });
      if (res.success && res.data) {
        const updated = (res.data as unknown as ConsultationResponse).data ?? (res.data as unknown as Consultation);
        setConsultation(updated);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
      // Rollback optimistic update
      setConsultation((prev) =>
        prev
          ? { ...prev, messages: prev.messages.slice(0, -1) }
          : prev
      );
    } finally {
      setLoading(false);
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleSkip = () => sendMessage("Skip");

  const handleGoBack = async () => {
    if (!consultation || loading || consultation.currentStep === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient<ApiResponse<ConsultationResponse>>("/consultation/back", {
        method: "POST",
        body: JSON.stringify({ consultationId: consultation._id }),
      });
      if (res.success && res.data) {
        const updated = (res.data as unknown as ConsultationResponse).data ?? (res.data as unknown as Consultation);
        setConsultation(updated);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to go back.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAnswer = async (messageIndex: number, newText: string) => {
    if (!consultation || loading) return;
    const answerIndex = Math.floor((messageIndex - 1) / 2);
    const key = ANSWER_KEYS[answerIndex];
    if (!key) return;

    setLoading(true);
    setError(null);
    try {
      const res = await apiClient<ApiResponse<ConsultationResponse>>("/consultation/update", {
        method: "PUT",
        body: JSON.stringify({ consultationId: consultation._id, key, value: newText }),
      });
      if (res.success && res.data) {
        const updated = (res.data as unknown as ConsultationResponse).data ?? (res.data as unknown as Consultation);
        setConsultation(updated);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update answer.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ============================================================
  // RENDER: Not started yet — loading
  // ============================================================
  if (starting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center animate-pulse">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <p className="text-sm text-slate-400">Initializing AI Consultant...</p>
      </div>
    );
  }

  // ============================================================
  // RENDER: Error state
  // ============================================================
  if (error && !consultation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <h2 className="text-white font-bold text-lg">Something went wrong</h2>
        <p className="text-slate-400 text-sm max-w-sm">{error}</p>
        <button
          onClick={startConsultation}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-500 transition-colors"
        >
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  // ============================================================
  // RENDER: No consultation yet
  // ============================================================
  if (!consultation) return null;

  const isComplete = consultation.status === "completed";

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[900px]">
      {/* ── Header ── */}
      <div className="flex-shrink-0 border-b border-slate-800 bg-slate-900/40 px-4 md:px-6 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-sm leading-tight">
                AI Web Consultant
              </h1>
              <p className="text-[11px] text-slate-400">Manju Web Agency</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isComplete && (
              <>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                  <CheckCircle2 className="h-3 w-3" /> Complete
                </span>
                <button
                  onClick={() => setShowJSON(!showJSON)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  <FileJson className="h-3.5 w-3.5" />
                  {showJSON ? "Hide" : "View"} JSON
                </button>
              </>
            )}
            {!isComplete && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-bold text-indigo-400 uppercase tracking-wide">
                <MessageSquare className="h-3 w-3" /> In Progress
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <ConsultationProgressBar
          currentStep={Math.min(consultation.currentStep, TOTAL_QUESTIONS)}
          totalSteps={TOTAL_QUESTIONS}
        />
      </div>

      {/* ── Generated JSON Panel ── */}
      {showJSON && isComplete && consultation.generatedJSON && (
        <div className="flex-shrink-0 border-b border-slate-800 bg-slate-950 p-4 max-h-56 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Generated Requirements JSON
            </h3>
            <button onClick={() => setShowJSON(false)}>
              <X className="h-4 w-4 text-slate-500 hover:text-white" />
            </button>
          </div>
          <pre className="text-[11px] text-emerald-400 font-mono overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(consultation.generatedJSON, null, 2)}
          </pre>
        </div>
      )}

      {/* ── Messages Area ── */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
        {consultation.messages.map((msg, i) => (
          <ChatBubble
            key={i}
            role={msg.role}
            content={msg.content}
            timestamp={msg.createdAt}
            onEdit={
              msg.role === "user" && !isComplete
                ? (newText) => handleEditAnswer(i, newText)
                : undefined
            }
          />
        ))}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}

        {/* Error inline */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* ── Scroll to bottom button ── */}
      <button
        onClick={scrollToBottom}
        className="absolute bottom-24 right-6 h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all opacity-60 hover:opacity-100 shadow-lg"
        aria-label="Scroll to bottom"
      >
        <ChevronDown className="h-4 w-4" />
      </button>

      {/* ── Input Area ── */}
      <div className="flex-shrink-0 border-t border-slate-800 bg-slate-900/40 px-4 md:px-6 py-4">
        {isComplete ? (
          <div className="flex items-center justify-center gap-3 py-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <p className="text-sm text-slate-300 font-semibold">
              Consultation complete! Our team will review your requirements.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-end gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading || isTyping}
                rows={1}
                placeholder="Type your answer... (Enter to send, Shift+Enter for new line)"
                className="flex-1 resize-none rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all min-h-[44px] max-h-32 overflow-y-auto disabled:opacity-50"
                style={{ height: "auto" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = Math.min(target.scrollHeight, 128) + "px";
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading || isTyping}
                className="flex-shrink-0 h-11 w-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-lg shadow-indigo-600/20"
                aria-label="Send"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {consultation.currentStep > 0 && (
                <>
                  <button
                    onClick={handleGoBack}
                    disabled={loading || isTyping}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </button>
                  <span className="text-slate-700 text-xs">•</span>
                </>
              )}
              <button
                onClick={handleSkip}
                disabled={loading || isTyping}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
              >
                <SkipForward className="h-3.5 w-3.5" />
                Skip Question
              </button>
              <span className="text-slate-700 text-xs">•</span>
              <p className="text-[11px] text-slate-600">
                Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">Enter</kbd> to send
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
