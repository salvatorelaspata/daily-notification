import { Notification } from "@/types/types";
import { proxy } from "valtio";

type anyOrSpecific = "any" | "specific";

interface INotification {
  reminder: {
    title: string;
    body: string;
    mode: number;
    repetitions: number;
    specificDate: Date;
    specificTime: Date;
    monthPreference: anyOrSpecific;
    selectedMonths: number[];
    dayPreference: anyOrSpecific;
    selectedDays: number[];
    workingDays: boolean;
    weekends: boolean;
    timePreference: anyOrSpecific;
    startTime: Date;
    endTime: Date;
    continue_: boolean;
  };
}

const emptyNotification: INotification = {
  reminder: {
    title: "",
    body: "",
    mode: 0,
    repetitions: 0,
    specificDate: new Date(),
    specificTime: new Date(),
    monthPreference: "any",
    selectedMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    dayPreference: "any",
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    workingDays: false,
    weekends: false,
    timePreference: "any",
    startTime: new Date(0, 0, 0, 0, 0, 0),
    endTime: new Date(0, 0, 0, 23, 59, 59),
    continue_: true,
  },
};

export const reminderState = proxy<INotification>(emptyNotification);

export const reminderActions = {
  set: {
    title: (title: string) => (reminderState.reminder.title = title),
    body: (body: string) => (reminderState.reminder.body = body),
    mode: (mode: number) => (reminderState.reminder.mode = mode),
    repetitions: (repetitions: number) =>
      (reminderState.reminder.repetitions = repetitions),
    specificDate: (specificDate: Date) =>
      (reminderState.reminder.specificDate = specificDate),
    specificTime: (specificTime: Date) =>
      (reminderState.reminder.specificTime = specificTime),
    monthPreference: (monthPreference: anyOrSpecific) =>
      (reminderState.reminder.monthPreference = monthPreference),
    selectedMonths: (selectedMonths: number[]) =>
      (reminderState.reminder.selectedMonths = selectedMonths),
    dayPreference: (dayPreference: anyOrSpecific) =>
      (reminderState.reminder.dayPreference = dayPreference),
    selectedDays: (selectedDays: number[]) =>
      (reminderState.reminder.selectedDays = selectedDays),
    workingDays: (workingDays: boolean) =>
      (reminderState.reminder.workingDays = workingDays),
    weekends: (weekends: boolean) =>
      (reminderState.reminder.weekends = weekends),
    timePreference: (timePreference: anyOrSpecific) =>
      (reminderState.reminder.timePreference = timePreference),
    startTime: (startTime: Date) =>
      (reminderState.reminder.startTime = startTime),
    endTime: (endTime: Date) => (reminderState.reminder.endTime = endTime),
    continue: (continue_: boolean) =>
      (reminderState.reminder.continue_ = continue_),
  },
  reset: () => Object.assign(reminderState, emptyNotification),
};
