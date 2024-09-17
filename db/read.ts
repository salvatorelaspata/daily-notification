import { Union } from "@/types/types";
import type { SQLiteDatabase } from "expo-sqlite";

export const getTodayNotifications = async (db: SQLiteDatabase) => {
  const today = new Date();
  const date = today.toISOString().split("T")[0];
  return getScheduledNotificationByDate(db, date);
};

export const getAllNotifications = async (db: SQLiteDatabase) => {
  try {
    const result = await db.getAllAsync(
      `SELECT *
      FROM scheduled_notifications  as s
      LEFT JOIN notifications AS n
      ON s.notification_id = n.id;`
    );
    // group by notification id
    const grouped = result.reduce((accumulator: any[], currentValue: any) => {
      const existing = accumulator.findIndex((i) => i.id === currentValue.id);
      if (existing !== -1) {
        accumulator[existing].scheduled.push({
          scheduled_date: currentValue.scheduled_date,
          scheduled_time: currentValue.scheduled_time,
        });
      } else {
        accumulator.push({
          ...currentValue,
          scheduled: [
            {
              scheduled_date: currentValue.scheduled_date,
              scheduled_time: currentValue.scheduled_time,
            },
          ],
        });
      }
      return accumulator;
    }, []);
    console.log({ grouped });
    return grouped;
  } catch (error) {
    console.error("Error while getting all notifications", error);
    return [];
  }
};

export const getScheduledNotificationByDate = async (
  db: SQLiteDatabase,
  date: string
) => {
  const statement = await db.prepareAsync(
    `SELECT *
      FROM scheduled_notifications  as s
      INNER JOIN notifications AS n
      ON s.notification_id = n.id
      WHERE DATE(s.scheduled_date) = DATE(?)`
  );
  try {
    const result = await statement.executeAsync([date]);
    const all = await result.getAllAsync();

    return all as Union[];
  } catch (error) {
    console.error("Error while getting notifications by date", error);
    return [];
  } finally {
    await statement.finalizeAsync();
  }
};

export const getSettings = async (db: SQLiteDatabase) => {
  try {
    const result = await db.getAllAsync(`SELECT * FROM settings`);
    return result;
  } catch (error) {
    console.error("Error while getting settings", error);
    return [];
  }
};
