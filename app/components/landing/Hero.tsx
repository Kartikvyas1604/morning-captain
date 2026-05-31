import Greeting from "./Greeting";
import BriefingButton from "./BriefingButton";

export default function Hero() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center px-6 py-20">
      <div className="relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--accent-teal)] opacity-5 rounded-full blur-3xl animate-float" />
        <Greeting />
        <div className="flex justify-center">
          <BriefingButton />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in-up delay-1">
        <div className="flex items-center gap-6 text-xs text-[var(--text-secondary)] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] animate-pulse-glow" />
            Gmail
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] animate-pulse-glow delay-pulse-2" />
            Calendar
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] animate-pulse-glow delay-pulse-3" />
            Notion
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] animate-pulse-glow delay-pulse-4" />
            GitHub
          </span>
        </div>
      </div>
    </section>
  );
}
