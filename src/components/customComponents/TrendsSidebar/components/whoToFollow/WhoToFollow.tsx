"use server";

import { cachedValidateRequest } from "@/auth";
import { whoToFollowSidebarTranslations } from "@/lib/translationKeys";
import { getTranslations } from "next-intl/server";
import WhoToFollowItem from "./components/WhoToFollowItem";
import { getSuggestedUsersToFollow } from "./services/getSuggestedUsersToFollow";

export default async function WhoToFollow() {
  const t = await getTranslations();
  const { user: loggedInUser } = await cachedValidateRequest();

  if (!loggedInUser) {
    return null;
  }

  const suggestedUsersToFollow = await getSuggestedUsersToFollow(
    loggedInUser.id,
  );

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-lg font-bold">
        {t(whoToFollowSidebarTranslations.title)}
      </div>
      {suggestedUsersToFollow.map((suggestedUserToFollow) => {
        return (
          <WhoToFollowItem
            key={suggestedUserToFollow.id}
            suggestedUserToFollow={suggestedUserToFollow}
            loggedInUserId={loggedInUser.id}
          />
        );
      })}
    </div>
  );
}
