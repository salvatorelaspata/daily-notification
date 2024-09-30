import { ScheduledNotification } from "@/types/types";
import { SQLiteDatabase } from "expo-sqlite";

export const updateScheduledNotification = async (
  db: SQLiteDatabase,
  data: Partial<ScheduledNotification>
) => {
  if (!data.id) throw new Error("Id is required");

  const statement = await db.prepareAsync(`
    UPDATE scheduled_notifications
    SET mobile_id = ?
    WHERE id = ?
  `);

  try {
    const result = await statement.executeAsync([
      data.mobile_id || null,
      data.id,
    ]);
    return result;
  } catch (error) {
    console.error("Error while updating reminder schedule", error);
  } finally {
    await statement.finalizeAsync();
  }
};
