import { InMemoryCache } from '@apollo/client';

export const cache = new InMemoryCache({
  typePolicies: {
    User: {
      keyFields: ['id'],
      fields: {
        subscriptionTier: { merge: false },
        subscriptionStatus: { merge: false },
      },
    },
    Bot: {
      keyFields: ['id'],
      fields: {
        status: { merge: false },
        scanCapUsed: { merge: false },
        scanCapRemaining: { merge: false },
      },
    },
    Proposal: { keyFields: ['id'] },
    Position: { keyFields: ['id'] },
    Account: { keyFields: ['id'] },
    Balance: { keyFields: false }, // no stable identity — always re-fetch
  },
});
