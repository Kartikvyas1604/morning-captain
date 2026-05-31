"use client";
import BriefingCard from "./BriefingCard";
import type { Task } from "@/app/lib/types";

interface Props { tasks: Task[]; loading?: boolean; connected?: boolean; }

const labels: Record<string,string> = { high:"\uD83D\uDD34 High", medium:"\uD83D\uDFE1 Med", normal:"\uD83D\uDFE2 Norm", low:"\u26AA Low" };
function pc(p: string) { return `priority-${p}`; }

export default function TasksCard({ tasks, loading, connected }: Props) {
  return (
    <BriefingCard icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>} title="Treasure List" count={tasks.length} variant="gold" index={2} connected={connected} loading={loading}>
      {tasks.length === 0 && !loading ? <p className="text-sm text-[var(--text-secondary)] font-mono italic">No plunder pending</p> : (
        <div className="space-y-2">
          {tasks.slice(0, 3).map((t) => (
            <p key={t.id} className="text-sm text-[var(--text-secondary)] font-mono leading-relaxed truncate"><span className={pc(t.priority)}>{labels[t.priority] || t.priority}</span> {t.title}</p>
          ))}
        </div>
      )}
    </BriefingCard>
  );
}
