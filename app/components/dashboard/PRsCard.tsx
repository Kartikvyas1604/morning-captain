"use client";
import BriefingCard from "./BriefingCard";
import type { PullRequest } from "@/app/lib/types";

interface Props { pull_requests: PullRequest[]; loading?: boolean; connected?: boolean; }

function sc(s: string) { const m: Record<string,string> = { needs_review:"status-needs_review", changes_requested:"status-changes_requested", draft:"status-draft", approved:"status-approved", merged:"status-merged" }; return m[s] || "status-draft"; }

export default function PRsCard({ pull_requests, loading, connected }: Props) {
  return (
    <BriefingCard icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2l3 3-3 3"/><path d="M6 2l-3 3 3 3"/><line x1="3" y1="5" x2="18" y2="5"/><line x1="12" y1="5" x2="12" y2="19"/><line x1="8" y1="21" x2="16" y2="21"/></svg>} title="Ship Repairs" count={pull_requests.length} variant="teal" index={3} connected={connected} loading={loading}>
      {pull_requests.length === 0 && !loading ? <p className="text-sm text-[var(--text-secondary)] font-mono italic">Hull is sound</p> : (
        <div className="space-y-2">
          {pull_requests.slice(0, 3).map((p) => (
            <p key={p.id} className="text-sm text-[var(--text-secondary)] font-mono leading-relaxed truncate"><span className={sc(p.status)}>#{p.id.slice(0,6)}</span> \u2014 {p.title}</p>
          ))}
        </div>
      )}
    </BriefingCard>
  );
}
