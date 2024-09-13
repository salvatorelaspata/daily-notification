import React, { useEffect } from "react";
import { StyleSheet, FlatList } from "react-native";
import { format } from "date-fns";
import { Union } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { getTodayNotifications } from "@/db/read";
import { ThemedText } from "@/components/ThemedText";
import FloatingActionButton, {
  FloatingAction,
} from "@/components/FloatingActionButton";
import { Href, useRouter } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { HelloWave } from "@/components/HelloWave";
import { ThemedCard } from "@/components/ThemedCard";

const Today: React.FC = () => {
  const db = useSQLiteContext();
  const [notification, setNotification] = React.useState<Union[]>([]);
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
        setNotification(result);
      } catch (error) {
        setNotification([]);
      }
    }
    getReminders();
  }, []);

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

      <FlatList
        data={notification}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id?.toString() || ""}
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
});

export default Today;
