const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) return "com.salvatorelaspata.dailynotification.dev";
  if (IS_PREVIEW) return "com.salvatorelaspata.dailynotification.preview";
  return "com.salvatorelaspata.dailynotification";
};

const getAppName = () => {
  if (IS_DEV) return "(Dev) Daily Notification";
  if (IS_PREVIEW) return "(Preview) Daily Notification";
  return "Daily Notification";
};

const getAssetPath = (path) => {
  if (IS_DEV) return `${path}-dev.png`;
  return `${path}.png`;
};
export default {
  name: getAppName(),
  slug: "daily-notification",
  version: "1.0.0",
  orientation: "portrait",
  icon: getAssetPath("./assets/images/icon"),
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: getAssetPath("./assets/images/splash"),
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    package: getUniqueIdentifier(),
    adaptiveIcon: {
      foregroundImage: getAssetPath("./assets/images/adaptive-icon"),
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
    [
      "react-native-fbsdk-next",
      {
        appID: "590774426934850",
        clientToken: "30dd25ec07b43f8aafd709bf4c109e9f",
        displayName: "dayly-notification",
        scheme: "fb590774426934850",
        advertiserIDCollectionEnabled: false,
        autoLogAppEventsEnabled: false,
        isAutoInitEnabled: true,
        iosUserTrackingPermission:
          "This identifier will be used to deliver personalized ads to you.",
      },
    ],
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
