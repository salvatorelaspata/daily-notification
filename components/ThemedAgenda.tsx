import { useTranslation } from "react-i18next";
import {
  Agenda,
  AgendaEntry,
  AgendaProps,
  LocaleConfig,
} from "react-native-calendars";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { format } from "date-fns";

export type ThemedAgendaProps = AgendaProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedAgenda({
  lightColor,
  darkColor,
  ...other
}: ThemedAgendaProps) {
  const { t, i18n } = useTranslation();

  LocaleConfig.locales.z = {
    monthNames: [
      t("months.full.january"),
      t("months.full.february"),
      t("months.full.march"),
      t("months.full.april"),
      t("months.full.may"),
      t("months.full.june"),
      t("months.full.july"),
      t("months.full.august"),
      t("months.full.september"),
      t("months.full.october"),
      t("months.full.november"),
      t("months.full.december"),
    ],
    monthNamesShort: [
      t("months.short.january"),
      t("months.short.february"),
      t("months.short.march"),
      t("months.short.april"),
      t("months.short.may"),
      t("months.short.june"),
      t("months.short.july"),
      t("months.short.august"),
      t("months.short.september"),
      t("months.short.october"),
      t("months.short.november"),
      t("months.short.december"),
    ],
    dayNames: [
      t("daysOfWeek.full.sunday"),
      t("daysOfWeek.full.monday"),
      t("daysOfWeek.full.tuesday"),
      t("daysOfWeek.full.wednesday"),
      t("daysOfWeek.full.thursday"),
      t("daysOfWeek.full.friday"),
      t("daysOfWeek.full.saturday"),
    ],
    dayNamesShort: [
      t("daysOfWeek.short.sunday"),
      t("daysOfWeek.short.monday"),
      t("daysOfWeek.short.tuesday"),
      t("daysOfWeek.short.wednesday"),
      t("daysOfWeek.short.thursday"),
      t("daysOfWeek.short.friday"),
      t("daysOfWeek.short.saturday"),
    ],
  };

  LocaleConfig.defaultLocale = "z";

  const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    return r1.name !== r2.name;
  };

  // const renderDay = (day: Date) => {
  //   if (day) return <Text>{day.getDay()} aaaaaaa</Text>;
  //   return <View />;
  // };

  return (
    <Agenda
      {...other}
      showClosingKnob={true}
      rowHasChanged={rowHasChanged}
      firstDay={i18n.language === "it-IT" ? 1 : 0}
      selected={format(new Date(), "yyyy-MM-dd")}
      renderEmptyData={() => (
        <ThemedView style={{ flex: 1 }}>
          <ThemedText>...</ThemedText>
        </ThemedView>
      )}
      // renderDay={renderDay}
    />
  );
}
