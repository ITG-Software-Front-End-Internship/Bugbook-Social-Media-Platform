"use server";

import { trendingTopicsTranslations } from "@/lib/translationKeys";
import { formatNumber } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getTrendingTopics } from "../../helpers/getTrendingTopics";

export async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();
  const t = await getTranslations();

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">
        {t(trendingTopicsTranslations.title)}
      </div>
      {trendingTopics.map((trendingTopic) => {
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
      })}
    </div>
  );
}
