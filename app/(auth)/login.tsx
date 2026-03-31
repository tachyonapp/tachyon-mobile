import { useAuth } from "@/auth/AuthProvider";
import { AuthErrorState } from "@/components/auth/auth-error-state";
import { AuthScreen } from "@/components/auth/auth-screen";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { validateEmailFormat, validateLoginForm } from "@/utils/auth-validators";
import { isClerkAPIResponseError } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const mapErrorToMessage = (error: Error | null): string | null => {
  if (!error) return null;
  if (error.message === "session_expired")
    return "Your session has expired. Please sign in again.";
  if (isClerkAPIResponseError(error)) {
    const code = error.errors[0]?.code;
    if (
      code === "form_password_incorrect" ||
      code === "form_identifier_not_found"
    )
      return "Incorrect email or password. Please try again.";
    if (code === "network_error")
      return "Unable to connect. Check your internet connection.";
  }
  if (error.message.toLowerCase().includes("network"))
    return "Unable to connect. Check your internet connection.";
  return "Something went wrong. Please try again later.";
};

export default function LoginScreen() {
  const { login, setError, isLoading, error, pendingVerification } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (pendingVerification === "signin_second_factor") {
      router.push("/(auth)/verify");
    }
  }, [pendingVerification, router]);

  const handleLogin = async () => {
    if (submitting) return;
    const invalid = validateLoginForm(email, password);
    if (invalid) {
      setValidationError(invalid);
      return;
    }
    setValidationError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      // Navigation guard in RootNavigator handles redirect to (tabs) automatically
    } catch {
      // error state is set inside AuthProvider — no additional handling needed here
    } finally {
      setSubmitting(false);
    }
  };

  const displayedError = validationError ?? mapErrorToMessage(error);
  const isSubmittable: boolean =
    !submitting &&
    !isLoading &&
    validationError == null &&
    email !== "" &&
    password !== "";

  return (
    <AuthScreen>
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
          if (validationError !== null)
            setValidationError(validateLoginForm(v, password));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        textContentType="emailAddress"
        onBlur={() => setValidationError(validateEmailFormat(email))}
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
          placeholder={"Password"}
          placeholderTextColor={theme.textDisabled}
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            if (validationError !== null)
              setValidationError(validateLoginForm(email, v));
          }}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          onBlur={() => setValidationError(validateLoginForm(email, password))}
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
          !isSubmittable && styles.submitButtonDisabled,
        ]}
        onPress={handleLogin}
        disabled={!isSubmittable}
        accessibilityRole="button"
      >
        {submitting || isLoading ? (
          <ActivityIndicator size="small" color={theme.textPrimary} />
        ) : (
          <Text style={[styles.submitButtonText, { color: theme.textPrimary }]}>
            {"Sign In"}
          </Text>
        )}
      </Pressable>

      <Pressable
        style={styles.linkButton}
        onPress={() => {
          router.push("/(auth)/forgot-password");
        }}
      >
        <Text style={[styles.linkText, { color: theme.textSecondary }]}>
          {"Forgot password?"}
        </Text>
      </Pressable>

      <View style={styles.switchContainer}>
        <Text style={[styles.switchText, { color: theme.textSecondary }]}>
          {"Don't have an account?"}{" "}
        </Text>
        <Link href="/(auth)/signup" asChild>
          <Pressable>
            <Text style={[styles.switchLink, { color: theme.electricBlue }]}>
              {"Sign up"}
            </Text>
          </Pressable>
        </Link>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 8,
    marginBottom: 16,
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  linkButton: {
    alignItems: "center",
    marginBottom: 24,
  },
  linkText: {
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  switchText: {
    fontSize: 14,
  },
  switchLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
