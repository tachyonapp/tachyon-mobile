import { useAuth } from "@/auth/AuthProvider";
import { AuthErrorState } from "@/components/auth/auth-error-state";
import { AuthScreen } from "@/components/auth/auth-screen";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  validateEmailFormat,
  validatePasswordResetForm,
} from "@/utils/auth-validators";
import { isClerkAPIResponseError } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Step = "email" | "verify";

const ForgotPasswordScreen = () => {
  const { forgotPassword, confirmPasswordReset, error } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // --- Step 1: send code ---
  const handleSendCode = async () => {
    if (submitting) return;
    const invalid = validateEmailFormat(email);
    if (invalid) {
      setValidationError(invalid);
      return;
    }
    setValidationError(null);
    setSubmitting(true);
    try {
      await forgotPassword(email);
      setStep("verify");
    } catch {
      // error state set in AuthProvider
    } finally {
      setSubmitting(false);
    }
  };

  // --- Step 2: verify code + set new password ---
  const handleConfirm = async () => {
    if (submitting) return;
    const invalid = validatePasswordResetForm(code, newPassword);
    if (invalid) {
      setValidationError(invalid);
      return;
    }
    setValidationError(null);
    setSubmitting(true);
    try {
      await confirmPasswordReset(code, newPassword);
      // On success Clerk sets the active session — RootNavigator redirects to (tabs)
    } catch {
      // error state set in AuthProvider
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setCode("");
    setValidationError(null);
    setSubmitting(true);
    try {
      await forgotPassword(email);
    } catch {
      // error state set in AuthProvider
    } finally {
      setSubmitting(false);
    }
  };

  // --- Error mapping ---
  const errorMessage = (() => {
    if (!error) return null;
    if (isClerkAPIResponseError(error)) {
      const code = error.errors[0]?.code;
      if (code === "form_identifier_not_found")
        return "No account found with that email address.";
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

  // --- Email step ---
  if (step === "email") {
    return (
      <AuthScreen>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {"Reset Password"}
        </Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {"Enter your email and we'll send you a verification code."}
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
          placeholder={"Email"}
          placeholderTextColor={theme.textDisabled}
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            setValidationError(null);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          textContentType="emailAddress"
        />

        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            { backgroundColor: theme.electricBlue },
            pressed && styles.submitButtonPressed,
          ]}
          onPress={handleSendCode}
          disabled={submitting}
          accessibilityRole="button"
        >
          {submitting ? (
            <ActivityIndicator size="small" color={theme.textPrimary} />
          ) : (
            <Text
              style={[styles.submitButtonText, { color: theme.textPrimary }]}
            >
              {"Send Code"}
            </Text>
          )}
        </Pressable>

        <Pressable style={styles.backLink} onPress={() => router.back()}>
          <Text style={[styles.backLinkText, { color: theme.textSecondary }]}>
            {"Back to Sign In"}
          </Text>
        </Pressable>
      </AuthScreen>
    );
  }

  // --- Verify step ---
  return (
    <AuthScreen>
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        {"Check your email"}
      </Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        {`We sent a 6-digit code to ${email}. Enter it below with your new password.`}
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
        onChangeText={(v) => {
          setCode(v);
          setValidationError(null);
        }}
        keyboardType="number-pad"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={6}
        textContentType="oneTimeCode"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.input,
            styles.passwordInput,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.inputBorder,
              color: theme.textPrimary,
            },
          ]}
          placeholder={"New password"}
          placeholderTextColor={theme.textDisabled}
          value={newPassword}
          onChangeText={(v) => {
            setNewPassword(v);
            setValidationError(null);
          }}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
        />
        <Pressable
          style={styles.eyeButton}
          onPress={() => setShowPassword((v) => !v)}
          accessibilityLabel={showPassword ? "Hide password" : "Show password"}
        >
          <Text style={[styles.eyeButtonText, { color: theme.textSecondary }]}>
            {showPassword ? "Hide" : "Show"}
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          { backgroundColor: theme.electricBlue },
          pressed && styles.submitButtonPressed,
        ]}
        onPress={handleConfirm}
        disabled={submitting}
        accessibilityRole="button"
      >
        {submitting ? (
          <ActivityIndicator size="small" color={theme.textPrimary} />
        ) : (
          <Text style={[styles.submitButtonText, { color: theme.textPrimary }]}>
            {"Reset Password"}
          </Text>
        )}
      </Pressable>

      <Pressable
        style={styles.backLink}
        onPress={handleResend}
        disabled={submitting}
      >
        <Text style={[styles.backLinkText, { color: theme.textSecondary }]}>
          {"Didn't receive a code? Resend"}
        </Text>
      </Pressable>

      <Pressable
        style={styles.backLink}
        onPress={() => router.replace("/(auth)/login")}
      >
        <Text style={[styles.backLinkText, { color: theme.textSecondary }]}>
          {"Back to Sign In"}
        </Text>
      </Pressable>
    </AuthScreen>
  );
};

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
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 12,
  },
  passwordInput: {
    marginBottom: 0,
    paddingRight: 64,
    height: 52,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  eyeButtonText: {
    fontSize: 13,
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
  backLink: {
    alignItems: "center",
    marginBottom: 12,
  },
  backLinkText: {
    fontSize: 14,
  },
});

export default ForgotPasswordScreen;
