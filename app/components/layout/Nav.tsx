"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Deck" },
  { href: "/dashboard", label: "Bridge" },
  { href: "/settings", label: "Quarters" },
];

export default function Nav() {
  const pathname = usePathname();
  const [time, setTime] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    }, 30000);
    setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? "bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-8 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12">
              <circle cx="12" cy="12" r="10" stroke="var(--accent-gold)" />
              <circle cx="12" cy="12" r="2" fill="var(--accent-teal)" stroke="var(--accent-teal)" />
              <line x1="12" y1="2" x2="12" y2="7" />
              <line x1="12" y1="17" x2="12" y2="22" />
              <line x1="2" y1="12" x2="7" y2="12" />
              <line x1="17" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="8.46" y2="8.46" />
              <line x1="15.54" y1="15.54" x2="19.07" y2="19.07" />
              <line x1="4.93" y1="19.07" x2="8.46" y2="15.54" />
              <line x1="15.54" y1="8.46" x2="19.07" y2="4.93" />
            </svg>
            <div className="absolute inset-0 bg-[var(--accent-teal)]/10 blur-md rounded-full group-hover:opacity-20 transition-opacity" />
          </div>
          <span className="font-heading text-xl tracking-wide text-[var(--text-primary)]">
            Morning Captain
          </span>
          <span className="text-[10px] font-mono text-[var(--accent-gold)] italic hidden sm:inline opacity-60">⚓</span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm tracking-wide transition-all duration-300 relative ${
                  pathname === l.href ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {l.label}
                {pathname === l.href && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-[var(--accent-teal)] to-transparent" />
                )}
              </Link>
            ))}
          </div>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent("opencode:toggle-command-palette"))}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-tertiary)]/60 border border-[var(--border)] text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)]/40 transition-all duration-200"
            aria-label="Open command palette"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
            </svg>
            <kbd className="text-[10px] font-mono opacity-70">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          </button>

          <span className="text-sm font-heading text-[var(--text-secondary)] hidden sm:block">{time}</span>

          {isHome ? (
            <Link href="/dashboard">
              <button className="relative group/btn" aria-label="Set Sail">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-teal)] rounded-full opacity-20 group-hover/btn:opacity-40 blur-md transition-opacity duration-500" />
                <span className="relative px-5 py-2 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--accent-gold)] font-mono tracking-wide hover:border-[var(--accent-gold)] transition-all duration-300 block">
                  Set Sail ↗
                </span>
              </button>
            </Link>
          ) : (
            <Link href="/">
              <span className="text-xs text-[var(--text-secondary)] font-mono hover:text-[var(--text-primary)] transition-colors">
                ← Back
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
