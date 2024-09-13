import React from "react";
import { View, FlatList, Text, StyleSheet, Image } from "react-native";

import { format } from "date-fns";
import type { Union } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { getAllNotifications } from "@/db/read";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { useIsFocused } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";

const Notifications: React.FC = () => {
  const isFocused = useIsFocused();
  const db = useSQLiteContext();
  const [reminders, setReminders] = React.useState<Union[]>([]);

  React.useEffect(() => {
    async function getReminders() {
      try {
        const result = await getAllNotifications(db);
        if (result) setReminders(result as Union[]);
      } catch (error) {
        console.error("Error while getting all notifications", error);
      }
    }
    if (isFocused) getReminders();
  }, [isFocused]);

  const renderItem = ({ item }: { item: Union }) => (
    <View style={styles.notificationItem}>
      <ThemedText>title: {item.title}</ThemedText>
      <ThemedText>description: {item.description}</ThemedText>
      <ThemedText>repeat_count: {item.repeat_count}</ThemedText>
      <ThemedText>mode: {item.mode === "0" ? "Random" : "Specific"}</ThemedText>
      <ThemedText>date: {item.date}</ThemedText>
      <ThemedText>time: {item.time}</ThemedText>
      <ThemedText>month_preference: {item.month_preference}</ThemedText>
      <ThemedText>months: {item.months}</ThemedText>
      <ThemedText>day_preference: {item.day_preference}</ThemedText>
      <ThemedText>days_of_week: {item.days_of_week}</ThemedText>
      <ThemedText>time_preference: {item.time_preference}</ThemedText>
      <ThemedText>start_time: {format(item.start_time, "HH:mm")}</ThemedText>
      <ThemedText>end_time: {format(item.end_time, "HH:mm")}</ThemedText>
      <ThemedText>
        created_at: {format(item.created_at, "dd-MM-yyyy HH:mm")}
      </ThemedText>
      <ThemedText>
        scheduled_date: {format(item.scheduled_date, "dd-MM-yyyy")}
      </ThemedText>
      <ThemedText>
        scheduled_time: {format(item.scheduled_time, "HH:mm")}
      </ThemedText>
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
});

export default Notifications;
