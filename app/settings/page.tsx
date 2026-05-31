import Nav from "@/app/components/layout/Nav";
import SourceToggle from "@/app/components/settings/SourceToggle";

export default function SettingsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-heading text-[var(--text-primary)] mb-2">
            Command Center
          </h1>
          <p className="text-sm text-[var(--text-secondary)] font-mono">
            Connect your intelligence sources. Toggle each one on to include it in your daily briefing.
          </p>
        </div>

        <div className="space-y-4">
          <SourceToggle
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 4l10 8 10-8" />
              </svg>
            }
            name="Gmail"
            description="Unread emails from your inbox"
            defaultEnabled={true}
            connected={true}
          />
          <SourceToggle
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            name="Google Calendar"
            description="Today&apos;s events and meetings"
            defaultEnabled={true}
            connected={true}
          />
          <SourceToggle
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            }
            name="Notion"
            description="Tasks and action items"
            defaultEnabled={false}
            connected={false}
          />
          <SourceToggle
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2l3 3-3 3" />
                <path d="M6 2l-3 3 3 3" />
                <line x1="3" y1="5" x2="18" y2="5" />
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="8" y1="21" x2="16" y2="21" />
              </svg>
            }
            name="GitHub"
            description="Open PRs and review requests"
            defaultEnabled={false}
            connected={false}
          />
        </div>

        <div className="mt-10 p-5 frosted-glass rounded-xl">
          <h2 className="font-heading text-lg text-[var(--text-primary)] mb-2">Data Sources</h2>
          <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
            Morning Captain uses Coral SQL to query your connected services. All data is encrypted in transit and at rest.
            No data is stored permanently — only cached for your active session.
          </p>
        </div>
      </main>
    </>
  );
}
