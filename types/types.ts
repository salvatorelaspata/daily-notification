export interface Reminder {
  id?: number;
  title: string;
  frequency: "yearly" | "monthly" | "weekly";
  days: string[];
  time: string;
  createdAt: string;
}
