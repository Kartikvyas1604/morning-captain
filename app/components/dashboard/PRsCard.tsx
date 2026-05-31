import BriefingCard from "./BriefingCard";

const ITEMS = [
  "#142 — refactor/api-versioning (needs_review)",
  "#141 — feat/billing-overhaul (draft)",
  "#140 — fix/auth-token-refresh (changes_requested)",
  "#139 — chore/deps-update (approved ✅)",
];

export default function PRsCard() {
  return (
    <BriefingCard
      icon={
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2l3 3-3 3" />
          <path d="M6 2l-3 3 3 3" />
          <line x1="3" y1="5" x2="18" y2="5" />
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="8" y1="21" x2="16" y2="21" />
        </svg>
      }
      title="Pull Requests"
      count={ITEMS.length}
      items={ITEMS.slice(0, 3)}
      accentColor="var(--accent-teal)"
      index={3}
    />
  );
}
