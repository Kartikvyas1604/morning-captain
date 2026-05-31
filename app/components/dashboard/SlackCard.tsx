"use client";
import BriefingCard from "./BriefingCard";
import type { SlackMessage } from "@/app/lib/types";

interface Props { slack_messages: SlackMessage[]; loading?: boolean; connected?: boolean; }

export default function SlackCard({ slack_messages, loading, connected }: Props) {
  return (
    <BriefingCard icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2a2.5 2.5 0 0 1 2.5 2.5v2.5h-2.5a2.5 2.5 0 0 1 0-5z"/><path d="M2 9.5A2.5 2.5 0 0 1 4.5 7H7v2.5a2.5 2.5 0 0 1-5 0z"/><path d="M9.5 22a2.5 2.5 0 0 1-2.5-2.5V17h2.5a2.5 2.5 0 0 1 0 5z"/><path d="M22 14.5a2.5 2.5 0 0 1-2.5 2.5H17v-2.5a2.5 2.5 0 0 1 5 0z"/></svg>} title="Crow&apos;s Nest" count={slack_messages.length} variant="gold" index={4} connected={connected} loading={loading}>
      {slack_messages.length === 0 && !loading ? <p className="text-sm text-[var(--text-secondary)] font-mono italic">Quiet seas</p> : (
        <div className="space-y-2">
          {slack_messages.slice(0, 3).map((m) => (
            <p key={m.id} className="text-sm text-[var(--text-secondary)] font-mono leading-relaxed truncate"><span className="text-[var(--accent-teal)]">#{m.channel}</span> \u2014 {m.sender}: {m.text}</p>
          ))}
        </div>
      )}
    </BriefingCard>
  );
}
