/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const palette = {
  light: {
    palette1: "#006D77",
    palette2: "#83C5BE",
    palette3: "#EDF6F9",
    palette4: "#FFDDD2",
    palette5: "#E29578",
  },
  dark: {
    palette1: "#D7CEB2",
    palette2: "#377771",
    palette3: "#00171F",
    palette4: "#18314F",
    palette5: "#D7CEB2",
  },
};
export const Colors = {
  light: {
    text: palette.light.palette1,
    background: palette.light.palette3,
    tint: palette.light.palette3,
    buttonBg: palette.light.palette1,
    buttonText: palette.light.palette3,

    tabBarActiveTintColor: palette.light.palette1,
    tabBarInactiveTintColor: palette.light.palette2,

    link: palette.light.palette5,

    icon: palette.light.palette5,

    card: palette.light.palette3,
    cardShadow: palette.light.palette1,

    segmentedBg: palette.light.palette3,
    segmentedBorder: palette.light.palette1,
    segmentedSelect: palette.light.palette1,
    segmentedText: palette.light.palette1,
    segmentedSelectText: palette.light.palette3,

    sliderThumb: palette.light.palette1,
    minimumTrackTint: palette.light.palette5,
    maximumTrackTint: palette.light.palette4,

    datePickerText: palette.light.palette1,

    agendaCalendarBackground: palette.light.palette3,
    agendaReservationsBackgroundColor: palette.light.palette3,
    agendaSelectedDayBackgroundColor: palette.light.palette4,
    agendaDayTextColor: palette.light.palette1,
  },
  dark: {
    text: palette.dark.palette1,
    background: palette.dark.palette3,
    tint: palette.dark.palette3,
    buttonBg: palette.dark.palette1,
    buttonText: palette.dark.palette3,

    tabBarActiveTintColor: palette.dark.palette1,
    tabBarInactiveTintColor: palette.dark.palette2,

    link: palette.dark.palette5,

    icon: palette.dark.palette5,

    card: palette.dark.palette3,
    cardShadow: palette.dark.palette1,

    segmentedBg: palette.dark.palette3,
    segmentedBorder: palette.dark.palette1,
    segmentedSelect: palette.dark.palette1,
    segmentedText: palette.dark.palette1,
    segmentedSelectText: palette.dark.palette3,
    sliderThumb: palette.dark.palette1,
    minimumTrackTint: palette.dark.palette5,
    maximumTrackTint: palette.dark.palette4,

    datePickerText: palette.dark.palette1,

    agendaCalendarBackground: palette.dark.palette3,
    agendaReservationsBackgroundColor: palette.dark.palette3,
    agendaSelectedDayBackgroundColor: palette.dark.palette4,
    agendaDayTextColor: palette.dark.palette1,
  },
};
