import { Notification } from "@/types/types";
import { proxy } from "valtio";

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
    month_preference: "any",
    months: "",
    day_preference: "any",
    days_of_week: "",
    time_preference: "any",
    start_time: "",
    end_time: "",
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
};
