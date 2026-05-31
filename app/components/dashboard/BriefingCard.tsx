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
      className="group glass-pirate rounded-xl p-5 parchment hover:border-[var(--accent-gold)]/20 hover:shadow-[0_0_24px_rgba(201,147,58,0.04)] transition-all duration-500"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`${accent} transition-transform duration-300 group-hover:scale-110`}>{icon}</span>
          <h3 className="font-heading text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors duration-300">{title}</h3>
          {!connected && <span className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--accent-red)]/30 text-[var(--accent-red)] font-mono">adrift</span>}
        </div>
        {loading ? (
          <span className="w-8 h-5 rounded-full bg-[var(--bg-tertiary)] animate-pulse" />
        ) : (
          <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${badge} transition-all duration-300`}>{count}</span>
        )}
      </div>
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[var(--bg-tertiary)] animate-pulse" />
              <div className={`h-3 bg-[var(--bg-tertiary)] rounded animate-pulse ${i === 1 ? "w-full" : i === 2 ? "w-3/4" : "w-1/2"}`} />
            </div>
          ))}
        </div>
      ) : (
        <div className="transition-all duration-300">
          {children}
        </div>
      )}
    </motion.div>
  );
}
