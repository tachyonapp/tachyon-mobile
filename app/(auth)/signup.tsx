import { useAuth } from "@/auth/AuthProvider";
import { AuthErrorState } from "@/components/auth/auth-error-state";
import { AuthScreen } from "@/components/auth/auth-screen";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

/** 
 * 
 * Terms acknowledgment:
 * A row with a checkbox (Pressable that toggles a boolean state) and the 
 * localized terms label. The CTA button must be `disabled` until 
 * `termsAccepted === true`.
 * 
 * Password strength indicator spec: 
 * The strength indicator is a row of 4 segments that fill progressively. 
 * Strength is computed client-side based on password length and character variety:

    | Score | Label | Color |
    |---|---|---|
    | 0 | — | `#2A3347` (empty) |
    | 1 | Weak | `#D64545` (danger) |
    | 2 | Fair | `#F2B705` (warning) |
    | 3 | Good | `#1C9C61` (success) |
    | 4 | Strong | `#2C6BED` (electricBlue) |
*/
const STRENGTH_COLORS = ["#D64545", "#D64545", "#F2B705", "#1C9C61", "#2C6BED"];
const STRENGTH_SEGMENTS = 4;

function getPasswordStrength(password: string): number {
  if (password.length === 0) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export default function SignupScreen() {
  const { signup, isLoading, error } = useAuth();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const strength = getPasswordStrength(password);
  const strengthColor =
    strength > 0 ? STRENGTH_COLORS[strength] : theme.inputBorder;

  const handleSignup = async () => {
    if (!email || !password || !termsAccepted || submitting) return;
    setSubmitting(true);
    try {
      await signup(email, password);
    } catch {
      // error state managed by AuthProvider
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

  return (
    <AuthScreen>
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        {"Create Account"}
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
          onChangeText={setPassword}
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

      {/* Password strength indicator */}
      {password.length > 0 ? (
        <View style={styles.strengthContainer}>
          <Text style={[styles.strengthLabel, { color: theme.textSecondary }]}>
            {"Password strength"}
          </Text>
          <View style={styles.strengthSegments}>
            {Array.from({ length: STRENGTH_SEGMENTS }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.strengthSegment,
                  {
                    backgroundColor:
                      i < strength ? strengthColor : theme.inputBorder,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      ) : null}

      {/* Terms acknowledgment */}
      <Pressable
        style={styles.termsRow}
        onPress={() => setTermsAccepted((v) => !v)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: termsAccepted }}
      >
        <View
          style={[
            styles.checkbox,
            { borderColor: theme.inputBorder },
            termsAccepted && {
              backgroundColor: theme.electricBlue,
              borderColor: theme.electricBlue,
            },
          ]}
        >
          {termsAccepted ? (
            <Text style={[styles.checkmark, { color: theme.textPrimary }]}>
              ✓
            </Text>
          ) : null}
        </View>
        <Text style={[styles.termsLabel, { color: theme.textSecondary }]}>
          {"I agree to the Terms of Service and Privacy Policy"}
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          { backgroundColor: theme.electricBlue },
          (!termsAccepted || submitting) && styles.submitButtonDisabled,
          pressed && termsAccepted && styles.submitButtonPressed,
        ]}
        onPress={handleSignup}
        disabled={!termsAccepted || submitting || isLoading}
        accessibilityRole="button"
      >
        {submitting || isLoading ? (
          <ActivityIndicator size="small" color={theme.textPrimary} />
        ) : (
          <Text style={[styles.submitButtonText, { color: theme.textPrimary }]}>
            {"Create Account"}
          </Text>
        )}
      </Pressable>

      <View style={styles.switchContainer}>
        <Text style={[styles.switchText, { color: theme.textSecondary }]}>
          {"Already have an account?"}{" "}
        </Text>
        <Link href="/(auth)/login" asChild>
          <Pressable>
            <Text style={[styles.switchLink, { color: theme.electricBlue }]}>
              {"Sign in"}
            </Text>
          </Pressable>
        </Link>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 32,
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
  strengthContainer: {
    marginBottom: 16,
  },
  strengthLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  strengthSegments: {
    flexDirection: "row",
    gap: 4,
  },
  strengthSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkmark: {
    fontSize: 12,
    fontWeight: "700",
  },
  termsLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  submitButton: {
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
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
