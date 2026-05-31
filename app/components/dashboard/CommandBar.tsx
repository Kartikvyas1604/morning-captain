"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShellResult {
  sql: string;
  columns: string[];
  rows: Record<string, unknown>[];
  error?: string;
}

export default function CommandBar() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ShellResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((p) => !p);
        setResult(null);
        setInput("");
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const search = useCallback(async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setHistory((p) => [input, ...p.slice(0, 19)]);
    try {
      const res = await fetch("/api/shell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data: ShellResult = await res.json();
      setResult(data);
    } catch {
      setResult({ sql: "", columns: [], rows: [], error: "Query failed" });
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const runQuery = useCallback(async (sql: string) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/shell/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql }),
      });
      const data: ShellResult = await res.json();
      setResult(data);
    } catch {
      setResult({ sql, columns: [], rows: [], error: "Execution failed" });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-2xl glass-pirate rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") search();
                  if (e.key === "ArrowUp" && history.length > 0) {
                    e.preventDefault();
                    setInput(history[0]);
                  }
                }}
                placeholder="Ask about your data... e.g. 'PRs I haven't reviewed'"
                className="flex-1 bg-transparent text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none"
              />
              <kbd className="hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--text-secondary)] font-mono">⏎</kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {loading && (
                <div className="space-y-3 p-4">
                  <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse w-1/2" />
                  <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse w-2/3" />
                </div>
              )}

              {result?.error && (
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--accent-red)]/30">
                  <p className="text-sm text-[var(--accent-red)] font-mono">{result.error}</p>
                </div>
              )}

              {result && !result.error && (
                <div className="space-y-4">
                  {result.sql && (
                    <div className="p-3 rounded-xl bg-[#080d14] border border-[var(--border)]">
                      <div className="flex items-center gap-2 mb-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="16 3 21 3 21 8" />
                          <line x1="4" y1="20" x2="21" y2="3" />
                          <polyline points="21 16 21 21 16 21" />
                          <line x1="15" y1="15" x2="21" y2="21" />
                          <line x1="4" y1="4" x2="9" y2="9" />
                        </svg>
                        <span className="text-[10px] font-mono text-[var(--accent-teal)] tracking-wider uppercase">SQL</span>
                      </div>
                      <pre className="text-xs font-mono text-[var(--text-secondary)] whitespace-pre-wrap break-all">{result.sql}</pre>
                    </div>
                  )}

                  {result.columns.length > 0 && (
                    <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
                      <table className="w-full text-xs font-mono">
                        <thead>
                          <tr className="bg-[var(--bg-tertiary)]">
                            {result.columns.map((col, i) => (
                              <th key={i} className="px-3 py-2 text-left text-[var(--accent-teal)] font-medium">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.rows.map((row, i) => (
                            <tr key={i} className="border-t border-[var(--border)] hover:bg-[var(--bg-tertiary)]/50">
                              {result.columns.map((col, j) => (
                                <td key={j} className="px-3 py-2 text-[var(--text-primary)] truncate max-w-[200px]">
                                  {String(row[col] ?? "")}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {result.columns.length === 0 && result.sql && (
                    <div className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)]">
                      <p className="text-sm text-[var(--text-secondary)] font-mono italic">
                        SQL generated. Run with Coral to see results.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!result && !loading && history.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-wider mb-2">Recent</p>
                  {history.slice(0, 5).map((h, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(h); setTimeout(() => inputRef.current?.focus(), 50); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-mono text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}

              {!result && !loading && history.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-sm text-[var(--text-secondary)] font-mono italic">
                    Try: &quot;unread emails this week&quot; or &quot;PRs needing review&quot;
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
