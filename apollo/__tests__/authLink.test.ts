import { ApolloClient, ApolloLink, InMemoryCache, gql } from "@apollo/client";
import Auth0 from "react-native-auth0";
import { of } from "rxjs";
import { authLink } from "@/apollo/links/authLink";

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
    }
  }
`;

// auth0 is instantiated at module scope in authLink.ts when the module is first imported.
// Capture the mock instance so we can control getCredentials per test.
const mockGetCredentials = (Auth0 as jest.Mock).mock.results[0].value
  .credentialsManager.getCredentials as jest.Mock;

beforeEach(() => {
  mockGetCredentials.mockReset();
});

it("attaches Authorization header with Bearer token", async () => {
  mockGetCredentials.mockResolvedValue({ accessToken: "test-token-abc" });

  let capturedHeaders: Record<string, string> = {};

  const requestLink = new ApolloLink((operation) => {
    capturedHeaders = operation.getContext().headers;
    return of({ data: { me: { id: "1", email: "test@test.com" } } });
  });

  const client = new ApolloClient({
    link: authLink.concat(requestLink),
    cache: new InMemoryCache(),
  });

  await client.query({ query: ME_QUERY });
  expect(capturedHeaders.authorization).toBe("Bearer test-token-abc");
});

it("proceeds unauthenticated when no credentials are available", async () => {
  mockGetCredentials.mockRejectedValue(new Error("No credentials stored"));

  let capturedHeaders: Record<string, string> | undefined;

  const requestLink = new ApolloLink((operation) => {
    capturedHeaders = operation.getContext().headers;
    return of({ data: { me: null } });
  });

  const client = new ApolloClient({
    link: authLink.concat(requestLink),
    cache: new InMemoryCache(),
  });

  await client.query({ query: ME_QUERY });
  expect(capturedHeaders?.authorization).toBeUndefined();
});
