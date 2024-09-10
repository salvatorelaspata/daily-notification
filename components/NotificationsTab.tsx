import React, { useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Reminder } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";

type NotificationsTabProps = {
  route: RouteProp<{ params: { reminders: Reminder[] } }, "params">;
};

const NotificationsTab: React.FC<NotificationsTabProps> = ({ route }) => {
  const db = useSQLiteContext();
  const [version, setVersion] = useState("");
  const [reminders, setReminders] = useState<Reminder[]>([]);
  useEffect(() => {
    async function setup() {
      const result = await db.getFirstAsync<{ "sqlite_version()": string }>(
        "SELECT sqlite_version()"
      );
      if (result) setVersion(result["sqlite_version()"]);
    }
    async function getReminders() {
      const result = await db.getAllAsync("SELECT * FROM todos;");
      // if (result) setReminders(result as Reminder[]);
      console.log({ result });
    }
    setup();
    getReminders();
  }, []);
  const getTodayReminders = (): Reminder[] => {
    const today = new Date();
    return reminders.filter((reminder) => {
      const reminderDays = reminder.days.map(Number);
      return reminderDays.includes(today.getDay());
    });
  };

  return (
    <View style={styles.container}>
      <Text style={{ textAlign: "center", marginBottom: 16 }}>
        SQLite version: {version}
      </Text>
      <FlatList
        data={getTodayReminders()}
        keyExtractor={(item) => item?.id?.toString() ?? ""}
        renderItem={({ item }) => (
          <View style={styles.reminderItem}>
            <Text style={styles.reminderTitle}>{item.title}</Text>
            <Text style={styles.reminderTime}>{item.time}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No reminders scheduled for today.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  reminderItem: {
    backgroundColor: "#f4f4f4",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reminderTime: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 32,
  },
});

export default NotificationsTab;
