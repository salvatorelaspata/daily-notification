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
          user_id INTEGER NOT NULL,           -- ID dell'utente (se necessario)
          preference_key TEXT NOT NULL,       -- Chiave della preferenza
          preference_value TEXT NOT NULL       -- Valore della preferenza
        );
      `);
    } catch (error) {
      console.error("Error while creating tables", error);
    }
    currentDbVersion = 1;
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
