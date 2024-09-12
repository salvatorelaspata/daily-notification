import React from "react";
import { StyleSheet } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";

const Calendar: React.FC = () => {
  const randomColor = () =>
    "#" + ((Math.random() * 0xffffff) << 0).toString(16);

  // create fake markedDates
  const markedDates: () => MarkedDates = () => {
    let dates: MarkedDates = {};
    let date = new Date();
    let dateString = date.toISOString().split("T")[0];
    dates[dateString] = {
      dots: [{ color: randomColor() }],
      selected: true,
      selectedColor: randomColor(),
    };
    return dates;
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <RNCalendar
        markingType={"multi-dot"}
        markedDates={markedDates()}
        style={styles.calendar}
      />
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendar: {},
});

export default Calendar;
