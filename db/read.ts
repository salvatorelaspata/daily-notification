import { ScheduledNotification, Union } from "@/types/types";
import type { SQLiteDatabase } from "expo-sqlite";

export const getTodayNotifications = async (db: SQLiteDatabase) => {
  const today = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
  const statement = await db.prepareAsync(
    "SELECT * FROM scheduled_notifications WHERE scheduled_date = ?"
  );
  try {
    const result = await statement.executeAsync([today]);
    return result;
  } catch (error) {
    console.error("Error while getting today's notifications", error);
    return [];
  } finally {
    await statement.finalizeAsync();
  }
};

export const getAllNotifications = async (db: SQLiteDatabase) => {
  try {
    const result = await db.execAsync("SELECT * FROM notifications");
    return result;
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
      WHERE scheduled_date = ?`
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
