import { useAuth } from "@/auth/AuthProvider";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";

export default function HomeScreen() {
  const { logout } = useAuth();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image source={require("@/assets/images/partial-react-logo.png")} />
      }
    >
      <Pressable style={styles.button} onPress={() => logout()}>
        <Text>Logout</Text>
      </Pressable>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
});
