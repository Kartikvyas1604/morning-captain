import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Morning Captain — Daily Briefing",
  description: "Your AI-powered daily command briefing. One click to get emails, calendar, tasks, and PRs from every source.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono antialiased">
        <div className="star-field fixed inset-0" />
        <div className="chart-grid fixed inset-0" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_#0d1829_0%,_#050810_100%)] pointer-events-none" />
        <div className="relative z-10 min-h-full flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
