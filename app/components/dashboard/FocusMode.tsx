"use client";

import { useState } from "react";
import type { BriefingData } from "@/app/lib/types";
import { motion } from "framer-motion";

interface Props {
  data: BriefingData | null;
}

export default function FocusMode({ data }: Props) {
  const [hours, setHours] = useState(2);
  const [schedule, setSchedule] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  const generate = async () => {
    if (!data || loading) return;
    setLoading(true);
    setSchedule("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `I have ${hours} hours to focus today. Generate a structured focus block schedule respecting my calendar events. List the blocks with times.`,
          history: [],
          briefing_data: data,
        }),
      });
      const result = await res.json();
      setSchedule(result.reply || "Could not generate schedule.");
      setActive(true);
    } catch {
      setSchedule("Failed to generate. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-pirate rounded-xl p-5 parchment">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <h3 className="font-heading text-lg text-[var(--text-primary)]">Focus Mode</h3>
          {active && <span className="w-2 h-2 rounded-full bg-[var(--accent-teal)] anim-pulse" />}
        </div>
      </div>

      {!active && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <button onClick={() => setHours(Math.max(1, hours - 0.5))} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm">−</button>
            <span className="text-sm font-mono text-[var(--text-primary)] w-8 text-center">{hours}h</span>
            <button onClick={() => setHours(Math.min(8, hours + 0.5))} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm">+</button>
          </div>
          <button
            onClick={generate}
            disabled={!data || loading}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[var(--accent-teal)] to-[var(--accent-gold)] text-xs font-mono text-[var(--bg-primary)] font-medium hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "Planning..." : "Enter Focus"}
          </button>
        </div>
      )}

      {loading && (
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-[var(--bg-tertiary)] rounded animate-pulse w-full" />
          <div className="h-3 bg-[var(--bg-tertiary)] rounded animate-pulse w-4/5" />
          <div className="h-3 bg-[var(--bg-tertiary)] rounded animate-pulse w-3/5" />
        </div>
      )}

      {schedule && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className="p-3 rounded-xl bg-[#080d14] border border-[var(--border)]">
            <p className="text-xs font-mono text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">{schedule}</p>
          </div>
          <button
            onClick={() => { setActive(false); setSchedule(""); }}
            className="mt-3 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors"
          >
            Exit Focus Mode
          </button>
        </motion.div>
      )}
    </div>
  );
}
