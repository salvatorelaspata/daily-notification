import type { SQLiteDatabase } from "expo-sqlite";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  // console.log("Migrating database");
  await db.execAsync(`PRAGMA user_version = 0`); // Resetting the database
  const DATABASE_VERSION = 1;
  // set PRAGMA user_version = 1;

  type Schema = { user_version: number };
  let { user_version: currentDbVersion } = (await db.getFirstAsync<Schema>(
    "PRAGMA user_version"
  )) ?? { user_version: 0 };
  // console.log("Current db version", currentDbVersion);
  // console.log("Target db version", DATABASE_VERSION);
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    try {
      // notifications
      await db.execAsync(`
        DROP TABLE IF EXISTS notifications;
        CREATE TABLE notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          repeat_count INTEGER NOT NULL,
          month_preference TEXT, -- 'any' o 'specific'
          months TEXT,           -- Mesi selezionati se 'specific'
          day_preference TEXT,   -- 'any' o 'specific'
          days_of_week TEXT,     -- Giorni selezionati, 'workdays', 'weekends', o combinazione
          time_preference TEXT,  -- 'any' o 'specific'
          start_time TIME,       -- Ora di inizio se 'specific'
          end_time TIME,         -- Ora di fine se 'specific'
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_notified BOOLEAN DEFAULT FALSE
        );
      `);
      // scheduled_notifications
      await db.execAsync(`
        DROP TABLE IF EXISTS scheduled_notifications;
        CREATE TABLE scheduled_notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          notification_id INTEGER NOT NULL,
          scheduled_date DATE NOT NULL,
          scheduled_time TIME NOT NULL,
          FOREIGN KEY (notification_id) REFERENCES notifications(id)
        );
      `);
      // settings
      await db.execAsync(`
        DROP TABLE IF EXISTS settings;
        CREATE TABLE settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          preference_key TEXT NOT NULL,
          preference_value TEXT NOT NULL
        );
      `);
    } catch (error) {
      console.error("Error while creating tables", error);
    }

    // Insert sample data
    // console.log("Sample Data TODAY");
    const statNotification = await db.prepareAsync(
      `INSERT INTO notifications (title, description, repeat_count, month_preference, months, day_preference, days_of_week, time_preference, start_time, end_time)
        VALUES ('Test notification', 'This is a test notification', 1, 'any', '', 'any', '', 'any', '09:00', '09:30')`
    );
    const execNotification: any = await statNotification.executeAsync();
    const statScheduledNotification = await db.prepareAsync(
      `INSERT INTO scheduled_notifications (notification_id, scheduled_date, scheduled_time)
        VALUES (?, ?, ?)`
    );
    // console.log("execNotification", execNotification.lastInsertRowId);
    const today = new Date();
    const date = today.toISOString().split("T")[0];
    const time = today.toISOString().split("T")[1].split(".")[0];

    await statScheduledNotification.executeAsync([
      execNotification.lastInsertRowId as number,
      date,
      time,
    ]);
    currentDbVersion = 1;
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
