import { Notification } from "@/types/types";
import { proxy, useSnapshot } from "valtio";
interface NotificationState {
  notifications: Notification[];
  modalCreateVisible: boolean;
  createNotification: Omit<Notification, "id" | "created_at" | "is_notified">;
}

export const notificationState = proxy<NotificationState>({
  notifications: [],
  modalCreateVisible: false,
  createNotification: {
    title: "",
    description: "",
    repeat_count: 1,
    interval_days: 1,
    days_of_week: "",
    notification_time: "08:00",
  },
});

export const notificationActions = {
  addNotification: (notification: Notification) => {
    notificationState.notifications.push(notification);
  },
  removeNotification: (notification: Notification) => {
    notificationState.notifications = notificationState.notifications.filter(
      (n) => n.id !== notification.id
    );
  },
  updateNotification: (notification: Notification) => {
    const index = notificationState.notifications.findIndex(
      (n) => n.id === notification.id
    );
    notificationState.notifications[index] = notification;
  },
  showModalCreate: () => {
    notificationState.modalCreateVisible = true;
  },
  hideModalCreate: () => {
    notificationState.modalCreateVisible = false;
  },
  // setPropValue: (
  //   key: keyof NotificationState["createNotification"],
  //   value: any
  // ) => {
  //   if (
  //     Object.keys(notificationState.createNotification).includes(key) &&
  //     typeof value === typeof notificationState.createNotification[key]
  //   )
  //     notificationState.createNotification[key] = value;
  // },
  setTitle: (title: string) => {
    notificationState.createNotification.title = title;
  },
  setDescription: (description: string) => {
    notificationState.createNotification.description = description;
  },
  setRepeatCount: (repeatCount: string) => {
    notificationState.createNotification.repeat_count = parseInt(repeatCount);
  },
  setIntervalDays: (intervalDays: string) => {
    notificationState.createNotification.interval_days = parseInt(intervalDays);
  },
  setDaysOfWeek: (daysOfWeek: string) => {
    notificationState.createNotification.days_of_week = daysOfWeek;
  },
  setNotificationTime: (notificationTime: string) => {
    notificationState.createNotification.notification_time = notificationTime;
  },
};
