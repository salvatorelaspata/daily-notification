import React, { Suspense, useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, Image } from "react-native";

import { format } from "date-fns";
import type { Union } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { getAllNotifications } from "@/db/read";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { useIsFocused } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { ThemedChip } from "@/components/ThemedChip";
import { months } from "@/constants/Date";
import { useSnapshot } from "valtio";
import { notificationActions, notificationState } from "@/store/notification";
import { ThemedView } from "@/components/ThemedView";
import { ThemedCard } from "@/components/ThemedCard";
import { ThemedCardText } from "@/components/ThemedCardText";
import { ThemedSegmentedButton } from "@/components/ThemedSegmentedButton";

const Notifications: React.FC = () => {
  const isFocused = useIsFocused();
  const db = useSQLiteContext();
  const { notifications } = useSnapshot(notificationState);
  const { setNotifications } = notificationActions;
  const [loading, setLoading] = useState(true);

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
      <ThemedCardText type="title">{item.title}</ThemedCardText>
      {/* <ThemedCardText>{item.description}</ThemedCardText> */}
      {/* <ThemedCardText>repeat_count: {item.repeat_count}</ThemedCardText> */}
      {/* <ThemedCardText>mode: {item.mode}</ThemedCardText> */}
      <ThemedSegmentedButton
        enabled={false}
        values={["Random", "Specific"]}
        selectedIndex={item.mode === "0" ? 0 : 1}
      />
      {item.mode === "1" ? (
        <>
          <ThemedCardText type="defaultSemiBold">
            {format(item.date, "dd-MM-yyyy")}
          </ThemedCardText>
          <ThemedCardText type="defaultSemiBold">
            {format(item.time, "dd-MM-yyyy HH:mm")}
          </ThemedCardText>
        </>
      ) : (
        <>
          {/* <ThemedCardText>month_preference: {item.month_preference}</ThemedCardText> */}
          {item.month_preference !== "any" && (
            <>
              <ThemedCardText>months: {item.months}</ThemedCardText>
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

          {/* <ThemedCardText>day_preference: {item.day_preference}</ThemedCardText>
          <ThemedCardText>days_of_week: {item.days_of_week}</ThemedCardText>
          <ThemedCardText>
            time_preference: {item.time_preference}
          </ThemedCardText>
          <ThemedCardText>
            start_time: {format(item.start_time, "HH:mm")}
          </ThemedCardText>
          <ThemedCardText>
            end_time: {format(item.end_time, "HH:mm")}
          </ThemedCardText> */}
        </>
      )}
      {/* <ThemedCardText>
        created_at: {format(item.created_at, "dd-MM-yyyy HH:mm")}
      </ThemedCardText> */}
      <View>
        <ThemedCardText>Scheduled:</ThemedCardText>
        {item.scheduled &&
          item.scheduled.map((s: any, index: number) => (
            <View key={`${s.scheduled_date}_${index}`}>
              <ThemedCardText>
                {index + 1}) {format(s.scheduled_date, "dd-MM-yyyy HH:mm")}
              </ThemedCardText>
            </View>
          ))}
      </View>
      {/* <ThemedCardText>is_notified: {item.is_notified}</ThemedCardText> */}
    </ThemedCard>
  );

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedView
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <ThemedText type="title">Notifications</ThemedText>
        <ThemedChip text={notifications.length.toString() || "0"} disabled />
      </ThemedView>
      <Suspense fallback={<Text>Loading...</Text>}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item?.id?.toString() ?? ""}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.container}>
              <Text style={styles.emptyText}>
                No reminders have been added yet.
              </Text>
              <Image
                source={require("@/assets/images/no-record-found.png")}
                style={{ alignSelf: "center" }}
              />
            </View>
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
