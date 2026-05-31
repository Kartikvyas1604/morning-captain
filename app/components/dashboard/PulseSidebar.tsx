"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BriefingData } from "@/app/lib/types";

interface Props {
  data: BriefingData | null;
}

function fmtTime(iso: string) {
  try { return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }); } catch { return ""; }
}

function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }); } catch { return ""; }
}

const sectionColors: Record<string, string> = {
  emails: "var(--accent-gold)",
  slack: "var(--accent-teal)",
  prs: "var(--accent-teal)",
  meetings: "var(--accent-gold)",
  tasks: "var(--accent-teal)",
};

export default function PulseSidebar({ data }: Props) {
  const [open, setOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const [lastCount, setLastCount] = useState(0);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (!data) return;
    const count = data.emails.length + data.slack_messages.length + data.pull_requests.length;
    if (count > lastCount && lastCount > 0) {
      setHasNew(true);
      const items: string[] = [];
      if (data.emails.length > 0) items.push(`${data.emails.length} new emails`);
      if (data.slack_messages.length > 0) items.push(`${data.slack_messages.length} Slack messages`);
      if (data.pull_requests.length > 0) items.push(`${data.pull_requests.length} PRs updated`);
      setNotifications(items);
      setTimeout(() => setHasNew(false), 5000);
    }
    setLastCount(count);
  }, [data]);

  const emails = data?.emails ?? [];
  const slack = data?.slack_messages ?? [];
  const prs = data?.pull_requests ?? [];
  const meetings = data?.meetings ?? [];
  const tasks = data?.tasks ?? [];

  const totalItems = emails.length + meetings.length + tasks.length + prs.length + slack.length;
  const sections = [
    { key: "emails", label: "Messages", icon: "✉️", items: emails, color: sectionColors.emails, count: emails.length },
    { key: "meetings", label: "Meetings", icon: "📅", items: meetings, color: sectionColors.meetings, count: meetings.length },
    { key: "tasks", label: "Tasks", icon: "✅", items: tasks, color: sectionColors.tasks, count: tasks.length },
    { key: "prs", label: "Pull Requests", icon: "🔀", items: prs, color: sectionColors.prs, count: prs.length },
    { key: "slack", label: "Slack", icon: "💬", items: slack, color: sectionColors.slack, count: slack.length },
  ].filter((s) => s.count > 0);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
          open
            ? "bg-[var(--accent-teal)]/10 border-[var(--accent-teal)]/40 text-[var(--accent-teal)]"
            : "bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent-teal)] hover:border-[var(--accent-teal)]/40"
        }`}
        aria-label="Toggle pulse sidebar"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
        <span className="hidden sm:inline">Pulse</span>
        {totalItems > 0 && (
          <span
            className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-mono font-bold bg-[var(--accent-gold)] text-[var(--bg-primary)]"
            title={`${sections.map((s) => `${s.count} ${s.label}`).join(" · ")}`}
          >
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
        {hasNew && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--accent-red)] anim-pulse" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 360 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 360 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed right-0 top-0 bottom-0 z-[60] w-96 max-w-[calc(100vw-3rem)] glass-pirate border-l border-[var(--border)] shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border)] px-5 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <h2 className="font-heading text-lg text-[var(--text-primary)]">Pulse</h2>
                {totalItems > 0 && (
                  <span className="text-xs font-mono text-[var(--text-secondary)]">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-secondary)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] anim-pulse" />
                  Live
                </div>
                <button onClick={() => setOpen(false)} className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            <div className="p-5 space-y-6">
              {notifications.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-[var(--accent-red)]/10 to-transparent border border-[var(--accent-red)]/20"
                >
                  <p className="text-xs font-mono text-[var(--accent-red)] font-medium">New activity</p>
                  {notifications.map((n, i) => (
                    <p key={i} className="text-sm font-mono text-[var(--text-primary)] mt-1">{n}</p>
                  ))}
                </motion.div>
              )}

              {sections.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center mx-auto mb-5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] font-mono">No pulse yet, Captain.</p>
                  <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">Connect your sources in the Quarters to see activity here.</p>
                </div>
              )}

              {sections.map((section) => (
                <div key={section.key}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{section.icon}</span>
                      <h3 className="text-xs font-mono uppercase tracking-wider" style={{ color: section.color }}>
                        {section.label}
                      </h3>
                    </div>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                      style={{ borderColor: `${section.color}44`, color: section.color, background: `${section.color}11` }}
                    >
                      {section.count} {section.count === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {section.key === "emails" && (section.items as typeof emails).map((e) => (
                      <div key={e.id} className="group p-3 rounded-xl bg-[#080d14] border border-[var(--border)] hover:border-[var(--accent-gold)]/30 transition-all cursor-pointer">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-mono text-[var(--text-primary)] font-medium truncate group-hover:text-[var(--accent-gold)] transition-colors">{e.subject}</p>
                          {e.is_unread && <span className="shrink-0 w-2 h-2 rounded-full bg-[var(--accent-gold)] mt-1" title="Unread" />}
                        </div>
                        <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-1">{e.sender} · {fmtDate(e.received_at)}</p>
                        {e.snippet && <p className="text-[10px] font-mono text-[var(--text-secondary)]/60 mt-1 line-clamp-2">{e.snippet}</p>}
                      </div>
                    ))}

                    {section.key === "slack" && (section.items as typeof slack).map((m) => (
                      <div key={m.id} className="group p-3 rounded-xl bg-[#080d14] border border-[var(--border)] hover:border-[var(--accent-teal)]/30 transition-all cursor-pointer">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-mono text-[var(--accent-teal)] truncate group-hover:text-white transition-colors">#{m.channel}</p>
                          {m.is_unread && <span className="shrink-0 w-2 h-2 rounded-full bg-[var(--accent-teal)] mt-1" title="Unread" />}
                        </div>
                        <p className="text-xs font-mono text-[var(--text-primary)] mt-0.5 line-clamp-2">{m.sender}: {m.text}</p>
                      </div>
                    ))}

                    {section.key === "prs" && (section.items as typeof prs).map((p) => (
                      <div key={p.id} className="group p-3 rounded-xl bg-[#080d14] border border-[var(--border)] hover:border-[var(--accent-teal)]/30 transition-all cursor-pointer">
                        <p className="text-xs font-mono text-[var(--text-primary)] truncate group-hover:text-[var(--accent-teal)] transition-colors">{p.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-[var(--text-secondary)]">{p.repository}</span>
                          <span className="text-[10px] font-mono" style={{ color: "var(--accent-gold)" }}>{p.status.replace("_", " ")}</span>
                        </div>
                      </div>
                    ))}

                    {section.key === "meetings" && (section.items as typeof meetings).map((m) => (
                      <div key={m.id} className="group p-3 rounded-xl bg-[#080d14] border border-[var(--border)] hover:border-[var(--accent-gold)]/30 transition-all cursor-pointer">
                        <p className="text-xs font-mono text-[var(--text-primary)] truncate group-hover:text-[var(--accent-gold)] transition-colors">{m.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-[var(--accent-teal)]">{fmtTime(m.start_time)}</span>
                          <span className="text-[10px] font-mono text-[var(--text-secondary)]">· {m.organizer}</span>
                          {m.attendee_count > 0 && <span className="text-[10px] font-mono text-[var(--text-secondary)]">· {m.attendee_count} attendees</span>}
                        </div>
                      </div>
                    ))}

                    {section.key === "tasks" && (section.items as typeof tasks).map((t) => {
                      const priorityColor = t.priority === "high" ? "var(--accent-red)" : t.priority === "medium" ? "var(--accent-gold)" : "var(--accent-teal)";
                      return (
                        <div key={t.id} className="group p-3 rounded-xl bg-[#080d14] border border-[var(--border)] hover:border-[var(--accent-teal)]/30 transition-all cursor-pointer">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-mono text-[var(--text-primary)] truncate group-hover:text-[var(--accent-teal)] transition-colors">{t.title}</p>
                            <span className="shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: `${priorityColor}15`, color: priorityColor }}>
                              {t.priority}
                            </span>
                          </div>
                          {t.due_date && <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-1">Due {fmtDate(t.due_date)}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-t border-[var(--border)] px-5 py-3 flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)]" />
                Updated just now
              </div>
              <span>{totalItems} total</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
