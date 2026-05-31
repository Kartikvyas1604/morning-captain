const sessions = new Map<string, Map<string, string>>();

export function getSessionTokens(sessionId: string): Map<string, string> {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, new Map());
  }
  return sessions.get(sessionId)!;
}

export function getToken(sessionId: string, provider: string): string | undefined {
  return getSessionTokens(sessionId).get(provider);
}

export function setToken(sessionId: string, provider: string, token: string): void {
  getSessionTokens(sessionId).set(provider, token);
}

export function removeToken(sessionId: string, provider: string): void {
  getSessionTokens(sessionId).delete(provider);
}

export function hasToken(sessionId: string, provider: string): boolean {
  return getSessionTokens(sessionId).has(provider);
}

export function getAllTokens(sessionId: string): Record<string, string> {
  const tokens: Record<string, string> = {};
  getSessionTokens(sessionId).forEach((v, k) => { tokens[k] = v; });
  return tokens;
}

export function clearSession(sessionId: string): void {
  sessions.delete(sessionId);
}

export function setOAuthState(sessionId: string, state: string, provider: string): void {
  if (!sessions.has(sessionId)) sessions.set(sessionId, new Map());
  sessions.get(sessionId)!.set(`_oauth_state_${provider}`, state);
}

export function getOAuthState(sessionId: string, provider: string): string | undefined {
  return sessions.get(sessionId)?.get(`_oauth_state_${provider}`);
}

export function removeOAuthState(sessionId: string, provider: string): void {
  sessions.get(sessionId)?.delete(`_oauth_state_${provider}`);
}
