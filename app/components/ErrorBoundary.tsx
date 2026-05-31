"use client";

import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--accent-red)]/30 text-sm text-[var(--text-secondary)] font-mono italic">
          Something went wrong.
        </div>
      );
    }
    return this.props.children;
  }
}
