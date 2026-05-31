import BriefingCard from "./BriefingCard";

const ITEMS = [
  "Sarah Chen — Deployment deadline moved to Friday",
  "GitHub — [morning-captain] 3 new PR comments",
  "Alex — Re: Q3 budget review meeting",
  "Design Team — Updated mockups for review",
  "Calendar — Reminder: Standup in 15 min",
  "Notion — Task assigned: Update API docs",
  "Jen — Re: Sprint retro notes",
  "Stripe — Receipt for subscription payment",
  "Jen — Lunch tomorrow?",
  "GitHub — [api-service] Build failed on main",
  "Mom — Are you coming this weekend?",
  "LinkedIn — You have 5 new connection requests",
];

export default function EmailsCard() {
  return (
    <BriefingCard
      icon={
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 4l10 8 10-8" />
        </svg>
      }
      title="Emails"
      count={ITEMS.length}
      items={ITEMS.slice(0, 3)}
      accentColor="var(--accent-gold)"
      index={0}
    />
  );
}
