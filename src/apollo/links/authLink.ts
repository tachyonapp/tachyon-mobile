import { ApolloLink } from '@apollo/client';
import { Observable } from 'rxjs';
import Auth0 from 'react-native-auth0';

// Apollo v4: Observable is from rxjs — not from @apollo/client
const auth0 = new Auth0({
  domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN!,
  clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID!,
});

// Attaches Bearer token to every outgoing request
// Reads from platform secure storage via credentialsManager (iOS Keychain / Android Keystore)
export const authLink = new ApolloLink((operation, forward) => {
  return new Observable((subscriber) => {
    auth0.credentialsManager
      .getCredentials()
      .then((credentials) => {
        if (credentials?.accessToken) {
          operation.setContext({
            headers: { authorization: `Bearer ${credentials.accessToken}` },
          });
        }
        forward(operation).subscribe(subscriber);
      })
      .catch(() => {
        // No credentials — proceed unauthenticated
        forward(operation).subscribe(subscriber);
      });
  });
});
