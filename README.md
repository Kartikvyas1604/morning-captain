# ⚓ Morning Captain

> **Your AI-powered daily command briefing.**  
> *Chart your course through the noise.*

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer)](https://www.framer.com/motion)
[![OpenRouter](https://img.shields.io/badge/AI-OpenRouter-FF6B6B?style=flat-square)](https://openrouter.ai)

---

## Ahoy, Captain.

Every morning, you face a storm of emails, calendar invites, Slack DMs, GitHub PRs, and Notion tasks. Important signals get lost in the noise. Decisions pile up before your first cup of coffee.

**Morning Captain** is your AI quartermaster — it scans your entire digital fleet, distills what matters, and delivers a sharp, actionable briefing before you've even opened your inbox. No dashboards to configure. No widgets to drag. Just a single, clear view of your day ahead.

---

## The Captain's Deck

Connect your tools, and Morning Captain does the rest. Each morning (or on demand), it aggregates your data, runs it through your chosen AI, and presents a unified briefing on a single, beautiful screen.

### ⚡ One Briefing to Rule Them All

Morning Captain ingests data from **five sources** and synthesizes them into a coherent, natural-language summary:

| Source | What We Fetch |
|---|---|
| **Gmail** | Unread emails with subject, sender, snippet, and importance flags |
| **Google Calendar** | Today's meetings — title, time, organizer, attendees, join link |
| **GitHub** | Open PRs needing review, changes requested, and draft PRs |
| **Notion** | Tasks from your databases — title, status, due date, priority |
| **Slack** | Unread messages, direct mentions, and DMs from your channels |

### 🧠 AI Briefing, Your Way

The Quartermaster (your AI) reads everything and delivers a **Captain's Briefing** — 4–6 sentences that tell you what's urgent, what can wait, and where your focus should go. Choose your persona to match your intent:

- **Deep Work** — Suppresses noise, prioritizes PRs and tasks. For days you need to ship.
- **Inbox Zero** — Surfaces communications first. Suggests what to archive, reply to, or delegate.
- **Ship Mode** — Crunch time. Only PRs, CI status, and blockers make the cut.

Switch personas freely. Your preference is remembered.

---

## Tools of the Trade

Beyond the briefing, Morning Captain arms you with a full arsenal of command tools — all accessible from the Deck.

### 🗣️ Message in a Bottle (Chat)

Ask anything about your day in natural language. "Which email is the most urgent?" "When is my next free slot?" "Summarize my PRs." "Any Slack DMs I'm missing?" The AI responds with context from your live data.

### 📋 Standup Generator

Generate a crisp async standup message from your briefing with one click. Yesterday / Today / Blockers — formatted for Slack, ready to copy and paste.

### 🎯 Focus Mode

Tell the Captain how many hours you have to work (1–8), and the AI generates a structured focus schedule that respects your existing calendar events. No more staring at a blank afternoon.

### 📓 Captain's Log

End your day with a ritual. Write a journal entry, or let the AI draft a 3-sentence summary of what you accomplished. Browse your log history to track progress across days.

### ⌨️ Command Palette (`⌘K`)

Hit `⌘K` from anywhere on the Deck to open the command bar. Type in natural language — like *"unread emails this week"* or *"PRs needing review"* — and Morning Captain translates it into SQL, runs it against your data, and shows you the results. Keyboard-navigable, history-aware, and fast.

### 📊 Captain's Charts (SQL Shell)

The full power of your data is exposed through a natural-language-to-SQL interface. Describe what you want in plain English, inspect the generated SQL, and execute it against the Coral schema — which includes `gmail.inbox`, `calendar.events`, `notion.tasks`, `github.pull_requests`, and `slack.messages`.

### 👁️ Pulse Sidebar

A slide-out panel that gives you a live, at-a-glance view of everything happening across your sources. Grouped by source, color-coded, with count badges and a connection status indicator. Pull it open whenever you need the full picture without leaving your flow.

---

## The Look & Feel

Morning Captain is more than a tool — it's an atmosphere. The entire experience is built around a **pirate / naval-officer aesthetic**, designed to make your daily planning feel like an adventure rather than a chore.

- **Dark seas** — A deep navy color palette (`#0a0e17` primary) that's easy on the eyes at any hour.
- **Gold accents** (`#c9933a`) — Highlights, callouts, and treasure throughout the UI.
- **Glass morphism** — Frosted panels with backdrop blur give the Deck a tactile, layered feel.
- **Parchment & wood** — Textured backgrounds that ground the digital experience in the physical world.
- **Atmospheric animations** — A starfield twinkles in the background. The ship rocks gently at anchor. Waves drift, treasure glows, and your log unfurls like a map.
- **Instrument Serif** for headings — a typeface that commands attention.
- **JetBrains Mono** for code and data — precise, readable, technical.

Every detail — from the *"Hoist the Colours"* call-to-action to the *"Captain's Quarters"* settings page — carries the theme through.

---

## Getting Started

Morning Captain runs on your machine and connects to your accounts directly. No cloud dependency beyond the AI API.

### Prerequisites

- Node.js 20+
- An **OpenRouter API key** (free tier available)
- OAuth credentials for the sources you want to connect

### Installation

```bash
git clone https://github.com/your-org/morning-captain.git
cd morning-captain
npm install
```

### Environment

Copy the example environment file and fill in your keys:

```bash
cp .env.example .env.local
```

You'll need at minimum:

| Variable | Why |
|---|---|
| `OPENROUTER_API_KEY` | Powers the AI — get one at [openrouter.ai](https://openrouter.ai) |
| `NEXTAUTH_URL` | Your local URL (default `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | A random string for session encryption |

For each source you want to connect, add the corresponding OAuth client ID and secret (see the Settings page for step-by-step setup guides for each provider).

### Launch

```bash
npm run dev
```

Set sail at [http://localhost:3000](http://localhost:3000). Click **"Hoist the Colours"** to reach the Captain's Deck, then connect your sources from the **Captain's Quarters** (`/settings`).

---

## Architecture at a Glance

Morning Captain is a **Next.js 16 App Router** application with a fully custom frontend and backend, no external authentication libraries, and no database dependency.

### The Flow

1. **Briefing request** hits `/api/briefing`
2. Data is fetched from all connected sources — via the **Coral CLI** (preferred, single SQL query across all sources) or **fallback REST APIs** (direct calls to GitHub, Google, Slack, Notion)
3. Raw data is classified, typed, and sent to the **LLM** via OpenRouter
4. The AI returns a natural-language briefing + structured data
5. The Captain's Deck renders everything — cards, chat context, standup data, and command palette state

### Authentication

- Custom **OAuth 2.0** implementation for GitHub, Google, Notion, and Slack
- CSRF protection via OAuth `state` parameter
- Sessions tracked via `mc_session` httpOnly cookie (30-day expiry)
- Tokens stored in-memory per-session — **zero persistence**, maximally secure
- Google uses `access_type=offline&prompt=consent` to guarantee refresh tokens

### AI

- **OpenRouter** as the AI gateway — supports dozens of models
- Default model: `anthropic/claude-sonnet-4` (can be changed via `OPENROUTER_MODEL`)
- Three system prompts for the three personas
- Chat context includes the full briefing data for contextual Q&A

### Data Flow

- **Coral CLI** is the primary data-fetching engine — a local binary that speaks SQL across all five sources
- If Coral is unavailable or disabled, the system falls back to individual API fetchers for each source
- Source toggles are persisted in `localStorage` and respected during data fetching

---

## Configuration

### Source Toggles

Each of the five sources can be independently enabled or disabled from the Captain's Deck. Disabled sources are not fetched during briefing generation. Preferences persist across sessions via `localStorage`.

### AI Model

Set `OPENROUTER_MODEL` in your environment to any model available on OpenRouter. Change it any time — no code changes needed.

### Persona Persistence

Your chosen briefing persona (Deep Work / Inbox Zero / Ship Mode) is saved to `localStorage` and reapplied on every briefing.

---

## Why Morning Captain?

There are dozens of productivity dashboards. Most are:

- **Noisy** — Show everything, ask you to triage
- **Rigid** — Fixed views, no adaptation to context
- **Generic** — One-size-fits-all, no personality

Morning Captain flips the model. It doesn't show you everything — it **tells you what matters**. It adapts to your intent (deep work vs. communication vs. shipping). And it wraps the whole thing in a world that's actually *fun* to spend time in.

**It's the difference between staring at a spreadsheet and standing at the helm of your ship.**

---

## Tech Stack

| Category | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| AI Gateway | OpenRouter |
| Validation | Zod 4 |
| Data Engine | Coral CLI + REST fallbacks |
| Auth | Custom OAuth 2.0 |
| Fonts | Geist, Instrument Serif, JetBrains Mono |

---

## License

Private — v0.1.0. All rights reserved.

---

*Built with ☕ and the tides by those who believe your morning should feel like an adventure, not an inbox sweep.*

*"The sea is the same as it has been since before men ever went on it in boats." — Ernest Hemingway*
