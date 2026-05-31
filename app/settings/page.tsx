"use client";

import { Suspense } from "react";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Nav from "@/app/components/layout/Nav";
import SourceToggle from "@/app/components/settings/SourceToggle";

const STORAGE_KEY = "mc_sources_enabled";

const SOURCES = [
  { name: "gmail", label: "Gmail", desc: "Messages in the bottle", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 4l10 8 10-8"/></svg>, oauth: "google" },
  { name: "calendar", label: "Google Calendar", desc: "Ship's schedule", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, oauth: "google" },
  { name: "notion", label: "Notion", desc: "Treasure map markers", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, oauth: "notion" },
  { name: "github", label: "GitHub", desc: "Ship repairs & upgrades", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2l3 3-3 3"/><path d="M6 2l-3 3 3 3"/><line x1="3" y1="5" x2="18" y2="5"/><line x1="12" y1="5" x2="12" y2="19"/><line x1="8" y1="21" x2="16" y2="21"/></svg>, oauth: "github" },
  { name: "slack", label: "Slack", desc: "Crow's nest chatter", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2a2.5 2.5 0 0 1 2.5 2.5v2.5h-2.5a2.5 2.5 0 0 1 0-5z"/><path d="M2 9.5A2.5 2.5 0 0 1 4.5 7H7v2.5a2.5 2.5 0 0 1-5 0z"/><path d="M9.5 22a2.5 2.5 0 0 1-2.5-2.5V17h2.5a2.5 2.5 0 0 1 0 5z"/><path d="M22 14.5a2.5 2.5 0 0 1-2.5 2.5H17v-2.5a2.5 2.5 0 0 1 5 0z"/></svg>, oauth: "slack" },
];

const DEFAULT_ENABLED: Record<string, boolean> = { gmail: true, calendar: true, notion: false, github: false, slack: false };

function saveEnabled(state: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("opencode:sources-changed"));
  } catch { /* noop */ }
}

const oauthProviderLabel: Record<string, string> = {
  google: "Google",
  notion: "Notion",
  github: "GitHub",
  slack: "Slack",
};

function SettingsContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const [tokens, setTokens] = useState<Record<string, boolean>>({});
  const [enabled, setEnabled] = useState<Record<string, boolean>>(DEFAULT_ENABLED);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState<"success" | "error" | "info">("info");

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/sources");
      const data = await res.json();
      setStatus(data.status ?? {});
      const foundTokens: Record<string, boolean> = {};
      for (const s of SOURCES) {
        const hasIt = data.sources?.find((src: any) => src.name === s.name)?.connected ?? false;
        foundTokens[s.oauth] = foundTokens[s.oauth] || hasIt;
      }
      if (data.token_map) {
        for (const [provider, has] of Object.entries(data.token_map)) {
          if (has) foundTokens[provider] = true;
        }
      }
      setTokens(foundTokens);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setEnabled((prev) => ({ ...prev, ...JSON.parse(saved) }));
    } catch { /* noop */ }

    const connected = searchParams.get("connected");
    const error = searchParams.get("error");

    if (connected) {
      setNotice(`${oauthProviderLabel[connected] || connected} connected!`);
      setNoticeType("success");
    }
    if (error) {
      setNotice(`Connection failed: ${error.replace(/_/g, " ")}`);
      setNoticeType("error");
    }
    if (connected || error) {
      setTimeout(() => setNotice(""), 6000);
      window.history.replaceState({}, "", "/settings");
    }
    fetchStatus();
  }, [searchParams, fetchStatus]);

  const connectedCount = Object.values(status).filter(Boolean).length;
  const enabledCount = Object.values(enabled).filter(Boolean).length;

  const handleToggle = (name: string) => {
    setEnabled((prev) => {
      const next = { ...prev, [name]: !prev[name] };
      saveEnabled(next);
      return next;
    });
  };

  const handleDisconnect = async (oauthProvider: string) => {
    try {
      await fetch("/api/auth/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: oauthProvider }),
      });
      setNotice(`${oauthProviderLabel[oauthProvider] || oauthProvider} disconnected.`);
      setNoticeType("info");
      setTokens((prev) => ({ ...prev, [oauthProvider]: false }));
      setStatus((prev) => {
        const next = { ...prev };
        for (const k of Object.keys(next)) {
          if (SOURCES.find((s) => s.name === k && s.oauth === oauthProvider)) {
            next[k] = false;
          }
        }
        return next;
      });
      setTimeout(() => setNotice(""), 5000);
      fetchStatus();
    } catch { /* noop */ }
  };

  const getHasToken = (oauthProvider: string) => tokens[oauthProvider] ?? false;

  return (
    <main className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen wood-grain">
      <div className="fixed top-1/3 left-1/4 w-72 h-72 rounded-full bg-[var(--accent-teal)] opacity-[0.02] blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[var(--accent-gold)] opacity-[0.015] blur-[120px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        <div className="mb-10 anim-fade-up d1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-heading text-[var(--text-primary)] tracking-tight">Captain&apos;s Quarters</h1>
              <p className="text-sm text-[var(--text-secondary)] font-mono mt-1">Connect your fleet to start receiving intelligence.</p>
            </div>
            {!loading && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">Connected</span>
                <span className="text-[10px] font-mono text-[var(--accent-gold)]">{connectedCount}/{SOURCES.length}</span>
              </div>
            )}
          </div>
        </div>

        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            className={`mb-6 p-4 rounded-xl glass border text-sm font-mono ${
              noticeType === "success" ? "border-[var(--accent-teal)] text-[var(--accent-teal)]" :
              noticeType === "error" ? "border-[var(--accent-red)] text-[var(--accent-red)]" :
              "border-[var(--accent-gold)] text-[var(--accent-gold)]"
            }`}
          >
            <div className="flex items-center gap-2">
              {noticeType === "success" && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>}
              {noticeType === "error" && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
              {notice}
            </div>
          </motion.div>
        )}

        <div className="space-y-3 anim-fade-up d2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-base text-[var(--text-primary)]">Sources</h2>
            <span className="text-[10px] font-mono text-[var(--text-secondary)]">{enabledCount} active · {connectedCount} connected</span>
          </div>
          {SOURCES.map((s, i) => (
            <div key={s.name} className="anim-fade-up" style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
              <SourceToggle
                icon={s.icon}
                name={s.label}
                description={s.desc}
                connected={status[s.name] ?? false}
                enabled={enabled[s.name] ?? false}
                hasToken={getHasToken(s.oauth)}
                oauthPath={`/api/auth/${s.oauth}`}
                onToggle={() => handleToggle(s.name)}
                onDisconnect={() => handleDisconnect(s.oauth)}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 glass rounded-xl anim-fade-up d10 border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <h2 className="font-heading text-lg text-[var(--text-primary)]">Security</h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
            All connections use OAuth 2.0 — you never enter API keys. Tokens are stored server-side, encrypted in transit, and cached only for your session. No data is stored permanently.
          </p>
          <div className="mt-4 flex items-center gap-4 text-[10px] font-mono text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] anim-pulse" /> OAuth 2.0</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]" /> Encrypted</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)]" /> Session only</span>
          </div>
        </div>
      </div>

      <div className="fixed top-20 left-4 map-corner-tl opacity-20" />
      <div className="fixed top-20 right-4 map-corner-tr opacity-20" />
      <div className="fixed bottom-4 left-4 map-corner-bl opacity-20" />
      <div className="fixed bottom-4 right-4 map-corner-br opacity-20" />
    </main>
  );
}

export default function SettingsPage() {
  return (
    <>
      <Nav />
      <Suspense fallback={
        <main className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen wood-grain">
          <div className="max-w-3xl mx-auto">
            <div className="h-10 w-48 bg-[var(--bg-tertiary)] rounded animate-pulse mb-4" />
            <div className="h-4 w-64 bg-[var(--bg-tertiary)] rounded animate-pulse" />
          </div>
        </main>
      }>
        <SettingsContent />
      </Suspense>
    </>
  );
}
