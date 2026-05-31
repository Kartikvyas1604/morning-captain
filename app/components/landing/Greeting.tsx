"use client";

import { useEffect, useState } from "react";

export default function Greeting() {
  const [greeting, setGreeting] = useState("Good Morning");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
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
    <div className="text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading text-[var(--text-primary)] mb-3 tracking-tight">
        {greetingChars.map((char, i) => (
          <span
            key={i}
            className="char-reveal"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
      <p className="text-lg sm:text-xl text-[var(--accent-teal)] font-heading italic mb-2 fade-in-delay-1">
        Your command center is ready
      </p>
      <div className="fade-in-delay-2">
        <p className="text-sm text-[var(--text-secondary)] font-mono">{date}</p>
        <p className="text-2xl font-heading text-[var(--text-primary)]">{time}</p>
      </div>
    </div>
  );
}
