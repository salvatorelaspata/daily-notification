import { Union } from "@/types/types";
import { proxy } from "valtio";

interface NotificationState {
  todayNotifications: Union[];
  recentNotifications: Union[];
  notifications: Union[];
}

export const notificationState = proxy<NotificationState>({
  todayNotifications: [],
  recentNotifications: [],
  notifications: [],
});

export const notificationActions = {
  setTodayNotifications: (notifications: Union[]) => {
    notificationState.todayNotifications = notifications;
  },
  setRecentNotifications: (notifications: Union[]) => {
    notificationState.recentNotifications = notifications;
  },
  setNotifications: (notifications: Union[]) => {
    notificationState.notifications = notifications;
  },
};
