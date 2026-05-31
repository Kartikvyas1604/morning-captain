"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { sql: string }

export default function SqlDrawer({ sql }: Props) {
  const [open, setOpen] = useState(false);
  if (!sql) return null;

  return (
    <div className="mt-6">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-mono hover:text-[var(--accent-teal)] transition-colors">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
        Coral Query
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] anim-pulse" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mt-2">
            <div className="bg-[#080d14] border border-[var(--border)] rounded-xl p-4 overflow-x-auto">
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
                    <div key={i} className="flex hover:bg-white/[0.02] rounded px-1 -mx-1 transition-colors">
                      <span className="text-[var(--text-secondary)] w-8 text-right select-none shrink-0 mr-4 opacity-50">{i + 1}</span>
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
  const kws = ["SELECT","FROM","WHERE","ORDER BY","LIMIT","AND","OR","AS","DESC","ASC","TRUE","IN","CURRENT_DATE","NOT","JOIN","ON","LEFT","RIGHT","INNER","OUTER","UNION","ALL","CASE","WHEN","THEN","ELSE","END","CONCAT","DATE","INTERVAL"];
  const parts: React.ReactNode[] = [];
  let r = line;
  while (r.length > 0) {
    let m = false;
    for (const kw of kws) {
      const idx = r.toUpperCase().indexOf(kw.toUpperCase());
      if (idx === 0 && (r.length === kw.length || !/[a-zA-Z_]/.test(r[kw.length]))) {
        parts.push(<span key={`k${parts.length}`} className="text-[var(--accent-teal)]">{r.slice(0, kw.length)}</span>);
        r = r.slice(kw.length); m = true; break;
      }
    }
    if (!m) {
      if (r[0] === "'") {
        const e = r.indexOf("'", 1);
        parts.push(<span key={`s${parts.length}`} className="text-[var(--accent-gold)]">{e !== -1 ? r.slice(0, e+1) : r}</span>);
        r = e !== -1 ? r.slice(e+1) : "";
      } else if (";,()".includes(r[0])) {
        parts.push(<span key={`p${parts.length}`} className="text-[var(--text-secondary)]">{r[0]}</span>);
        r = r.slice(1);
      } else if (r.startsWith("--")) {
        parts.push(<span key={`c${parts.length}`} className="text-[var(--text-secondary)] opacity-50">{r}</span>);
        r = "";
      } else { parts.push(r[0]); r = r.slice(1); }
    }
  }
  return <>{parts}</>;
}
