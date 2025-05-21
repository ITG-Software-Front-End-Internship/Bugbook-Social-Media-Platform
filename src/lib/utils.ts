import { clsx, type ClassValue } from "clsx";
import { formatDate, formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(fromDate: Date) {
  const currentDate = new Date();

  const HOURS_IN_DAY = 24;
  const MINUTES_IN_HOUR = 60;
  const SECONDS_IN_MINUTE = 60;
  const MILLISECONDS_IN_A_SECOND = 1000;

  const twentyFourHours =
    HOURS_IN_DAY *
    MINUTES_IN_HOUR *
    SECONDS_IN_MINUTE *
    MILLISECONDS_IN_A_SECOND;

  const isPostedWithin24Hours =
    currentDate.getTime() - fromDate.getTime() < twentyFourHours;

  if (isPostedWithin24Hours) {
    return formatDistanceToNow(fromDate, {
      addSuffix: true,
    });
  } else {
    const isPostedWithinSameYear =
      currentDate.getFullYear() === fromDate.getFullYear();
    if (isPostedWithinSameYear) {
      return formatDate(fromDate, "MMM d");
    } else {
      return formatDate(fromDate, "MMM d, yyyy");
    }
  }
}
