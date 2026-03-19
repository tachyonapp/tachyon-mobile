import { SetContextLink } from '@apollo/client/link/context'

// Module-level ref populated by ClerkTokenBridge (auth/clerk-token-bridge.tsx).
// ClerkTokenBridge calls setClerkGetToken() once on mount, wiring Clerk's
// getToken() into the link chain without needing a React hook here.
let clerkGetToken: (() => Promise<string | null>) | null = null

export function setClerkGetToken(fn: () => Promise<string | null>) {
  clerkGetToken = fn
}

export const authLink = new SetContextLink(async (prevContext) => {
  const token = clerkGetToken ? await clerkGetToken() : null
  const { headers } = prevContext
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }
})
