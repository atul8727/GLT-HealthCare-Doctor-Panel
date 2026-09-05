import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDate(dateStr, pattern = "dd MMM yyyy") {
  if (!dateStr) return "-";
  try {
    return format(typeof dateStr === "string" ? parseISO(dateStr) : dateStr, pattern);
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr) {
  return formatDate(dateStr, "dd MMM yyyy, hh:mm a");
}

export function formatTime(dateStr) {
  return formatDate(dateStr, "hh:mm a");
}

export function relativeFromNow(dateStr) {
  if (!dateStr) return "-";
  try {
    return formatDistanceToNow(typeof dateStr === "string" ? parseISO(dateStr) : dateStr, {
      addSuffix: true,
    });
  } catch {
    return dateStr;
  }
}
