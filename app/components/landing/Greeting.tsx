"use client";

import { useEffect, useState } from "react";

export default function Greeting() {
  const [greeting, setGreeting] = useState("Good Morning");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 17) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");

      setTime(now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      }));
      setDate(now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }));
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const greetingChars = `${greeting}, Captain`.split("");

  return (
    <div className="text-center perspective-1500">
      <div className="relative">
        {/* Ambient glow behind greeting */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--accent-gold)] opacity-[0.04] rounded-full blur-[100px] animate-drift" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[var(--accent-teal)] opacity-[0.03] rounded-full blur-[100px] animate-drift" style={{ animationDelay: "-4s" }} />

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading text-[var(--text-primary)] mb-4 tracking-tight leading-[0.92]" style={{ letterSpacing: "-2.46px" }}>
          {greetingChars.map((char, i) => (
            <span
              key={i}
              className="animate-char-reveal"
              style={{ animationDelay: `${mounted ? i * 0.035 : 0}s` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <p
          className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] font-heading italic max-w-2xl mx-auto mb-2 leading-relaxed"
          style={{ opacity: 0, animation: "fade-rise 1s cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards" }}
        >
          Your command center awaits. Through the noise, we chart your course.
        </p>

        <div
          className="mt-3"
          style={{ opacity: 0, animation: "fade-rise 1s cubic-bezier(0.16, 1, 0.3, 1) 1.6s forwards" }}
        >
          <p className="text-xs text-[var(--text-secondary)] font-mono tracking-wider uppercase">{date}</p>
          <p className="text-lg sm:text-xl font-heading text-[var(--text-primary)] mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
}
