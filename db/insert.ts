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
// notifications
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

export const deleteNotification = async (db: SQLiteDatabase, id: number) => {
  const statement = await db.prepareAsync(`
    DELETE FROM notifications
    WHERE id = ?
  `);
  try {
    await statement.executeAsync([id]);
  } catch (error) {
    console.error("Error while deleting notification", error);
  } finally {
    await statement.finalizeAsync();
  }
};

export const updateNotification = async (
  db: SQLiteDatabase,
  id: number,
  args: Args
) => {
  const statement = await db.prepareAsync(`
    UPDATE notifications
    SET title = ?, description = ?, repeat_count = ?, interval_days = ?, days_of_week = ?, notification_time = ?
    WHERE id = ?
  `);
  try {
    await statement.executeAsync([
      args.title,
      args.description,
      args.repeatCount,
      args.intervalDays,
      args.daysOfWeek,
      args.notificationTime,
      id,
    ]);
  } catch (error) {
    console.error("Error while updating notification", error);
  } finally {
    await statement.finalizeAsync();
  }
};

// scheduled_notifications TODO: Implementare
export const createScheduledNotificationFromPreferences = async () => {};
