import BriefingCard from "./BriefingCard";

const ITEMS = [
  "10:30 AM — Sprint Planning (Zoom)",
  "1:00 PM — Design Review with Alex",
  "3:30 PM — 1:1 with Manager",
  "4:45 PM — Coffee chat with new intern",
];

export default function MeetingsCard() {
  return (
    <BriefingCard
      icon={
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      }
      title="Meetings"
      count={ITEMS.length}
      items={ITEMS.slice(0, 3)}
      accentColor="var(--accent-teal)"
      index={1}
    />
  );
}
