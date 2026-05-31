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
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/briefing", { method: "POST" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: BriefingResponse = await res.json();
        if (!cancelled) setBriefing(data);
      } catch (err) {
        if (!cancelled) {
          console.error("[dashboard] Failed to load briefing:", err);
          setError("Failed to load briefing. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    fetch("/api/briefing", { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: BriefingResponse) => setBriefing(data))
      .catch((err) => {
        console.error("[dashboard] Failed to refresh briefing:", err);
        setError("Failed to refresh briefing. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  const connected = briefing?.source_status ?? {};
  const hasData = briefing?.data && Object.values(briefing.data).some((arr) => arr.length > 0);
  const isFullyDisconnected = briefing?.source_status && Object.values(briefing.source_status).every((v) => !v);

  return (
    <>
      <Nav />
      <main className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        {/* Background depth */}
        <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--accent-gold)] opacity-[0.02] blur-[120px] pointer-events-none" />
        <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[var(--accent-teal)] opacity-[0.015] blur-[150px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          {/* Page header */}
          <div className="mb-8" style={{ opacity: 0, animation: "fade-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards" }}>
            <h1 className="text-3xl sm:text-4xl font-heading text-[var(--text-primary)] tracking-tight">
              The Bridge
            </h1>
            <p className="text-sm text-[var(--text-secondary)] font-mono mt-2 tracking-wide">
              Your daily operational overview. All sources, one view.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--accent-red)] text-sm text-[var(--accent-red)] font-mono animate-fade-scale">
              {error}
              <button onClick={handleRefresh} className="ml-4 underline hover:no-underline">Retry</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <AISummary
                summary={briefing?.summary ?? ""}
                timestamp={briefing?.timestamp ?? ""}
                loading={loading}
                onRefresh={handleRefresh}
              />

              {!loading && isFullyDisconnected && (
                <div className="p-6 frosted-glass rounded-xl text-center perspective-1000">
                  <div className="card-3d-layer">
                    <p className="text-sm text-[var(--text-secondary)] font-mono mb-3">No data sources connected.</p>
                    <a
                      href="/settings"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--accent-teal)] font-mono hover:bg-[var(--border)] transition-colors"
                    >
                      Open Command Center
                    </a>
                  </div>
                </div>
              )}

              {!loading && !hasData && !isFullyDisconnected && (
                <div className="p-6 frosted-glass rounded-xl text-center perspective-1000">
                  <div className="card-3d-layer">
                    <p className="text-sm text-[var(--text-secondary)] font-mono">
                      Briefing loaded — no new activity across your sources.
                    </p>
                  </div>
                </div>
              )}

              <ChatInput briefingData={briefing?.data ?? null} />
              <SqlDrawer sql={briefing?.sql ?? ""} />
            </div>

            <div className="lg:col-span-5 space-y-4">
              <EmailsCard
                emails={briefing?.data?.emails ?? []}
                loading={loading}
                connected={connected.gmail ?? false}
              />
              <MeetingsCard
                meetings={briefing?.data?.meetings ?? []}
                loading={loading}
                connected={connected.calendar ?? false}
              />
              <TasksCard
                tasks={briefing?.data?.tasks ?? []}
                loading={loading}
                connected={connected.notion ?? false}
              />
              <PRsCard
                pull_requests={briefing?.data?.pull_requests ?? []}
                loading={loading}
                connected={connected.github ?? false}
              />
              <SlackCard
                slack_messages={briefing?.data?.slack_messages ?? []}
                loading={loading}
                connected={connected.slack ?? false}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
