import type { SQLiteDatabase } from "expo-sqlite";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  type Schema = { user_version: number };
  let { user_version: currentDbVersion } = (await db.getFirstAsync<Schema>(
    "PRAGMA user_version"
  )) ?? { user_version: 0 };
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    try {
      // notifications
      await db.execAsync(`
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
        CREATE TABLE settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          preference_key TEXT NOT NULL,
          preference_value TEXT NOT NULL
        );
      `);
    } catch (error) {
      console.error("Error while creating tables", error);
    }
    currentDbVersion = 1;
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
