import { useAuth } from "@/auth/AuthProvider";
import { AuthErrorState } from "@/components/auth/auth-error-state";
import { AuthScreen } from "@/components/auth/auth-screen";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
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

export default function ForgotPasswordScreen() {
  const { forgotPassword, error } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch {
      // error state set in AuthProvider
    } finally {
      setSubmitting(false);
    }
  };

  const errorMessage = (() => {
    if (!error) return null;
    if (error.message.toLowerCase().includes("network"))
      return "Unable to connect. Check your internet connection.";
    return "Something went wrong. Please try again.";
  })();

  if (submitted) {
    return (
      <AuthScreen>
        <View style={styles.successContainer}>
          <Text style={[styles.successTitle, { color: theme.textPrimary }]}>
            {"Check your email"}
          </Text>
          <Text
            style={[styles.successDescription, { color: theme.textSecondary }]}
          >
            {"A password reset link has been sent to your email address."}
          </Text>
          <Pressable
            style={[styles.backButton, { backgroundColor: theme.electricBlue }]}
            onPress={() => router.replace("/(auth)/login")}
          >
            <Text style={[styles.backButtonText, { color: theme.textPrimary }]}>
              {"Back to Sign In"}
            </Text>
          </Pressable>
        </View>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen>
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        {"Reset Password"}
      </Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        {"Enter your email and we'll send you a reset link."}
      </Text>

      {errorMessage ? (
        <AuthErrorState message={errorMessage} type="auth_failed" />
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
        onChangeText={setEmail}
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
        onPress={handleSubmit}
        disabled={submitting || !email}
        accessibilityRole="button"
      >
        {submitting ? (
          <ActivityIndicator size="small" color={theme.textPrimary} />
        ) : (
          <Text style={[styles.submitButtonText, { color: theme.textPrimary }]}>
            {"Send Reset Email"}
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
  },
  backLinkText: {
    fontSize: 14,
  },
  // Success state
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  successDescription: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 32,
  },
  backButton: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
