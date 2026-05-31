"use client";

import { useEffect, useState } from "react";
import AnimatedRadar from "./AnimatedRadar";

const PIRATE_TITLES = ["Captain", "Admiral", "Commodore", "Privateer"];

export default function Greeting() {
  const [greeting, setGreeting] = useState("Ahoy");
  const [title, setTitle] = useState("Captain");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const h = new Date().getHours();
      setGreeting(h < 12 ? "Ahoy" : h < 17 ? "Ahoy" : "Ahoy");
      setTitle(PIRATE_TITLES[Math.floor(Math.random() * PIRATE_TITLES.length)]);
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" }));
      setDate(new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
    };
    update();
    const i = setInterval(update, 60000);
    return () => clearInterval(i);
  }, []);

  const chars = `${greeting}, ${title}`.split("");

  return (
    <div className="flex flex-col items-center gap-8 sm:gap-10">
      {/* Compass rose visual */}
      <div className="anim-fade-in d3">
        <AnimatedRadar />
      </div>

      {/* Greeting */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading text-[var(--text-primary)] tracking-tight leading-[0.92] text-center" style={{ letterSpacing: "-2.46px" }}>
        {chars.map((c, i) => (
          <span key={i} className="anim-char" style={{ animationDelay: `${0.6 + i * 0.035}s` }}>
            {c === " " ? "\u00A0" : c}
          </span>
        ))}
      </h1>

      {/* Tagline */}
      <p className="text-base sm:text-lg text-[var(--accent-gold)] font-heading italic text-center max-w-xl leading-relaxed anim-fade-up d10">
        The horizon awaits — chart your course through the noise.
      </p>

      {/* Date/time */}
      <div className="text-center anim-fade-up d15">
        <p className="text-xs text-[var(--text-secondary)] font-mono tracking-widest uppercase">{date}</p>
        <p className="text-xl font-heading text-[var(--accent-gold)] mt-1">{time}</p>
      </div>
    </div>
  );
}
