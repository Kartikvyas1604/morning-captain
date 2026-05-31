"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SqlDrawerProps {
  sql: string;
}

export default function SqlDrawer({ sql }: SqlDrawerProps) {
  const [open, setOpen] = useState(false);

  if (!sql) return null;

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-mono hover:text-[var(--accent-teal)] transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span>View Coral SQL Query</span>
        <span className="w-2 h-2 rounded-full bg-[var(--accent-teal)] animate-pulse-glow" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mt-3"
          >
            <div className="bg-[#080d14] border border-[var(--border)] rounded-lg p-4 overflow-x-auto">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--border)]">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e05c5c]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e0b85c]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5ce05c]" />
                </div>
                <span className="text-xs text-[var(--text-secondary)] font-mono ml-2">coral.sql</span>
              </div>
              <pre className="text-sm leading-relaxed font-mono">
                <code>
                  {sql.split("\n").map((line, i) => (
                    <div key={i} className="flex">
                      <span className="text-[var(--text-secondary)] w-8 text-right select-none shrink-0 mr-4 opacity-50">
                        {i + 1}
                      </span>
                      <span className="whitespace-pre">{highlightSQL(line)}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function highlightSQL(line: string) {
  const keywords = ["SELECT", "FROM", "WHERE", "ORDER BY", "LIMIT", "AND", "OR", "AS", "DESC", "ASC", "TRUE", "IN", "CURRENT_DATE", "NOT", "JOIN", "ON", "LEFT", "RIGHT", "INNER", "OUTER", "UNION", "ALL", "CASE", "WHEN", "THEN", "ELSE", "END", "CONCAT", "DATE", "INTERVAL"];
  const parts: React.ReactNode[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    let matched = false;
    for (const kw of keywords) {
      const idx = remaining.toUpperCase().indexOf(kw.toUpperCase());
      if (idx === 0 && (remaining.length === kw.length || !/[a-zA-Z_]/.test(remaining[kw.length]))) {
        parts.push(
          <span key={`kw-${parts.length}`} className="text-[var(--accent-teal)]">{remaining.slice(0, kw.length)}</span>
        );
        remaining = remaining.slice(kw.length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      if (remaining[0] === "'") {
        const end = remaining.indexOf("'", 1);
        if (end !== -1) {
          parts.push(
            <span key={`str-${parts.length}`} className="text-[var(--accent-gold)]">{remaining.slice(0, end + 1)}</span>
          );
          remaining = remaining.slice(end + 1);
        } else {
          parts.push(
            <span key={`str-${parts.length}`} className="text-[var(--accent-gold)]">{remaining}</span>
          );
          remaining = "";
        }
      } else if (remaining[0] === ";" || remaining[0] === "," || remaining[0] === "(" || remaining[0] === ")") {
        parts.push(
          <span key={`punct-${parts.length}`} className="text-[var(--text-secondary)]">{remaining[0]}</span>
        );
        remaining = remaining.slice(1);
      } else if (remaining.startsWith("--")) {
        parts.push(
          <span key={`comment-${parts.length}`} className="text-[var(--text-secondary)] opacity-50">{remaining}</span>
        );
        remaining = "";
      } else {
        parts.push(remaining[0]);
        remaining = remaining.slice(1);
      }
    }
  }

  return <>{parts}</>;
}
