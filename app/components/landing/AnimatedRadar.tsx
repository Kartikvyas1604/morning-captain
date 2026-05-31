"use client";

export default function AnimatedRadar() {
  return (
    <div className="relative w-40 h-40 sm:w-52 sm:h-52">
      {/* Ring 1 */}
      <div className="absolute inset-0 rounded-full border border-[var(--border)] opacity-30" />
      {/* Ring 2 */}
      <div className="absolute inset-4 rounded-full border border-[var(--border)] opacity-20" />
      {/* Ring 3 */}
      <div className="absolute inset-8 rounded-full border border-[var(--border)] opacity-10" />

      {/* Sweep line */}
      <svg className="absolute inset-0 w-full h-full anim-radar" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="sweep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-teal)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent-teal)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="50,50 100,50 100,100" fill="url(#sweep)" />
      </svg>

      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--accent-teal)] shadow-[0_0_12px_rgba(45,212,191,0.5)]" />

      {/* Ping dots at cardinal points */}
      {[0, 90, 180, 270].map((angle, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]"
          style={{
            top: `${50 + 38 * Math.sin((angle * Math.PI) / 180)}%`,
            left: `${50 + 38 * Math.cos((angle * Math.PI) / 180)}%`,
            animationDelay: `${i * 1}s`,
          }}
        >
          <div
            className="absolute -inset-2 rounded-full border border-[var(--accent-gold)] opacity-0"
            style={{
              animation: `radarPing 3s ease-out ${i * 1}s infinite`,
            }}
          />
        </div>
      ))}

      {/* Center anchor icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 anim-float">
          <path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
    </div>
  );
}
