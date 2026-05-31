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
import type { BriefingResponse } from "@/app/lib/types";

export default function DashboardPage() {
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBriefing = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/briefing", { method: "POST" });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data: BriefingResponse = await res.json();
      setBriefing(data);
    } catch (err) {
      console.error("[dashboard] Failed to load briefing:", err);
      setError("Failed to load briefing. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBriefing();
  }, [fetchBriefing]);

  const connected = briefing?.source_status ?? {};
  const hasData = briefing?.data && Object.values(briefing.data).some((arr) => arr.length > 0);
  const isFullyDisconnected = briefing?.source_status && Object.values(briefing.source_status).every((v) => !v);

  return (
    <>
      <Nav />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--accent-red)] text-sm text-[var(--accent-red)] font-mono">
            {error}
            <button
              onClick={fetchBriefing}
              className="ml-4 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <AISummary
              summary={briefing?.summary ?? ""}
              timestamp={briefing?.timestamp ?? ""}
              loading={loading}
              onRefresh={fetchBriefing}
            />

            {!loading && isFullyDisconnected && (
              <div className="p-5 frosted-glass rounded-xl text-center">
                <p className="text-sm text-[var(--text-secondary)] font-mono mb-3">
                  No data sources connected. Configure your sources in Settings.
                </p>
                <a
                  href="/settings"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--accent-teal)] font-mono hover:bg-[var(--border)] transition-colors"
                >
                  Open Settings
                </a>
              </div>
            )}

            {!loading && !hasData && !isFullyDisconnected && (
              <div className="p-5 frosted-glass rounded-xl text-center">
                <p className="text-sm text-[var(--text-secondary)] font-mono">
                  Briefing loaded but no items found. Your sources may have no new activity today.
                </p>
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
      </main>
    </>
  );
}
