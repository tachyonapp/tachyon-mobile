import { errorLink } from "@/apollo/links/errorLink";
import { ApolloClient, ApolloLink, InMemoryCache, gql } from "@apollo/client";
import { of } from "rxjs";

const ME_QUERY = gql`
  query Me {
    me {
      id
    }
  }
`;

it("logs a warning on UNAUTHENTICATED error and does not retry", async () => {
  const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

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
  expect(warnSpy).toHaveBeenCalledWith(
    expect.stringContaining("UNAUTHENTICATED"),
  );

  warnSpy.mockRestore();
});

it("does not intercept non-UNAUTHENTICATED errors", async () => {
  const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

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
  expect(warnSpy).not.toHaveBeenCalled();

  warnSpy.mockRestore();
});
