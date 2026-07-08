"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { Pencil } from "lucide-react";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  onEdit?: (newContent: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content, timestamp, onEdit }) => {
  const isUser = role === "user";

  const handleEditClick = () => {
    if (!onEdit) return;
    const newText = prompt("Edit your answer:", content);
    if (newText !== null && newText.trim() !== "") {
      onEdit(newText.trim());
    }
  };

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
        className={`relative max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed group ${
          isUser
            ? "bg-indigo-600 text-white rounded-br-sm"
            : "bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-sm"
        }`}
      >
        {isUser ? (
          <div className="pr-5">
            <p className="whitespace-pre-wrap">{content}</p>
            {onEdit && (
              <button
                onClick={handleEditClick}
                className="absolute right-2 top-2 p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                title="Edit response"
              >
                <Pencil className="h-3 w-3" />
              </button>
            )}
          </div>
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

