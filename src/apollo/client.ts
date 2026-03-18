/**
 * Apollo Client — tachyon-mobile's data layer for all communication with tachyon-api.
 *
 * Tachyon's API is GraphQL-first. Every piece of data the mobile app needs — bots,
 * proposals, positions, account info — is fetched via GraphQL queries and mutations
 * defined in tachyon-api. Apollo Client is a standard React Native library for
 * consuming GraphQL: it handles request execution, normalized caching, loading/error
 * state, and re-rendering when data changes.
 *
 * This file wires together the full link chain and exports a single shared client
 * instance that is provided to the entire app via <ApolloProvider> in the root layout.
 */
import { ApolloClient, ApolloLink, HttpLink } from "@apollo/client";
import Constants from "expo-constants";
import { cache } from "./cache";
import { authLink } from "./links/authLink";
import { errorLink } from "./links/errorLink";
import { retryLink } from "./links/retryLink";

const httpLink = new HttpLink({
  uri: Constants.expoConfig?.extra?.apiUrl
    ? `${Constants.expoConfig.extra.apiUrl}/graphql`
    : "http://localhost:4000/graphql",
});

// Link chain order: authLink → errorLink → retryLink → httpLink
// authLink: attaches token before request leaves
// errorLink: intercepts UNAUTHENTICATED responses and refreshes token
// retryLink: retries on transient network failures
// httpLink: sends the HTTP request
export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, retryLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network", // show cached data immediately, refresh in background
    },
  },
});
