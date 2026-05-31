"use client";

import { useState } from "react";
import type { Persona, BriefingData } from "@/app/lib/types";

interface Props {
  current: Persona;
  onSelect: (p: Persona) => void;
}

const PERSONAS: { value: Persona; label: string; icon: string; desc: string }[] = [
  { value: "deep-work", label: "Deep Work", icon: "⚔️", desc: "Silence noise, focus on PRs & tasks" },
  { value: "inbox-zero", label: "Inbox Zero", icon: "📨", desc: "Communications first" },
  { value: "ship-mode", label: "Ship Mode", icon: "🚀", desc: "Crunch — code, CI, blockers only" },
];

export default function PersonaSelector({ current, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)]/40 transition-all"
        aria-label="Select mode"
      >
        <span>{PERSONAS.find((p) => p.value === current)?.icon}</span>
        <span>{PERSONAS.find((p) => p.value === current)?.label}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-56 glass-pirate rounded-xl border border-[var(--border)] shadow-xl overflow-hidden">
            {PERSONAS.map((p) => (
              <button
                key={p.value}
                onClick={() => { onSelect(p.value); setOpen(false); }}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--bg-tertiary)] ${
                  current === p.value ? "bg-[var(--bg-tertiary)] border-l-2 border-[var(--accent-gold)]" : ""
                }`}
              >
                <span className="text-lg mt-0.5">{p.icon}</span>
                <div>
                  <p className="text-sm font-mono text-[var(--text-primary)]">{p.label}</p>
                  <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-0.5">{p.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
