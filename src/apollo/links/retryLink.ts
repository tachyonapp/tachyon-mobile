import { RetryLink } from '@apollo/client/link/retry';

// Retries on transient network errors (not auth errors — those are handled by errorLink)
export const retryLink = new RetryLink({
  delay: { initial: 300, max: 5000, jitter: true },
  attempts: {
    max: 3,
    retryIf: (error) => !!error && (error as any).statusCode !== 401,
  },
});
