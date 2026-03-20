import { emitSessionExpired } from "@/auth/authEventEmitter";
import { CombinedGraphQLErrors } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";

// Clerk manages token refresh internally — getToken() in authLink always returns
// a fresh token. A genuine UNAUTHENTICATED response means the session is truly
// expired; do not retry. The auth state from ClerkProvider will update accordingly.
export const errorLink = new ErrorLink(({ error }) => {
  if (
    error instanceof CombinedGraphQLErrors &&
    error.errors.some((e) => e.extensions?.code === "UNAUTHENTICATED")
  ) {
    // Signal AuthProvider to sign out.
    emitSessionExpired();
  }
});
