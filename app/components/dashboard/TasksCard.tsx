import BriefingCard from "./BriefingCard";

const ITEMS = [
  "🔴 [High] Finalize deployment checklist — Due Today",
  "🟡 [Medium] Update API documentation — Due Tomorrow",
  "🟢 [Low] Refactor auth middleware — Due Friday",
  "🔴 [High] Review PR #142 — Pending",
  "🟡 [Medium] Write unit tests for billing module",
];

export default function TasksCard() {
  return (
    <BriefingCard
      icon={
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      }
      title="Tasks"
      count={ITEMS.length}
      items={ITEMS.slice(0, 3)}
      accentColor="var(--accent-gold)"
      index={2}
    />
  );
}
