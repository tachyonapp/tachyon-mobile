/**
 * Lightweight event bridge for signaling session expiry from the Apollo error link
 * (which is outside the React tree) to AuthProvider (which can call Clerk signOut).
 *
 * Only one handler is registered at a time — the currently mounted AuthProvider.
 */
type SessionExpiredHandler = () => void;

let _sessionExpiredHandler: SessionExpiredHandler | null = null;

export function setSessionExpiredHandler(fn: SessionExpiredHandler): void {
  _sessionExpiredHandler = fn;
}

export function clearSessionExpiredHandler(): void {
  _sessionExpiredHandler = null;
}

export function emitSessionExpired(): void {
  _sessionExpiredHandler?.();
}
