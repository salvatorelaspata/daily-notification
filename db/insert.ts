import { SQLiteDatabase } from "expo-sqlite";

type Args = {
  title: string;
  description: string;
  repeatCount: number;
  intervalDays: number;
  daysOfWeek: string;
  notificationTime: string;
};
interface CreateNotification {
  db: SQLiteDatabase;
  args: Args;
}
export const createNotification = async ({
  db,
  args: {
    title,
    description,
    repeatCount,
    intervalDays,
    daysOfWeek,
    notificationTime,
  },
}: CreateNotification) => {
  const statement = await db.prepareAsync(`
    INSERT INTO notifications (title, description, repeat_count, interval_days, days_of_week, notification_time)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  try {
    await statement.executeAsync([
      title,
      description,
      repeatCount,
      intervalDays,
      daysOfWeek,
      notificationTime,
    ]);
  } catch (error) {
    console.error("Error while creating notification", error);
  } finally {
    await statement.finalizeAsync();
  }

  // Calcola e inserisci le date programmate nella tabella scheduled_notifications
  // (Logica per calcolare le date basata su repeatCount, intervalDays, e daysOfWeek)
};
