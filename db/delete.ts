import type { SQLiteDatabase } from "expo-sqlite";

export const deleteAllTables = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    DELETE FROM notifications;
    DELETE FROM scheduled_notifications;
  `);
};

export const deleteNotification = async (db: SQLiteDatabase, id: number) => {
  const statement = await db.prepareAsync(`
    DELETE FROM notifications WHERE id = ?
  `);
  try {
    const result = await statement.executeAsync([id]);
    return result;
  } catch (error) {
    console.error("Error while deleting notification", error);
  } finally {
    await statement.finalizeAsync();
  }
};
