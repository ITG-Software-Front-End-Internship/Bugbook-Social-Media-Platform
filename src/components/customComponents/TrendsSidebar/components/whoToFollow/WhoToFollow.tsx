"use server";

import { cachedValidateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import UserToolTip from "@/components/UserTooltip";
import { whoToFollowSidebarTranslations } from "@/lib/translationKeys";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import UserAvatar from "../../../UserAvatar";
import { getUsersToFollow } from "./services/getUsersToFollow";

export default async function WhoToFollow() {
  const t = await getTranslations();
  const { user } = await cachedValidateRequest();

  if (!user) {
    return null;
  }

  const usersToFollow = await getUsersToFollow(user.id);

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">
        {t(whoToFollowSidebarTranslations.title)}
      </div>
      {usersToFollow.map((user) => {
        return (
          <div
            className="flex items-center justify-between gap-3"
            key={user.id}
          >
            <UserToolTip user={user}>
              <Link
                href={`/users/${user.username}`}
                className="flex items-center gap-3"
              >
                <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
                <div className="flex-grow text-start">
                  <p className="line-clamp-1 break-all font-semibold hover:underline">
                    {user.displayName}
                  </p>
                  <p className="line-clamp-1 break-all text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
              </Link>
            </UserToolTip>
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
