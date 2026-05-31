"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Nav() {
  const pathname = usePathname();
  const [time, setTime] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDashboard = pathname === "/dashboard";
  const isSettings = pathname === "/settings";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || isDashboard || isSettings
          ? "bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-8 py-5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-8deg]">
              <path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div className="absolute inset-0 bg-[var(--accent-teal)] opacity-10 blur-md rounded-full group-hover:opacity-20 transition-opacity" />
          </div>
          <span className="font-heading text-xl text-[var(--text-primary)] tracking-wide">
            Morning Captain<span className="text-[var(--accent-gold)] text-xs align-super ml-0.5">®</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm tracking-wide transition-colors duration-300 ${
                pathname === "/" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`text-sm tracking-wide transition-colors duration-300 ${
                isDashboard ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Bridge
            </Link>
            <Link
              href="/settings"
              className={`text-sm tracking-wide transition-colors duration-300 ${
                isSettings ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Command
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-heading text-[var(--text-secondary)] tracking-wide hidden sm:block">{time}</span>
            <Link href="/dashboard">
              <button className="relative group/btn">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-teal)] rounded-full opacity-30 group-hover/btn:opacity-60 blur-md transition-opacity duration-500" />
                <span className="relative px-5 py-2.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--accent-teal)] font-mono tracking-wide hover:border-[var(--accent-teal)] transition-all duration-300 block">
                  Launch Briefing
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
