import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SubscriptionTier, SubscriptionStatus } from '@/generated/graphql';

interface Props {
  subscriptionTier: SubscriptionTier | null | undefined;
  subscriptionStatus: SubscriptionStatus | null | undefined;
  onCreateBot: () => void;
}

function ctaLabel(
  tier: SubscriptionTier | null | undefined,
  status: SubscriptionStatus | null | undefined,
): string {
  if (tier == null) {
    return 'Get Started';
  }
  if (status === SubscriptionStatus.Suspended || status === SubscriptionStatus.Cancelled) {
    return 'Reactivate Subscription';
  }
  return 'Create Bot';
}

export function EmptyBotListState({ subscriptionTier, subscriptionStatus, onCreateBot }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.headline}>No bots yet</Text>
      <Text style={styles.subtext}>
        Build your first bot to start receiving trade proposals.
      </Text>
      <Pressable
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        onPress={onCreateBot}
      >
        <Text style={styles.ctaText}>{ctaLabel(subscriptionTier, subscriptionStatus)}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtext: {
    fontSize: 14,
    color: '#A0A7B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  cta: {
    marginTop: 8,
    backgroundColor: '#2C6BED',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  ctaPressed: {
    opacity: 0.8,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
