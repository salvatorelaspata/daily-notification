import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { ThemedText } from "@/components/ThemedText";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedButton } from "@/components/ThemedButton";

import { ThemedCheckbox } from "@/components/ThemedCheckbox";

import { ThemedCard } from "@/components/ThemedCard";
import { ThemedSegmentedButton } from "@/components/ThemedSegmentedButton";
import { createReminder } from "@/db/insert";
import { useSQLiteContext } from "expo-sqlite";
import ThemedTextInput from "@/components/ThemedTextInput";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useNotifications } from "@/hooks/useNotifications";
import { updateScheduledNotification } from "@/db/update";
import { deleteNotification } from "@/db/delete";
import { ThemedView } from "@/components/ThemedView";
import { useSnapshot } from "valtio";
import { reminderActions, reminderState } from "@/store/reminder";
import { RandomFragment } from "@/fragments/new/random";
import { SpecificFragment } from "@/fragments/new/specific";
import { BirtdayFragment } from "@/fragments/new/birthday";

export default function CreateReminderView() {
  const [body, setBody] = useState<string>(""); // WA: super glitch for multiline text input
  const { reminder } = useSnapshot(reminderState);
  const { set, reset } = reminderActions;

  const db = useSQLiteContext();

  const { t } = useTranslation();

  const { schedulePushNotification } = useNotifications();

  // const isFocused = useIsFocused();
  // useEffect(() => {
  //   if (isFocused) reset();
  // }, [isFocused]);

  const handleCreate = async () => {
    try {
      const scheduled = await createReminder(db, {
        title: reminder.title,
        body: reminder.body,
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
    <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
      <ThemedCard style={styles.card}>
        <ThemedSegmentedButton
          values={[t("new.random"), t("new.specific"), t("new.birthday")]}
          selectedIndex={reminder.mode}
          onChange={(event) => set.mode(event.nativeEvent.selectedSegmentIndex)}
        />
      </ThemedCard>
      <ThemedScrollView>
        <ThemedCard style={styles.card}>
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
            value={body} // WA reminder.body
            onChangeText={setBody} // WA set.body
            style={{
              height: 100,
              textAlignVertical: "top",
              alignItems: "flex-start",
            }}
          />
        </ThemedCard>
        {reminder.mode === 0 ? (
          <RandomFragment />
        ) : reminder.mode === 1 ? (
          <SpecificFragment />
        ) : (
          <BirtdayFragment />
        )}
        <ThemedCard style={styles.card}>
          <ThemedButton isCard text={t("new.save")} onPress={handleCreate} />
          {reminder.mode === 0 && (
            <ThemedText style={styles.randomNote}>
              {t("new.randomNote")}
            </ThemedText>
          )}
          <ThemedView
            style={{ flexDirection: "column", justifyContent: "flex-end" }}
          >
            <ThemedCheckbox
              label={t("new.continue")}
              checked={reminder.continue_}
              onPress={() => set.continue(!reminder.continue_)}
            />
          </ThemedView>
        </ThemedCard>
      </ThemedScrollView>
      {/* create a floating button to save */}
    </ThemedView>
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
  randomNote: {
    marginTop: 8,
    textAlign: "justify",
    fontSize: 12,
    color: "#666",
  },
});
