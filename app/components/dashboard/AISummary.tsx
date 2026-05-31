"use client";

import { motion } from "framer-motion";

export default function AISummary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="frosted-glass-gold rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a4 4 0 0 1 4 4c0 2-2 4-4 4s-4-2-4-4 2-4 4-4z" />
          <path d="M20 18c0-4-4-8-8-8s-8 4-8 8" />
        </svg>
        <h2 className="font-heading text-xl text-[var(--accent-gold)]">Captain&apos;s Log</h2>
      </div>
      <div className="space-y-3">
        <p className="text-sm text-[var(--text-primary)] font-heading leading-relaxed">
          You have <span className="text-[var(--accent-gold)]">12 unread emails</span>,{" "}
          <span className="text-[var(--accent-teal)]">3 meetings today</span>,{" "}
          <span className="text-[var(--accent-gold)]">5 pending tasks</span>, and{" "}
          <span className="text-[var(--accent-teal)]">2 open PRs</span> requiring your review.
        </p>
        <p className="text-sm text-[var(--text-secondary)] font-heading italic">
          Your morning is clear until 10:30 AM — a good window for deep work. The most urgent email is from Sarah about the deployment deadline.
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] animate-pulse-glow" />
          Last synced 2 min ago
        </div>
      </div>
    </motion.div>
  );
}
