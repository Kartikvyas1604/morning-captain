"use client";

import { useEffect, useState } from "react";
import Nav from "@/app/components/layout/Nav";
import SourceToggle from "@/app/components/settings/SourceToggle";

const SOURCES = [
  { name: "gmail", label: "Gmail", desc: "Messages in the bottle", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 4l10 8 10-8"/></svg> },
  { name: "calendar", label: "Google Calendar", desc: "Ship's schedule", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { name: "notion", label: "Notion", desc: "Treasure map markers", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { name: "github", label: "GitHub", desc: "Ship repairs & upgrades", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2l3 3-3 3"/><path d="M6 2l-3 3 3 3"/><line x1="3" y1="5" x2="18" y2="5"/><line x1="12" y1="5" x2="12" y2="19"/><line x1="8" y1="21" x2="16" y2="21"/></svg> },
  { name: "slack", label: "Slack", desc: "Crow's nest chatter", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2a2.5 2.5 0 0 1 2.5 2.5v2.5h-2.5a2.5 2.5 0 0 1 0-5z"/><path d="M2 9.5A2.5 2.5 0 0 1 4.5 7H7v2.5a2.5 2.5 0 0 1-5 0z"/><path d="M9.5 22a2.5 2.5 0 0 1-2.5-2.5V17h2.5a2.5 2.5 0 0 1 0 5z"/><path d="M22 14.5a2.5 2.5 0 0 1-2.5 2.5H17v-2.5a2.5 2.5 0 0 1 5 0z"/></svg> },
];

export default function SettingsPage() {
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ gmail: true, calendar: true, notion: false, github: false, slack: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/sources");
        setStatus((await res.json()).status ?? {});
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const active = Object.values(status).filter(Boolean).length;

  return (
    <>
      <Nav />
      <main className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen wood-grain">
        <div className="fixed top-1/3 left-1/4 w-72 h-72 rounded-full bg-[var(--accent-teal)] opacity-[0.02] blur-[100px] pointer-events-none" />
        <div className="fixed bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[var(--accent-gold)] opacity-[0.015] blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <div className="mb-10 anim-fade-up d1">
            <h1 className="text-3xl font-heading text-[var(--text-primary)] tracking-tight">Captain&apos;s Quarters</h1>
            <p className="text-sm text-[var(--text-secondary)] font-mono mt-1">Manage your intelligence fleet.</p>
            {!loading && (
              <div className="flex items-center gap-3 mt-4">
                <div className="flex-1 h-px bg-gradient-to-r from-[var(--accent-gold)] to-transparent" />
                <span className="text-xs text-[var(--accent-gold)] font-mono">{active} of {SOURCES.length} ships in fleet</span>
                <div className="flex-1 h-px bg-gradient-to-l from-[var(--accent-gold)] to-transparent" />
              </div>
            )}
          </div>

          <div className="space-y-3">
            {SOURCES.map((s, i) => (
              <div key={s.name} className="anim-fade-up" style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
                <SourceToggle icon={s.icon} name={s.label} description={s.desc} connected={status[s.name] ?? false} enabled={enabled[s.name] ?? false} onToggle={() => setEnabled((p) => ({ ...p, [s.name]: !p[s.name] }))} />
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 glass rounded-xl anim-fade-up d10">
            <h2 className="font-heading text-lg text-[var(--text-primary)] mb-2">Treasure Vault</h2>
            <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
              All cargo encrypted in transit and at rest. No plunder stored permanently \u2014 cached only for your active voyage. Coral SQL queries run server-side.
            </p>
          </div>
        </div>

        {/* Treasure map corners */}
        <div className="fixed top-20 left-4 map-corner-tl opacity-20" />
        <div className="fixed top-20 right-4 map-corner-tr opacity-20" />
        <div className="fixed bottom-4 left-4 map-corner-bl opacity-20" />
        <div className="fixed bottom-4 right-4 map-corner-br opacity-20" />
      </main>
    </>
  );
}
