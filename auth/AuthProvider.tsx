import {
  clearSessionExpiredHandler,
  setSessionExpiredHandler,
} from "@/auth/authEventEmitter";
import { useClerk, useSignIn, useSignUp, useUser } from "@clerk/clerk-expo";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { id: string; email: string | null } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  error: Error | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    isLoaded: signInLoaded,
    signIn,
    setActive: setSignInActive,
  } = useSignIn();
  const {
    isLoaded: signUpLoaded,
    signUp,
    setActive: setSignUpActive,
  } = useSignUp();
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const [error, setError] = useState<Error | null>(null);

  const isLoading = !signInLoaded || !signUpLoaded || !userLoaded;

  useEffect(() => {
    setSessionExpiredHandler(async () => {
      try {
        await signOut();
      } catch {
        // signOut failure is non-recoverable here — still clear local state
      }
      setError(new Error("session_expired"));
    });

    return () => {
      clearSessionExpiredHandler();
    };
  }, [signOut]);

  const login = async (email: string, password: string): Promise<void> => {
    setError(null);
    try {
      const result = await signIn!.create({ identifier: email, password });
      if (result.status === "complete") {
        await setSignInActive!({ session: result.createdSessionId });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Login failed"));
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    try {
      await signOut();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Logout failed"));
      throw err;
    }
  };

  const signup = async (email: string, password: string): Promise<void> => {
    setError(null);
    try {
      const result = await signUp!.create({ emailAddress: email, password });
      if (result.status === "complete") {
        await setSignUpActive!({ session: result.createdSessionId });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Sign up failed"));
      throw err;
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    setError(null);
    try {
      await signIn!.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      // Clerk sends a reset email — no further action needed on this screen
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Password reset failed"));
      throw err;
    }
  };

  const value: AuthContextValue = {
    isAuthenticated: !!isSignedIn,
    isLoading,
    user: user
      ? { id: user.id, email: user.primaryEmailAddress?.emailAddress ?? null }
      : null,
    login,
    logout,
    signup,
    forgotPassword,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within ClerkProvider");
  return ctx;
}
