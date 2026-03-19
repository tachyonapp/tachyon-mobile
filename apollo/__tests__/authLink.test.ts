import { authLink, setClerkGetToken } from "@/apollo/links/authLink";
import { ApolloClient, ApolloLink, InMemoryCache, gql } from "@apollo/client";
import { of } from "rxjs";

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
    }
  }
`;

beforeEach(() => {
  // Reset to null before each test so tests are isolated
  setClerkGetToken(async () => null);
});

it("attaches Authorization header with Bearer token", async () => {
  setClerkGetToken(async () => "test-token-abc");

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
  setClerkGetToken(async () => null);

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
