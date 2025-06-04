"use client";

import { useLocaleSettings } from "@/hooks/useLocaleSettings";
import { headerTranslations } from "@/lib/translationKeys";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslations } from "use-intl";
import { Input } from "../ui/input";

export default function SearchField() {
  console.log(`Search field ...`);

  const router = useRouter();
  const { direction } = useLocaleSettings();
  const t = useTranslations();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const query = (form.query as HTMLInputElement).value.trim();
    if (!query) {
      return;
    }
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className="relative">
        <Input
          name="query"
          placeholder={t(headerTranslations.searchField.placeholder)}
          className="pe-10"
        />
        <SearchIcon
          className={cn(
            "absolute top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground",
            direction === "rtl" ? "left-2" : "right-3",
          )}
        />
      </div>
    </form>
  );
}
