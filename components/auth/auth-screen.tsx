import TachyonLogo from "@/assets/images/logo.png";
import { RingWave } from "@/components/animated/ring-wave";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

interface AuthScreenProps {
  children: React.ReactNode;
}

export function AuthScreen({ children }: AuthScreenProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* <View style={styles.waveContainer} pointerEvents="none">
        <RingWave ringCount={4} color={theme.electricBlue} />
      </View> */}

      <View style={styles.logoContainer}>
        <Image source={TachyonLogo} style={styles.logo} resizeMode="contain" />
        <View style={styles.waveContainer} pointerEvents="none">
          <RingWave ringCount={4} color={theme.electricBlue} />
        </View>
      </View>

      {/* Keyboard-aware scroll content */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 0,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    marginBottom: 70,
  },
  waveContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
});
