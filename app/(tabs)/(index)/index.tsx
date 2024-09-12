import React, { useState } from "react";
import { View, FlatList, Text, StyleSheet, Image } from "react-native";
import { Agenda } from "react-native-calendars";
import { format } from "date-fns";
import { Notification, ScheduledNotification, Union } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getScheduledNotificationByDate,
  getTodayNotifications,
} from "@/db/read";
import { ThemedText } from "@/components/ThemedText";
import FloatingActionButton, {
  FloatingAction,
} from "@/components/FloatingActionButton";
import { Href, useRouter } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { HelloWave } from "@/components/HelloWave";

const Today: React.FC = () => {
  const db = useSQLiteContext();
  const [notification, setNotification] = React.useState<Notification[]>([]);
  const router = useRouter();
  const actions: FloatingAction[] = [
    {
      icon: "add",
      text: "New Reminder",
      onPress: () => {
        router.navigate("/new" as Href);
      },
    },
  ];
  React.useEffect(() => {
    async function getReminders() {
      try {
        const result = await getTodayNotifications(db);
        if (result) setNotification(result as Notification[]);
      } catch (error) {
        console.error("Error while getting all Today", error);
      }
    }
    getReminders();
  }, []);

  const renderItem = ({ item }: { item: Union }) => (
    <View style={styles.notificationItem}>
      <ThemedText>{item.title}</ThemedText>
      <ThemedText>{item.description}</ThemedText>
      <ThemedText>{item.repeat_count}</ThemedText>
      <ThemedText>{item.month_preference}</ThemedText>
      <ThemedText>{item.months}</ThemedText>
      <ThemedText>{item.day_preference}</ThemedText>
      <ThemedText>{item.days_of_week}</ThemedText>
      <ThemedText>{item.time_preference}</ThemedText>
      <ThemedText>{format(item.start_time, "HH:mm")}</ThemedText>
      <ThemedText>{format(item.end_time, "HH:mm")}</ThemedText>
      <ThemedText>{format(item.created_at, "yyyy-MM-dd")}</ThemedText>
      <ThemedText>{item.is_notified}</ThemedText>
    </View>
  );
  const [items, setItems] = useState<any>({});

  interface Day {
    dateString: string;
    day: number;
    month: number;
    timestamp: number;
    year: number;
  }

  const loadItems = (day: Day) => {
    console.log("day", day);

    (async () => {
      try {
        const items: Union[] = await getScheduledNotificationByDate(
          db,
          day.dateString
        );
        setItems(
          items.map((item) => ({
            name: item.title,
            height: 50,
            day: item.scheduled_date,
          }))
        );
      } catch (error) {
        console.error("Error while getting items", error);
      }
    })();
    // setTimeout(() => {
    //   for (let i = -15; i < 85; i++) {
    //     const time = day.timestamp + i * 24 * 60 * 60 * 1000;
    //     const strTime = timeToString(time);
    //     if (!items[strTime]) {
    //       items[strTime] = [];
    //       const numItems = Math.floor(Math.random() * 3 + 1);
    //       for (let j = 0; j < numItems; j++) {
    //         items[strTime].push({
    //           name: "Evento " + strTime + " #" + j,
    //           height: Math.max(50, Math.floor(Math.random() * 150)),
    //           day: strTime,
    //         });
    //       }
    //     }
    //   }
    //   const newItems: any = {};
    //   Object.keys(items).forEach((key) => {
    //     newItems[key] = items[key];
    //   });
    //   setItems(newItems);
    // }, 1000);
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
  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedText type="title">
        Today
        <HelloWave />
      </ThemedText>
      <ThemedText type="subtitle">
        {format(new Date(), "dd/MM/yyyy")}
      </ThemedText>
      {/* Ricordi passati? */}
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        renderItem={renderItem}
        renderEmptyDate={() => <View />}
        rowHasChanged={(r1: any, r2: any) => r1.name !== r2.name}
      />
      <FloatingActionButton actions={actions} />
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  notificationItem: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  item: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
});

export default Today;
