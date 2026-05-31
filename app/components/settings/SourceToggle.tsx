"use client";

import { motion } from "framer-motion";

interface SourceToggleProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  connected: boolean;
  enabled: boolean;
  onToggle: () => void;
}

export default function SourceToggle({
  icon,
  name,
  description,
  connected,
  enabled,
  onToggle,
}: SourceToggleProps) {
  return (
    <div className="frosted-glass rounded-xl p-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center ${enabled ? "icon-box-enabled" : "icon-box-disabled"}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-heading text-lg text-[var(--text-primary)]">{name}</h3>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">{description}</p>
          <span
            className={`inline-flex items-center gap-1 text-xs font-mono mt-1 ${
              connected ? "text-[var(--accent-teal)]" : "text-[var(--accent-red)]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                connected ? "bg-[var(--accent-teal)] animate-pulse-glow" : "bg-[var(--accent-red)]"
              }`}
            />
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      <button
        onClick={onToggle}
        aria-label={`Toggle ${name}`}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
          enabled ? "bg-[var(--accent-teal)]" : "bg-[var(--bg-tertiary)] border border-[var(--border)]"
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`absolute top-1 w-4 h-4 rounded-full ${
            enabled ? "bg-[var(--bg-primary)]" : "bg-[var(--text-secondary)]"
          }`}
        />
      </button>
    </div>
  );
}
