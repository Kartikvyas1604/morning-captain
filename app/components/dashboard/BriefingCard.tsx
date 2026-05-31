"use client";

import { motion } from "framer-motion";

type Variant = "gold" | "teal" | "red";

interface Props {
  icon: React.ReactNode;
  title: string;
  count: number;
  variant?: Variant;
  index?: number;
  children?: React.ReactNode;
  connected?: boolean;
  loading?: boolean;
}

const vClass = (v: Variant) => `card-${v}`;

export default function BriefingCard({ icon, title, count, variant = "teal", index = 0, children, connected = true, loading = false }: Props) {
  const accent = connected ? vClass(variant) : "card-muted";
  const badge = count > 0 && connected ? vClass(variant) : "card-muted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={accent}>{icon}</span>
          <h3 className="font-heading text-lg text-[var(--text-primary)]">{title}</h3>
          {!connected && <span className="text-xs text-[var(--accent-red)] font-mono">offline</span>}
        </div>
        {loading ? (
          <span className="w-8 h-5 rounded-full bg-[var(--bg-tertiary)] animate-pulse" />
        ) : (
          <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${badge}`}>{count}</span>
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
    </motion.div>
  );
}
