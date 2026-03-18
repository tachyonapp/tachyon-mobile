import { InMemoryCache } from '@apollo/client';

export const cache = new InMemoryCache({
  typePolicies: {
    User: { keyFields: ['id'] },
    Bot: { keyFields: ['id'] },
    Proposal: { keyFields: ['id'] },
    Position: { keyFields: ['id'] },
    Account: { keyFields: ['id'] },
    Balance: { keyFields: false }, // no stable identity — always re-fetch
  },
});
