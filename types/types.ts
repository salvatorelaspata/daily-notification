export type Notification = {
  id: number;
  title: string;
  description?: string;
  repeat_count: number;
  interval_days: number;
  days_of_week?: string;
  notification_time: string;
  created_at: string;
  is_notified: boolean;
};

export type ScheduledNotification = {
  id: number;
  notification_id: number;
  scheduled_date: string;
};

export type Setting = {
  id: number;
  user_id: number;
  preference_key: string;
  preference_value: string;
};
