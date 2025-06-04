import { clsx, type ClassValue } from "clsx";
import { formatDate, formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(fromDate: Date, locale: "ar" | "en" = "en") {
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

  const selectedLocale = locale === "ar" ? ar : enUS;

  if (isPostedWithin24Hours) {
    return formatDistanceToNow(fromDate, {
      addSuffix: true,
      locale: selectedLocale,
    });
  } else {
    const isPostedWithinSameYear =
      currentDate.getFullYear() === fromDate.getFullYear();
    if (isPostedWithinSameYear) {
      return formatDate(fromDate, "MMM d", { locale: selectedLocale });
    } else {
      return formatDate(fromDate, "MMM d, yyyy", { locale: selectedLocale });
    }
  }
}

export function formatNumber(number: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
}

export function slugify(input: string): string {
  /** Replace empty spaces with dashes */

  /** Remove anything not a-z and 0-0 and - and remove it "" */

  return input
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
