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
import { updateScheduledNotification } from "@/db/update";
import { deleteNotification } from "@/db/delete";
import { ThemedView } from "@/components/ThemedView";
import { useSnapshot } from "valtio";
import { reminderActions, reminderState } from "@/store/reminder";
import { useIsFocused } from "@react-navigation/native";
// import FloatingActionButton from "@/components/FloatingActionButton";

export default function CreateReminderView() {
  const [body, setBody] = useState<string>(""); // WA: super glitch for multiline text input
  const { reminder } = useSnapshot(reminderState);
  const { set, reset } = reminderActions;

  const textColor = useThemeColor({}, "buttonText");
  const bgColor = useThemeColor({}, "buttonBg");
  const datePickerText = useThemeColor({}, "datePickerText");

  const db = useSQLiteContext();

  const { t } = useTranslation();

  const isTablet = Device.deviceType === Device.DeviceType.TABLET;

  const { schedulePushNotification } = useNotifications();

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) reset();
  }, [isFocused]);

  const toggleMonth = (index: number) => {
    const current = reminder.selectedMonths.includes(index)
      ? reminder.selectedMonths.filter((m) => m !== index)
      : [...reminder.selectedMonths, index];
    set.selectedMonths(current);
  };

  const toggleDay = (index: number) => {
    const current = reminder.selectedDays.includes(index)
      ? reminder.selectedDays.filter((m) => m !== index)
      : [...reminder.selectedDays, index];
    set.selectedDays(current);
  };

  const handleCreate = async () => {
    try {
      const scheduled = await createReminder(db, {
        title: reminder.title,
        body: body,
        mode: reminder.mode.toString(),
        date: reminder.specificDate.toISOString(),
        time: reminder.specificTime.toISOString(),
        repeat_count: reminder.repetitions,
        month_preference: reminder.monthPreference,
        months: reminder.selectedMonths.join(","),
        day_preference: reminder.dayPreference,
        days_of_week: reminder.selectedDays.join(","),
        time_preference: reminder.timePreference,
        start_time: reminder.startTime.toISOString(),
        end_time: reminder.endTime.toISOString(),
      });
      if (!scheduled) return new Error(t("new.errorMessage"));
      for (const { id, date } of scheduled) {
        try {
          const mobile_id = await schedulePushNotification({
            title: reminder.title,
            body: reminder.body,
            date: new Date(date),
            data: { id },
          });

          await updateScheduledNotification(db, { id, mobile_id });
        } catch (error) {
          await deleteNotification(db, id);
          throw new Error(t("new.errorSchedule"));
        }
      }
      Alert.alert(t("new.successTitle"), t("new.successMessage"));
      if (!reminder.continue_) router.back();
      else reset();
    } catch (error: any) {
      Alert.alert(t("new.errorTitle"), error.message);
    }
  };

  return (
    // <ThemedSafeAreaView
    //   style={[styles.container, { backgroundColor: "green" }]}
    // >
    <ThemedScrollView
      style={[styles.container, { backgroundColor: "transparent" }]}
    >
      <ThemedCard style={styles.card}>
        <ThemedSegmentedButton
          values={[t("new.random"), t("new.specific")]}
          selectedIndex={reminder.mode}
          onChange={(event) => set.mode(event.nativeEvent.selectedSegmentIndex)}
        />
        {reminder.mode === 0 && (
          <ThemedText style={styles.randomNote}>
            {t("new.randomNote")}
          </ThemedText>
        )}

        <ThemedTextInput
          style={{ marginTop: 8 }}
          placeholder={t("new.reminderTitle")}
          value={reminder.title}
          onChangeText={set.title}
        />
        <ThemedTextInput
          multiline={true}
          numberOfLines={4}
          placeholder={t("new.reminderBody")}
          value={body}
          onChangeText={setBody}
          style={{
            height: 100,
            textAlignVertical: "top",
            alignItems: "flex-start",
          }}
        />
        <ThemedView
          style={{ flexDirection: "column", justifyContent: "flex-end" }}
        >
          <ThemedCheckbox
            label={t("new.continue")}
            checked={reminder.continue_}
            onPress={() => set.continue(!reminder.continue_)}
          />
          {/* <ThemedCheckbox label={t("new.important")} checked={true} /> */}
        </ThemedView>
      </ThemedCard>
      {reminder.mode === 0 ? (
        <>
          <ThemedCard style={styles.card}>
            <View style={styles.cardHeader}>
              <ThemedIcon icon="repeat" isCard style={{ marginRight: 8 }} />
              <ThemedText type="defaultSemiBold">
                {t("new.repeating")}
              </ThemedText>
            </View>
            <View style={styles.container}>
              <ThemedText type="defaultSemiBold">
                {t("new.repeatingCount")}: {reminder.repetitions}
              </ThemedText>
              <ThemedSlider
                value={reminder.repetitions}
                onValueChange={(value) => set.repetitions(Math.round(value))}
                minimumValue={1}
                maximumValue={12}
                step={1}
              />
            </View>
          </ThemedCard>

          <ThemedCard style={styles.card}>
            <View style={styles.cardHeader}>
              <ThemedIcon icon="calendar" isCard style={{ marginRight: 8 }} />
              <ThemedText type="defaultSemiBold">
                {t("new.preferences")}
              </ThemedText>
            </View>
            <ThemedText type="defaultSemiBold">{t("new.months")}</ThemedText>
            <ThemedButton
              isCard
              text={t("new.anyMonth")}
              onPress={() => set.monthPreference("any")}
              type={reminder.monthPreference === "any" ? "default" : "outline"}
            />
            <ThemedButton
              isCard
              text={t("new.specificMonths")}
              onPress={() => set.monthPreference("specific")}
              type={
                reminder.monthPreference === "specific" ? "default" : "outline"
              }
            />
            {reminder.monthPreference === "specific" && (
              <View style={styles.montsContainer}>
                {months.map((month, index) => (
                  <ThemedChip
                    isCard={true}
                    key={month}
                    onPress={() => toggleMonth(index)}
                    text={t(`months.${isTablet ? "full" : "short"}.${month}`)}
                    selected={reminder.selectedMonths.includes(index)}
                    style={{ width: "20%" }}
                  />
                ))}
              </View>
            )}
            <ThemedText type="defaultSemiBold">
              {t("new.daysOfWeek")}
            </ThemedText>
            <ThemedButton
              isCard
              text={t("new.anyDay")}
              onPress={() => set.dayPreference("any")}
              type={reminder.dayPreference === "any" ? "default" : "outline"}
            />
            <ThemedButton
              isCard
              text={t("new.specificDays")}
              onPress={() => set.dayPreference("specific")}
              type={
                reminder.dayPreference === "specific" ? "default" : "outline"
              }
            />
            {reminder.dayPreference === "specific" && (
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
                      selected={reminder.selectedDays.includes(index)}
                      style={{ width: "20%" }}
                    />
                  ))}
                </View>

                <ThemedCheckbox
                  label={t("new.workingDays")}
                  checked={reminder.workingDays}
                  onPress={() => {
                    const current = !reminder.workingDays;
                    for (let i = 0; i < 5; i++) {
                      if (current && !reminder.selectedDays.includes(i))
                        toggleDay(i); // select
                      if (!current && reminder.selectedDays.includes(i))
                        toggleDay(i); // remove
                    }
                    set.workingDays(current);
                  }}
                />
                <ThemedCheckbox
                  label={t("new.weekends")}
                  checked={reminder.weekends}
                  onPress={() => {
                    const current = !reminder.weekends;

                    for (let i = 5; i < 7; i++) {
                      if (current && !reminder.selectedDays.includes(i))
                        toggleDay(i); // select
                      if (!current && reminder.selectedDays.includes(i))
                        toggleDay(i); // remove
                    }
                    set.weekends(current);
                  }}
                />
              </View>
            )}
            <ThemedText type="defaultSemiBold">
              {t("new.reminderTime")}
            </ThemedText>
            <ThemedButton
              isCard
              text={t("new.anyTime")}
              onPress={() => set.timePreference("any")}
              type={reminder.timePreference === "any" ? "default" : "outline"}
            />
            <ThemedButton
              isCard
              text={t("new.specificTime")}
              onPress={() => set.timePreference("specific")}
              type={
                reminder.timePreference === "specific" ? "default" : "outline"
              }
            />
            {reminder.timePreference === "specific" && (
              <View>
                <View style={styles.timePickerContainer}>
                  <ThemedText type="defaultSemiBold">
                    {t("new.from")}:
                  </ThemedText>
                  <DateTimePicker
                    textColor={textColor}
                    accentColor={bgColor}
                    value={reminder.startTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedTime) =>
                      set.startTime(selectedTime || reminder.startTime)
                    }
                  />
                  <ThemedText type="defaultSemiBold">{t("new.to")}:</ThemedText>
                  <DateTimePicker
                    textColor={textColor}
                    accentColor={bgColor}
                    value={reminder.endTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedTime) =>
                      set.endTime(selectedTime || reminder.endTime)
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
                        set.startTime(
                          momentOfTheDay[moment as keyof typeof momentOfTheDay]
                            .start
                        );
                        set.endTime(
                          momentOfTheDay[moment as keyof typeof momentOfTheDay]
                            .end
                        );
                      }}
                      selected={
                        reminder.startTime.getHours() ===
                          momentOfTheDay[
                            moment as keyof typeof momentOfTheDay
                          ].start.getHours() &&
                        reminder.endTime.getHours() ===
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
          <ThemedText type="defaultSemiBold">{t("new.date")}:</ThemedText>
          <DateTimePicker
            textColor={datePickerText}
            value={reminder.specificDate}
            mode="date"
            display="spinner"
            onChange={(_, selectedTime) => {
              set.specificDate(selectedTime || reminder.specificDate);
            }}
          />
          <ThemedText type="defaultSemiBold">{t("new.time")}:</ThemedText>
          <DateTimePicker
            textColor={datePickerText}
            value={reminder.specificTime}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={(_, selectedTime) => {
              set.specificTime(selectedTime || reminder.specificTime);
            }}
          />
        </ThemedCard>
      )}
      <ThemedCard style={styles.card}>
        <ThemedButton isCard text={t("new.save")} onPress={handleCreate} />
      </ThemedCard>
      {/* create a floating button to save */}
    </ThemedScrollView>
    // <ThemedButton
    //   text={t("new.save")}
    //   onPress={handleCreate}
    //   style={{ position: "absolute", bottom: 16, right: 16 }}
    // />
    // </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginVertical: 8,
  },
  card: {
    marginHorizontal: 8,
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
    marginTop: 8,
    textAlign: "justify",
    fontSize: 12,
    color: "#666",
  },
});
