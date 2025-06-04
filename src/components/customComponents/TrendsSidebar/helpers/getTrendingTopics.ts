import prisma from "@/lib/prisma";
import { trendingTopicsTranslations } from "@/lib/translationKeys";
import { getTranslations } from "next-intl/server";
import { unstable_cache } from "next/cache";

const NUMBER_OF_HOURS = 3;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;

const trendingTopicsRevalidate =
  NUMBER_OF_HOURS * MINUTES_IN_HOUR * SECONDS_IN_MINUTE;

const CACHE_KEY = ["trending_topics"];

const TRENDING_TOPICS_QUERY = prisma.$queryRaw<
  { hashtag: string; count: bigint }[]
>`
  SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+','g'))) AS hashtag, 
  COUNT(*) AS count
  FROM posts
  GROUP BY (hashtag)
  ORDER BY count DESC, hashtag ASC
  LIMIT 5
  `;

export const getTrendingTopics = async () => {
  const t = await getTranslations();

  try {
    const result = await TRENDING_TOPICS_QUERY;
    const trendingTopics = result.map((row) => {
      return {
        hashtag: row.hashtag,
        count: Number(row.count),
      };
    });

    return { trendingTopics };
  } catch (error) {
    console.error(error);

    return {
      error: t(trendingTopicsTranslations.generalError),
    };
  }
};

export default unstable_cache(getTrendingTopics, CACHE_KEY, {
  revalidate: trendingTopicsRevalidate,
});
