"use client";

import { motion } from "framer-motion";

type AccentVariant = "gold" | "teal" | "red";

interface BriefingCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  variant?: AccentVariant;
  index?: number;
  children?: React.ReactNode;
  connected?: boolean;
  loading?: boolean;
}

const variantClass = (v: AccentVariant) => `card-accent-${v}`;

export default function BriefingCard({
  icon,
  title,
  count,
  variant = "teal",
  index = 0,
  children,
  connected = true,
  loading = false,
}: BriefingCardProps) {
  const accentClass = connected ? variantClass(variant) : "card-accent-muted";
  const badgeClass = count > 0 && connected ? variantClass(variant) : "card-accent-muted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
      className="frosted-glass rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={accentClass}>
            {icon}
          </span>
          <h3 className="font-heading text-lg text-[var(--text-primary)]">{title}</h3>
          {!connected && (
            <span className="text-xs text-[var(--accent-red)] font-mono">Disconnected</span>
          )}
        </div>
        {loading ? (
          <span className="w-8 h-5 rounded-full bg-[var(--bg-tertiary)] animate-pulse" />
        ) : (
          <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${badgeClass}`}>
            {count}
          </span>
        )}
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse" />
          <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse w-3/4" />
          <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse w-1/2" />
        </div>
      ) : (
        children
      )}
      {!loading && count > 3 && (
        <button className="mt-3 text-xs text-[var(--accent-teal)] font-mono hover:underline transition-opacity">
          View all {count} items →
        </button>
      )}
    </motion.div>
  );
}
