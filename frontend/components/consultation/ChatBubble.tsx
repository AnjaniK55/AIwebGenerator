"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content, timestamp }) => {
  const isUser = role === "user";

  return (
    <div className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
        }`}
      >
        {isUser ? "U" : "AI"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-indigo-600 text-white rounded-br-sm"
            : "bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-sm"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-strong:text-white prose-ul:my-1">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
        {timestamp && (
          <p className={`text-[10px] mt-1.5 ${isUser ? "text-indigo-200" : "text-slate-500"}`}>
            {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </div>
    </div>
  );
};
