"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Props {
  icon: React.ReactNode;
  name: string;
  description: string;
  connected: boolean;
  enabled: boolean;
  onToggle: () => void;
  onDisconnect?: () => void;
  oauthPath?: string;
  hasToken: boolean;
  configured?: boolean;
}

export default function SourceToggle({ icon, name, description, connected, enabled, onToggle, onDisconnect, oauthPath, hasToken, configured = true }: Props) {
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  const notConfigured = !connected && !configured;
  const statusColor = connected ? "text-[var(--accent-teal)]" : hasToken ? "text-[var(--accent-red)]" : notConfigured ? "text-[var(--accent-gold)]" : "text-[var(--text-secondary)]";
  const statusDot = connected ? "bg-[var(--accent-teal)]" : hasToken ? "bg-[var(--accent-red)]" : notConfigured ? "bg-[var(--accent-gold)]" : "bg-[var(--text-secondary)]";
  const statusLabel = connected ? "Connected" : hasToken ? "Offline" : notConfigured ? "Setup required" : "Not connected";

  return (
    <div className={`glass rounded-xl p-5 flex items-center justify-between group transition-all duration-300 ${connected ? "border-[var(--accent-teal)]/20" : "border-[var(--border)]"} ${!connected && oauthPath && !hasToken ? "hover:border-[var(--accent-gold)]/20" : ""}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] border flex items-center justify-center transition-all duration-300 ${connected ? "border-[var(--accent-teal)]/40 text-[var(--accent-teal)]" : "text-[var(--text-secondary)] border-[var(--border)]"}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-heading text-lg text-[var(--text-primary)]">{name}</h3>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">{description}</p>
          <div className={`inline-flex items-center gap-1.5 text-xs font-mono mt-1.5 ${statusColor} transition-colors duration-300`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot} ${connected ? "anim-pulse" : ""}`} />
            {statusLabel}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {connected ? (
          <>
            <button
              onClick={onToggle}
              aria-label={enabled ? `Disable ${name}` : `Enable ${name}`}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${enabled ? "bg-[var(--accent-teal)] shadow-[0_0_12px_rgba(45,212,191,0.2)]" : "bg-[var(--bg-tertiary)] border border-[var(--border)]"}`}
            >
              <motion.div
                animate={{ x: enabled ? 28 : 3 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`absolute top-1 w-5 h-5 rounded-full shadow-sm ${enabled ? "bg-white" : "bg-[var(--text-secondary)]"}`}
              />
            </button>

            {!confirmDisconnect ? (
              <button
                onClick={() => setConfirmDisconnect(true)}
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-red)] hover:bg-[var(--accent-red)]/5 transition-all"
                aria-label={`Disconnect ${name}`}
                title="Disconnect"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[var(--accent-red)] whitespace-nowrap">Sure?</span>
                <button
                  onClick={() => { onDisconnect?.(); setConfirmDisconnect(false); }}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/30 text-[10px] font-mono text-[var(--accent-red)] hover:bg-[var(--accent-red)]/20 transition-all"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDisconnect(false)}
                  className="px-2 py-1.5 rounded-lg text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                >
                  No
                </button>
              </div>
            )}
          </>
        ) : oauthPath && !hasToken && configured ? (
          <a
            href={oauthPath}
            className="relative group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-b from-[var(--bg-tertiary)] to-[var(--bg-secondary)] border border-[var(--accent-gold)]/40 text-sm font-mono text-[var(--accent-gold)] hover:border-[var(--accent-gold)] hover:shadow-[0_0_24px_rgba(201,147,58,0.18)] transition-all duration-300"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-teal)] rounded-xl opacity-0 group-hover/btn:opacity-10 blur-md transition-opacity duration-500" />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
            Connect
          </a>
        ) : oauthPath && !hasToken && !configured ? (
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs font-mono text-[var(--text-secondary)] cursor-default">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Setup required
          </span>
        ) : (
          <button
            onClick={() => { onDisconnect?.(); }}
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
