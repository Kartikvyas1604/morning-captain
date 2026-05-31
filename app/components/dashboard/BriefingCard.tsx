"use client";

import { motion } from "framer-motion";

interface BriefingCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  items: string[];
  accentColor?: string;
  index?: number;
  children?: React.ReactNode;
}

export default function BriefingCard({
  icon,
  title,
  count,
  items,
  accentColor = "var(--accent-teal)",
  index = 0,
  children,
}: BriefingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
      className="frosted-glass rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span style={{ color: accentColor }}>{icon}</span>
          <h3 className="font-heading text-lg text-[var(--text-primary)]">{title}</h3>
        </div>
        <span
          className="text-xs font-mono px-2.5 py-1 rounded-full border"
          style={{
            borderColor: accentColor,
            color: accentColor,
          }}
        >
          {count}
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <p
            key={i}
            className="text-sm text-[var(--text-secondary)] font-mono leading-relaxed truncate"
          >
            {item}
          </p>
        ))}
      </div>
      {items.length > 3 && (
        <button className="mt-3 text-xs text-[var(--accent-teal)] font-mono hover:underline transition-opacity">
          View all {count} items →
        </button>
      )}
      {children}
    </motion.div>
  );
}
