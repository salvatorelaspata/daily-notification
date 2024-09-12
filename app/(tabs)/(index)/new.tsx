import React, { useEffect, useState } from "react";
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
import { ThemedText } from "@/components/ThemedText";
import { days, months } from "@/constants/Date";

type anyOrSpecific = "any" | "specific";

export default function CreateReminderView() {
  const [title, setTitle] = useState("");
  const [repetitions, setRepetitions] = useState<number>(1);
  const [monthPreference, setMonthPreference] = useState<anyOrSpecific>("any");
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [dayPreference, setDayPreference] = useState<anyOrSpecific>("any");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [workingDays, setWorkingDays] = useState<boolean>(false);
  const [weekends, setWeekends] = useState<boolean>(false);
  const [timePreference, setTimePreference] = useState<anyOrSpecific>("any");
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());

  useEffect(() => {
    // preselect months, days and time
    setMonthPreference("any");
    setSelectedMonths([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    setDayPreference("any");
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    setWorkingDays(true);
    setWeekends(true);
    setTimePreference("any");
    setStartTime(new Date(0, 0, 0, 0, 0, 0));
    setEndTime(new Date(0, 0, 0, 23, 59, 59));
  }, []);

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
      monthPreference,
      selectedMonths,
      dayPreference,
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
      <ThemedText type="title" style={styles.title}>
        Nuovo Ricordo
      </ThemedText>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="pencil" size={20} color="#000" />
          <ThemedText type="subtitle">Generali</ThemedText>
        </View>
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
          <ThemedText type="subtitle">Preferenze</ThemedText>
        </View>
        <Text style={styles.label}>Mesi</Text>
        <CustomButton
          title="Qualsiasi mese"
          onPress={() => setMonthPreference("any")}
          selected={monthPreference === "any"}
        />
        <CustomButton
          title="Mesi specifici"
          onPress={() => setMonthPreference("specific")}
          selected={monthPreference === "specific"}
        />
        {monthPreference === "specific" && (
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
        )}
        <Text style={styles.label}>Giorni della settimana</Text>
        <CustomButton
          title="Qualsiasi giorno"
          onPress={() => setDayPreference("any")}
          selected={dayPreference === "any"}
        />
        <CustomButton
          title="Giorni specifici"
          onPress={() => setDayPreference("specific")}
          selected={dayPreference === "specific"}
        />
        {dayPreference === "specific" && (
          <View>
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
              onPress={() => {
                const current = !workingDays;
                for (let i = 0; i < 5; i++) {
                  if (current && !selectedDays.includes(i)) toggleDay(i); // select
                  if (!current && selectedDays.includes(i)) toggleDay(i); // remove
                }
                setWorkingDays(current);
              }}
            />
            <CustomCheckBox
              label="Fine settimana"
              checked={weekends}
              onPress={() => {
                const current = !weekends;

                for (let i = 5; i < 7; i++) {
                  if (current && !selectedDays.includes(i)) toggleDay(i); // select
                  if (!current && selectedDays.includes(i)) toggleDay(i); // remove
                }
                setWeekends(current);
              }}
            />
          </View>
        )}
        <Text style={styles.label}>Orario</Text>
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
          <View>
            <View style={styles.timePickerContainer}>
              <ThemedText style={styles.label}>Dalle:</ThemedText>
              <DateTimePicker
                value={startTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedTime) =>
                  setStartTime(selectedTime || startTime)
                }
              />
              <ThemedText style={styles.label}>Alle:</ThemedText>
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
            {/* mattina */}
            <View
              style={[
                styles.optionsContainer,
                { justifyContent: "space-between", marginTop: 16 },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  setStartTime(new Date(0, 0, 0, 6, 0, 0));
                  setEndTime(new Date(0, 0, 0, 12, 0, 0));
                }}
                style={[
                  styles.chip,
                  startTime.getHours() === 6 &&
                    endTime.getHours() === 12 &&
                    styles.chipSelected,
                ]}
              >
                <Text
                  style={
                    startTime.getHours() === 6 && endTime.getHours() === 12
                      ? styles.chipTextSelected
                      : styles.chipText
                  }
                >
                  Mattina
                </Text>
              </TouchableOpacity>
              {/* pomeriggio */}
              <TouchableOpacity
                onPress={() => {
                  setStartTime(new Date(0, 0, 0, 12, 0, 0));
                  setEndTime(new Date(0, 0, 0, 18, 0, 0));
                }}
                style={[
                  styles.chip,
                  startTime.getHours() === 12 &&
                    endTime.getHours() === 18 &&
                    styles.chipSelected,
                ]}
              >
                <Text
                  style={
                    startTime.getHours() === 12 && endTime.getHours() === 18
                      ? styles.chipTextSelected
                      : styles.chipText
                  }
                >
                  Pomeriggio
                </Text>
              </TouchableOpacity>
              {/* sera */}
              <TouchableOpacity
                onPress={() => {
                  setStartTime(new Date(0, 0, 0, 18, 0, 0));
                  setEndTime(new Date(0, 0, 0, 23, 59, 59));
                }}
                style={[
                  styles.chip,
                  startTime.getHours() === 18 &&
                    endTime.getHours() === 23 &&
                    styles.chipSelected,
                ]}
              >
                <Text
                  style={
                    startTime.getHours() === 18 && endTime.getHours() === 23
                      ? styles.chipTextSelected
                      : styles.chipText
                  }
                >
                  Sera
                </Text>
              </TouchableOpacity>
            </View>
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
  },
  title: {
    textAlign: "center",
    marginVertical: 16,
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
