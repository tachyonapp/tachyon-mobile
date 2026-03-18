import React, { createContext, useContext } from 'react';
import Auth0, { type Credentials } from 'react-native-auth0';

const auth0 = new Auth0({
  domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN!,
  clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID!,
});

interface Auth0ContextValue {
  login: () => Promise<Credentials>;
  logout: () => Promise<void>;
  getCredentials: () => Promise<Credentials | null>;
}

const Auth0Context = createContext<Auth0ContextValue | null>(null);

export function Auth0Provider({ children }: { children: React.ReactNode }) {
  const login = async (): Promise<Credentials> => {
    // Uses SFSafariViewController (iOS) / Chrome Custom Tabs (Android)
    // This is Auth0 Universal Login — stays in-app, does NOT open external browser
    const credentials = await auth0.webAuth.authorize({
      scope: 'openid profile email offline_access',
      audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE!,
    });

    // Store tokens in iOS Keychain / Android Keystore via react-native-auth0
    // NEVER store in AsyncStorage — platform secure storage only
    await auth0.credentialsManager.saveCredentials(credentials);
    return credentials;
  };

  const logout = async (): Promise<void> => {
    await auth0.webAuth.clearSession();
    await auth0.credentialsManager.clearCredentials();
  };

  const getCredentials = async (): Promise<Credentials | null> => {
    const hasCredentials = await auth0.credentialsManager.hasValidCredentials();
    if (!hasCredentials) return null;
    return auth0.credentialsManager.getCredentials();
  };

  return (
    <Auth0Context.Provider value={{ login, logout, getCredentials }}>
      {children}
    </Auth0Context.Provider>
  );
}

export function useAuth0(): Auth0ContextValue {
  const ctx = useContext(Auth0Context);
  if (!ctx) {
    throw new Error('useAuth0 must be used within an Auth0Provider');
  }
  return ctx;
}
