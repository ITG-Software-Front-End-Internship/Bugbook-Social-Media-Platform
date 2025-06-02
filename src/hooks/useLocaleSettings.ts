import { useLocale } from "next-intl";
import { getLocale } from "next-intl/server";
import { getLangDir } from "rtl-detect";

export async function getLocaleSettings() {
  const locale = await getLocale();
  const direction = getLangDir(locale);
  return { locale, direction };
}

export function useLocaleSettings() {
  const locale = useLocale();
  const direction = getLangDir(locale);
  return { locale, direction };
}
