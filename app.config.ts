import { ConfigContext, ExpoConfig } from "expo/config";

const ENV = {
  development: {
    apiUrl: "http://localhost:4000",
  },
  staging: {
    apiUrl: "https://staging-api.tachyon.app",
  },
  production: {
    apiUrl: "https://api.tachyon.app",
  },
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const environment = (process.env.APP_ENV ||
    "development") as keyof typeof ENV;
  const envConfig = ENV[environment] || ENV.development;

  return {
    ...config,
    name: "Tachyon",
    slug: "tachyon",
    version: "0.1.0",
    orientation: "portrait",
    scheme: "tachyon",
    extra: {
      apiUrl: envConfig.apiUrl,
      environment,
    },
    ios: {
      bundleIdentifier: "com.marczenn.tachyon",
      userInterfaceStyle: "automatic",
      infoPlist: {
        NSFaceIDUsageDescription:
          "Tachyon uses Face ID to protect your account.",
      },
    },
    android: {
      package: "com.marczenn.tachyon",
    },
    plugins: ["expo-secure-store", "expo-local-authentication"],
  };
};
