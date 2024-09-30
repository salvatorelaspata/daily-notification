import React, { Suspense, useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, Image } from "react-native";

import { format } from "date-fns";
import type { ScheduledNotification, Union } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { getAllNotifications } from "@/db/read";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { useIsFocused } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedChip } from "@/components/ThemedChip";
import { months } from "@/constants/Date";
import { useSnapshot } from "valtio";
import { notificationActions, notificationState } from "@/store/notification";
import { ThemedView } from "@/components/ThemedView";
import { ThemedCard } from "@/components/ThemedCard";

import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

const Notifications: React.FC = () => {
  const router = useRouter();
  const isFocused = useIsFocused();
  const db = useSQLiteContext();
  const { notifications } = useSnapshot(notificationState);
  const { setNotifications } = notificationActions;
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    async function getReminders() {
      setLoading(true);
      try {
        const result = await getAllNotifications(db);

        if (result) {
          setNotifications(result as Union[]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error while getting all notifications", error);
      }
    }
    if (isFocused) getReminders();
  }, [isFocused]);

  const renderItem = ({ item }: { item: any }) => (
    <ThemedCard>
      <ThemedText type="subtitle">{item.title}</ThemedText>
      <ThemedText>{item.body}</ThemedText>

      {item.mode === "1" ? (
        <>
          <ThemedText type="defaultSemiBold">
            {format(item.date, "dd-MM-yyyy")}
          </ThemedText>
          <ThemedText type="defaultSemiBold">
            {format(item.time, "dd-MM-yyyy HH:mm")}
          </ThemedText>
        </>
      ) : (
        <>
          {item.month_preference !== "any" && (
            <>
              <ThemedText>months: {item.months}</ThemedText>
              <View style={styles.montsContainer}>
                {item.months &&
                  item.months
                    .split(",")
                    .map((m: string) => (
                      <ThemedChip
                        isCard={true}
                        key={m}
                        text={months[parseInt(m)]}
                        disabled
                      />
                    ))}
              </View>
            </>
          )}
        </>
      )}
      <View>
        {/* <ThemedText>{t("notifications.scheduled")}:</ThemedText> */}
        {item.scheduled && (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {item.scheduled.map((s: ScheduledNotification) => (
              <ThemedView
                style={{ position: "relative", backgroundColor: "transparent" }}
                key={format(s.scheduled_date, "dd-MM-yyyy HH:mm:ss")}
              >
                <ThemedChip
                  text={format(s.scheduled_date, "dd-MM-yy")}
                  isCard
                  onPress={() => {
                    router.navigate("/notifications/detail");
                  }}
                />
                <ThemedChip
                  text={format(s.scheduled_date, "HH:mm")}
                  isCard
                  disabled
                  selected
                  style={{
                    position: "absolute",
                    padding: 1,
                    right: -5,
                    bottom: -10,
                  }}
                  styleText={{ fontSize: 12 }}
                />
              </ThemedView>
            ))}
          </View>
        )}
      </View>
    </ThemedCard>
  );

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedView
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <ThemedText type="title">{t("notifications.title")}</ThemedText>
        <ThemedChip
          text={
            notifications.length < 100
              ? notifications.length.toString()
              : ":)" || "0"
          }
          disabled
          style={{ width: 40 }}
        />
      </ThemedView>
      <Suspense fallback={<Text>{t("loading")}</Text>}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item?.id?.toString() ?? ""}
          renderItem={renderItem}
          ListEmptyComponent={
            <Image
              width={200}
              height={200}
              source={require("@/assets/images/no-record-found.png")}
              style={{ alignSelf: "center", width: 200, height: 200 }}
            />
          }
        />
      </Suspense>
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 32,
  },
  montsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 16,
  },
});

export default Notifications;
