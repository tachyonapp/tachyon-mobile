import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export type DeployError =
  | { kind: "validation"; message: string; field?: string | null }
  | { kind: "network" }
  | { kind: "rate_limited" };

interface DeployProps {
  deploying: boolean;
  canDeploy: boolean;
  handleDeploy: () => void;
  deployError: DeployError | null;
}

export const Deploy = ({
  deploying,
  canDeploy,
  deployError,
  handleDeploy,
}: DeployProps) => {
  const theme = Colors[useColorScheme()];

  return (
    <View style={styles.deploySection}>
      <View
        style={[
          styles.complianceBox,
          {
            backgroundColor: theme.surface,
            borderLeftColor: theme.electricBlue,
          },
        ]}
      >
        <Text style={[styles.complianceText, { color: theme.textSecondary }]}>
          Your agent will propose trades, but every trade requires your approval
          before it executes.
        </Text>
      </View>

      {deployError?.kind === "validation" && (
        <View style={[styles.errorBox, { borderColor: theme.danger }]}>
          <Text style={[styles.errorBoxText, { color: theme.danger }]}>
            {deployError.message}
          </Text>
          {deployError.field && (
            <Text style={[styles.errorBoxHint, { color: theme.textSecondary }]}>
              {`Check the "${deployError.field}" field above.`}
            </Text>
          )}
        </View>
      )}
      {deployError?.kind === "network" && (
        <View style={[styles.errorBox, { borderColor: theme.danger }]}>
          <Text style={[styles.errorBoxText, { color: theme.danger }]}>
            Something went wrong — try again.
          </Text>
        </View>
      )}
      {deployError?.kind === "rate_limited" && (
        <View style={[styles.errorBox, { borderColor: theme.danger }]}>
          <Text style={[styles.errorBoxText, { color: theme.danger }]}>
            Too many attempts — please wait before trying again.
          </Text>
        </View>
      )}

      <Pressable
        onPress={handleDeploy}
        disabled={!canDeploy || deploying}
        style={[
          styles.deployBtn,
          { backgroundColor: theme.electricBlue },
          (!canDeploy || deploying) && styles.deployBtnDisabled,
        ]}
      >
        {deploying ? (
          <ActivityIndicator size="small" color={theme.textPrimary} />
        ) : (
          <Text style={[styles.deployBtnLabel, { color: theme.textPrimary }]}>
            Deploy Agent
          </Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  deploySection: { gap: 16 },
  complianceBox: {
    borderRadius: 8,
    padding: 14,
    borderLeftWidth: 3,
  },
  complianceText: { fontSize: 13, lineHeight: 20 },
  errorBox: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    backgroundColor: "rgba(214, 69, 69, 0.08)",
    gap: 4,
  },
  errorBoxText: { fontSize: 13, fontWeight: "600" },
  errorBoxHint: { fontSize: 12 },
  deployBtn: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  deployBtnDisabled: { opacity: 0.35 },
  deployBtnLabel: { fontSize: 17, fontWeight: "700" },
});
