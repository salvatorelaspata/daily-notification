import React, { useEffect } from "react";
import { StyleSheet, FlatList } from "react-native";
import { format } from "date-fns";
import { Union } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { getRecentNotifications, getTodayNotifications } from "@/db/read";
import { ThemedText } from "@/components/ThemedText";
import FloatingActionButton, {
  FloatingAction,
} from "@/components/FloatingActionButton";
import { Href, Link, useRouter } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { HelloWave } from "@/components/HelloWave";
import { ThemedCard } from "@/components/ThemedCard";
import { ThemedView } from "@/components/ThemedView";
import { useIsFocused } from "@react-navigation/native";
import { useSnapshot } from "valtio";
import { notificationActions, notificationState } from "@/store/notification";

import { useTranslation } from "react-i18next";

const Today: React.FC = () => {
  const { t } = useTranslation();

  const today = t("today.title");
  const todaysReminder = t("today.todaysReminder");
  const recentDays = t("today.recentDays");
  const noReminders = t("today.noReminders");
  const isFocused = useIsFocused();
  const db = useSQLiteContext();
  const { todayNotifications, recentNotifications } =
    useSnapshot(notificationState);
  const { setTodayNotifications, setRecentNotifications } = notificationActions;
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
  useEffect(() => {
    async function getReminders() {
      try {
        const result = await getTodayNotifications(db);
        const recent = await getRecentNotifications(db);
        setTodayNotifications(result);
        setRecentNotifications(recent);
      } catch (error) {
        setTodayNotifications([]);
      }
    }
    if (isFocused) getReminders();
  }, [isFocused]);

  const renderRecentDays = ({ item }: { item: any }) => (
    <ThemedCard
      key={item.id}
      style={{
        width: 150,
        height: 150,
        marginRight: 20,
        justifyContent: "space-between",
      }}
    >
      <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
      <ThemedText type="default" style={{ textAlign: "right" }}>
        {format(item.scheduled_date, "dd-MM-yyyy HH:mm")}
      </ThemedText>
    </ThemedCard>
  );

  const renderTodayNotificationItem = ({ item }: { item: Union }) => (
    <ThemedCard>
      <ThemedText type="title">{item.title}</ThemedText>
      <ThemedText type="subtitle">
        {format(item.scheduled_date, "HH:mm")}
      </ThemedText>
    </ThemedCard>
  );
  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedText type="title">
        {today}
        <HelloWave />
      </ThemedText>
      <ThemedText type="subtitle">
        {format(new Date(), "dd/MM/yyyy")}
      </ThemedText>

      <ThemedView style={{ flex: 1, marginTop: 20 }}>
        <ThemedText type="link">{todaysReminder}</ThemedText>
        <FlatList
          data={todayNotifications}
          renderItem={renderTodayNotificationItem}
          keyExtractor={(item) => item?.id?.toString() || ""}
          style={{ flex: 1 }}
          ListEmptyComponent={
            <ThemedCard>
              <ThemedText type="subtitle">{noReminders}</ThemedText>
            </ThemedCard>
          }
        />
      </ThemedView>
      <ThemedView style={{ marginTop: 20 }}>
        <Link href={"/(tabs)/notifications" as Href<string>}>
          <ThemedText type="link">
            {recentDays}
            {`>`}
          </ThemedText>
        </Link>
        <FlatList
          data={recentNotifications}
          renderItem={renderRecentDays}
          keyExtractor={(item) => item?.id?.toString() || ""}
          horizontal
        />
      </ThemedView>
      <FloatingActionButton actions={actions} />
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default Today;
