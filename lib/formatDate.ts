import { format } from "date-fns";

export function formatDate(dateInput: number | string | Date): string {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const now = Date.now();
  const diffInMilliseconds = now - date.getTime();
  const absoluteDiff = Math.abs(diffInMilliseconds);
  const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;

  if (absoluteDiff < twentyFourHoursInMilliseconds) {
    const totalSeconds = Math.floor(absoluteDiff / 1000);

    if (totalSeconds < 60) {
      return `${totalSeconds}s ${diffInMilliseconds >= 0 ? "ago" : "from now"}`;
    }

    const totalMinutes = Math.floor(totalSeconds / 60);

    if (totalMinutes < 60) {
      return `${totalMinutes}m ${diffInMilliseconds >= 0 ? "ago" : "from now"}`;
    }

    const totalHours = Math.floor(totalMinutes / 60);
    return `${totalHours}h ${diffInMilliseconds >= 0 ? "ago" : "from now"}`;
  }

  return format(date, "MMM d, yyyy");
}
