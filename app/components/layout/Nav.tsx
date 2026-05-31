"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Bridge" },
  { href: "/settings", label: "Command" },
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
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
              <path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div className="absolute inset-0 bg-[var(--accent-teal)]/10 blur-md rounded-full group-hover:opacity-20 transition-opacity" />
          </div>
          <span className="font-heading text-xl tracking-wide text-[var(--text-primary)]">
            Morning Captain
          </span>
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

          <span className="text-sm font-heading text-[var(--text-secondary)] hidden sm:block">{time}</span>

          {isHome ? (
            <Link href="/dashboard">
              <button className="relative group/btn">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-teal)] rounded-full opacity-20 group-hover/btn:opacity-40 blur-md transition-opacity duration-500" />
                <span className="relative px-5 py-2 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--accent-teal)] font-mono tracking-wide hover:border-[var(--accent-teal)] transition-all duration-300 block">
                  Launch
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
