"use client";

import BriefingCard from "./BriefingCard";
import type { Task } from "@/app/lib/types";

interface TasksCardProps {
  tasks: Task[];
  loading?: boolean;
  connected?: boolean;
}

const priorityColors: Record<string, string> = {
  high: "var(--accent-red)",
  medium: "var(--accent-gold)",
  normal: "var(--accent-teal)",
  low: "var(--text-secondary)",
};

const priorityLabels: Record<string, string> = {
  high: "🔴 High",
  medium: "🟡 Med",
  normal: "🟢 Norm",
  low: "⚪ Low",
};

export default function TasksCard({ tasks, loading = false, connected = true }: TasksCardProps) {
  return (
    <BriefingCard
      icon={
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      }
      title="Tasks"
      count={tasks.length}
      accentColor="var(--accent-gold)"
      index={2}
      connected={connected}
      loading={loading}
    >
      {tasks.length === 0 && !loading ? (
        <p className="text-sm text-[var(--text-secondary)] font-mono italic">
          No pending tasks
        </p>
      ) : (
        <div className="space-y-2">
          {tasks.slice(0, 3).map((task) => (
            <p
              key={task.id}
              className="text-sm text-[var(--text-secondary)] font-mono leading-relaxed truncate"
            >
              <span style={{ color: priorityColors[task.priority] || "var(--text-secondary)" }}>
                {priorityLabels[task.priority] || task.priority}
              </span>
              {" "}
              {task.title}
            </p>
          ))}
        </div>
      )}
    </BriefingCard>
  );
}
