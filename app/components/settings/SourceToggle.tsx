"use client";

import { motion } from "framer-motion";

interface Props {
  icon: React.ReactNode;
  name: string;
  description: string;
  connected: boolean;
  enabled: boolean;
  onToggle: () => void;
  oauthPath?: string;
  hasToken: boolean;
}

export default function SourceToggle({ icon, name, description, connected, enabled, onToggle, oauthPath, hasToken }: Props) {
  return (
    <div className="glass-pirate rounded-xl p-5 flex items-center justify-between group parchment">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center ${enabled ? "icon-on anim-treasure-glow" : "icon-off"}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-heading text-lg text-[var(--text-primary)]">{name}</h3>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">{description}</p>
          <span className={`inline-flex items-center gap-1 text-xs font-mono mt-1 ${connected ? "text-[var(--accent-teal)]" : hasToken ? "text-[var(--accent-red)]" : "text-[var(--text-secondary)]"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-[var(--accent-teal)] anim-pulse" : hasToken ? "bg-[var(--accent-red)]" : "bg-[var(--text-secondary)]"}`} />
            {connected ? "On Watch" : hasToken ? "Off Duty" : "Not Connected"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {hasToken && (
          <button
            onClick={onToggle}
            aria-label={`Toggle ${name}`}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${enabled ? "bg-[var(--accent-gold)]" : "bg-[var(--bg-tertiary)] border border-[var(--border)]"}`}
          >
            <motion.div
              animate={{ x: enabled ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`absolute top-1 w-4 h-4 rounded-full ${enabled ? "bg-[var(--bg-primary)]" : "bg-[var(--text-secondary)]"}`}
            />
          </button>
        )}

        {oauthPath && !hasToken && (
          <a
            href={oauthPath}
            className="px-3 py-1.5 rounded-lg bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/30 text-xs font-mono text-[var(--accent-teal)] hover:bg-[var(--accent-teal)]/20 transition-all"
          >
            Connect
          </a>
        )}
      </div>
    </div>
  );
}
