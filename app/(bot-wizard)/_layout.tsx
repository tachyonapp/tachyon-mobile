import { WizardProvider } from "@/context/WizardContext";
import { Stack } from "expo-router";

// Wizard stack layout — no tab bar; back navigation enabled
export default function BotWizardLayout() {
  return (
    <WizardProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </WizardProvider>
  );
}
