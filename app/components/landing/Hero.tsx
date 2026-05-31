import Greeting from "./Greeting";
import BriefingButton from "./BriefingButton";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-24 overflow-hidden">
      {/* Ambient background orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-[var(--accent-gold)] opacity-[0.03] blur-[100px] anim-float" />
      <div className="absolute bottom-1/3 -right-20 w-96 h-96 rounded-full bg-[var(--accent-teal)] opacity-[0.025] blur-[120px] anim-float" style={{ animationDelay: "-4s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent-teal)] opacity-[0.02] blur-[150px]" />

      {/* Content */}
      <Greeting />
      <div className="mt-6 sm:mt-8">
        <BriefingButton />
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
