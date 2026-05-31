"use client";

import { useEffect, useState, useCallback } from "react";
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
import type { BriefingResponse, Persona } from "@/app/lib/types";

export default function DashboardPage() {
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [persona, setPersona] = useState<Persona>("deep-work");

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
    if (typeof window !== "undefined") localStorage.setItem("mc_persona", p);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("mc_persona") as Persona | null;
    if (saved && ["deep-work", "inbox-zero", "ship-mode"].includes(saved)) setPersona(saved);
  }, []);

  const st = briefing?.source_status ?? {};
  const hasData = briefing?.data && Object.values(briefing.data).some((a) => a.length > 0);
  const allOff = st && Object.values(st).every((v) => !v);

  return (
    <>
      <Nav />
      <CommandBar />
      <PulseSidebar data={briefing?.data ?? null} />
      <main className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen wood-grain">
        <div className="fixed top-1/4 left-1/4 w-80 h-80 rounded-full bg-[var(--accent-gold)] opacity-[0.02] blur-[100px] pointer-events-none" />
        <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--accent-teal)] opacity-[0.015] blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="mb-8 anim-fade-up d1 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading text-[var(--text-primary)] tracking-tight">The Captain&apos;s Deck</h1>
              <p className="text-sm text-[var(--text-secondary)] font-mono mt-1">All hands on deck — your daily intelligence.</p>
            </div>
            <div className="flex items-center gap-3">
              <PersonaSelector current={persona} onSelect={changePersona} />
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
                Refresh
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <EmailsCard emails={briefing?.data?.emails ?? []} loading={loading} connected={st.gmail ?? false} />
              <MeetingsCard meetings={briefing?.data?.meetings ?? []} loading={loading} connected={st.calendar ?? false} />
              <TasksCard tasks={briefing?.data?.tasks ?? []} loading={loading} connected={st.notion ?? false} />
              <PRsCard pull_requests={briefing?.data?.pull_requests ?? []} loading={loading} connected={st.github ?? false} />
              <SlackCard slack_messages={briefing?.data?.slack_messages ?? []} loading={loading} connected={st.slack ?? false} />
            </div>

            <div className="lg:col-span-5 space-y-6">
              <AISummary summary={briefing?.summary ?? ""} timestamp={briefing?.timestamp ?? ""} loading={loading} onRefresh={refresh} aiGenerated={briefing?.ai_generated ?? false} />
              <CaptainsLog data={briefing?.data ?? null} />
              <StandupGenerator data={briefing?.data ?? null} />
              <FocusMode data={briefing?.data ?? null} />
              <ChatInput briefingData={briefing?.data ?? null} />
              <SqlDrawer sql={briefing?.sql ?? ""} />
            </div>
          </div>
        </div>

        <div className="fixed top-20 left-4 map-corner-tl opacity-30" />
        <div className="fixed top-20 right-4 map-corner-tr opacity-30" />
        <div className="fixed bottom-4 left-4 map-corner-bl opacity-30" />
        <div className="fixed bottom-4 right-4 map-corner-br opacity-30" />
      </main>
    </>
  );
}
