import { ThemedButton } from "@/components/ThemedButton";
import { ThemedCard } from "@/components/ThemedCard";
import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemedSlider } from "@/components/ThemedSlider";
import { ThemedText } from "@/components/ThemedText";
import { ThemedChip } from "@/components/ThemedChip";
import { days, momentOfTheDay, months } from "@/constants/Date";

import DateTimePicker from "@react-native-community/datetimepicker";

import * as Device from "expo-device";

import { useSnapshot } from "valtio";
import { useThemeColor } from "@/hooks/useThemeColor";

import { reminderActions, reminderState } from "@/store/reminder";
import { useTranslation } from "react-i18next";
import { ThemedCheckbox } from "@/components/ThemedCheckbox";
import { StyleSheet, View } from "react-native";

export const RandomFragment = () => {
  const { t } = useTranslation();
  const { reminder } = useSnapshot(reminderState);
  const { set, reset } = reminderActions;
  const textColor = useThemeColor({}, "buttonText");
  const bgColor = useThemeColor({}, "buttonBg");
  const isTablet = Device.deviceType === Device.DeviceType.TABLET;

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

  return (
    <>
      <ThemedCard style={styles.card}>
        <View style={styles.cardHeader}>
          <ThemedIcon icon="repeat" isCard style={{ marginRight: 8 }} />
          <ThemedText type="defaultSemiBold">{t("new.repeating")}</ThemedText>
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
          <ThemedText type="defaultSemiBold">{t("new.preferences")}</ThemedText>
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
          type={reminder.monthPreference === "specific" ? "default" : "outline"}
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
        <ThemedText type="defaultSemiBold">{t("new.daysOfWeek")}</ThemedText>
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
          type={reminder.dayPreference === "specific" ? "default" : "outline"}
        />
        {reminder.dayPreference === "specific" && (
          <View>
            <View style={styles.daysContainer}>
              {days.map((day, index) => (
                <ThemedChip
                  isCard={true}
                  key={day}
                  onPress={() => toggleDay(index)}
                  text={t(`daysOfWeek.${isTablet ? "full" : "short"}.${day}`)}
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
        <ThemedText type="defaultSemiBold">{t("new.reminderTime")}</ThemedText>
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
          type={reminder.timePreference === "specific" ? "default" : "outline"}
        />
        {reminder.timePreference === "specific" && (
          <View>
            <View style={styles.timePickerContainer}>
              <ThemedText type="defaultSemiBold">{t("new.from")}:</ThemedText>
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
                  text={t(`moment.${isTablet ? "full" : "short"}.${moment}`)}
                  onPress={() => {
                    set.startTime(
                      momentOfTheDay[moment as keyof typeof momentOfTheDay]
                        .start
                    );
                    set.endTime(
                      momentOfTheDay[moment as keyof typeof momentOfTheDay].end
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
  );
};

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
