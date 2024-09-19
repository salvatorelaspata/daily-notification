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
import { Href, useRouter } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { HelloWave } from "@/components/HelloWave";
import { ThemedCard } from "@/components/ThemedCard";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";

const Today: React.FC = () => {
  const db = useSQLiteContext();
  const [notification, setNotification] = React.useState<Union[]>([]);
  const [recent, setRecent] = React.useState<Union[]>([]);
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
        setNotification(result);
        setRecent(recent);
      } catch (error) {
        setNotification([]);
      }
    }
    getReminders();
  }, []);

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
        {format(item.scheduled_time, "dd-MM-yyyy HH:mm")}
      </ThemedText>
    </ThemedCard>
  );

  const renderItem = ({ item }: { item: Union }) => (
    <ThemedCard>
      <ThemedText type="title">{item.title}</ThemedText>
      <ThemedText type="subtitle">
        {format(item.scheduled_time, "HH:mm")}
      </ThemedText>
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

      <ThemedView style={{ marginTop: 20 }}>
        <ThemedText type="link">Today's Reminders </ThemedText>
        <FlatList
          data={notification}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id?.toString() || ""}
          ListEmptyComponent={
            // create card like recent days with + icon to create a new reminder
            <ThemedCard
              style={{
                width: 150,
                height: 150,
                marginRight: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="add-circle" size={48} color="black" />
              <ThemedText> No Reminders </ThemedText>
            </ThemedCard>
          }
        />
      </ThemedView>

      <ThemedView style={{ marginTop: 20 }}>
        <ThemedText type="link">Recent Days {`>`}</ThemedText>
        <FlatList
          data={recent}
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
