import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { days, momentOfTheDay, months } from "@/constants/Date";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedChip } from "@/components/ThemedChip";
import { ThemedCheckbox } from "@/components/ThemedCheckbox";
import { ThemedSlider } from "@/components/ThemedSlider";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedCard } from "@/components/ThemedCard";
import { ThemedSegmentedButton } from "@/components/ThemedSegmentedButton";
import { createReminder } from "@/db/insert";
import { useSQLiteContext } from "expo-sqlite";
import CustomTextInput from "@/components/TextInput";
import ThemedTextInput from "@/components/ThemedTextInput";
import { router } from "expo-router";

type anyOrSpecific = "any" | "specific";

export default function CreateReminderView() {
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<number>(0); // 0 = random, 1 = specific
  const [repetitions, setRepetitions] = useState<number>(1);
  const [specificDate, setSpecificDate] = useState<Date>(new Date());
  const [specificTime, setSpecificTime] = useState<Date>(new Date());
  const [monthPreference, setMonthPreference] = useState<anyOrSpecific>("any");
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [dayPreference, setDayPreference] = useState<anyOrSpecific>("any");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [workingDays, setWorkingDays] = useState<boolean>(false);
  const [weekends, setWeekends] = useState<boolean>(false);
  const [timePreference, setTimePreference] = useState<anyOrSpecific>("any");
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const textColor = useThemeColor({}, "buttonText");
  const bgColor = useThemeColor({}, "buttonBg");

  const datePickerText = useThemeColor({}, "datePickerText");

  const db = useSQLiteContext();

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

  const handleCreate = async () => {
    try {
      await createReminder(db, {
        title,
        mode: mode === 0 ? "random" : "specific",
        date: specificDate.toISOString(),
        time: specificTime.toISOString(),
        repeat_count: repetitions,
        month_preference: monthPreference,
        months: selectedMonths.join(","),
        day_preference: dayPreference,
        days_of_week: selectedDays.join(","),
        time_preference: timePreference,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
      });
      Alert.alert("Successo", "Ricordo creato con successo");
      router.back();
    } catch (error) {
      Alert.alert("Errore", (error as Error).message);
    }
  };

  return (
    <ThemedScrollView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Nuovo Ricordo
      </ThemedText>
      <ThemedCard style={styles.card}>
        <ThemedSegmentedButton
          values={["Random", "Specific"]}
          selectedIndex={mode}
          onChange={(event) => setMode(event.nativeEvent.selectedSegmentIndex)}
        />

        <ThemedTextInput
          style={{ marginTop: 16 }}
          placeholder="Titolo del ricordo"
          value={title}
          onChangeText={setTitle}
        />
      </ThemedCard>
      {mode === 0 ? (
        <>
          <ThemedCard style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons
                style={{ marginRight: 8 }}
                name="paper-plane"
                size={30}
                color="#000"
              />
              <Text>Generali</Text>
            </View>
            <View style={styles.container}>
              <Text style={styles.label}>
                Numero di ripetizioni all'anno: {repetitions}
              </Text>
              <ThemedSlider
                value={repetitions}
                onValueChange={(value) => setRepetitions(Math.round(value))}
                minimumValue={1}
                maximumValue={12}
                step={1}
              />
            </View>
          </ThemedCard>

          <ThemedCard style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons
                style={{ marginRight: 8 }}
                name="calendar"
                size={30}
                color="#000"
              />
              <Text>Preferenze</Text>
            </View>
            <Text style={styles.label}>Mesi</Text>
            <ThemedButton
              text="Qualsiasi mese"
              onPress={() => setMonthPreference("any")}
              type={monthPreference === "any" ? "default" : "outline"}
            />
            <ThemedButton
              text="Mesi specifici"
              onPress={() => setMonthPreference("specific")}
              type={monthPreference === "specific" ? "default" : "outline"}
            />
            {monthPreference === "specific" && (
              <View style={styles.montsContainer}>
                {months.map((month, index) => (
                  <ThemedChip
                    key={month}
                    onPress={() => toggleMonth(index)}
                    text={month}
                    selected={selectedMonths.includes(index)}
                    style={{ width: "20%" }}
                  />
                ))}
              </View>
            )}
            <Text style={styles.label}>Giorni della settimana</Text>
            <ThemedButton
              text="Qualsiasi giorno"
              onPress={() => setDayPreference("any")}
              type={dayPreference === "any" ? "default" : "outline"}
            />
            <ThemedButton
              text="Giorni specifici"
              onPress={() => setDayPreference("specific")}
              type={dayPreference === "specific" ? "default" : "outline"}
            />
            {dayPreference === "specific" && (
              <View>
                <View style={styles.daysContainer}>
                  {days.map((day, index) => (
                    <ThemedChip
                      key={day}
                      onPress={() => toggleDay(index)}
                      text={day}
                      selected={selectedDays.includes(index)}
                      style={{ width: "20%" }}
                    />
                  ))}
                </View>

                <ThemedCheckbox
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
                <ThemedCheckbox
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
            <ThemedButton
              text="Qualsiasi ora"
              onPress={() => setTimePreference("any")}
              type={timePreference === "any" ? "default" : "outline"}
            />
            <ThemedButton
              text="Fascia oraria specifica"
              onPress={() => setTimePreference("specific")}
              type={timePreference === "specific" ? "default" : "outline"}
            />
            {timePreference === "specific" && (
              <View>
                <View style={styles.timePickerContainer}>
                  <Text style={styles.label}>Dalle:</Text>
                  <DateTimePicker
                    textColor={textColor}
                    accentColor={bgColor}
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
                    textColor={textColor}
                    accentColor={bgColor}
                    value={endTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedTime) =>
                      setEndTime(selectedTime || endTime)
                    }
                  />
                </View>
                <View style={styles.momentContainer}>
                  {Object.keys(momentOfTheDay).map((moment) => (
                    <ThemedChip
                      key={moment}
                      text={moment}
                      onPress={() => {
                        setStartTime(
                          momentOfTheDay[moment as keyof typeof momentOfTheDay]
                            .start
                        );
                        setEndTime(
                          momentOfTheDay[moment as keyof typeof momentOfTheDay]
                            .end
                        );
                      }}
                      selected={
                        startTime.getHours() ===
                          momentOfTheDay[
                            moment as keyof typeof momentOfTheDay
                          ].start.getHours() &&
                        endTime.getHours() ===
                          momentOfTheDay[
                            moment as keyof typeof momentOfTheDay
                          ].end.getHours()
                      }
                    />
                  ))}
                </View>
              </View>
            )}
          </ThemedCard>
        </>
      ) : (
        <ThemedCard style={styles.card}>
          <Text style={styles.label}>Data:</Text>
          <DateTimePicker
            textColor={datePickerText}
            value={specificDate}
            mode="date"
            display="spinner"
            onChange={(_, selectedTime) => {
              setSpecificDate(selectedTime || specificDate);
            }}
          />
          <Text style={styles.label}>Ora:</Text>
          <DateTimePicker
            textColor={datePickerText}
            value={specificTime}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={(_, selectedTime) => {
              setSpecificTime(selectedTime || specificTime);
            }}
          />
        </ThemedCard>
      )}
      <ThemedCard style={styles.card}>
        {mode === 0 && (
          <ThemedText style={styles.randomNote}>
            Il ricordo verrà programmato in un giorno casuale in base alle
            preferenze selezionate.
          </ThemedText>
        )}
        <ThemedButton text="Crea Ricordo" onPress={handleCreate} />
      </ThemedCard>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginVertical: 16,
  },
  card: {
    marginHorizontal: 16,
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
  montsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  momentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
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
});
