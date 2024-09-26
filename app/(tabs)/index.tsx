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
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useSnapshot } from "valtio";
import { notificationActions, notificationState } from "@/store/notification";
import { ThemedCardText } from "@/components/ThemedCardText";

const Today: React.FC = () => {
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
      <ThemedCardText type="defaultSemiBold">{item.title}</ThemedCardText>
      <ThemedCardText type="default" style={{ textAlign: "right" }}>
        {format(item.scheduled_time, "dd-MM-yyyy HH:mm")}
      </ThemedCardText>
    </ThemedCard>
  );

  const renderTodayNotificationItem = ({ item }: { item: Union }) => (
    <ThemedCard>
      <ThemedCardText type="title">{item.title}</ThemedCardText>
      <ThemedCardText type="subtitle">
        {format(item.scheduled_time, "HH:mm")}
      </ThemedCardText>
    </ThemedCard>
  );
  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedText type="title">
        Today
        <HelloWave />
      </ThemedText>
      <ThemedText type="subtitle">
        {format(new Date(), "dd/MM/yyyy")}
      </ThemedText>

      <ThemedView style={{ flex: 1, marginTop: 20 }}>
        <ThemedText type="link">Today's Reminders </ThemedText>
        <FlatList
          data={todayNotifications}
          renderItem={renderTodayNotificationItem}
          keyExtractor={(item) => item?.id?.toString() || ""}
          style={{ flex: 1 }}
          ListEmptyComponent={
            <ThemedCard>
              <ThemedCardText type="title">
                <Ionicons name="add-circle" size={32} color="black" />
              </ThemedCardText>
              <ThemedCardText type="subtitle">No Reminders</ThemedCardText>
            </ThemedCard>
          }
        />
      </ThemedView>
      <ThemedView style={{ marginTop: 20 }}>
        <Link href={"/(tabs)/notifications" as Href<string>}>
          <ThemedText type="link">Recent Days {`>`}</ThemedText>
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
