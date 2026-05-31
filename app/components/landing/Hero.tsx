"use client";

import { useEffect, useState } from "react";
import Greeting from "./Greeting";
import BriefingButton from "./BriefingButton";

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden">
      {/* Parallax depth layers */}
      <div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[var(--accent-gold)] opacity-[0.03] blur-[80px] pointer-events-none transition-transform duration-500 ease-out"
        style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-[var(--accent-teal)] opacity-[0.02] blur-[100px] pointer-events-none transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
      />

      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-teal)] opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <Greeting />
      <BriefingButton />

      {/* Source indicators */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8"
        style={{ opacity: 0, animation: "fade-rise 1s cubic-bezier(0.16, 1, 0.3, 1) 2.2s forwards" }}
      >
        {[
          { name: "Gmail", delay: "0s" },
          { name: "Calendar", delay: "0.5s" },
          { name: "Notion", delay: "1s" },
          { name: "GitHub", delay: "1.5s" },
          { name: "Slack", delay: "2s" },
        ].map((src) => (
          <div key={src.name} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-mono tracking-wide">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] animate-breathe"
              style={{ animationDelay: src.delay }}
            />
            {src.name}
          </div>
        ))}
      </div>

      {/* Bottom fade edge */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
    </section>
  );
}
