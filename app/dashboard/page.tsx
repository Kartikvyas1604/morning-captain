"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Nav from "@/app/components/layout/Nav";
import AISummary from "@/app/components/dashboard/AISummary";
import EmailsCard from "@/app/components/dashboard/EmailsCard";
import MeetingsCard from "@/app/components/dashboard/MeetingsCard";
import TasksCard from "@/app/components/dashboard/TasksCard";
import PRsCard from "@/app/components/dashboard/PRsCard";
import SlackCard from "@/app/components/dashboard/SlackCard";
import ChatInput from "@/app/components/dashboard/ChatInput";
import SqlDrawer from "@/app/components/dashboard/SqlDrawer";
import CommandBar from "@/app/components/dashboard/CommandBar";
import PersonaSelector from "@/app/components/dashboard/PersonaSelector";
import StandupGenerator from "@/app/components/dashboard/StandupGenerator";
import FocusMode from "@/app/components/dashboard/FocusMode";
import CaptainsLog from "@/app/components/dashboard/CaptainsLog";
import PulseSidebar from "@/app/components/dashboard/PulseSidebar";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import type { BriefingResponse, Persona } from "@/app/lib/types";

const STORAGE_KEY = "mc_sources_enabled";

const DEFAULT_PERSONA: Persona = "deep-work";
const DEFAULT_ENABLED: Record<string, boolean> = {};

export default function DashboardPage() {
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [persona, setPersona] = useState<Persona>(DEFAULT_PERSONA);
  const [sourcesEnabled, setSourcesEnabled] = useState<Record<string, boolean>>(DEFAULT_ENABLED);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mc_persona");
      if (saved && ["deep-work", "inbox-zero", "ship-mode"].includes(saved)) setPersona(saved as Persona);
      const enabledRaw = localStorage.getItem(STORAGE_KEY);
      if (enabledRaw) setSourcesEnabled(JSON.parse(enabledRaw));
    } catch { /* noop */ }

    const handler = () => {
      try {
        const enabledRaw = localStorage.getItem(STORAGE_KEY);
        if (enabledRaw) setSourcesEnabled(JSON.parse(enabledRaw));
      } catch { /* noop */ }
    };
    window.addEventListener("storage", handler);
    window.addEventListener("opencode:sources-changed", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("opencode:sources-changed", handler);
    };
  }, []);

  const fetchBriefing = useCallback(async (p: Persona) => {
    try {
      const res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: p }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: BriefingResponse = await res.json();
      setBriefing(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load briefing.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let c = false;
    setLoading(true);
    fetchBriefing(persona).catch(() => { if (!c) setError("Failed to load."); });
    return () => { c = true; };
  }, [persona, fetchBriefing]);

  const refresh = useCallback(() => {
    setLoading(true); setError(null);
    fetchBriefing(persona);
  }, [persona, fetchBriefing]);

  const changePersona = useCallback((p: Persona) => {
    setPersona(p);
    try { localStorage.setItem("mc_persona", p); } catch { /* noop */ }
  }, []);

  const st = briefing?.source_status ?? {};
  const hasData = briefing?.data && Object.values(briefing.data).some((a) => a.length > 0);
  const allOff = st && Object.values(st).every((v) => !v);

  return (
    <>
      <Nav />
      <ErrorBoundary><CommandBar /></ErrorBoundary>
      <main className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen wood-grain">
        <div className="fixed top-1/4 left-1/4 w-80 h-80 rounded-full bg-[var(--accent-gold)] opacity-[0.02] blur-[100px] pointer-events-none" />
        <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--accent-teal)] opacity-[0.015] blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="mb-8 anim-fade-up d1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-heading text-[var(--text-primary)] tracking-tight">The Captain&apos;s Deck</h1>
              <p className="text-sm text-[var(--text-secondary)] font-mono mt-1">All hands on deck — your daily intelligence.</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ErrorBoundary><PersonaSelector current={persona} onSelect={changePersona} /></ErrorBoundary>
              <ErrorBoundary><PulseSidebar data={briefing?.data ?? null} /></ErrorBoundary>
              <button
                onClick={refresh}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent-teal)] hover:border-[var(--accent-teal)]/40 transition-all disabled:opacity-50"
                aria-label="Refresh briefing"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={loading ? "animate-spin" : ""}>
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--accent-red)] text-sm text-[var(--accent-red)] font-mono anim-scale-in">
              Arrr! {error} <button onClick={refresh} className="ml-4 underline">Retry</button>
            </div>
          )}

          {!loading && allOff && (
            <div className="mb-6 p-6 glass rounded-xl text-center">
              <p className="text-sm text-[var(--text-secondary)] font-mono mb-3">No sources in sight, Captain.</p>
              <a href="/settings" className="inline-flex px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--accent-teal)] font-mono hover:bg-[var(--border)] transition-colors">Open the Charts</a>
            </div>
          )}

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.06 } },
            }}
          >
            <motion.div
              className="lg:col-span-7 space-y-4"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }}
            >
              {(sourcesEnabled.gmail ?? true) && (
                <EmailsCard emails={briefing?.data?.emails ?? []} loading={loading} connected={st.gmail ?? false} />
              )}
              {(sourcesEnabled.calendar ?? true) && (
                <MeetingsCard meetings={briefing?.data?.meetings ?? []} loading={loading} connected={st.calendar ?? false} />
              )}
              {(sourcesEnabled.notion ?? false) && (
                <TasksCard tasks={briefing?.data?.tasks ?? []} loading={loading} connected={st.notion ?? false} />
              )}
              {(sourcesEnabled.github ?? false) && (
                <PRsCard pull_requests={briefing?.data?.pull_requests ?? []} loading={loading} connected={st.github ?? false} />
              )}
              {(sourcesEnabled.slack ?? false) && (
                <SlackCard slack_messages={briefing?.data?.slack_messages ?? []} loading={loading} connected={st.slack ?? false} />
              )}
            </motion.div>

            <motion.div
              className="lg:col-span-5 space-y-6"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }}
            >
              <ErrorBoundary>
                <AISummary summary={briefing?.summary ?? ""} timestamp={briefing?.timestamp ?? ""} loading={loading} onRefresh={refresh} aiGenerated={briefing?.ai_generated ?? false} />
              </ErrorBoundary>
              <ErrorBoundary><CaptainsLog data={briefing?.data ?? null} /></ErrorBoundary>
              <ErrorBoundary><StandupGenerator data={briefing?.data ?? null} /></ErrorBoundary>
              <ErrorBoundary><FocusMode data={briefing?.data ?? null} /></ErrorBoundary>
              <ChatInput briefingData={briefing?.data ?? null} />
              <SqlDrawer sql={briefing?.sql ?? ""} />
            </motion.div>
          </motion.div>
        </div>

        <div className="fixed bottom-6 right-6 z-40 group flex items-center gap-2">
          <span className="hidden sm:block text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--bg-tertiary)]/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-[var(--border)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <kbd className="text-[var(--accent-gold)]">⌘K</kbd> commands
          </span>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("opencode:toggle-command-palette"))}
            className="w-11 h-11 rounded-full glass-pirate border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)]/40 transition-all duration-200 hover:shadow-[0_0_24px_rgba(201,147,58,0.15)] active:scale-90 anim-treasure-glow"
            aria-label="Open command palette"
            title="Open command palette (⌘K)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
            </svg>
          </button>
        </div>

        <div className="fixed top-20 left-4 map-corner-tl opacity-30" />
        <div className="fixed top-20 right-4 map-corner-tr opacity-30" />
        <div className="fixed bottom-4 left-4 map-corner-bl opacity-30" />
        <div className="fixed bottom-4 right-4 map-corner-br opacity-30" />
      </main>
    </>
  );
}
