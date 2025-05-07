import { format, formatDistanceToNow as dateFnsFormatDistanceToNow, isToday, isYesterday } from "date-fns";

export function formatDate(date: Date): string {
  if (isToday(date)) {
    return "today";
  } else if (isYesterday(date)) {
    return "yesterday";
  } else {
    return format(date, "PPP"); // "Apr 29, 2023"
  }
}

export function formatDistanceToNow(date: Date): string {
  if (isToday(date)) {
    return "today";
  } else if (isYesterday(date)) {
    return "yesterday";
  } else {
    return dateFnsFormatDistanceToNow(date, { addSuffix: true });
  }
}
