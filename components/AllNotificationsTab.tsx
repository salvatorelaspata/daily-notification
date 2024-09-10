import React from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { format } from "date-fns";
import { Reminder } from "@/types/types";

type AllNotificationsTabProps = {
  route: RouteProp<{ params: { reminders: Reminder[] } }, "params">;
};

const AllNotificationsTab: React.FC<AllNotificationsTabProps> = ({ route }) => {
  const { reminders } = route.params;

  const renderItem = ({ item }: { item: Reminder }) => (
    <View style={styles.reminderItem}>
      <Text style={styles.reminderTitle}>{item.title}</Text>
      <Text style={styles.reminderFrequency}>{item.frequency}</Text>
      <Text style={styles.reminderTime}>{item.time}</Text>
      <Text style={styles.reminderCreatedAt}>
        Created: {format(new Date(item.createdAt), "MMM d, yyyy")}
      </Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No reminders have been added yet.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  reminderItem: {
    backgroundColor: "#f4f4f4",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reminderFrequency: {
    fontSize: 14,
    color: "#666",
  },
  reminderTime: {
    fontSize: 14,
    color: "#666",
  },
  reminderCreatedAt: {
    fontSize: 12,
    color: "#999",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  editButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 32,
  },
});

export default AllNotificationsTab;
