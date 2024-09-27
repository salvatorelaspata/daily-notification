export const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
export const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

type Moment = {
  start: Date;
  end: Date;
};

export type MomentOfTheDayKey = "morning" | "afternoon" | "evening";

export type MomentOfTheDayProp = {
  [key in MomentOfTheDayKey]: Moment;
};

export const momentOfTheDay: MomentOfTheDayProp = {
  morning: {
    start: new Date(0, 0, 0, 6, 0, 0),
    end: new Date(0, 0, 0, 12, 0, 0),
  },
  afternoon: {
    start: new Date(0, 0, 0, 12, 0, 0),
    end: new Date(0, 0, 0, 18, 0, 0),
  },
  evening: {
    start: new Date(0, 0, 0, 18, 0, 0),
    end: new Date(0, 0, 0, 24, 0, 0),
  },
};

export function timeToString(time: number) {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
}
