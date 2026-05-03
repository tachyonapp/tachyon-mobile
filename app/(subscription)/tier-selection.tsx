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
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type TierOption = {
  tier: SubscriptionTier;
  label: string;
  price: string;
  features: string[];
};

const TIER_OPTIONS: TierOption[] = [
  {
    tier: SubscriptionTier.FreeTrial,
    label: "Free Trial",
    price: "Free",
    features: ["40 scans/day", "30-day free trial", "No payment required"],
  },
  {
    tier: SubscriptionTier.Byok,
    label: "BYOK",
    price: "$9.99/mo",
    features: ["Unlimited bots", "Use your own API key", "No scan cap"],
  },
  {
    tier: SubscriptionTier.TachyonHosted,
    label: "Tachyon-Hosted",
    price: "$45/mo",
    features: ["Fully managed", "78 scans/day", "No API key needed"],
  },
];

export default function TierSelectionScreen() {
  const theme = Colors[useColorScheme()];
  const router = useRouter();
  const { origin } = useLocalSearchParams<{ origin?: string }>();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const { refetch: refetchMe } = useQuery(MeSubscriptionDocument, {
    fetchPolicy: "cache-first",
  });

  const [selectTier, { loading }] = useMutation<
    SelectTierMutation,
    SelectTierMutationVariables
  >(SelectTierDocument);

  const handleContinue = async () => {
    if (!selectedTier) return;
    setError(null);

    if (selectedTier === SubscriptionTier.FreeTrial) {
      try {
        await selectTier({ variables: { tier: SubscriptionTier.FreeTrial } });
        await refetchMe();
        navigateAfterSuccess();
      } catch {
        setError("Failed to start free trial. Please try again.");
      }
      return;
    }

    // Paid tiers — navigate to card input
    router.push({
      pathname: "/(subscription)/stripe-card-input",
      params: { tier: selectedTier, origin: origin ?? "" },
    });
  };

  const navigateAfterSuccess = () => {
    if (origin === "bot-forge") {
      router.replace("/(bot-forge)" as never);
    } else {
      router.replace("/(tabs)" as never);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Choose Your Plan
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Select a subscription to start building bots.
        </Text>

        <View style={styles.cards}>
          {TIER_OPTIONS.map((option) => {
            const isSelected = selectedTier === option.tier;
            return (
              <Pressable
                key={option.tier}
                style={[
                  styles.card,
                  { backgroundColor: theme.surface },
                  isSelected && styles.cardSelected,
                ]}
                onPress={() => setSelectedTier(option.tier)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              >
                <View style={styles.cardHeader}>
                  <Text
                    style={[styles.cardLabel, { color: theme.textPrimary }]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[styles.cardPrice, { color: theme.electricBlue }]}
                  >
                    {option.price}
                  </Text>
                </View>
                {option.features.map((feature) => (
                  <Text
                    key={feature}
                    style={[styles.feature, { color: theme.textSecondary }]}
                  >
                    • {feature}
                  </Text>
                ))}
              </Pressable>
            );
          })}
        </View>

        {error != null && <Text style={styles.errorText}>{error}</Text>}

        <Pressable
          style={[
            styles.continueBtn,
            { backgroundColor: theme.electricBlue },
            (selectedTier == null || loading) && styles.continueBtnDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedTier == null || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.continueBtnText}>Continue</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 48,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 16,
  },
  cards: { gap: 12 },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "transparent",
    gap: 6,
  },
  cardSelected: {
    borderColor: "#2C6BED",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 17,
    fontWeight: "600",
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: "600",
  },
  feature: {
    fontSize: 14,
  },
  errorText: {
    color: "#D64545",
    fontSize: 14,
    textAlign: "center",
  },
  continueBtn: {
    marginTop: 8,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnDisabled: {
    opacity: 0.5,
  },
  continueBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
