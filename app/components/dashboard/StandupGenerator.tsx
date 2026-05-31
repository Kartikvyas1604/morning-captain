"use client";

import { useState } from "react";
import type { BriefingData, StandupResponse } from "@/app/lib/types";
import { motion } from "framer-motion";

interface Props {
  data: BriefingData | null;
}

export default function StandupGenerator({ data }: Props) {
  const [standup, setStandup] = useState<StandupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!data || loading) return;
    setLoading(true);
    setStandup(null);
    try {
      const res = await fetch("/api/standup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const result = await res.json();
      setStandup(result);
    } catch { /* noop */ }
    finally { setLoading(false); }
  };

  const copyToClipboard = () => {
    if (!standup) return;
    const text = `*Morning Standup — ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}*\n\n*Yesterday:* ${standup.yesterday}\n*Today:* ${standup.today}\n*Blockers:* ${standup.blockers}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-pirate rounded-xl p-5 parchment">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <h3 className="font-heading text-lg text-[var(--text-primary)]">Standup Generator</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--accent-teal)] text-[var(--accent-teal)] font-mono">AI</span>
        </div>
        {standup && (
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs font-mono text-[var(--accent-gold)] hover:bg-[var(--bg-secondary)] transition-all"
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                Copied
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {!standup && !loading && (
        <button
          onClick={generate}
          disabled={!data}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--accent-teal)]/10 to-[var(--accent-gold)]/10 border border-dashed border-[var(--border)] text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--accent-teal)] hover:border-[var(--accent-teal)]/40 transition-all disabled:opacity-50"
        >
          Generate Standup
        </button>
      )}

      {loading && (
        <div className="space-y-3">
          <div className="h-3 bg-[var(--bg-tertiary)] rounded animate-pulse w-full" />
          <div className="h-3 bg-[var(--bg-tertiary)] rounded animate-pulse w-5/6" />
          <div className="h-3 bg-[var(--bg-tertiary)] rounded animate-pulse w-4/6" />
        </div>
      )}

      {standup && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="p-3 rounded-xl bg-[#080d14] border border-[var(--border)] space-y-2">
            <p className="text-[10px] font-mono text-[var(--accent-teal)] uppercase tracking-wider">Yesterday</p>
            <p className="text-sm text-[var(--text-primary)] font-mono leading-relaxed">{standup.yesterday}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#080d14] border border-[var(--border)] space-y-2">
            <p className="text-[10px] font-mono text-[var(--accent-gold)] uppercase tracking-wider">Today</p>
            <p className="text-sm text-[var(--text-primary)] font-mono leading-relaxed">{standup.today}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#080d14] border border-[var(--border)] space-y-2">
            <p className="text-[10px] font-mono text-[var(--accent-red)] uppercase tracking-wider">Blockers</p>
            <p className="text-sm text-[var(--text-primary)] font-mono leading-relaxed">{standup.blockers}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
