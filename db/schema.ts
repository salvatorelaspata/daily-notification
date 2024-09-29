import type { SQLiteDatabase } from "expo-sqlite";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  await db.execAsync(`PRAGMA user_version = 0`); // Resetting the database
  const DATABASE_VERSION = 1;
  // set PRAGMA user_version = 1;

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
        -- DROP TABLE IF EXISTS notifications;
        CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          repeat_count INTEGER NOT NULL,
          mode TEXT,              -- 'random' o 'specific'
          date DATE,              -- Data se 'specific'
          time TIME,              -- Ora se 'specific'
          month_preference TEXT,  -- 'any' o 'specific'
          months TEXT,            -- Mesi selezionati se 'specific'
          day_preference TEXT,    -- 'any' o 'specific'
          days_of_week TEXT,      -- Giorni selezionati, 'workdays', 'weekends', o combinazione
          time_preference TEXT,   -- 'any' o 'specific'
          start_time TIME,        -- Ora di inizio se 'specific'
          end_time TIME,          -- Ora di fine se 'specific'
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_notified BOOLEAN DEFAULT FALSE
        );
      `);
      // scheduled_notifications
      await db.execAsync(`
        -- DROP TABLE IF EXISTS scheduled_notifications;
        CREATE TABLE IF NOT EXISTS scheduled_notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          notification_id INTEGER NOT NULL,
          scheduled_date DATETIME NOT NULL,
          FOREIGN KEY (notification_id) REFERENCES notifications(id)
        );
      `);
      // settings
      await db.execAsync(`
        -- DROP TABLE IF EXISTS settings;
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          start_time TIME NOT NULL,
          end_time TIME NOT NULL
        );
      `);
    } catch (error) {}

    currentDbVersion = 1;
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
