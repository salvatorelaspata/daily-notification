import type { Notification } from "@/types/types";
import { SQLiteDatabase } from "expo-sqlite";

interface CreateNotification {
  db: SQLiteDatabase;
  args: Partial<Notification>;
}
// notifications
export const createNotification = async ({
  db,
  args: {
    title,
    body,
    repeat_count,
    mode,
    date,
    time,
    month_preference,
    months,
    day_preference,
    days_of_week,
    time_preference,
    start_time,
    end_time,
  },
}: CreateNotification) => {
  const statement = await db.prepareAsync(`
    INSERT INTO notifications (title, body, repeat_count, mode, date, time, month_preference, months, day_preference, days_of_week, time_preference, start_time, end_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  try {
    const result = await statement.executeAsync([
      title || null,
      body || null,
      repeat_count || 0,
      mode || null,
      date || null,
      time || null,
      month_preference || null,
      months || null,
      day_preference || null,
      days_of_week || null,
      time_preference || null,
      start_time || null,
      end_time || null,
    ]);
    return result;
  } catch (error) {
    console.error("Error while creating notification", error);
  } finally {
    await statement.finalizeAsync();
  }
};

export const createReminder = async (
  db: SQLiteDatabase,
  data: Partial<Notification>
) => {
  if (!data.title || !data.repeat_count || !data.mode) {
    throw new Error("Title are required");
  }
  const scheduled: { id: number; date: Date }[] = [];
  try {
    const result = await createNotification({ db, args: data });
    const id = result?.lastInsertRowId;

    // Schedule notifications
    if (id) {
      const start = new Date();
      const end = new Date();
      end.setFullYear(end.getFullYear() + 1);

      const statement = await db.prepareAsync(`
        INSERT INTO scheduled_notifications (notification_id, scheduled_date)
        VALUES (?, ?)
      `);
      try {
        // check if the mode is specific or random (random === '0')
        if (data.mode === "0") {
          for (let i = 0; i < data.repeat_count; i++) {
            const scheduled_date = generateRandomDate(start, end, data);
            try {
              const res = await statement.executeAsync([
                id,
                scheduled_date.toISOString(),
              ]);
              const scheduled_id = res.lastInsertRowId;
              scheduled.push({ id: scheduled_id, date: scheduled_date });
            } catch (error) {
              console.error("Error while creating reminder", error);
            }
          }
        } else {
          if (!data.date || !data.time) {
            console.error(
              "Error while creating reminder: date and time are required"
            );
            return;
          }
          try {
            const _date = new Date(data.date);
            const _time = new Date(data.time);
            _date.setHours(_time.getHours());
            _date.setMinutes(_time.getMinutes());
            _date.setSeconds(_time.getSeconds());

            const res = await statement.executeAsync([id, _date.toISOString()]);
            const scheduled_id = res.lastInsertRowId;
            scheduled.push({ id: scheduled_id, date: _date });
          } catch (error) {
            console.error("Error while creating reminder", error);
          }
        }
      } finally {
        await statement.finalizeAsync();
      }
    } else {
      console.error("Errore durante la creazione del ricordo:");
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
  return scheduled;
};

const generateRandomDate = (
  start: Date,
  end: Date,
  data: Partial<Notification>
): Date => {
  if (!data.months) {
    console.error("Error while generating random date: months are required");
    return new Date();
  }
  let date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  // Selected months
  const m = data.months.split(",").map((m) => parseInt(m));
  // check if the month is specified (month_preference === "specific")
  if (data.month_preference === "specific" && m.length > 0) {
    date.setMonth(m[Math.floor(Math.random() * m.length)]);
  }

  // Adjust based on day preference
  if (!data.days_of_week) {
    console.error(
      "Error while generating random date: days_of_week are required"
    );
    return new Date();
  }
  // Selected days
  const d = data.days_of_week.split(",").map((d) => parseInt(d));
  // check if the day is specified (day_preference === "specific")
  if (data.day_preference === "specific") {
    let validDays = d;
    if (d.indexOf(0) > -1 && d.indexOf(6) > -1)
      validDays = [...new Set([...validDays, 1, 2, 3, 4, 5])];
    if (d.indexOf(0) > -1)
      validDays = [...new Set([...validDays, 1, 2, 3, 4, 5, 6])];
    validDays = [...new Set([...validDays, 0, 6])];

    while (!validDays.includes(date.getDay())) {
      date.setDate(date.getDate() + 1);
      if (date > end) date = new Date(start);
    }
  }

  return date;
};

const generateRandomTime = (start: Date, end: Date): Date => {
  const time = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return time;
};
