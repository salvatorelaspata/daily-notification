import React, { useState } from "react";
import { View, FlatList, Text, StyleSheet, Image } from "react-native";
import { Agenda } from "react-native-calendars";
import { format } from "date-fns";
import { Notification } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { SafeAreaView } from "react-native-safe-area-context";
import { getTodayNotifications } from "@/db/read";
import { ThemedText } from "@/components/ThemedText";

const Today: React.FC = () => {
  const db = useSQLiteContext();
  const [reminders, setReminders] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    async function getReminders() {
      try {
        const result = await getTodayNotifications(db);
        if (result) setReminders(result as Notification[]);
      } catch (error) {
        console.error("Error while getting all Today", error);
      }
    }
    getReminders();
  }, []);

  const renderItem = ({ item }: { item: Notification }) => (
    <View style={styles.notificationItem}>
      <ThemedText>{item.id}</ThemedText>
      <ThemedText>{item.title}</ThemedText>
      <ThemedText>{item.description}</ThemedText>
      <ThemedText>{item.repeat_count}</ThemedText>
      <ThemedText>{item.interval_days}</ThemedText>
      <ThemedText>{item.days_of_week}</ThemedText>
      <ThemedText>{item.notification_time}</ThemedText>
      <ThemedText>{format(item.created_at, "yyyy-MM-dd HH:mm")}</ThemedText>
      <ThemedText>{item.is_notified}</ThemedText>
    </View>
  );
  const [items, setItems] = useState<any>({});

  const loadItems = (day: any) => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!items[strTime]) {
          items[strTime] = [];

          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: "Evento " + strTime + " #" + j,
              height: Math.max(50, Math.floor(Math.random() * 150)),
              day: strTime,
            });
          }
        }
      }

      const newItems: any = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
  };

  const renderAgendaItem = (item: any) => {
    return (
      <View style={styles.item}>
        <View>
          <Text>{item.name}</Text>
        </View>
      </View>
    );
  };

  const timeToString = (time: string) => {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item?.id?.toString() ?? ""}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.container}>
            <Text style={styles.emptyText}>
              No reminders have been added yet.
            </Text>
          </View>
        }
      />
      {/* Ricordi passati? */}
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        renderItem={renderAgendaItem}
        renderEmptyDate={() => <View />}
        rowHasChanged={(r1: any, r2: any) => r1.name !== r2.name}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
});

export default Today;
