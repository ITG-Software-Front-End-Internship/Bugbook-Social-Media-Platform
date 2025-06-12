"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import FollowerCount from "@/app/(main)/users/components/followingFeed/followerCount/FollowerCount";
import { FollowerInfo, UserData } from "@/lib/types";
import Link from "next/link";
import { memo, PropsWithChildren, useEffect, useMemo } from "react";
import FollowButton from "../customComponents/TrendsSidebar/components/whoToFollow/components/FollowButton";
import UserAvatar from "../customComponents/UserAvatar";
import Linkify from "../linkify/Linkify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface UserTooltipProps extends PropsWithChildren {
  user: UserData;
}

function UserToolTip({ user, children }: UserTooltipProps) {
  console.log(`User tool tip render ...`);

  const { user: loggedInUser } = useSession();

  const userFollowersCount = user._count.followers;

  const userFollowersIds = useMemo(() => user.followers, [user.followers]);

  const followerState: FollowerInfo = useMemo(() => {
    return {
      followers: userFollowersCount,
      isFollowedByUser: !!userFollowersIds.some(({ followerId }) => {
        /** Check if the loggedInUserId is a follower of tooltip user. */
        return followerId === loggedInUser.id;
      }),
    };
  }, [loggedInUser.id, userFollowersCount, userFollowersIds]);

  useEffect(() => {
    console.log(`Follower state changed ...`);
  }, [followerState]);

  const isCurrentLoggedInUserToolTip = loggedInUser.id === user.id;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="bg-card shadow-2xl">
          <div className="flex max-w-80 flex-col gap-3 break-words bg-card px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.id}`}>
                <UserAvatar avatarUrl={user.avatarUrl} size={70} />
              </Link>
              {isCurrentLoggedInUserToolTip && (
                <FollowButton userId={user.id} initialState={followerState} />
              )}
            </div>
            <div>
              <Link href={`/users/${user.username}`}>
                <div className="text-lg font-bold text-black hover:underline">
                  {user.displayName}
                </div>
                <div className="text-muted-foreground">@{user.username}</div>
              </Link>
            </div>
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line text-black">
                  {user.bio}
                </div>
              </Linkify>
            )}
            <FollowerCount
              userId={user.id}
              initialState={followerState}
              className="text-black"
            />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default memo(UserToolTip);
