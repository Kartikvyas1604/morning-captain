"use client";

import Link from "next/link";

export default function BriefingButton() {
  return (
    <Link href="/dashboard">
      <button className="relative group mt-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-gold)] via-amber-300 to-[var(--accent-gold)] rounded-full opacity-40 group-hover:opacity-70 blur-md transition-opacity duration-500" />
        <div className="relative flex items-center gap-3 px-8 py-4 bg-[var(--bg-secondary)] border border-[var(--accent-gold)] rounded-full overflow-hidden">
          <div className="animate-shimmer absolute inset-0" />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent-gold)] relative z-10">
            <polygon points="5 3 19 12 5 21 5 3" fill="var(--accent-gold)" />
          </svg>
          <span className="text-[var(--accent-gold)] font-heading text-lg tracking-wider relative z-10">
            Get My Briefing
          </span>
        </div>
      </button>
    </Link>
  );
}
