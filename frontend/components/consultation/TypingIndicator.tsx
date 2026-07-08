"use client";

import React from "react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-end gap-3">
      {/* AI Avatar */}
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
        AI
      </div>

      {/* Animated dots */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        <span
          className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce"
          style={{ animationDelay: "0ms", animationDuration: "800ms" }}
        />
        <span
          className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce"
          style={{ animationDelay: "150ms", animationDuration: "800ms" }}
        />
        <span
          className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce"
          style={{ animationDelay: "300ms", animationDuration: "800ms" }}
        />
      </div>
    </div>
  );
};
