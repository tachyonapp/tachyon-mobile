import { Colors } from "@/constants/theme";
import {
  MeSubscriptionDocument,
  SelectTierDocument,
  SubscriptionTier,
  type SelectTierMutation,
  type SelectTierMutationVariables,
} from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CardField,
  StripeProvider,
  useStripe,
} from "@stripe/stripe-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

function StripeCardInputInner() {
  const theme = Colors[useColorScheme()];
  const router = useRouter();
  const { tier, origin } = useLocalSearchParams<{
    tier: string;
    origin?: string;
  }>();
  const { createPaymentMethod } = useStripe();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const { refetch: refetchMe } = useQuery(MeSubscriptionDocument, {
    fetchPolicy: "cache-first",
  });

  const [selectTier] = useMutation<
    SelectTierMutation,
    SelectTierMutationVariables
  >(SelectTierDocument);

  const handleSubscribe = async () => {
    if (!cardComplete) return;
    setError(null);
    setSubmitting(true);

    try {
      const { paymentMethod, error: stripeError } = await createPaymentMethod({
        paymentMethodType: "Card",
      });

      if (stripeError != null || paymentMethod == null) {
        setError(stripeError?.message ?? "Could not create payment method.");
        return;
      }

      const resolvedTier =
        tier === SubscriptionTier.Byok
          ? SubscriptionTier.Byok
          : SubscriptionTier.TachyonHosted;

      await selectTier({
        variables: {
          tier: resolvedTier,
          stripePaymentMethodId: paymentMethod.id,
        },
      });

      await refetchMe();
      navigateAfterSuccess();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.";
      setError(`Payment failed: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const navigateAfterSuccess = () => {
    if (origin === "bot-forge") {
      router.replace("/(bot-forge)" as never);
    } else {
      router.replace("/(tabs)" as never);
    }
  };

  const tierLabel =
    tier === SubscriptionTier.Byok
      ? "BYOK ($9.99/mo)"
      : "Tachyon-Hosted ($45/mo)";

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Payment Details
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Subscribing to {tierLabel}
        </Text>

        <View
          style={[
            styles.cardFieldWrapper,
            { backgroundColor: theme.surface, borderColor: theme.inputBorder },
          ]}
        >
          <CardField
            postalCodeEnabled={false}
            style={styles.cardField}
            cardStyle={{
              backgroundColor: theme.surface,
              textColor: theme.textPrimary,
              placeholderColor: theme.textSecondary,
              borderColor: "transparent",
            }}
            onCardChange={(details) => setCardComplete(details.complete)}
          />
        </View>

        {error != null && <Text style={styles.errorText}>{error}</Text>}

        <Pressable
          style={[
            styles.subscribeBtn,
            { backgroundColor: theme.electricBlue },
            (!cardComplete || submitting) && styles.subscribeBtnDisabled,
          ]}
          onPress={handleSubscribe}
          disabled={!cardComplete || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.subscribeBtnText}>Subscribe</Text>
          )}
        </Pressable>

        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={[styles.backBtnText, { color: theme.textSecondary }]}>
            Go Back
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function StripeCardInputScreen() {
  return (
    <StripeProvider publishableKey={PUBLISHABLE_KEY}>
      <StripeCardInputInner />
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
  },
  cardFieldWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginTop: 8,
  },
  cardField: {
    height: 52,
  },
  errorText: {
    color: "#D64545",
    fontSize: 14,
  },
  subscribeBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  subscribeBtnDisabled: {
    opacity: 0.5,
  },
  subscribeBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  backBtn: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
