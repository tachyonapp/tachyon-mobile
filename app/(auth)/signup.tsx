import { useAuth } from "@/auth/AuthProvider";
import { useBiometricAuth } from "@/auth/BiometricAuthProvider";
import { AuthErrorState } from "@/components/auth/auth-error-state";
import { AuthScreen } from "@/components/auth/auth-screen";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  validateEmailFormat,
  validateSignupForm,
} from "@/utils/auth-validators";
import { isClerkAPIResponseError } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
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
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const BIOMETRIC_LABEL =
  Platform.OS === "ios"
    ? "Enable Face ID for quick access"
    : "Enable fingerprint for quick access";

export default function SignupScreen() {
  const { signup, setError, isLoading, error, pendingVerification } = useAuth();
  const { isSupported, isDeviceEnrolled, enableSilently } = useBiometricAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [biometricOptIn, setBiometricOptIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (pendingVerification === "signup_email") {
      router.push("/(auth)/verify");
    }
  }, [pendingVerification, router]);

  const strength = getPasswordStrength(password);
  const strengthColor =
    strength > 0 ? STRENGTH_COLORS[strength] : theme.inputBorder;

  const handleSignup = async () => {
    if (!termsAccepted || submitting) return;
    const invalid = validateSignupForm(email, password);
    if (invalid) {
      setValidationError(invalid);
      return;
    }
    setValidationError(null);
    setSubmitting(true);
    try {
      await signup(email, password);
      // Write the biometric preference silently after signup succeeds.
      // We don't prompt Face ID here — the normal cold-start lock handles
      // the first prompt on the user's next session after email verification.
      if (biometricOptIn) {
        await enableSilently();
      }
    } catch {
      // error state managed by AuthProvider
    } finally {
      setSubmitting(false);
    }
  };

  const errorMessage = (() => {
    if (!error) return null;
    if (isClerkAPIResponseError(error)) {
      const code = error.errors[0]?.code;
      if (code === "form_identifier_exists")
        return "An account with this email already exists.";
      if (
        code === "form_password_pwned" ||
        code === "form_password_length_too_short"
      )
        return "Please choose a stronger password.";
      if (code === "network_error")
        return "Unable to connect. Check your internet connection.";
    }
    if (error.message.toLowerCase().includes("network"))
      return "Unable to connect. Check your internet connection.";
    return "Something went wrong. Please try again later.";
  })();

  const displayedError = validationError ?? errorMessage;

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
            setValidationError(validateSignupForm(v, password));
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
              setValidationError(validateSignupForm(email, v));
          }}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          onBlur={() => setValidationError(validateSignupForm(email, password))}
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

      {/* Biometric opt-in — only shown when the device supports biometrics */}
      {isSupported && isDeviceEnrolled ? (
        <Pressable
          style={styles.termsRow}
          onPress={() => setBiometricOptIn((v) => !v)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: biometricOptIn }}
        >
          <View
            style={[
              styles.checkbox,
              { borderColor: theme.inputBorder },
              biometricOptIn && {
                backgroundColor: theme.electricBlue,
                borderColor: theme.electricBlue,
              },
            ]}
          >
            {biometricOptIn ? (
              <Text style={[styles.checkmark, { color: theme.textPrimary }]}>
                ✓
              </Text>
            ) : null}
          </View>
          <Text style={[styles.termsLabel, { color: theme.textSecondary }]}>
            {BIOMETRIC_LABEL}
          </Text>
        </Pressable>
      ) : null}

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
          <Pressable onPress={() => setError(null)}>
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
    // Explicit height prevents iOS layout jump when toggling secureTextEntry.
    // Without it, iOS remeasures the input because bullet (•) and regular text
    // use different font metrics.
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
