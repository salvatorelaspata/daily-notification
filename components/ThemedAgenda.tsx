import { Agenda, AgendaProps } from "react-native-calendars";

export type ThemedAgendaProps = AgendaProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedAgenda({
  lightColor,
  darkColor,
  ...other
}: ThemedAgendaProps) {
  return <Agenda {...other} />;
}
