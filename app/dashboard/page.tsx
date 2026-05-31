"use client";

import { useEffect, useState } from "react";
import Nav from "@/app/components/layout/Nav";
import AISummary from "@/app/components/dashboard/AISummary";
import EmailsCard from "@/app/components/dashboard/EmailsCard";
import MeetingsCard from "@/app/components/dashboard/MeetingsCard";
import TasksCard from "@/app/components/dashboard/TasksCard";
import PRsCard from "@/app/components/dashboard/PRsCard";
import SlackCard from "@/app/components/dashboard/SlackCard";
import ChatInput from "@/app/components/dashboard/ChatInput";
import SqlDrawer from "@/app/components/dashboard/SqlDrawer";
import type { BriefingResponse } from "@/app/lib/types";

export default function DashboardPage() {
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const res = await fetch("/api/briefing", { method: "POST" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: BriefingResponse = await res.json();
        if (!c) setBriefing(data);
      } catch (err) {
        if (!c) { console.error(err); setError("Failed to load briefing."); }
      } finally { if (!c) setLoading(false); }
    })();
    return () => { c = true; };
  }, []);

  const refresh = () => {
    setLoading(true); setError(null);
    fetch("/api/briefing", { method: "POST" })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: BriefingResponse) => setBriefing(d))
      .catch(() => setError("Failed to refresh."))
      .finally(() => setLoading(false));
  };

  const st = briefing?.source_status ?? {};
  const hasData = briefing?.data && Object.values(briefing.data).some((a) => a.length > 0);
  const allOff = st && Object.values(st).every((v) => !v);

  return (
    <>
      <Nav />
      <main className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen wood-grain">
        <div className="fixed top-1/4 left-1/4 w-80 h-80 rounded-full bg-[var(--accent-gold)] opacity-[0.02] blur-[100px] pointer-events-none" />
        <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--accent-teal)] opacity-[0.015] blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="mb-8 anim-fade-up d1">
            <h1 className="text-3xl font-heading text-[var(--text-primary)] tracking-tight">The Captain&apos;s Deck</h1>
            <p className="text-sm text-[var(--text-secondary)] font-mono mt-1">All hands on deck — your daily intelligence.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--accent-red)] text-sm text-[var(--accent-red)] font-mono anim-scale-in">
              Arrr! {error} <button onClick={refresh} className="ml-4 underline">Retry</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <AISummary summary={briefing?.summary ?? ""} timestamp={briefing?.timestamp ?? ""} loading={loading} onRefresh={refresh} />

              {!loading && allOff && (
                <div className="p-6 glass rounded-xl text-center">
                  <p className="text-sm text-[var(--text-secondary)] font-mono mb-3">No sources in sight, Captain.</p>
                  <a href="/settings" className="inline-flex px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--accent-teal)] font-mono hover:bg-[var(--border)] transition-colors">Open the Charts</a>
                </div>
              )}
              {!loading && !hasData && !allOff && (
                <div className="p-6 glass rounded-xl text-center">
                  <p className="text-sm text-[var(--text-secondary)] font-mono">Calm waters. No new sightings.</p>
                </div>
              )}

              <ChatInput briefingData={briefing?.data ?? null} />
              <SqlDrawer sql={briefing?.sql ?? ""} />
            </div>

            <div className="lg:col-span-5 space-y-4">
              <EmailsCard emails={briefing?.data?.emails ?? []} loading={loading} connected={st.gmail ?? false} />
              <MeetingsCard meetings={briefing?.data?.meetings ?? []} loading={loading} connected={st.calendar ?? false} />
              <TasksCard tasks={briefing?.data?.tasks ?? []} loading={loading} connected={st.notion ?? false} />
              <PRsCard pull_requests={briefing?.data?.pull_requests ?? []} loading={loading} connected={st.github ?? false} />
              <SlackCard slack_messages={briefing?.data?.slack_messages ?? []} loading={loading} connected={st.slack ?? false} />
            </div>
          </div>
        </div>

        {/* Treasure map corners */}
        <div className="fixed top-20 left-4 map-corner-tl opacity-30" />
        <div className="fixed top-20 right-4 map-corner-tr opacity-30" />
        <div className="fixed bottom-4 left-4 map-corner-bl opacity-30" />
        <div className="fixed bottom-4 right-4 map-corner-br opacity-30" />
      </main>
    </>
  );
}
