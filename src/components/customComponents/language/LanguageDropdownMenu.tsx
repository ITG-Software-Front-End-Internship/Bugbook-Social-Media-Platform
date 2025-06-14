"use client";

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";

export default function LanguageDropdownMenu() {
  const router = useRouter();
  const currentLocale = useLocale();

  const availableLocales = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ];

  const changeLanguage = (newLocale: string) => {
    if (newLocale !== currentLocale) {
      document.cookie = `locale=${newLocale}; path=/; max-age=31536000`; // 1 year

      localStorage.setItem("locale", newLocale);

      router.refresh();
    }
  };

  return (
    <DropdownMenuPortal>
      <DropdownMenuSubContent>
        {availableLocales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => changeLanguage(locale.code)}
          >
            {locale.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  );
}
