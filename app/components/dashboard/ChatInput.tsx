"use client";

import { useState } from "react";
import type { ChatMessage, BriefingData } from "@/app/lib/types";

interface ChatInputProps {
  briefingData: BriefingData | null;
}

export default function ChatInput({ briefingData }: ChatInputProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!query.trim() || sending || !briefingData) return;

    const userMessage: ChatMessage = { role: "user", content: query };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setQuery("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: updatedHistory.slice(0, -1),
          briefing_data: briefingData,
        }),
      });

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.reply || "No response",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const suggestions = [
    "Which email is most urgent?",
    "When is my next free slot?",
    "Summarize my PRs",
    "What Slack messages need attention?",
  ];

  return (
    <div className="mt-6 perspective-1000">
      {messages.length > 0 && (
        <div className="mb-4 space-y-3 max-h-64 overflow-y-auto pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm font-mono leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)]"
                    : "bg-[#080d14] border border-[var(--border)] text-[var(--accent-teal)]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--accent-gold)] rounded-full opacity-0 group-focus-within:opacity-20 blur-sm transition-opacity duration-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            briefingData
              ? "Ask about your briefing..."
              : "Load your briefing first to ask questions"
          }
          disabled={!briefingData || sending}
          className="relative w-full px-6 py-4 pr-14 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] font-mono text-sm placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-teal)] transition-all duration-300 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!query.trim() || sending || !briefingData}
          aria-label="Send message"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--accent-teal)] hover:bg-[var(--accent-teal)] hover:text-[var(--bg-primary)] transition-all duration-200 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${sending ? "animate-pulse" : "group-hover/btn:rotate-45"}`}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-[var(--text-secondary)] font-mono px-2">
        <span>Ask:</span>
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setQuery(s)}
            className="hover:text-[var(--accent-teal)] transition-colors whitespace-nowrap"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
