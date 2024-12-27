import { ThemedCard } from "@/components/ThemedCard";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { reminderActions, reminderState } from "@/store/reminder";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { useSnapshot } from "valtio";

export const SpecificFragment = () => {
  const { reminder } = useSnapshot(reminderState);
  const { set } = reminderActions;
  const datePickerText = useThemeColor({}, "datePickerText");
  const { t } = useTranslation();

  return (
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
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
  },
});
