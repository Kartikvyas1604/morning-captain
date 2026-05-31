"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BriefingData } from "@/app/lib/types";

interface Props {
  data: BriefingData | null;
}

export default function PulseSidebar({ data }: Props) {
  const [open, setOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const [lastCount, setLastCount] = useState(0);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (!data) return;
    const count = data.emails.length + data.slack_messages.length + data.pull_requests.length;
    if (count > lastCount && lastCount > 0) {
      setHasNew(true);
      const items: string[] = [];
      if (data.emails.length > 0) items.push(`${data.emails.length} new emails`);
      if (data.slack_messages.length > 0) items.push(`${data.slack_messages.length} Slack messages`);
      if (data.pull_requests.length > 0) items.push(`${data.pull_requests.length} PRs updated`);
      setNotifications(items);
      setTimeout(() => setHasNew(false), 5000);
    }
    setLastCount(count);
  }, [data]);

  const totalItems = data
    ? data.emails.length + data.meetings.length + data.tasks.length + data.pull_requests.length + data.slack_messages.length
    : 0;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="relative fixed right-4 bottom-4 z-50 w-12 h-12 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--accent-teal)] transition-all shadow-lg"
        aria-label="Pulse"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
        {hasNew && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--accent-red)] anim-pulse" />
        )}
        {totalItems > 0 && !open && (
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--accent-gold)] text-[9px] font-mono text-[var(--bg-primary)] flex items-center justify-center font-bold">
            {totalItems}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed right-0 top-0 bottom-0 z-[60] w-80 glass-pirate border-l border-[var(--border)] shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border)] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <h2 className="font-heading text-lg text-[var(--text-primary)]">Pulse</h2>
              </div>
              <button onClick={() => setOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="p-5 space-y-4">
              {notifications.length > 0 && (
                <div className="p-3 rounded-xl bg-[var(--accent-red)]/5 border border-[var(--accent-red)]/20">
                  <p className="text-xs font-mono text-[var(--accent-red)]">New activity</p>
                  {notifications.map((n, i) => (
                    <p key={i} className="text-sm font-mono text-[var(--text-primary)] mt-1">{n}</p>
                  ))}
                </div>
              )}

              {data?.emails && data.emails.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono text-[var(--accent-gold)] uppercase tracking-wider mb-2">Messages ({data.emails.length})</p>
                  {data.emails.slice(0, 5).map((e) => (
                    <div key={e.id} className="p-2.5 rounded-lg bg-[#080d14] border border-[var(--border)] mb-1.5">
                      <p className="text-xs font-mono text-[var(--text-primary)] truncate">{e.subject}</p>
                      <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-0.5">{e.sender}</p>
                    </div>
                  ))}
                </div>
              )}

              {data?.slack_messages && data.slack_messages.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono text-[var(--accent-teal)] uppercase tracking-wider mb-2">Slack ({data.slack_messages.length})</p>
                  {data.slack_messages.slice(0, 5).map((m) => (
                    <div key={m.id} className="p-2.5 rounded-lg bg-[#080d14] border border-[var(--border)] mb-1.5">
                      <p className="text-xs font-mono text-[var(--text-primary)] truncate">{m.text}</p>
                      <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-0.5">#{m.channel}</p>
                    </div>
                  ))}
                </div>
              )}

              {totalItems === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-[var(--text-secondary)] font-mono italic">No pulse yet. Data appears after briefing loads.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
