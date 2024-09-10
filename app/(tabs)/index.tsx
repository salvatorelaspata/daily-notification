// App.tsx
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { format } from "date-fns";
import * as Notifications from "expo-notifications";
import * as SQLite from "expo-sqlite";
import { Reminder } from "@/types/types";
import NotificationsTab from "@/components/NotificationsTab";
import AllNotificationsTab from "@/components/AllNotificationsTab";
import CalendarTab from "@/components/CalendarTab";

import { Ionicons } from "@expo/vector-icons";

type RootTabParamList = {
  Notifications: { reminders: Reminder[] };
  "All Notifications": { reminders: Reminder[] };
  Calendar: { reminders: Reminder[] };
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const App: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isAddReminderModalVisible, setIsAddReminderModalVisible] =
    useState(false);
  const db = SQLite.useSQLiteContext();
  useEffect(() => {
    // Initialize the database and load reminders
    (async () => {
      try {
        console.log({ db, connected: db.options });
        const sqlCreateTable =
          "CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, frequency TEXT, days TEXT, time TEXT, createdAt TEXT);";

        const sqlSelectReminders = "SELECT * FROM reminders;";

        const createDb = await db.execAsync(sqlCreateTable);
        const selectReminders = await db.execAsync(sqlSelectReminders);
        console.log({
          createDb,
          selectReminders,
        });
      } catch (error) {
        console.log({ error });
      }
      // Request notification permissions
      Notifications.requestPermissionsAsync();
    })();
  }, []);

  const addReminder = async (reminder: Omit<Reminder, "id" | "createdAt">) => {
    const createdAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    const insertReminderStatement = await db.prepareAsync(
      "INSERT INTO reminders (title, frequency, days, time, createdAt) VALUES (title, frequency, days, time, createdAt)"
    );
    const newReminder = {
      $title: reminder.title,
      $frequency: reminder.frequency,
      $days: reminder.days.join(","),
      $time: reminder.time,
      $createdAt: createdAt,
    };
    try {
      let result = await insertReminderStatement.executeAsync(newReminder);

      // setReminders([...reminders, newReminder]);
      // scheduleNotification(newReminder);
      // setIsAddReminderModalVisible(false);
      console.log({ result });
    } catch (error) {
      console.log({ error });
    } finally {
      await insertReminderStatement.finalizeAsync();
    }
  };

  const scheduleNotification = (reminder: Reminder) => {
    // Schedule a notification based on the reminder settings
    const triggerDate = new Date();
    const daysOfWeek = reminder.days.map(Number);
    const [hours, minutes] = reminder.time.split(":").map(Number);

    triggerDate.setHours(hours, minutes, 0, 0);

    // Randomly schedule the notification within the selected parameters
    const randomDayOffset = Math.floor(Math.random() * daysOfWeek.length);
    triggerDate.setDate(
      triggerDate.getDate() +
        (daysOfWeek[
          (triggerDate.getDay() + randomDayOffset) % daysOfWeek.length
        ] -
          triggerDate.getDay())
    );

    Notifications.scheduleNotificationAsync({
      content: {
        title: reminder.title,
        body: "Time to remember!",
      },
      trigger: {
        seconds: Math.floor((triggerDate.getTime() - Date.now()) / 1000),
        repeats: true,
      },
    });
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Notifications") {
            iconName = "notifications";
          } else if (route.name === "All Notifications") {
            iconName = "list";
          } else if (route.name === "Calendar") {
            iconName = "calendar";
          }

          return (
            <Ionicons
              name={iconName as typeof Ionicons.defaultProps.name}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Notifications"
        component={NotificationsTab as React.ComponentType<any>}
        initialParams={{ reminders }}
      />
      <Tab.Screen
        name="All Notifications"
        component={AllNotificationsTab as React.ComponentType<any>}
        initialParams={{ reminders }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarTab as React.ComponentType<any>}
        initialParams={{ reminders }}
      />
    </Tab.Navigator>
  );
};

export default App;
