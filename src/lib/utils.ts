import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function getWeekDates(referenceDate?: string): string[] {
  const base = referenceDate ? new Date(referenceDate) : new Date();
  // Start from Monday
  const day = base.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(base);
  monday.setDate(base.getDate() + diff);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatWeekRange(dates: string[]): string {
  const first = new Date(dates[0] + "T00:00:00");
  const last = new Date(dates[6] + "T00:00:00");
  const sameMonth = first.getMonth() === last.getMonth();
  if (sameMonth) {
    return `${first.getDate()} - ${last.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
  }
  const f = first.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  const l = last.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${f} - ${l}`;
}
