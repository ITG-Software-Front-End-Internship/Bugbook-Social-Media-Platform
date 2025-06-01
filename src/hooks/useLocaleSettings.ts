import { getLocale } from "next-intl/server";
import { getLangDir } from "rtl-detect";

export async function getLocaleSettings() {
  const locale = await getLocale();
  const direction = getLangDir(locale);
  return { locale, direction };
}
