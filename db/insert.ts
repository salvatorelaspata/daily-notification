import { Notification } from "@/types/types";
import { SQLiteDatabase } from "expo-sqlite";
import { getAllNotifications } from "./read";

interface CreateNotification {
  db: SQLiteDatabase;
  args: Partial<Notification>;
}
// notifications
export const createNotification = async ({
  db,
  args: {
    title,
    description,
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
    INSERT INTO notifications (title, description, repeat_count, mode, date, time, month_preference, months, day_preference, days_of_week, time_preference, start_time, end_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  try {
    const result = await statement.executeAsync([
      title || null,
      description || null,
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

// export const deleteNotification = async (db: SQLiteDatabase, id: number) => {
//   const statement = await db.prepareAsync(`
//     DELETE FROM notifications
//     WHERE id = ?
//   `);
//   try {
//     await statement.executeAsync([id]);
//   } catch (error) {
//     console.error("Error while deleting notification", error);
//   } finally {
//     await statement.finalizeAsync();
//   }
// };

// scheduled_notifications TODO: Implementare
export const createReminder = async (
  db: SQLiteDatabase,
  data: Partial<Notification>
) => {
  try {
    if (!data.title || !data.repeat_count || !data.mode) {
      throw new Error("Title are required");
    }

    const result = await createNotification({ db, args: data });
    const id = result?.lastInsertRowId;

    // Schedule notifications
    if (id) {
      if (data.mode === "random") {
        // Random mode
        await scheduleRandomNotifications(db, id, data);
      } else {
        if (!data.date || !data.time)
          throw new Error("Date and time are required");

        // Specific mode
        await scheduleSpecificNotification(db, id, data);
      }
    } else {
      console.error("Errore durante la creazione del ricordo:");
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
};

const scheduleRandomNotifications = async (
  tx: SQLiteDatabase,
  notificationId: number,
  data: Partial<Notification>
) => {
  if (!data.start_time || !data.end_time || !data.repeat_count) {
    console.error(
      "Error while scheduling random notification: start_time and end_time are required"
    );
    return;
  }
  const now = new Date();
  const endOfYear = new Date(now.getFullYear(), 11, 31);
  const start = new Date(data.start_time);
  const end = new Date(data.end_time);
  for (let i = 0; i < data.repeat_count; i++) {
    let scheduledDate = generateRandomDate(now, endOfYear, data);
    let scheduledTime = generateRandomTime(start, end);

    const statement = await tx.prepareAsync(
      `INSERT INTO scheduled_notifications (notification_id, scheduled_date, scheduled_time)
       VALUES (?, ?, ?)`
    );
    try {
      await statement.executeAsync([
        notificationId,
        scheduledDate.toISOString(),
        scheduledTime.toISOString(),
      ]);

      console.log("Scheduled notification in date:", scheduledDate);
    } catch (error) {
      console.error("Error while scheduling random notification", error);
    } finally {
      await statement.finalizeAsync();
    }
  }
};

const scheduleSpecificNotification = async (
  tx: SQLiteDatabase,
  notificationId: number,
  data: Partial<Notification>
) => {
  if (!data.date || !data.time || !data.repeat_count) {
    console.error(
      "Error while scheduling specific notification: date and time are required"
    );
    return;
  }
  const date = new Date(data.date);
  const time = new Date(data.time);

  // Schedule notifications based on month preference
  const statement = await tx.prepareAsync(
    `INSERT INTO scheduled_notifications (notification_id, scheduled_date, scheduled_time)
         VALUES (?, ?, ?)`
  );
  try {
    await statement.executeAsync([
      notificationId,
      date.toISOString(),
      time.toISOString(),
    ]);
    console.log("Scheduled notification in date:", date);
  } catch (error) {
    console.error("Error while scheduling specific notification", error);
  } finally {
    await statement.finalizeAsync();
  }
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
  const m = data.months.split(",").map((m) => parseInt(m));
  // Adjust based on month preference
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
  const d = data.days_of_week.split(",").map((d) => parseInt(d));
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
