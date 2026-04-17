import { Stack } from "expo-router";
import { WizardProvider } from "@/context/WizardContext";

// Wizard stack layout — no tab bar; back navigation enabled
export default function BotWizardLayout() {
  return (
    <WizardProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </WizardProvider>
  );
}
