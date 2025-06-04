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

  const { suggestedUsersToFollow, error } = await getSuggestedUsersToFollow(
    loggedInUser.id,
  );

  if (error) {
    <p className="text-center text-destructive">{t(error)}</p>;
  }

  if (!suggestedUsersToFollow) {
    return (
      <p className="text-center text-muted-foreground">
        {t(whoToFollowSidebarTranslations.notFound)}
      </p>
    );
  }

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-base font-bold">
        {t(whoToFollowSidebarTranslations.title)}
      </div>
      {suggestedUsersToFollow.length > 0 ? (
        suggestedUsersToFollow.map((suggestedUserToFollow) => {
          return (
            <WhoToFollowItem
              key={suggestedUserToFollow.id}
              suggestedUserToFollow={suggestedUserToFollow}
              loggedInUserId={loggedInUser.id}
            />
          );
        })
      ) : (
        <p className="text-center text-muted-foreground">
          {t(whoToFollowSidebarTranslations.notFound)}
        </p>
      )}
    </div>
  );
}
