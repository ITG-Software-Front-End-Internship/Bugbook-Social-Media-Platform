"use server";

import { trendingTopicsTranslations } from "@/lib/translationKeys";
import { formatNumber } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getTrendingTopics } from "../../helpers/getTrendingTopics";

export async function TrendingTopics() {
  console.log(`TrendingTopics render ...`);

  const { trendingTopics, error } = await getTrendingTopics();
  const t = await getTranslations();

  if (error) {
    <p className="text-center text-destructive">{t(error)}</p>;
  }

  if (!trendingTopics) {
    return (
      <p className="text-center text-muted-foreground">
        {t(trendingTopicsTranslations.notFound)}
      </p>
    );
  }

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-base font-bold">
        {t(trendingTopicsTranslations.title)}
      </div>
      {trendingTopics.length > 0 ? (
        trendingTopics.map((trendingTopic) => {
          const { hashtag, count } = trendingTopic;
          const title = hashtag.split("#")[1];

          const formattedCountNumber = formatNumber(count);
          const postLabel = count === 1 ? "post" : "posts";

          return (
            <Link href={`/hashtag/${title}`} key={title} className="block">
              <p
                className="line-clamp-1 break-all font-semibold hover:underline"
                title={title}
              >
                {hashtag}
              </p>
              <p className="text-sm text-muted-foreground">
                {formattedCountNumber} {postLabel}
              </p>
            </Link>
          );
        })
      ) : (
        <p className="text-center text-muted-foreground">
          {t(trendingTopicsTranslations.notFound)}
        </p>
      )}
    </div>
  );
}
