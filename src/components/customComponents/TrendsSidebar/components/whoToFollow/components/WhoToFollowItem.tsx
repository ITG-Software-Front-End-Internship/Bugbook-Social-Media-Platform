"use server";

import FollowButton from "@/components/customComponents/TrendsSidebar/components/whoToFollow/components/FollowButton";
import UserToolTip from "@/components/userTooltip/UserTooltip";
import { UserData } from "@/lib/types";
import UserToFollowSidebarInfo from "./UserToFollowSidebarInfo";

interface WhoToFollowItemProps {
  suggestedUserToFollow: UserData;
  loggedInUserId: string;
}

export default async function WhoToFollowItem({
  suggestedUserToFollow,
  loggedInUserId,
}: WhoToFollowItemProps) {
  console.log(`who to follow item render ...`);

  const followInitialState = {
    followers: suggestedUserToFollow._count.followers,
    isFollowedByUser: suggestedUserToFollow.followers.some(({ followerId }) => {
      /** Check if the loggedInUserId is a follower of  suggestedUserToFollow  */
      return followerId === loggedInUserId;
    }),
  };

  return (
    <div
      className="flex items-center justify-between gap-3"
      key={suggestedUserToFollow.id}
    >
      <UserToolTip user={suggestedUserToFollow}>
        <UserToFollowSidebarInfo
          displayName={suggestedUserToFollow.displayName}
          username={suggestedUserToFollow.username}
          userAvatarUrl={suggestedUserToFollow.avatarUrl}
        />
      </UserToolTip>
      <FollowButton
        userId={suggestedUserToFollow.id}
        initialState={followInitialState}
      />
    </div>
  );
}
