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
import { Reminder } from "@/types/types";

type AddReminderModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (reminder: Omit<Reminder, "id" | "createdAt">) => void;
};

const AddReminderModal: React.FC<AddReminderModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<Reminder["frequency"]>("yearly");
  const [days, setDays] = useState<string[]>([]);
  const [time, setTime] = useState("08:00");

  const handleSave = () => {
    const reminder: Omit<Reminder, "id" | "createdAt"> = {
      title,
      frequency,
      days,
      time,
    };
    onSave(reminder);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Reminder Title"
            value={title}
            onChangeText={setTitle}
          />
          <Picker<Reminder["frequency"]>
            selectedValue={frequency}
            onValueChange={(itemValue) => setFrequency(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Yearly" value="yearly" />
            <Picker.Item label="Monthly" value="monthly" />
            <Picker.Item label="Weekly" value="weekly" />
          </Picker>
          <Picker
            selectedValue={days}
            onValueChange={(itemValue) =>
              setDays(Array.isArray(itemValue) ? itemValue : [itemValue])
            }
            style={styles.picker}
            mode="dialog"
            multiple
          >
            <Picker.Item label="Monday" value="1" />
            <Picker.Item label="Tuesday" value="2" />
            <Picker.Item label="Wednesday" value="3" />
            <Picker.Item label="Thursday" value="4" />
            <Picker.Item label="Friday" value="5" />
            <Picker.Item label="Saturday" value="6" />
            <Picker.Item label="Sunday" value="0" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Time (24-hour format)"
            value={time}
            onChangeText={setTime}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    width: "90%",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  picker: {
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default AddReminderModal;
