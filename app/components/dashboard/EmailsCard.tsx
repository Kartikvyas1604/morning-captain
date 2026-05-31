"use client";
import BriefingCard from "./BriefingCard";
import type { Email } from "@/app/lib/types";

interface Props { emails: Email[]; loading?: boolean; connected?: boolean; }

export default function EmailsCard({ emails, loading, connected }: Props) {
  return (
    <BriefingCard icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 4l10 8 10-8"/></svg>} title="Messages" count={emails.length} variant="gold" index={0} connected={connected} loading={loading}>
      {emails.length === 0 && !loading ? <p className="text-sm text-[var(--text-secondary)] font-mono italic">No messages in the bottle</p> : (
        <div className="space-y-2">
          {emails.slice(0, 3).map((e) => (
            <p key={e.id} className="text-sm text-[var(--text-secondary)] font-mono leading-relaxed truncate"><span className="text-[var(--text-primary)]">{e.sender}</span> \u2014 {e.subject}</p>
          ))}
        </div>
      )}
    </BriefingCard>
  );
}
