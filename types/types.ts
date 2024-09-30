export type Notification = {
  id?: number;
  title: string;
  body: string;
  repeat_count: number;
  mode: string; // 'random' o 'specific'
  date: string; // Data se 'specific'
  time: string; // Ora se 'specific'
  month_preference: string;
  months: string;
  day_preference: string;
  days_of_week: string;
  time_preference: string;
  start_time: string;
  end_time: string;
  created_at: string;
  is_notified: boolean;
};

export type ScheduledNotification = {
  id?: number;
  notification_id: number;
  scheduled_date: string;
  created_at: string;
  is_notified: boolean;
  mobile_id: string;
};

export type Union = Notification & ScheduledNotification;

export type Setting = {
  id?: number;
  start_time?: string;
  end_time?: string;
};
