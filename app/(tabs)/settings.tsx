import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, StyleSheet, useColorScheme } from "react-native";

// import { Collapsible } from "@/components/Collapsible";
// import { ExternalLink } from "@/components/ExternalLink";
import DateTimePicker from "@react-native-community/datetimepicker";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import { ThemedButton } from "@/components/ThemedButton";
import { deleteAllTables } from "@/db/delete";
import { useNotifications } from "@/hooks/useNotifications";
import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemedChip } from "@/components/ThemedChip";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const { schedulePushNotification, expoPushToken, channels, notification } =
    useNotifications();

  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;

  const colorScheme = useColorScheme();
  const [specificStartTime, setSpecificStartTime] = useState(new Date());
  const [specificEndTime, setSpecificEndTime] = useState(new Date());

  const [version, setVersion] = useState("");
  const db = useSQLiteContext();

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("language");

      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
      }
    };
    loadLanguage();
  }, [i18n]);

  useEffect(() => {
    async function setup() {
      try {
        const result = await db.getFirstAsync<{ "sqlite_version()": string }>(
          "SELECT sqlite_version()"
        );
        if (result) setVersion(result["sqlite_version()"]);
      } catch (error) {
        console.error("Error while getting SQLite version", error);
      }
    }
    setup();
  }, []);

  const changeLanguage = async (lang: string) => {
    await AsyncStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t("settings.title")}</ThemedText>
      </ThemedView>
      <ThemedText>{t("settings.description")} </ThemedText>
      <Collapsible title={t("settings.technicalInfo.title")}>
        <ThemedView>
          <ThemedText>
            {t("settings.technicalInfo.sqliteVersion")}
            <ThemedText type="defaultSemiBold">{version}</ThemedText>
          </ThemedText>
          <ExternalLink href="https://www.sqlite.org/index.html">
            <ThemedText type="link">
              {t("settings.technicalInfo.learnMore")}
            </ThemedText>
          </ExternalLink>
        </ThemedView>
      </Collapsible>
      <Collapsible title={t("settings.generalSettings.title")}>
        <ThemedText>{t("settings.generalSettings.language")} </ThemedText>

        <ThemedView style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <ThemedChip
            text={t("settings.generalSettings.italian")}
            selected={currentLanguage === "it-IT"}
            onPress={() => {
              if (currentLanguage === "it-IT") return;
              changeLanguage("it-IT");
            }}
          />
          <ThemedChip
            text={t("settings.generalSettings.english")}
            selected={currentLanguage.startsWith("en-")}
            onPress={() => {
              if (currentLanguage.startsWith("en-")) return;
              changeLanguage("en-US");
            }}
          />
        </ThemedView>

        <ThemedText style={{ marginTop: 8 }}>
          {t("settings.generalSettings.theme")}
        </ThemedText>
        <ThemedView style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <ThemedChip
            text={t("settings.generalSettings.light")}
            selected={colorScheme === "light"}
            disabled
          />
          <ThemedChip
            text={t("settings.generalSettings.dark")}
            selected={colorScheme === "dark"}
            disabled
          />
        </ThemedView>
      </Collapsible>
      <Collapsible title={t("settings.timeLimit.title")}>
        <ThemedText>
          {t("settings.timeLimit.description")}
          <DateTimePicker
            // textColor={datePickerText}
            value={specificStartTime}
            mode="time"
            is24Hour={true}
            display="calendar"
            onChange={(_, selectedTime) => {
              setSpecificStartTime(selectedTime || specificStartTime);
            }}
          />
          <DateTimePicker
            // textColor={datePickerText}
            value={specificEndTime}
            mode="time"
            is24Hour={true}
            display="calendar"
            onChange={(_, selectedTime) => {
              setSpecificEndTime(selectedTime || specificEndTime);
            }}
          />
        </ThemedText>
      </Collapsible>
      <Collapsible title={t("settings.dangerZone.title")}>
        <ThemedText>{t("settings.dangerZone.description")}</ThemedText>
        <ThemedButton
          text={t("settings.dangerZone.deleteAll")}
          type="outline"
          onPress={async () => {
            Alert.alert(
              t("settings.dangerZone.deleteAll"),
              t("settings.dangerZone.areYouSure"),
              [
                {
                  text: t("settings.dangerZone.cancel"),
                  style: "cancel",
                },
                {
                  text: t("settings.dangerZone.delete"),
                  style: "destructive",
                  onPress: async () => {
                    await deleteAllTables(db);
                    Alert.alert(t("settings.dangerZone.success"));
                  },
                },
              ]
            );
          }}
        />
      </Collapsible>
      <Collapsible title="Notification">
        <ThemedText>Your expo push token: {expoPushToken}</ThemedText>
        <ThemedText>{`Channels: ${JSON.stringify(
          channels.map((c) => c.id),
          null,
          2
        )}`}</ThemedText>
        <ThemedView style={{ alignItems: "center", justifyContent: "center" }}>
          <ThemedText>
            Title: {notification && notification.request.content.title}{" "}
          </ThemedText>
          <ThemedText>
            Body: {notification && notification.request.content.body}
          </ThemedText>
          <ThemedText>
            Data:{" "}
            {notification && JSON.stringify(notification.request.content.data)}
          </ThemedText>
        </ThemedView>
        <ThemedButton
          text="Press to schedule a notification"
          onPress={async () => {
            await schedulePushNotification({
              date: new Date(Date.now() + 1000),
              title: "📬 Test 📬",
              body: "test notification 🧐",
              data: { data: "goes here" },
            });
          }}
        />
        <ThemedButton text="list notifications" onPress={async () => {}} />
      </Collapsible>
      <Collapsible title={t("settings.about.title")}>
        <ThemedView>
          <ThemedText>{t("settings.about.createdBy")}: </ThemedText>
          <ExternalLink
            href="https://salvatorelaspata.net"
            style={{ marginVertical: 8 }}
          >
            <ThemedIcon icon="home" />{" "}
            <ThemedText type="link">Salvatore La Spata</ThemedText>
          </ExternalLink>
        </ThemedView>

        <ExternalLink
          href="https://github.com/salvatorelaspata/daily-notification"
          style={{ marginVertical: 8 }}
        >
          <ThemedIcon icon="logo-github" />{" "}
          <ThemedText type="link">{t("settings.about.sourceCode")}</ThemedText>
        </ExternalLink>

        <ExternalLink
          href="https://github.com/salvatorelaspata/daily-notification/issues/new"
          style={{ marginVertical: 8 }}
        >
          <ThemedIcon icon="logo-github" />{" "}
          <ThemedText type="link">{t("settings.about.reportIssue")}</ThemedText>
        </ExternalLink>
      </Collapsible>
      {/* <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          and{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{" "}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the
          web version, press <ThemedText type="defaultSemiBold">w</ThemedText>{" "}
          in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the{" "}
          <ThemedText type="defaultSemiBold">@2x</ThemedText> and{" "}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to
          provide files for different screen densities
        </ThemedText>
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={{ alignSelf: "center" }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <ThemedText>
          Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText>{" "}
          to see how to load{" "}
          <ThemedText style={{ fontFamily: "SpaceMono" }}>
            custom fonts such as this one.
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{" "}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook
          lets you inspect what the user's current color scheme is, and so you
          can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{" "}
          <ThemedText type="defaultSemiBold">
            components/HelloWave.tsx
          </ThemedText>{" "}
          component uses the powerful{" "}
          <ThemedText type="defaultSemiBold">
            react-native-reanimated
          </ThemedText>{" "}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The{" "}
              <ThemedText type="defaultSemiBold">
                components/ParallaxScrollView.tsx
              </ThemedText>{" "}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible> */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
