import { cachedValidateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import FollowButton from "../FollowButton";
import UserAvatar from "./UserAvatar";

export default function TrendsSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <div className="space-y-5">
          <WhoToFollow />
          <TrendingTopics />
        </div>
      </Suspense>
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await cachedValidateRequest();

  if (!user) {
    return null;
  }

  const userToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      {userToFollow.map((user) => {
        return (
          <div
            className="flex items-center justify-between gap-3"
            key={user.id}
          >
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
            </Link>
            <div className="flex-grow text-start">
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.displayName}
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground">
                @{user.username}
              </p>
            </div>
            <FollowButton
              userId={user.id}
              initialState={{
                followers: user._count.followers,
                isFollowedByUser: user.followers.some(({ followerId }) => {
                  return followerId === user.id;
                }),
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

const getTrendingTopics = unstable_cache(
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
    revalidate: 3 * 60 * 60,
  },
);

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending Topics</div>
      {trendingTopics.map((trendingTopic) => {
        const { hashtag, count } = trendingTopic;
        const title = hashtag.split("#")[1];

        return (
          <Link href={`/hashtag/${title}`} key={title} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={title}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
