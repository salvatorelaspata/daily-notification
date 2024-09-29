import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

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
import ThemedTextInput from "@/components/ThemedTextInput";
import { router } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { useTranslation } from "react-i18next";
import { ThemedIcon } from "@/components/ThemedIcon";

import * as Device from "expo-device";
import { useNotifications } from "@/hooks/useNotifications";

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

  const { t } = useTranslation();

  const isTablet = Device.deviceType === Device.DeviceType.TABLET;

  const { schedulePushNotification } = useNotifications();

  useEffect(() => {
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
      const scheduled = await createReminder(db, {
        title,
        mode: mode.toString(),
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
      scheduled &&
        scheduled.forEach((s) => {
          schedulePushNotification({
            title: title,
            body: "🎉🎉🎉",
            date: new Date(s),
          });
        });

      Alert.alert(t("new.successTitle"), t("new.successMessage"));
      router.back();
    } catch (error) {
      Alert.alert(t("new.errorTitle"), t("new.errorMessage"));
    }
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {t("new.title")}
      </ThemedText>

      <ThemedScrollView style={styles.container}>
        <ThemedCard style={styles.card}>
          <ThemedSegmentedButton
            values={[t("new.random"), t("new.specific")]}
            selectedIndex={mode}
            onChange={(event) =>
              setMode(event.nativeEvent.selectedSegmentIndex)
            }
          />

          <ThemedTextInput
            style={{ marginTop: 16 }}
            placeholder={t("new.reminderTitle")}
            value={title}
            onChangeText={setTitle}
          />
        </ThemedCard>
        {mode === 0 ? (
          <>
            <ThemedCard style={styles.card}>
              <View style={styles.cardHeader}>
                <ThemedIcon icon="repeat" isCard />
                <ThemedText type="defaultSemiBold">
                  {t("new.repeating")}
                </ThemedText>
              </View>
              <View style={styles.container}>
                <ThemedText style={styles.label}>
                  {t("new.repeatingCount")}: {repetitions}
                </ThemedText>
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
                <ThemedIcon icon="calendar" isCard />
                <ThemedText type="defaultSemiBold">
                  {t("new.preferences")}
                </ThemedText>
              </View>
              <ThemedText style={styles.label}>{t("new.months")}</ThemedText>
              <ThemedButton
                isCard
                text={t("new.anyMonth")}
                onPress={() => setMonthPreference("any")}
                type={monthPreference === "any" ? "default" : "outline"}
              />
              <ThemedButton
                isCard
                text={t("new.specificMonths")}
                onPress={() => setMonthPreference("specific")}
                type={monthPreference === "specific" ? "default" : "outline"}
              />
              {monthPreference === "specific" && (
                <View style={styles.montsContainer}>
                  {months.map((month, index) => (
                    <ThemedChip
                      isCard={true}
                      key={month}
                      onPress={() => toggleMonth(index)}
                      text={t(`months.${isTablet ? "full" : "short"}.${month}`)}
                      selected={selectedMonths.includes(index)}
                      style={{ width: "20%" }}
                    />
                  ))}
                </View>
              )}
              <ThemedText style={styles.label}>
                {t("new.daysOfWeek")}
              </ThemedText>
              <ThemedButton
                isCard
                text={t("new.anyDay")}
                onPress={() => setDayPreference("any")}
                type={dayPreference === "any" ? "default" : "outline"}
              />
              <ThemedButton
                isCard
                text={t("new.specificDays")}
                onPress={() => setDayPreference("specific")}
                type={dayPreference === "specific" ? "default" : "outline"}
              />
              {dayPreference === "specific" && (
                <View>
                  <View style={styles.daysContainer}>
                    {days.map((day, index) => (
                      <ThemedChip
                        isCard={true}
                        key={day}
                        onPress={() => toggleDay(index)}
                        text={t(
                          `daysOfWeek.${isTablet ? "full" : "short"}.${day}`
                        )}
                        selected={selectedDays.includes(index)}
                        style={{ width: "20%" }}
                      />
                    ))}
                  </View>

                  <ThemedCheckbox
                    label={t("new.workingDays")}
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
                    label={t("new.weekends")}
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
              <ThemedText style={styles.label}>
                {t("new.reminderTime")}
              </ThemedText>
              <ThemedButton
                isCard
                text={t("new.anyTime")}
                onPress={() => setTimePreference("any")}
                type={timePreference === "any" ? "default" : "outline"}
              />
              <ThemedButton
                isCard
                text={t("new.specificTime")}
                onPress={() => setTimePreference("specific")}
                type={timePreference === "specific" ? "default" : "outline"}
              />
              {timePreference === "specific" && (
                <View>
                  <View style={styles.timePickerContainer}>
                    <ThemedText style={styles.label}>
                      {t("new.from")}:
                    </ThemedText>
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
                    <ThemedText style={styles.label}>{t("new.to")}:</ThemedText>
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
                        isCard={true}
                        key={moment}
                        text={t(
                          `moment.${isTablet ? "full" : "short"}.${moment}`
                        )}
                        onPress={() => {
                          setStartTime(
                            momentOfTheDay[
                              moment as keyof typeof momentOfTheDay
                            ].start
                          );
                          setEndTime(
                            momentOfTheDay[
                              moment as keyof typeof momentOfTheDay
                            ].end
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
            <ThemedText style={styles.label}>{t("new.date")}:</ThemedText>
            <DateTimePicker
              textColor={datePickerText}
              value={specificDate}
              mode="date"
              display="spinner"
              onChange={(_, selectedTime) => {
                setSpecificDate(selectedTime || specificDate);
              }}
            />
            <ThemedText style={styles.label}>{t("new.time")}:</ThemedText>
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
              {t("new.randomNote")}
            </ThemedText>
          )}
          <ThemedButton isCard text={t("new.save")} onPress={handleCreate} />
        </ThemedCard>
      </ThemedScrollView>
    </ThemedSafeAreaView>
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
