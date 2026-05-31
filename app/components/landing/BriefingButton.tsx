"use client";

import Link from "next/link";

export default function BriefingButton() {
  return (
    <Link href="/dashboard">
      <button
        className="relative group opacity-0 anim-fade-in d20"
        style={{ animationFillMode: "forwards" }}
      >
        {/* Outer glow ring */}
        <div className="absolute -inset-3 bg-gradient-to-r from-[var(--accent-gold)] via-[var(--accent-teal)] to-[var(--accent-gold)] rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700" />

        {/* Border glow */}
        <div className="absolute -inset-[1.5px] bg-gradient-to-r from-[var(--accent-gold)] via-[var(--accent-teal)] to-[var(--accent-gold)] rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-500" />

        {/* Button body */}
        <div className="relative flex items-center gap-4 px-10 py-4 sm:px-12 sm:py-5 rounded-full bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-transparent overflow-hidden transition-all duration-500 group-hover:scale-[1.02]">
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-500 group-hover:rotate-45">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="var(--accent-gold)" fillOpacity="0.2" />
          </svg>

          <span className="text-lg sm:text-xl font-heading text-[var(--accent-gold)] tracking-wider">
            Get My Briefing
          </span>

          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    </Link>
  );
}
