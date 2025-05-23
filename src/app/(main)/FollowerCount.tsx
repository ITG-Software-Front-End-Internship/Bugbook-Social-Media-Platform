"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

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
  const { data } = useFollowerInfo(userId, initialState);

  return (
    <span className="text-black">
      Followers :{" "}
      <span className={cn("font-semibold", className)}>
        {" "}
        {formatNumber(data.followers)}
      </span>
    </span>
  );
}
