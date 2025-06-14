"use server";

import FollowButton from "@/components/customComponents/TrendsSidebar/components/whoToFollow/components/FollowButton";
import UserAvatar from "@/components/customComponents/user/userAvatar/UserAvatar";
import Linkify from "@/components/linkify/Linkify";
import { getLocaleSettings } from "@/hooks/useLocaleSettings";
import { profileTranslations } from "@/lib/translationKeys";
import { FollowerInfo, UserData } from "@/lib/types";
import { formatNumber, getMappedLocale, SupportedLang } from "@/lib/utils";
import { formatDate } from "date-fns";
import { getTranslations } from "next-intl/server";
import FollowerCount from "../../../components/followingFeed/followerCount/FollowerCount";
import EditProfileButton from "../editProfile/editProfileButton/EditProfileButton";

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

export default async function UserProfile({
  user,
  loggedInUserId,
}: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(({ followerId }) => {
      return followerId === loggedInUserId;
    }),
  };

  const { locale } = await getLocaleSettings();

  const t = await getTranslations();

  const formattedUserCreatedAtAccount = formatDate(
    user.createdAt,
    "MMMM d, yyyy",
    {
      locale: getMappedLocale(locale as SupportedLang),
    },
  );

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>
            {t(profileTranslations.edit.memberSince)}{" "}
            {formattedUserCreatedAtAccount}
          </div>
          <div className="flex items-center gap-3">
            <span>
              {t(profileTranslations.posts.title)}:{""}{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
}
