import {
  clearSessionExpiredHandler,
  setSessionExpiredHandler,
} from "@/auth/authEventEmitter";
import { useClerk, useSignIn, useSignUp, useUser } from "@clerk/clerk-expo";
import React, { createContext, useContext, useEffect, useState } from "react";

export type PendingVerification = "signin_second_factor" | "signup_email" | null;

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { id: string; email: string | null } | null;
  pendingVerification: PendingVerification;
  pendingEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (code: string, newPassword: string) => Promise<void>;
  verifySignIn: (code: string) => Promise<void>;
  verifySignUp: (code: string) => Promise<void>;
  resendVerificationCode: () => Promise<void>;
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
  const [pendingVerification, setPendingVerification] =
    useState<PendingVerification>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const isLoading = !signInLoaded || !signUpLoaded || !userLoaded;

  useEffect(() => {
    setSessionExpiredHandler(async () => {
      try {
        await signOut();
      } catch {
        // signOut failure is non-recoverable here — still clear local state
      }
      setPendingVerification(null);
      setPendingEmail(null);
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
      } else if (result.status === "needs_second_factor") {
        await signIn!.prepareSecondFactor({ strategy: "email_code" });
        setPendingEmail(email);
        setPendingVerification("signin_second_factor");
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
      setPendingVerification(null);
      setPendingEmail(null);
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
      } else {
        // Email verification required
        await signUp!.prepareEmailAddressVerification({ strategy: "email_code" });
        setPendingEmail(email);
        setPendingVerification("signup_email");
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
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Password reset failed"));
      throw err;
    }
  };

  const confirmPasswordReset = async (
    code: string,
    newPassword: string,
  ): Promise<void> => {
    setError(null);
    try {
      const result = await signIn!.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });
      if (result.status === "complete") {
        await setSignInActive!({ session: result.createdSessionId });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Password reset failed"));
      throw err;
    }
  };

  const verifySignIn = async (code: string): Promise<void> => {
    setError(null);
    try {
      const result = await signIn!.attemptSecondFactor({
        strategy: "email_code",
        code,
      });
      if (result.status === "complete") {
        await setSignInActive!({ session: result.createdSessionId });
        setPendingVerification(null);
        setPendingEmail(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Verification failed"));
      throw err;
    }
  };

  const verifySignUp = async (code: string): Promise<void> => {
    setError(null);
    try {
      const result = await signUp!.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setSignUpActive!({ session: result.createdSessionId });
        setPendingVerification(null);
        setPendingEmail(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Verification failed"));
      throw err;
    }
  };

  const resendVerificationCode = async (): Promise<void> => {
    setError(null);
    try {
      if (pendingVerification === "signin_second_factor") {
        await signIn!.prepareSecondFactor({ strategy: "email_code" });
      } else if (pendingVerification === "signup_email") {
        await signUp!.prepareEmailAddressVerification({ strategy: "email_code" });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to resend code"));
      throw err;
    }
  };

  const value: AuthContextValue = {
    isAuthenticated: !!isSignedIn,
    isLoading,
    user: user
      ? { id: user.id, email: user.primaryEmailAddress?.emailAddress ?? null }
      : null,
    pendingVerification,
    pendingEmail,
    login,
    logout,
    signup,
    forgotPassword,
    confirmPasswordReset,
    verifySignIn,
    verifySignUp,
    resendVerificationCode,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within ClerkProvider");
  return ctx;
}
