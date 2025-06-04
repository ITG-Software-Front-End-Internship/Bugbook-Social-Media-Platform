"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import { whoToFollowSidebarTranslations } from "@/lib/translationKeys";
import { FollowerInfo } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Button } from "../../../../../ui/button";
import { useUpdateFollowStatusMutation } from "../hooks/useUpdateFollowStatusMutation";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowButton({
  userId,
  initialState,
}: FollowButtonProps) {
  console.log(`FollowButton render ...`);

  const t = useTranslations();
  const queryClient = useQueryClient();
  const { data: followerInfo } = useFollowerInfo(userId, initialState);

  const { mutate: updateFollowStatusMutate } = useUpdateFollowStatusMutation({
    userId,
    isFollowedByUser: followerInfo.isFollowedByUser,
    queryClient,
  });

  return (
    <Button
      variant={followerInfo.isFollowedByUser ? "secondary" : "default"}
      onClick={() => updateFollowStatusMutate()}
    >
      {followerInfo.isFollowedByUser
        ? t(whoToFollowSidebarTranslations.unfollow)
        : t(whoToFollowSidebarTranslations.follow)}
    </Button>
  );
}
