export const months = [
  "Gen",
  "Feb",
  "Mar",
  "Apr",
  "Mag",
  "Giu",
  "Lug",
  "Ago",
  "Set",
  "Ott",
  "Nov",
  "Dic",
];
export const days = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

type Moment = {
  text: string;
  start: Date;
  end: Date;
};

export type MomentOfTheDayKey = "morning" | "afternoon" | "evening";

export type MomentOfTheDayProp = {
  [key in MomentOfTheDayKey]: Moment;
};

export const momentOfTheDay: MomentOfTheDayProp = {
  morning: {
    text: "morning",
    start: new Date(0, 0, 0, 6, 0, 0),
    end: new Date(0, 0, 0, 12, 0, 0),
  },
  afternoon: {
    text: "afternoon",
    start: new Date(0, 0, 0, 12, 0, 0),
    end: new Date(0, 0, 0, 18, 0, 0),
  },
  evening: {
    text: "evening",
    start: new Date(0, 0, 0, 18, 0, 0),
    end: new Date(0, 0, 0, 24, 0, 0),
  },
};
