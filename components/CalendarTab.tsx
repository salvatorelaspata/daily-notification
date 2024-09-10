import React from "react";
import { View, StyleSheet } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { RouteProp } from "@react-navigation/native";
import { Reminder } from "@/types/types";

type CalendarTabProps = {
  route: RouteProp<{ params: { reminders: Reminder[] } }, "params">;
};

type MarkedDates = {
  [date: string]: {
    dots: { color: string }[];
    selected: boolean;
    selectedColor: string;
  };
};

const CalendarTab: React.FC<CalendarTabProps> = ({ route }) => {
  const { reminders } = route.params;

  const markedDates: MarkedDates = reminders.reduce(
    (acc: MarkedDates, reminder) => {
      reminder.days.forEach((day) => {
        const date = new Date();
        date.setDate(date.getDate() + ((Number(day) - date.getDay() + 7) % 7));
        const dateString = date.toISOString().split("T")[0];
        acc[dateString] = {
          dots: [{ color: "#007bff" }],
          selected: true,
          selectedColor: "#007bff",
        };
      });
      return acc;
    },
    {}
  );

  return (
    <View style={styles.container}>
      <Calendar
        markingType={"multi-dot"}
        markedDates={markedDates}
        style={styles.calendar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  calendar: {
    borderWidth: 1,
    borderColor: "#e6e6e6",
    height: "100%",
  },
});

export default CalendarTab;
