import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cachedValidateRequest } from "@/auth";
import TrendsSidebar from "@/components/customComponents/TrendsSidebar/TrendsSidebar";
import SearchResults from "./components/SearchResults";
import { searchTranslations } from "@/lib/translationKeys";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}): Promise<Metadata> {
  const { q } = searchParams;
  const { user: loggedInUser } = await cachedValidateRequest();

  if (!loggedInUser || !q) return {};
  return {
    title: `Search results for ${q}`,
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const { q } = searchParams;
  const t = await getTranslations();

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="line-clamp-2 break-all text-center text-2xl font-bold">
            <bdi>
              {t(searchTranslations.title)} {q ? `"${q}"` : ""}
            </bdi>
          </h1>
        </div>
        {q && <SearchResults query={q} />}
      </div>
      <TrendsSidebar />
    </main>
  );
}
