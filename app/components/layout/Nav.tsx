"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Nav() {
  const pathname = usePathname();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
      setDate(now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }));
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] frosted-glass sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-3 group">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110">
          <path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span className="font-heading text-xl text-[var(--text-primary)] tracking-wide">
          Morning Captain
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <div className="hidden sm:block text-right">
          <p className="text-sm text-[var(--text-secondary)] font-mono">{date}</p>
          <p className="text-lg font-heading text-[var(--text-primary)]">{time}</p>
        </div>
        <Link
          href="/settings"
          className={`p-2 rounded-lg transition-colors duration-200 hover:bg-[var(--bg-tertiary)] ${
            pathname === "/settings" ? "text-[var(--accent-teal)]" : "text-[var(--text-secondary)]"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </Link>
      </div>
    </nav>
  );
}
