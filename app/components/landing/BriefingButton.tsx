"use client";

import Link from "next/link";

export default function BriefingButton() {
  return (
    <Link href="/dashboard">
      <button
        className="relative group"
        style={{ opacity: 0, animation: "fade-rise 1s cubic-bezier(0.16, 1, 0.3, 1) 1.8s forwards" }}
      >
        {/* Glow rings */}
        <div className="absolute -inset-4 bg-gradient-to-r from-[var(--accent-gold)] via-[var(--accent-teal)] to-[var(--accent-gold)] rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700" />
        <div className="absolute -inset-2 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-teal)] rounded-full opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500" />

        {/* Button body */}
        <div className="relative flex items-center gap-4 px-10 py-5 rounded-full bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-[var(--border)] group-hover:border-[var(--accent-gold)]/50 overflow-hidden transition-all duration-500 group-hover:scale-[1.02]">
          {/* Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-gold)]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

          {/* Compass/Play icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 group-hover:rotate-45 transition-transform duration-500">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="var(--accent-gold)" fillOpacity="0.2" />
          </svg>

          <span className="relative z-10 text-lg font-heading text-[var(--accent-gold)] tracking-wider">
            Get My Briefing
          </span>

          {/* Arrow */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    </Link>
  );
}
