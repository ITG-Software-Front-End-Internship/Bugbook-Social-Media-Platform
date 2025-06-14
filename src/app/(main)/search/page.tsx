"use server";

import { cachedValidateRequest } from "@/auth";
import TrendsSidebar from "@/components/customComponents/TrendsSidebar/TrendsSidebar";
import { searchTranslations } from "@/lib/translationKeys";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SearchResults from "./components/SearchResults";

interface PageProps {
  q: string;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q: string };
}): Promise<Metadata> {
  const { q } = await searchParams;

  const { user: loggedInUser } = await cachedValidateRequest();

  if (!loggedInUser) {
    return {};
  }

  return {
    title: `Search results for ${q}`,
  };
}

export default async function page({
  searchParams,
}: {
  searchParams: Promise<PageProps>;
}) {
  const { q } = await searchParams;

  const t = await getTranslations();

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="line-clamp-2 break-all text-center text-2xl font-bold">
            <bdi>
              {t(searchTranslations.title)} &quot;{q}&quot;
            </bdi>
          </h1>
        </div>
        <SearchResults query={q} />
      </div>
      <TrendsSidebar />
    </main>
  );
}
