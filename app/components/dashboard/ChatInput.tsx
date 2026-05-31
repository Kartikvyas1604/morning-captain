"use client";

import { useState } from "react";
import type { ChatMessage, BriefingData } from "@/app/lib/types";

interface Props {
  briefingData: BriefingData | null;
}

export default function ChatInput({ briefingData }: Props) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!query.trim() || sending || !briefingData) return;
    const userMsg: ChatMessage = { role: "user", content: query };
    const history = [...messages, userMsg];
    setMessages(history);
    setQuery("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, history: history.slice(0, -1), briefing_data: briefingData }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "No response" }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Could not process. Try again." }]);
    } finally {
      setSending(false);
    }
  };

  const suggestions = ["Which email is most urgent?", "When is my next free slot?", "Summarize my PRs", "Any Slack DMs?"];

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a4 4 0 0 1 4 4c0 2-2 4-4 4s-4-2-4-4 2-4 4-4z" />
          <path d="M20 18c0-4-4-8-8-8s-8 4-8 8" />
        </svg>
        <span className="text-xs font-mono text-[var(--accent-gold)] tracking-wider uppercase">Message in a Bottle</span>
      </div>

      {messages.length > 0 && (
        <div className="mb-4 space-y-3 max-h-60 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm font-mono leading-relaxed ${m.role === "user" ? "bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)]" : "bg-[#080d14] border border-[var(--border)] text-[var(--accent-teal)]"}`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--accent-gold)] rounded-full opacity-0 focus-within:opacity-20 blur-sm transition-opacity duration-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={briefingData ? "Ask your quartermaster..." : "Load your briefing first"}
          disabled={!briefingData || sending}
          className="relative w-full px-6 py-4 pr-14 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] font-mono text-sm placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-teal)] transition-all duration-300 disabled:opacity-50"
        />
        <button onClick={send} disabled={!query.trim() || sending || !briefingData} aria-label="Send" className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--accent-teal)] hover:bg-[var(--accent-teal)] hover:text-[var(--bg-primary)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3 text-xs text-[var(--text-secondary)] font-mono px-2">
        <span className="text-[var(--accent-gold)]">Ask:</span>
        {suggestions.map((s) => (
          <button key={s} onClick={() => setQuery(s)} className="hover:text-[var(--accent-teal)] transition-colors">{s}</button>
        ))}
      </div>
    </div>
  );
}
