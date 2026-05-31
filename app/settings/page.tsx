"use client";

import { useEffect, useState } from "react";
import Nav from "@/app/components/layout/Nav";
import SourceToggle from "@/app/components/settings/SourceToggle";

interface SourceInfo {
  name: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}

const SOURCES: SourceInfo[] = [
  {
    name: "gmail",
    label: "Gmail",
    description: "Unread emails from your inbox",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 4l10 8 10-8" />
      </svg>
    ),
  },
  {
    name: "calendar",
    label: "Google Calendar",
    description: "Today&apos;s events and meetings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    name: "notion",
    label: "Notion",
    description: "Tasks and action items",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    name: "github",
    label: "GitHub",
    description: "Open PRs and review requests",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2l3 3-3 3" />
        <path d="M6 2l-3 3 3 3" />
        <line x1="3" y1="5" x2="18" y2="5" />
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="8" y1="21" x2="16" y2="21" />
      </svg>
    ),
  },
  {
    name: "slack",
    label: "Slack",
    description: "Unread DMs and mentions",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2a2.5 2.5 0 0 1 2.5 2.5v2.5h-2.5a2.5 2.5 0 0 1 0-5z" />
        <path d="M2 9.5A2.5 2.5 0 0 1 4.5 7H7v2.5a2.5 2.5 0 0 1-5 0z" />
        <path d="M9.5 22a2.5 2.5 0 0 1-2.5-2.5V17h2.5a2.5 2.5 0 0 1 0 5z" />
        <path d="M22 14.5a2.5 2.5 0 0 1-2.5 2.5H17v-2.5a2.5 2.5 0 0 1 5 0z" />
      </svg>
    ),
  },
];

export default function SettingsPage() {
  const [sourceStatus, setSourceStatus] = useState<Record<string, boolean>>({});
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    gmail: true,
    calendar: true,
    notion: false,
    github: false,
    slack: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/sources");
        const data = await res.json();
        setSourceStatus(data.status ?? {});
      } catch (err) {
        console.error("[settings] Failed to load source status:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const toggleSource = (name: string) => {
    setEnabled((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const allConnected = Object.values(sourceStatus).filter(Boolean).length;

  return (
    <>
      <Nav />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-heading text-[var(--text-primary)] mb-2">
            Command Center
          </h1>
          <p className="text-sm text-[var(--text-secondary)] font-mono">
            Connect your intelligence sources. Toggle each one on to include it in your daily briefing.
          </p>
          {!loading && (
            <p className="text-xs text-[var(--accent-teal)] font-mono mt-2">
              {allConnected} of {SOURCES.length} sources connected
            </p>
          )}
        </div>

        <div className="space-y-4">
          {SOURCES.map((source) => (
            <SourceToggle
              key={source.name}
              icon={source.icon}
              name={source.label}
              description={source.description}
              connected={sourceStatus[source.name] ?? false}
              enabled={enabled[source.name] ?? false}
              onToggle={() => toggleSource(source.name)}
            />
          ))}
        </div>

        <div className="mt-10 p-5 frosted-glass rounded-xl">
          <h2 className="font-heading text-lg text-[var(--text-primary)] mb-2">Data Sources</h2>
          <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
            Morning Captain uses Coral SQL to query your connected services. All data is encrypted in transit and at rest.
            No data is stored permanently — only cached for your active session. Connect each source by configuring the
            appropriate environment variables in your deployment.
          </p>
        </div>
      </main>
    </>
  );
}
