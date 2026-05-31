"use client";

import { useState } from "react";

export default function ChatInput() {
  const [query, setQuery] = useState("");

  return (
    <div className="mt-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about your briefing... e.g. 'Which email is most urgent?'"
          className="w-full px-6 py-4 pr-14 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] font-mono text-sm placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-teal)] focus:shadow-[0_0_12px_rgba(45,212,191,0.15)] transition-all duration-300"
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--accent-teal)] hover:bg-[var(--accent-teal)] hover:text-[var(--bg-primary)] transition-all duration-200 group"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:rotate-45">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-secondary)] font-mono px-2">
        <span>Suggestions:</span>
        <button className="hover:text-[var(--accent-teal)] transition-colors">Which email is most urgent?</button>
        <span className="text-[var(--border)]">·</span>
        <button className="hover:text-[var(--accent-teal)] transition-colors">When is my next free slot?</button>
        <span className="text-[var(--border)]">·</span>
        <button className="hover:text-[var(--accent-teal)] transition-colors">Summarize my PRs</button>
      </div>
    </div>
  );
}
