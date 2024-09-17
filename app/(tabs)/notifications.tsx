import React, { useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, Image } from "react-native";

import { format } from "date-fns";
import type { Union } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { getAllNotifications } from "@/db/read";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { useIsFocused } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { ThemedChip } from "@/components/ThemedChip";
import { months } from "@/constants/Date";

const Notifications: React.FC = () => {
  const isFocused = useIsFocused();
  const db = useSQLiteContext();
  const [reminders, setReminders] = useState<Union[]>([]);

  useEffect(() => {
    async function getReminders() {
      try {
        setReminders([]);
        const result = await getAllNotifications(db);
        if (result) setReminders(result as Union[]);
      } catch (error) {
        console.error("Error while getting all notifications", error);
      }
    }
    if (isFocused) getReminders();
  }, [isFocused]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.notificationItem}>
      <ThemedText>title: {item.title}</ThemedText>
      <ThemedText>description: {item.description}</ThemedText>
      <ThemedText>repeat_count: {item.repeat_count}</ThemedText>
      <ThemedText>mode: {item.mode}</ThemedText>
      <SegmentedControl
        enabled={false}
        values={["Random", "Specific"]}
        selectedIndex={item.mode === "0" ? 0 : 1}
      />
      {item.mode === "1" ? (
        <>
          <ThemedText>date: {format(item.date, "dd-MM-yyyy")}</ThemedText>
          <ThemedText>time: {format(item.time, "HH:mm")}</ThemedText>
        </>
      ) : (
        <>
          {/* <ThemedText>month_preference: {item.month_preference}</ThemedText> */}
          {item.month_preference !== "any" && (
            <>
              <ThemedText>months: {item.months}</ThemedText>
              <View style={styles.montsContainer}>
                {item.months &&
                  item.months
                    .split(",")
                    .map((m: string) => (
                      <ThemedChip key={m} text={months[parseInt(m)]} />
                    ))}
              </View>
            </>
          )}

          <ThemedText>day_preference: {item.day_preference}</ThemedText>
          <ThemedText>days_of_week: {item.days_of_week}</ThemedText>
          <ThemedText>time_preference: {item.time_preference}</ThemedText>
          <ThemedText>
            start_time: {format(item.start_time, "HH:mm")}
          </ThemedText>
          <ThemedText>end_time: {format(item.end_time, "HH:mm")}</ThemedText>
        </>
      )}
      <ThemedText>
        created_at: {format(item.created_at, "dd-MM-yyyy HH:mm")}
      </ThemedText>
      <View>
        <ThemedText>Scheduled:</ThemedText>
        {item.scheduled &&
          item.scheduled.map((s: any, index: number) => (
            <View key={`${s.scheduled_date}${s.scheduled_time}`}>
              <ThemedText>
                {index + 1}) {format(s.scheduled_date, "dd-MM-yyyy")} -{" "}
                {format(s.scheduled_time, "HH:mm")}
              </ThemedText>
            </View>
          ))}
      </View>
      <ThemedText>is_notified: {item.is_notified}</ThemedText>
    </View>
  );

  return (
    <ThemedSafeAreaView style={styles.container}>
      <FlatList
        data={reminders}
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
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  notificationItem: {
    backgroundColor: "#f4f4f4",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
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
