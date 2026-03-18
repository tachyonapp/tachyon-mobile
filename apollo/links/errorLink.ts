import { CombinedGraphQLErrors } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import Auth0 from "react-native-auth0";
import { from, switchMap } from "rxjs";

// Apollo v4: onError() is deprecated — use new ErrorLink() class
// Apollo v4: fromPromise() removed — use rxjs from() + switchMap() instead
const auth0 = new Auth0({
  domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN!,
  clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID!,
});

// Intercepts UNAUTHENTICATED errors and attempts a silent token refresh
// If refresh succeeds: retries the original operation with the new token
// If refresh fails: re-throws error (calling screen handles force logout)
export const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (
    error instanceof CombinedGraphQLErrors &&
    error.errors.some((e) => e.extensions?.code === "UNAUTHENTICATED")
  ) {
    return from(
      auth0.credentialsManager.getCredentials(undefined, 60), // scope=undefined, minTtl=60s
    ).pipe(
      switchMap((credentials) => {
        operation.setContext({
          headers: { authorization: `Bearer ${credentials.accessToken}` },
        });
        return forward(operation);
      }),
    );
  }
});
