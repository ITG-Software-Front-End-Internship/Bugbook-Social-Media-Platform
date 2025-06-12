"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import { followersTranslations } from "@/lib/translationKeys";
import { FollowerInfo } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
  className?: string;
}

export default function FollowerCount({
  userId,
  initialState,
  className,
}: FollowerCountProps) {
  console.log(`Followers count render ...`);

  const t = useTranslations();

  const {
    data: { followers: followersNumber },
  } = useFollowerInfo(userId, initialState);

  const formattedFollowersNumber = formatNumber(followersNumber);

  return (
    <span className="text-black">
      {t(followersTranslations.title)} :{" "}
      <span className={cn("font-semibold", className)}>
        {" "}
        {formattedFollowersNumber}
      </span>
    </span>
  );
}
