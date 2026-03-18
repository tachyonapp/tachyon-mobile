import { errorLink } from "@/apollo/links/errorLink";
import { ApolloClient, ApolloLink, InMemoryCache, gql } from "@apollo/client";
import Auth0 from "react-native-auth0";
import { of } from "rxjs";

const ME_QUERY = gql`
  query Me {
    me {
      id
    }
  }
`;

// auth0 is instantiated at module scope in errorLink.ts when the module is first imported.
// Capture the mock instance so we can control getCredentials per test.
const mockGetCredentials = (Auth0 as jest.Mock).mock.results[0].value
  .credentialsManager.getCredentials as jest.Mock;

beforeEach(() => {
  mockGetCredentials.mockReset();
});

it("retries operation with refreshed token on UNAUTHENTICATED error", async () => {
  mockGetCredentials.mockResolvedValue({ accessToken: "refreshed-token" });

  let callCount = 0;
  const terminatingLink = new ApolloLink(() => {
    callCount++;
    if (callCount === 1) {
      return of({
        errors: [
          {
            message: "Not authenticated",
            extensions: { code: "UNAUTHENTICATED" },
          },
        ],
      });
    }
    return of({ data: { me: { id: "1" } } });
  });

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, terminatingLink]),
    cache: new InMemoryCache(),
  });

  const result = (await client.query({ query: ME_QUERY })) as any;

  expect(result.data.me.id).toBe("1");
  expect(callCount).toBe(2);
  expect(mockGetCredentials).toHaveBeenCalledTimes(1);
});

it("does not retry on non-UNAUTHENTICATED errors", async () => {
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
  expect(mockGetCredentials).not.toHaveBeenCalled();
});
