import Greeting from "./Greeting";
import BriefingButton from "./BriefingButton";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-24 overflow-hidden">
      {/* Ambient background orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-[var(--accent-gold)] opacity-[0.03] blur-[100px] anim-float" />
      <div className="absolute bottom-1/3 -right-20 w-96 h-96 rounded-full bg-[var(--accent-teal)] opacity-[0.025] blur-[120px] anim-float" style={{ animationDelay: "-4s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent-gold)] opacity-[0.015] blur-[150px]" />

      {/* Ship silhouette */}
      <div className="ship-silhouette opacity-[0.03]">
        <svg viewBox="0 0 420 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full anim-wave-drift">
          <path d="M30 120 L60 50 L100 50 L120 40 L160 30 L200 30 L240 35 L280 45 L320 50 L380 60 L400 65 L420 120 Z" fill="var(--accent-gold)" />
          <path d="M160 30 L170 20 L180 15 L190 12 L200 30" fill="var(--accent-gold)" />
          <path d="M200 30 L210 12 L220 15 L230 20 L240 35" fill="var(--accent-gold)" />
          <rect x="190" y="15" width="20" height="15" rx="1" fill="var(--accent-gold)" />
          <line x1="200" y1="15" x2="200" y2="30" stroke="var(--bg-primary)" strokeWidth="1" />
          <path d="M60 50 Q100 30 160 30" fill="none" stroke="var(--accent-gold)" strokeWidth="0.5" />
          <path d="M240 35 Q280 25 320 50" fill="none" stroke="var(--accent-gold)" strokeWidth="0.5" />
          <path d="M30 120 L420 120" stroke="var(--accent-gold)" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Treasure map corner accents */}
      <div className="absolute top-8 left-8 map-corner-tl" />
      <div className="absolute top-8 right-8 map-corner-tr" />
      <div className="absolute bottom-8 left-8 map-corner-bl" />
      <div className="absolute bottom-8 right-8 map-corner-br" />

      {/* Content */}
      <Greeting />
      <div className="mt-6 sm:mt-8">
        <BriefingButton />
      </div>

      {/* X marks the spot floating accent */}
      <div className="absolute right-[15%] top-[25%] text-[var(--accent-gold)] opacity-[0.04] text-6xl font-heading anim-float select-none" style={{ animationDelay: "-2s" }}>
        ✦
      </div>

      {/* Source indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 anim-fade-in d25" style={{ animationFillMode: "forwards" }}>
        <div className="flex items-center gap-4 sm:gap-8 text-xs text-[var(--text-secondary)] font-mono tracking-wide">
          {["Gmail", "Calendar", "Notion", "GitHub", "Slack"].map((name, i) => (
            <div key={name} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] anim-pulse" style={{ animationDelay: `${i * 0.5}s` }} />
              <span className="hidden sm:inline">{name}</span>
              <span className="sm:hidden">{name[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
    </section>
  );
}
