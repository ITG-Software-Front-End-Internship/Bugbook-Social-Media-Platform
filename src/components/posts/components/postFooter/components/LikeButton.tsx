"use client";

import kyInstance from "@/lib/ky";
import { postTranslations } from "@/lib/translationKeys";
import { LikeInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUpdateLikeStatusMutation } from "../hooks/useUpdateLikeStatusMutation";

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

export default function LikeButton({ postId, initialState }: LikeButtonProps) {
  const t = useTranslations();
  const queryClient = useQueryClient();

  /** TODO: move it to sperate hook */

  const queryKey: QueryKey = ["like-info", postId];

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

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
        {data.likes}{" "}
        <span className="hidden sm:inline">
          {t(postTranslations.footer.likes)}
        </span>
      </span>
    </button>
  );
}
