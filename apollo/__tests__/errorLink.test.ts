import { errorLink } from "@/apollo/links/errorLink";
import { setSessionExpiredHandler } from "@/auth/authEventEmitter";
import { ApolloClient, ApolloLink, InMemoryCache, gql } from "@apollo/client";
import { of } from "rxjs";

const ME_QUERY = gql`
  query Me {
    me {
      id
    }
  }
`;

it("emits session expired on UNAUTHENTICATED error and does not retry", async () => {
  const sessionExpiredSpy = jest.fn();
  setSessionExpiredHandler(sessionExpiredSpy);

  let callCount = 0;
  const terminatingLink = new ApolloLink(() => {
    callCount++;
    return of({
      errors: [
        {
          message: "Not authenticated",
          extensions: { code: "UNAUTHENTICATED" },
        },
      ],
    });
  });

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, terminatingLink]),
    cache: new InMemoryCache(),
  });

  await expect(client.query({ query: ME_QUERY })).rejects.toThrow();
  expect(callCount).toBe(1); // no retry
  expect(sessionExpiredSpy).toHaveBeenCalledTimes(1);
});

it("does not intercept non-UNAUTHENTICATED errors", async () => {
  const sessionExpiredSpy = jest.fn();
  setSessionExpiredHandler(sessionExpiredSpy);

  let callCount = 0;
  const terminatingLink = new ApolloLink(() => {
    callCount++;
    return of({
      errors: [{ message: "Not found", extensions: { code: "NOT_FOUND" } }],
    });
  });

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, terminatingLink]),
    cache: new InMemoryCache(),
  });

  await expect(client.query({ query: ME_QUERY })).rejects.toThrow();
  expect(callCount).toBe(1);
  expect(sessionExpiredSpy).not.toHaveBeenCalled();
});
