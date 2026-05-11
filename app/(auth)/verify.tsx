import { useAuth } from "@/auth/AuthProvider";
import { AuthErrorState } from "@/components/auth/auth-error-state";
import { AuthScreen } from "@/components/auth/auth-screen";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { validateVerificationCode } from "@/utils/auth-validators";
import { isClerkAPIResponseError } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

export default function VerifyScreen() {
  const {
    pendingVerification,
    pendingEmail,
    verifySignIn,
    verifySignUp,
    abandonVerification,
    resendVerificationCode,
    error,
  } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Should not be accessible without a pending verification
  if (!pendingVerification) {
    return <Redirect href="/(auth)/login" />;
  }

  const isSignup = pendingVerification === "signup_email";

  const title = isSignup ? "Verify your email" : "Verify your identity";
  const description = pendingEmail
    ? `We sent a 6-digit code to ${pendingEmail}. Enter it below to ${isSignup ? "complete your account setup" : "continue signing in"}.`
    : "We sent a 6-digit code to your email. Enter it below.";

  const handleVerify = async () => {
    if (submitting) return;
    const invalid = validateVerificationCode(code);
    if (invalid) {
      setValidationError(invalid);
      return;
    }
    setValidationError(null);
    setSubmitting(true);
    try {
      if (isSignup) {
        await verifySignUp(code);
      } else {
        await verifySignIn(code);
      }
      // On success Clerk sets the active session — RootNavigator redirects to (tabs)
    } catch {
      // error state set in AuthProvider
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setCode("");
    setValidationError(null);
    setResending(true);
    try {
      await resendVerificationCode();
    } catch {
      // error state set in AuthProvider
    } finally {
      setResending(false);
    }
  };

  const errorMessage = (() => {
    if (!error) return null;
    if (error.message === "signup_session_expired")
      return "Your signup session expired. Please sign up again.";
    if (isClerkAPIResponseError(error)) {
      const code = error.errors[0]?.code;
      if (code === "incorrect_code" || code === "form_code_incorrect")
        return "Incorrect code. Please check and try again.";
      if (code === "form_code_expired")
        return "Code has expired. Please request a new one.";
      if (code === "network_error")
        return "Unable to connect. Check your internet connection.";
    }
    if (error.message.toLowerCase().includes("network"))
      return "Unable to connect. Check your internet connection.";
    return "Something went wrong. Please try again later.";
  })();

  const displayedError = validationError ?? errorMessage;

  // After a stale session, pendingVerification is cleared by AuthProvider and
  // the Redirect above fires — but if the error renders before that effect runs,
  // show a Back to Sign Up link so the user can restart immediately.
  const showStartOver = error?.message === "signup_session_expired";

  return (
    <AuthScreen>
      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        {description}
      </Text>

      {displayedError ? (
        <AuthErrorState message={displayedError} type="auth_failed" />
      ) : null}

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.inputBorder,
            color: theme.textPrimary,
          },
        ]}
        placeholder={"6-digit code"}
        placeholderTextColor={theme.textDisabled}
        value={code}
        onChangeText={(v) => { setCode(v); setValidationError(null); }}
        keyboardType="number-pad"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={6}
        textContentType="oneTimeCode"
        autoFocus
      />

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          { backgroundColor: theme.electricBlue },
          pressed && styles.submitButtonPressed,
        ]}
        onPress={handleVerify}
        disabled={submitting}
        accessibilityRole="button"
      >
        {submitting ? (
          <ActivityIndicator size="small" color={theme.textPrimary} />
        ) : (
          <Text style={[styles.submitButtonText, { color: theme.textPrimary }]}>
            {"Verify"}
          </Text>
        )}
      </Pressable>

      {showStartOver ? (
        <Pressable
          style={styles.linkButton}
          onPress={() => { abandonVerification(); router.replace("/(auth)/signup"); }}
        >
          <Text style={[styles.linkText, { color: theme.electricBlue }]}>
            {"Start over"}
          </Text>
        </Pressable>
      ) : (
        <Pressable
          style={styles.linkButton}
          onPress={handleResend}
          disabled={resending}
        >
          <Text style={[styles.linkText, { color: theme.textSecondary }]}>
            {resending ? "Sending…" : "Didn't receive a code? Resend"}
          </Text>
        </Pressable>
      )}

      <Pressable
        style={styles.linkButton}
        onPress={() => { abandonVerification(); router.replace("/(auth)/login"); }}
      >
        <Text style={[styles.linkText, { color: theme.textSecondary }]}>
          {"Back to Sign In"}
        </Text>
      </Pressable>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 28,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
    letterSpacing: 4,
  },
  submitButton: {
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  linkButton: {
    alignItems: "center",
    marginBottom: 12,
  },
  linkText: {
    fontSize: 14,
  },
});
