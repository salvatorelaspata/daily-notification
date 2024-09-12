import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomTextInput from "@/components/TextInput";
import CustomSlider from "@/components/Slider";
import { Ionicons } from "@expo/vector-icons";
import CustomCheckBox from "@/components/Checkbox";
import CustomButton from "@/components/Button";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateReminderView() {
  const [title, setTitle] = useState("");
  const [repetitions, setRepetitions] = useState(1);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [workingDays, setWorkingDays] = useState(false);
  const [weekends, setWeekends] = useState(false);
  const [timePreference, setTimePreference] = useState("any");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const months = [
    "Gen",
    "Feb",
    "Mar",
    "Apr",
    "Mag",
    "Giu",
    "Lug",
    "Ago",
    "Set",
    "Ott",
    "Nov",
    "Dic",
  ];
  const days = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  const toggleMonth = (index: number) => {
    setSelectedMonths((prev) =>
      prev.includes(index) ? prev.filter((m) => m !== index) : [...prev, index]
    );
  };

  const toggleDay = (index: number) => {
    setSelectedDays((prev) =>
      prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index]
    );
  };

  const handleCreate = () => {
    console.log({
      title,
      repetitions,
      selectedMonths,
      selectedDays,
      workingDays,
      weekends,
      timePreference,
      startTime,
      endTime,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Crea Nuovo Ricordo</Text>
        <CustomTextInput
          placeholder="Titolo del ricordo"
          value={title}
          onChangeText={setTitle}
        />
        <CustomSlider
          value={repetitions}
          onValueChange={(value) => setRepetitions(Math.round(value))}
          minimumValue={1}
          maximumValue={12}
          step={1}
          label="Numero di ripetizioni all'anno"
        />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="calendar" size={20} color="#000" />
          <Text style={styles.cardTitle}>Preferenze Temporali</Text>
        </View>
        <Text style={styles.label}>Mesi</Text>
        <View style={styles.optionsContainer}>
          {months.map((month, index) => (
            <TouchableOpacity
              key={month}
              onPress={() => toggleMonth(index)}
              style={[
                styles.chip,
                selectedMonths.includes(index) && styles.chipSelected,
              ]}
            >
              <Text
                style={
                  selectedMonths.includes(index)
                    ? styles.chipTextSelected
                    : styles.chipText
                }
              >
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Giorni della settimana</Text>
        <View style={styles.optionsContainer}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={day}
              onPress={() => toggleDay(index)}
              style={[
                styles.chip,
                selectedDays.includes(index) && styles.chipSelected,
              ]}
            >
              <Text
                style={
                  selectedDays.includes(index)
                    ? styles.chipTextSelected
                    : styles.chipText
                }
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <CustomCheckBox
          label="Giorni lavorativi"
          checked={workingDays}
          onPress={() => setWorkingDays(!workingDays)}
        />
        <CustomCheckBox
          label="Fine settimana"
          checked={weekends}
          onPress={() => setWeekends(!weekends)}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="time" size={20} color="#000" />
          <Text style={styles.cardTitle}>Preferenze Orario</Text>
        </View>
        <CustomButton
          title="Qualsiasi ora"
          onPress={() => setTimePreference("any")}
          selected={timePreference === "any"}
        />
        <CustomButton
          title="Fascia oraria specifica"
          onPress={() => setTimePreference("specific")}
          selected={timePreference === "specific"}
        />
        {timePreference === "specific" && (
          <View style={styles.timePickerContainer}>
            <Text style={styles.label}>Dalle:</Text>
            <DateTimePicker
              value={startTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedTime) =>
                setStartTime(selectedTime || startTime)
              }
            />
            <Text style={styles.label}>Alle:</Text>
            <DateTimePicker
              value={endTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedTime) =>
                setEndTime(selectedTime || endTime)
              }
            />
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.randomNote}>
          Il ricordo verrà programmato in un giorno casuale in base alle
          preferenze selezionate.
        </Text>
        <CustomButton
          title="Crea Ricordo"
          onPress={handleCreate}
          style={styles.createButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    marginTop: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  chip: {
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  chipSelected: {
    backgroundColor: "#007AFF",
  },
  chipText: {
    color: "#000000",
  },
  chipTextSelected: {
    color: "#ffffff",
  },
  timePickerContainer: {
    marginTop: 16,
  },
  randomNote: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 14,
    color: "#666",
  },
  createButton: {
    backgroundColor: "#007AFF",
  },
});
