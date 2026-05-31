"use client";

import { motion } from "framer-motion";

interface Props {
  summary: string;
  timestamp: string;
  loading: boolean;
  onRefresh: () => void;
}

export default function AISummary({ summary, timestamp, loading, onRefresh }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="glass-pirate rounded-xl p-6 parchment"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" fill="var(--accent-gold)" fillOpacity="0.15" />
            <line x1="12" y1="2" x2="12" y2="7" />
            <line x1="12" y1="17" x2="12" y2="22" />
            <line x1="2" y1="12" x2="7" y2="12" />
            <line x1="17" y1="12" x2="22" y2="12" />
          </svg>
          <h2 className="font-heading text-xl text-[var(--accent-gold)]">Captain&apos;s Log</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--accent-gold)] text-[var(--accent-gold)] font-mono tracking-wider uppercase">AI</span>
        </div>
        <button onClick={onRefresh} disabled={loading} aria-label="Refresh" className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-tertiary)] transition-all disabled:opacity-50">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={loading ? "animate-spin" : ""}>
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse" />
          <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse w-5/6" />
          <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse w-2/3" />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {summary.split("\n").filter(Boolean).map((p, i) => (
              <p key={i} className="text-sm text-[var(--text-primary)] font-heading leading-relaxed">{p}</p>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-secondary)] font-mono">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] anim-pulse" />
              {timestamp ? new Date(timestamp).toLocaleTimeString() : "\u2014"}
            </span>
            <span className="flex items-center gap-1">Quartermaster <span className="text-[var(--accent-gold)] italic">AI</span></span>
          </div>
        </>
      )}
    </motion.div>
  );
}
