import { WizardProvider } from "@/context/WizardContext";
import { Stack } from "expo-router";

export default function BotForgeLayout() {
  return (
    <WizardProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </WizardProvider>
  );
}
