"use client";

import { useState } from "react";
import type { BriefingData, CaptainLogEntry } from "@/app/lib/types";
import { motion } from "framer-motion";

interface Props {
  data: BriefingData | null;
}

export default function CaptainsLog({ data }: Props) {
  const [entries, setEntries] = useState<CaptainLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showLog, setShowLog] = useState(false);

  const fetchLog = async () => {
    setShowLog(!showLog);
    if (entries.length > 0) return;
    try {
      const res = await fetch("/api/log");
      const data = await res.json();
      setEntries(data.entries || []);
    } catch { /* noop */ }
  };

  const closeLog = async () => {
    if (!data || closing) return;
    setClosing(true);
    try {
      const date = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      const res = await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, data }),
      });
      const entry = await res.json();
      setEntries((p) => [entry, ...p]);
    } catch { /* noop */ }
    finally { setClosing(false); }
  };

  return (
    <div className="glass-pirate rounded-xl p-5 parchment">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <h3 className="font-heading text-lg text-[var(--text-primary)]">Captain&apos;s Log</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLog}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent-teal)] transition-all"
          >
            {showLog ? "Hide" : "View Log"}
          </button>
          <button
            onClick={closeLog}
            disabled={!data || closing}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[var(--accent-gold)]/20 to-[var(--accent-teal)]/20 border border-[var(--accent-gold)]/30 text-xs font-mono text-[var(--accent-gold)] hover:border-[var(--accent-gold)] transition-all disabled:opacity-50"
          >
            {closing ? "Saving..." : "Close the Log"}
          </button>
        </div>
      </div>

      {showLog && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-2 max-h-64 overflow-y-auto"
        >
          {entries.length === 0 && (
            <p className="text-sm text-[var(--text-secondary)] font-mono italic py-4 text-center">No log entries yet. Close the log at end of day.</p>
          )}
          {entries.map((e) => (
            <div key={e.id} className="p-3 rounded-xl bg-[#080d14] border border-[var(--border)]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-[var(--accent-teal)]">{e.date}</span>
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">{new Date(e.created_at).toLocaleTimeString()}</span>
              </div>
              <p className="text-xs font-mono text-[var(--text-primary)] leading-relaxed">{e.summary}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
