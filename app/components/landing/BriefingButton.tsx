"use client";

import Link from "next/link";

export default function BriefingButton() {
  return (
    <Link href="/dashboard">
      <button
        className="relative group opacity-0 anim-fade-in d20"
        style={{ animationFillMode: "forwards" }}
        aria-label="Hoist the Colours"
      >
        {/* Outer glow ring */}
        <div className="absolute -inset-3 bg-gradient-to-r from-[var(--accent-gold)] via-[var(--accent-teal)] to-[var(--accent-gold)] rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 anim-treasure-glow" />

        {/* Border glow */}
        <div className="absolute -inset-[1.5px] bg-gradient-to-r from-[var(--accent-gold)] via-[var(--accent-teal)] to-[var(--accent-gold)] rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-500" />

        {/* Button body */}
        <div className="relative flex items-center gap-4 px-10 py-4 sm:px-12 sm:py-5 rounded-full bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-transparent overflow-hidden transition-all duration-500 group-hover:scale-[1.02]">
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-gold)]/[0.06] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          {/* Ship wheel icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-500 group-hover:rotate-90">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" fill="var(--accent-gold)" fillOpacity="0.15" />
            <line x1="12" y1="2" x2="12" y2="7" />
            <line x1="12" y1="17" x2="12" y2="22" />
            <line x1="2" y1="12" x2="7" y2="12" />
            <line x1="17" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="4.93" x2="8.46" y2="8.46" />
            <line x1="15.54" y1="15.54" x2="19.07" y2="19.07" />
            <line x1="4.93" y1="19.07" x2="8.46" y2="15.54" />
            <line x1="15.54" y1="8.46" x2="19.07" y2="4.93" />
          </svg>

          <span className="text-lg sm:text-xl font-heading text-[var(--accent-gold)] tracking-wider">
            Hoist the Colours
          </span>

          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    </Link>
  );
}
