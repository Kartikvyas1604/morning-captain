"use client";

export default function AnimatedRadar() {
  return (
    <div className="relative w-40 h-40 sm:w-52 sm:h-52 anim-ship-rock">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border border-[var(--accent-gold)] opacity-20" />
      <div className="absolute inset-3 rounded-full border border-[var(--accent-gold)] opacity-10 border-dashed" />
      <div className="absolute inset-6 rounded-full border border-[var(--accent-gold)] opacity-[0.04]" />
      <div className="absolute inset-8 rounded-full border border-[var(--accent-teal)] opacity-[0.08]" />

      {/* Compass crosshairs */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
          <line x1="50" y1="2" x2="50" y2="98" stroke="var(--accent-gold)" strokeWidth="0.3" opacity="0.3" />
          <line x1="2" y1="50" x2="98" y2="50" stroke="var(--accent-gold)" strokeWidth="0.3" opacity="0.3" />
          <line x1="16" y1="16" x2="84" y2="84" stroke="var(--accent-teal)" strokeWidth="0.2" opacity="0.15" />
          <line x1="84" y1="16" x2="16" y2="84" stroke="var(--accent-teal)" strokeWidth="0.2" opacity="0.15" />
        </svg>
      </div>

      {/* N / S / E / W labels */}
      {[
        { label: "N", x: 50, y: 8 }, { label: "S", x: 50, y: 94 },
        { label: "E", x: 90, y: 52 }, { label: "W", x: 10, y: 52 },
      ].map(({ label, x, y }) => (
        <span
          key={label}
          className="absolute text-[9px] font-mono text-[var(--accent-gold)] opacity-40"
          style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
        >{label}</span>
      ))}

      {/* Sweep line */}
      <svg className="absolute inset-0 w-full h-full anim-radar" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="sweep" x1="50%" y1="50%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-teal)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--accent-teal)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="50,50 100,50 100,100" fill="url(#sweep)" />
      </svg>

      {/* Center medallion */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border border-[var(--accent-gold)] flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-[var(--accent-gold)] shadow-[0_0_10px_rgba(201,147,58,0.4)]" />
      </div>

      {/* Ping dots at 8 points */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[var(--accent-gold)]"
          style={{
            top: `${50 + 36 * Math.sin((angle * Math.PI) / 180)}%`,
            left: `${50 + 36 * Math.cos((angle * Math.PI) / 180)}%`,
            animationDelay: `${i * 0.75}s`,
            opacity: i % 2 === 0 ? 0.8 : 0.4,
          }}
        >
          <div
            className="absolute -inset-2 rounded-full border border-[var(--accent-gold)] opacity-0"
            style={{ animation: `radarPing 3s ease-out ${i * 0.75}s infinite` }}
          />
        </div>
      ))}

      {/* Crossed cutlasses icon in center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 anim-float">
          <path d="M14.5 17.5L3 6l3-3 11.5 11.5" />
          <path d="M13 19l4.5-4.5" />
          <path d="M16 11l4.5-4.5" />
          <path d="M18 21l2-2" />
          <path d="M20 6L9 17.5" />
        </svg>
      </div>
    </div>
  );
}
