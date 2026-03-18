import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  Observable,
  gql,
} from "@apollo/client";

const SKIP_PROPOSAL = gql`
  mutation SkipProposal($id: ID!) {
    skipProposal(id: $id) {
      ... on Proposal {
        id
        status
      }
    }
  }
`;

const PROPOSAL_FRAGMENT = gql`
  fragment ProposalFields on Proposal {
    id
    status
    __typename
  }
`;

const STATUS_FRAGMENT = gql`
  fragment ProposalStatus on Proposal {
    status
  }
`;

describe("skipProposal optimistic update", () => {
  it("applies optimistic update immediately and rolls back on network error", async () => {
    const cache = new InMemoryCache({
      typePolicies: {
        Proposal: { keyFields: ["id"] },
      },
    });

    const proposalRef = { __typename: "Proposal" as const, id: "proposal-1" };
    const cacheId = cache.identify(proposalRef)!;

    // Seed cache with a PENDING proposal using the normalized cache key
    cache.writeFragment({
      fragment: PROPOSAL_FRAGMENT,
      id: cacheId,
      data: { ...proposalRef, status: "PENDING" },
    });

    // Verify seeding worked
    expect(
      cache.readFragment({ fragment: STATUS_FRAGMENT, id: cacheId })
    ).toEqual({ __typename: "Proposal", status: "PENDING" });

    // Controllable link: holds the request open until we explicitly fail it
    let rejectLink!: (err: Error) => void;
    const controllableLink = new ApolloLink(
      () =>
        new Observable((subscriber) => {
          rejectLink = (err) => subscriber.error(err);
        })
    );

    const client = new ApolloClient({ link: controllableLink, cache });

    // Start mutation without awaiting — optimistic update is applied after subscription
    const mutationPromise = client
      .mutate({
        mutation: SKIP_PROPOSAL,
        variables: { id: "proposal-1" },
        optimisticResponse: {
          skipProposal: { ...proposalRef, status: "SKIPPED" },
        },
        update(cache) {
          cache.modify({
            id: cacheId,
            fields: { status: () => "SKIPPED" },
          });
        },
      })
      .catch(() => null); // expected to fail — suppress unhandled rejection

    // Flush task queue so Apollo can apply the optimistic write
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Optimistic layer should be visible when reading with optimistic: true
    const optimisticData = cache.readFragment<{ status: string }>({
      fragment: STATUS_FRAGMENT,
      id: cacheId,
      optimistic: true,
    });
    expect(optimisticData?.status).toBe("SKIPPED");

    // Trigger network failure — Apollo rolls back the optimistic layer
    rejectLink(new Error("Network error"));
    await mutationPromise;

    // After rollback, both optimistic and base reads should show PENDING
    const revertedData = cache.readFragment<{ status: string }>({
      fragment: STATUS_FRAGMENT,
      id: cacheId,
      optimistic: true,
    });
    expect(revertedData?.status).toBe("PENDING");
  });
});
