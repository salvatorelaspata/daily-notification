import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { notificationActions, notificationState } from "@/store/notification";
import { useSnapshot } from "valtio";

const Add: React.FC = () => {
  const {
    modalCreateVisible,
    createNotification: {
      title,
      description,
      repeat_count: repeatCount,
      interval_days: intervalDays,
      days_of_week: daysOfWeek,
      notification_time: notificationTime,
    },
  } = useSnapshot(notificationState);
  const {
    setTitle,
    setDescription,
    setRepeatCount,
    setIntervalDays,
    setDaysOfWeek,
    setNotificationTime,
  } = notificationActions;

  const handleSave = () => {
    // save the notification
  };

  return (
    // <Modal visible={modalCreateVisible} animationType="slide" transparent>
    <SafeAreaView style={styles.modalContainer}>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Notification Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Notification Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Repeat Count"
          value={repeatCount.toString()}
          // keyboardType="number-pad"
          onChangeText={setRepeatCount}
        />
        <TextInput
          style={styles.input}
          placeholder="Interval Days"
          value={intervalDays.toString()}
          onChangeText={setIntervalDays}
        />
        <TextInput
          style={styles.input}
          placeholder="Days of Week"
          value={daysOfWeek}
          onChangeText={setDaysOfWeek}
        />
        <Picker
          selectedValue={notificationTime}
          onValueChange={(itemValue) => setNotificationTime(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Morning" value="morning" />
          <Picker.Item label="Afternoon" value="afternoon" />
          <Picker.Item label="Evening" value="evening" />
        </Picker>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Notification</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    // </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    width: "100%",
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
  },
});

export default Add;
