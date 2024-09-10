import type { SQLiteDatabase } from "expo-sqlite";

export const getTodaysNotifications = async (db: SQLiteDatabase) => {
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
