import React from "react";
import { StyleSheet } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import { SafeAreaView } from "react-native-safe-area-context";

// import { Reminder } from "@/types/types";

// type MarkedDates = {
//   [date: string]: {
//     dots: { color: string }[];
//     selected: boolean;
//     selectedColor: string;
//   };
// };

const Calendar: React.FC = () => {
  // const markedDates: MarkedDates = reminders.reduce(
  //   (acc: MarkedDates, reminder) => {
  //     reminder.days.forEach((day) => {
  //       const date = new Date();
  //       date.setDate(date.getDate() + ((Number(day) - date.getDay() + 7) % 7));
  //       const dateString = date.toISOString().split("T")[0];
  //       acc[dateString] = {
  //         dots: [{ color: randomColor() }],
  //         selected: true,
  //         selectedColor: randomColor(),
  //       };
  //     });
  //     return acc;
  //   },
  //   {}
  // );
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
    <SafeAreaView style={styles.container}>
      <RNCalendar
        markingType={"multi-dot"}
        markedDates={markedDates()}
        style={styles.calendar}
      />
    </SafeAreaView>
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

export default Calendar;
