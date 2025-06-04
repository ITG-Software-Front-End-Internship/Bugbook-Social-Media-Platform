import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const NUMBER_OF_HOURS = 3;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;

export const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
  SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+','g'))) AS hashtag, 
  COUNT(*) AS count
  FROM posts
  GROUP BY (hashtag)
  ORDER BY count DESC, hashtag ASC
  LIMIT 5
  `;

    return result.map((row) => {
      return {
        hashtag: row.hashtag,
        count: Number(row.count),
      };
    });
  },
  ["trending_topics"],
  {
    revalidate: NUMBER_OF_HOURS * MINUTES_IN_HOUR * SECONDS_IN_MINUTE,
  },
);
