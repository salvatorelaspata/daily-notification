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
          id INTEGER PRIMARY KEY AUTOINCREMENT, -- ID della notifica
          title TEXT NOT NULL,                  -- Titolo della notifica
          description TEXT,                     -- Descrizione della notifica
          repeat_count INTEGER NOT NULL,        -- Numero di ripetizioni nell'anno
          interval_days INTEGER NOT NULL,       -- Intervallo di giorni tra le notifiche
          days_of_week TEXT,                    -- Giorni della settimana (es. "1,2,3" per Lunedì, Martedì, Mercoledì)
          notification_time TEXT NOT NULL,      -- Orario della notifica (es. "morning", "afternoon", "evening", "09:00-10:00")
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data di creazione della notifica
          is_notified BOOLEAN DEFAULT FALSE     -- Indica se la notifica è già stata inviata
        );
      `);
      // scheduled_notifications
      await db.execAsync(`
        CREATE TABLE scheduled_notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          notification_id INTEGER NOT NULL,
          scheduled_date DATE NOT NULL,      -- Data programmata per la notifica
          FOREIGN KEY (notification_id) REFERENCES notifications(id)
        );
      `);
      // settings
      await db.execAsync(`
        CREATE TABLE settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          -- user_id INTEGER NOT NULL,           -- ID dell'utente (se necessario)
          preference_key TEXT NOT NULL,       -- Chiave della preferenza
          preference_value TEXT NOT NULL       -- Valore della preferenza
        );
      `);

      // Insert sample data
      // await db.execAsync(`
      //   INSERT INTO notifications (title, repeat_count, interval_days, notification_time)
      //   VALUES
      //     ('Sample notification 1', 1, 7, 'morning'),
      //     ('Sample notification 2', 2, 14, 'afternoon'),
      //     ('Sample notification 3', 3, 21, 'evening');
      // `);
      // await db.execAsync(`
      //   INSERT INTO settings (preference_key, preference_value)
      //   VALUES
      //     ('theme', 'light'),
      //     ('language', 'en');
      // `);
      // await db.execAsync(`
      //   INSERT INTO scheduled_notifications (notification_id, scheduled_date)
      //   VALUES
      //     (1, '2022-01-01'),
      //     (1, '2022-01-08'),
      //     (1, '2022-01-15'),
      //     (2, '2022-01-01'),
      //     (2, '2022-01-15'),
      //     (3, '2022-01-01');
      // `);
    } catch (error) {
      console.error("Error while creating tables", error);
    }
    currentDbVersion = 1;
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
