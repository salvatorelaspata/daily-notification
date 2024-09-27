import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedAgenda } from "@/components/ThemedAgenda";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { AgendaEntry, AgendaSchedule } from "react-native-calendars";
import { TouchableOpacity } from "react-native-gesture-handler";
import { format } from "date-fns";

const Calendar: React.FC = () => {
  const [items, setItems] = React.useState<AgendaSchedule>({});

  const renderDay = (day: Date) => {
    if (day) {
      return <Text style={styles.customDay}>{day.getDay()}</Text>;
    }
    return <View style={styles.dayItem} />;
  };

  const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    const fontSize = isFirst ? 16 : 14;
    const color = isFirst ? "black" : "#43515c";
    return (
      <TouchableOpacity
        key={reservation.name}
        style={[styles.item, { height: reservation.height }]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <Text style={{ fontSize, color }}>{reservation.name}</Text>
      </TouchableOpacity>
    );
  };

  const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    return r1.name !== r2.name;
  };

  const loadItems = (day: DateData) => {
    const timeToString = (time: number) => {
      const date = new Date(time);
      return date.toISOString().split("T")[0];
    };
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!items[strTime]) {
          items[strTime] = [];

          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: "Item for " + strTime + " #" + j,
              height: Math.max(50, Math.floor(Math.random() * 150)),
              day: strTime,
            });
          }
        }
      }

      const newItems: AgendaSchedule = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedAgenda
        renderDay={renderDay}
        renderItem={renderItem}
        renderEmptyData={() => (
          <ThemedView style={styles.container}>
            <ThemedText>Nothing to see here!</ThemedText>
          </ThemedView>
        )}
        items={items}
        showClosingKnob={true}
        selected={format(new Date(), "yyyy-MM-dd")}
        rowHasChanged={rowHasChanged}
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
  customDay: {
    margin: 10,
    fontSize: 24,
    color: "green",
  },
  dayItem: {
    marginLeft: 34,
  },
});

export default Calendar;
