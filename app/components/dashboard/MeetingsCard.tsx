"use client";

import BriefingCard from "./BriefingCard";
import type { CalendarEvent } from "@/app/lib/types";

interface MeetingsCardProps {
  meetings: CalendarEvent[];
  loading?: boolean;
  connected?: boolean;
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function MeetingsCard({ meetings, loading = false, connected = true }: MeetingsCardProps) {
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
      count={meetings.length}
      variant="teal"
      index={1}
      connected={connected}
      loading={loading}
    >
      {meetings.length === 0 && !loading ? (
        <p className="text-sm text-[var(--text-secondary)] font-mono italic">
          No meetings scheduled today
        </p>
      ) : (
        <div className="space-y-2">
          {meetings.slice(0, 3).map((meeting) => (
            <p
              key={meeting.id}
              className="text-sm text-[var(--text-secondary)] font-mono leading-relaxed truncate"
            >
              <span className="text-[var(--accent-teal)]">{formatTime(meeting.start_time)}</span>
              {" — "}
              {meeting.title}
            </p>
          ))}
        </div>
      )}
    </BriefingCard>
  );
}
