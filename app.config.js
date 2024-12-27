const IS_DEV = process.env.APP_VARIANT === "development";
export default {
  name: IS_DEV ? "daily-notification (Dev)" : "daily-notification",
  slug: "daily-notification",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_DEV
      ? "com.salvatorelaspata.dailynotification.dev"
      : "com.salvatorelaspata.dailynotification",
  },
  android: {
    package: IS_DEV
      ? "com.salvatorelaspata.dailynotification.dev"
      : "com.salvatorelaspata.dailynotification",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-notifications",
    "expo-localization",
    "expo-font",
    "expo-contacts",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: "5ada0039-80ec-433f-981d-6e4948506e12",
    },
  },
};
