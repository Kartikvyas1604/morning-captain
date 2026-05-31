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
    <div className={`glass rounded-xl p-5 flex items-center justify-between group transition-all duration-300 ${connected ? "border-[var(--accent-teal)]/20" : ""}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] border flex items-center justify-center transition-all duration-300 ${connected ? "border-[var(--accent-teal)]/40 text-[var(--accent-teal)]" : "border-[var(--border)] text-[var(--text-secondary)]"}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-heading text-lg text-[var(--text-primary)]">{name}</h3>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">{description}</p>
          {connected && (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono mt-1.5 text-[var(--accent-teal)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] anim-pulse" />
              Connected
            </span>
          )}
          {!connected && hasToken && (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono mt-1.5 text-[var(--accent-red)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)]" />
              Offline
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {connected && (
          <button
            onClick={onToggle}
            aria-label={`Toggle ${name}`}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${enabled ? "bg-[var(--accent-teal)]" : "bg-[var(--bg-tertiary)] border border-[var(--border)]"}`}
          >
            <motion.div
              animate={{ x: enabled ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`absolute top-1 w-4 h-4 rounded-full ${enabled ? "bg-[var(--bg-primary)]" : "bg-[var(--text-secondary)]"}`}
            />
          </button>
        )}

        {!connected && oauthPath && (
          <a
            href={oauthPath}
            className="relative group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-b from-[var(--bg-tertiary)] to-[var(--bg-secondary)] border border-[var(--accent-gold)]/40 text-sm font-mono text-[var(--accent-gold)] hover:border-[var(--accent-gold)] hover:shadow-[0_0_20px_rgba(201,147,58,0.15)] transition-all duration-300"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-teal)] rounded-xl opacity-0 group-hover/btn:opacity-10 blur-md transition-opacity duration-500" />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
            Connect
          </a>
        )}

        {!connected && !oauthPath && hasToken && (
          <button
            onClick={onToggle}
            className="relative group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--accent-red)]/30 text-sm font-mono text-[var(--accent-red)] hover:bg-[var(--accent-red)]/10 transition-all duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
}
