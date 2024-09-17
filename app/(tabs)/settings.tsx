import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, StyleSheet } from "react-native";

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
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Settings() {
  // const [specificDate, setSpecificDate] = useState(new Date());
  const [specificStartTime, setSpecificStartTime] = useState(new Date());
  const [specificEndTime, setSpecificEndTime] = useState(new Date());

  // const datePickerText = useThemeColor({}, "datePickerText");

  const [version, setVersion] = useState("");
  const db = useSQLiteContext();

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
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <ThemedText>
        This app help yout to manage your reminders and notifications.
      </ThemedText>
      <Collapsible title="Technical info">
        <ThemedView>
          <ThemedText>
            SQLite version:
            <ThemedText type="defaultSemiBold">{version}</ThemedText>
          </ThemedText>
          <ExternalLink href="https://www.sqlite.org/index.html">
            <ThemedText type="link">Learn more</ThemedText>
          </ExternalLink>
        </ThemedView>
      </Collapsible>
      <Collapsible title="Time Limitations">
        <ThemedText>
          You can set a specific time for the notification to be sent between:
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
      <Collapsible title="Danger zone">
        <ThemedText>
          This section is for development purposes only. You can use it to
          delete all notifications and scheduled notifications from the database
        </ThemedText>
        <ThemedButton
          text="Delete all notifications"
          type="outline"
          onPress={async () => {
            Alert.alert("Delete all notifications", "Are you sure?", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                  await deleteAllTables(db);
                  Alert.alert("Notifications deleted");
                },
              },
            ]);
          }}
        />
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
