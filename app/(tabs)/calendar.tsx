import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedAgenda } from "@/components/ThemedAgenda";
import { AgendaEntry, AgendaSchedule, DateData } from "react-native-calendars";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getScheduledNotificationByDate } from "@/db/read";
import { useSQLiteContext } from "expo-sqlite";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedChip } from "@/components/ThemedChip";

const Calendar: React.FC = () => {
  const db = useSQLiteContext();
  const [items, setItems] = React.useState<AgendaSchedule>({});

  const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    return (
      <TouchableOpacity
        key={reservation.name}
        style={[styles.item, { height: reservation.height }]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <ThemedChip disabled selected text={reservation.name} />
      </TouchableOpacity>
    );
  };

  const loadItems = (day: DateData) => {
    const timeToString = (time: number) => {
      const date = new Date(time);
      return date.toISOString().split("T")[0];
    };
    setTimeout(async () => {
      // get all notifications for the next 100 days
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!items[strTime]) {
          items[strTime] = [];
          const notifications = await getScheduledNotificationByDate(
            db,
            strTime
          );
          items[strTime] = notifications.map((_) => ({
            name: _.title,
            // height: Math.max(50, Math.floor(Math.random() * 150)),
            day: strTime,
          }));
        }
      }

      const newItems: AgendaSchedule = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
  };

  const agendaCalendarBackground = useThemeColor(
    {},
    "agendaCalendarBackground"
  );

  const agendaSelectedDayBackgroundColor = useThemeColor(
    {},
    "agendaSelectedDayBackgroundColor"
  );

  const agendaReservationsBackgroundColor = useThemeColor(
    {},
    "agendaReservationsBackgroundColor"
  );

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedAgenda
        theme={{
          // dayTextColor: "red",
          calendarBackground: agendaCalendarBackground,
          selectedDayBackgroundColor: agendaSelectedDayBackgroundColor,
          reservationsBackgroundColor: agendaReservationsBackgroundColor,
        }}
        renderItem={renderItem}
        items={items}
        loadItemsForMonth={loadItems}
      />
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
});

export default Calendar;
