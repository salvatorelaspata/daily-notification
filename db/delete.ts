import type { SQLiteDatabase } from "expo-sqlite";

export const deleteAllTables = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    DELETE FROM notifications;
    DELETE FROM scheduled_notifications;
  `);
};
