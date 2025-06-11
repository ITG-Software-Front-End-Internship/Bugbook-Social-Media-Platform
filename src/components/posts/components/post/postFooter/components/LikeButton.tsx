"use client";

import { QUERY_KEYS } from "@/lib/queryKeys";
import { postTranslations } from "@/lib/translationKeys";
import { LikeInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { useFetchPostLikes } from "../hooks/useFetchPostLikes";
import { useUpdateLikeStatusMutation } from "../hooks/useUpdateLikeStatusMutation";

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

function LikeButton({ postId, initialState }: LikeButtonProps) {
  console.log(`Like button render ...`);
  const t = useTranslations();
  const queryClient = useQueryClient();

  const queryKey: QueryKey = QUERY_KEYS.getLikeInfoPost(postId);

  const { data } = useFetchPostLikes({
    postId,
    queryKey,
    initialState,
  });

  const numberOfLikes = data.likes;

  const { mutate: updateLikeMutate } = useUpdateLikeStatusMutation({
    postId,
    queryClient,
    queryKey,
    isLikedByUser: data.isLikedByUser,
  });

  return (
    <button
      onClick={() => updateLikeMutate()}
      className="flex items-center gap-2"
    >
      <Heart
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {numberOfLikes}{" "}
        <span className="hidden sm:inline">
          {t(postTranslations.footer.likes)}
        </span>
      </span>
    </button>
  );
}

export default React.memo(LikeButton);
