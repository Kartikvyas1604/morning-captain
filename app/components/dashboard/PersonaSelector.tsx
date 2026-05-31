"use client";

import { motion } from "framer-motion";
import type { Persona } from "@/app/lib/types";

interface Props {
  current: Persona;
  onSelect: (p: Persona) => void;
}

const PERSONAS: {
  value: Persona;
  label: string;
  abbr: string;
  icon: string;
  desc: string;
  color: string;
}[] = [
  {
    value: "deep-work",
    label: "Deep Work",
    abbr: "Focus",
    icon: "⚔️",
    desc: "Silence noise, focus on PRs & tasks",
    color: "#c9933a",
  },
  {
    value: "inbox-zero",
    label: "Inbox Zero",
    abbr: "Inbox",
    icon: "📨",
    desc: "Communications first",
    color: "#2dd4bf",
  },
  {
    value: "ship-mode",
    label: "Ship Mode",
    abbr: "Ship",
    icon: "🚀",
    desc: "Crunch — code, CI, blockers only",
    color: "#e05c5c",
  },
];

export default function PersonaSelector({ current, onSelect }: Props) {
  return (
    <div className="relative flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-tertiary)]/60 border border-[var(--border)] backdrop-blur-sm">
      {PERSONAS.map((p) => {
        const isActive = current === p.value;
        return (
          <button
            key={p.value}
            onClick={() => onSelect(p.value)}
            className={`relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3.5 py-2 rounded-lg text-xs font-mono transition-all duration-200 ${
              isActive
                ? "text-white"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="persona-indicator"
                className="absolute inset-0 rounded-lg border"
                style={{
                  background: `linear-gradient(135deg, ${p.color}22, ${p.color}08)`,
                  borderColor: `${p.color}55`,
                  boxShadow: `0 0 24px ${p.color}22, inset 0 0 12px ${p.color}11`,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{p.icon}</span>
            <span className="relative z-10 hidden sm:inline">{p.label}</span>
            <span className="relative z-10 sm:hidden">{p.abbr}</span>
          </button>
        );
      })}
    </div>
  );
}
