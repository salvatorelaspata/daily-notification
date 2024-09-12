import React from "react";
import { View, FlatList, Text, StyleSheet, Image } from "react-native";

import { format } from "date-fns";
import { Notification } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { getAllNotifications } from "@/db/read";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";

const Notifications: React.FC = () => {
  const db = useSQLiteContext();
  const [reminders, setReminders] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    async function getReminders() {
      try {
        const result = await getAllNotifications(db);
        if (result) setReminders(result as Notification[]);
      } catch (error) {
        console.error("Error while getting all notifications", error);
      }
    }
    getReminders();
  }, []);

  const renderItem = ({ item }: { item: Notification }) => (
    <View style={styles.notificationItem}>
      <Text>{item.id}</Text>
      <Text>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>{item.repeat_count}</Text>
      {/* <Text>{item.interval_days}</Text> */}
      <Text>{item.days_of_week}</Text>
      {/* <Text>{item.notification_time}</Text> */}
      <Text>{format(item.created_at, "yyyy-MM-dd HH:mm")}</Text>
      <Text>{item.is_notified}</Text>
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
