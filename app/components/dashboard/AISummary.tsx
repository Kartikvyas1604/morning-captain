"use client";

import { motion } from "framer-motion";

interface AISummaryProps {
  summary: string;
  timestamp: string;
  loading: boolean;
  onRefresh: () => void;
}

export default function AISummary({ summary, timestamp, loading, onRefresh }: AISummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="tilt-card-glow frosted-glass-gold rounded-xl p-6 cursor-default"
    >
      <div className="card-3d-layer flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
              <path d="M12 2a4 4 0 0 1 4 4c0 2-2 4-4 4s-4-2-4-4 2-4 4-4z" />
              <path d="M20 18c0-4-4-8-8-8s-8 4-8 8" />
            </svg>
            <div className="absolute inset-0 bg-[var(--accent-gold)] opacity-10 blur-sm rounded-full" />
          </div>
          <h2 className="font-heading text-xl text-[var(--accent-gold)]">Captain&apos;s Log</h2>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh briefing"
          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-tertiary)] transition-all disabled:opacity-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={loading ? "animate-spin" : ""}>
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>
      </div>
      {loading ? (
        <div className="card-3d-layer space-y-3">
          <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse" />
          <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse w-5/6" />
          <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse w-2/3" />
          <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse w-3/4" />
        </div>
      ) : (
        <>
          <div className="card-3d-layer space-y-3">
            {summary.split("\n").filter(Boolean).map((paragraph, i) => (
              <p key={i} className="text-sm text-[var(--text-primary)] font-heading leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="card-3d-depth mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] animate-glow-pulse" />
              Synced {timestamp ? new Date(timestamp).toLocaleTimeString() : "N/A"}
            </div>
            <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]" />
              AI Powered
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
