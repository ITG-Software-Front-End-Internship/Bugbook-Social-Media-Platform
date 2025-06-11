"use client";

import { QUERY_KEYS } from "@/lib/queryKeys";
import { BookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import React from "react";
import { useFetchPostBookmarks } from "../hooks/useFetchPostBookmarks";
import { useUpdateBookmarkStatusMutation } from "../hooks/useUpdateBookmarkStatusMutation";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

function BookmarkButton({ postId, initialState }: BookmarkButtonProps) {
  console.log(`Bookmark button render ...`);

  const queryClient = useQueryClient();
  const queryKey: QueryKey = QUERY_KEYS.getBookmarkInfoPost(postId);

  const {
    data: { isBookedmarkByUser },
  } = useFetchPostBookmarks({ queryKey, initialState, postId });

  const { mutate } = useUpdateBookmarkStatusMutation({
    queryClient,
    queryKey,
    isBookedmarkByUser,
    postId,
  });

  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Bookmark
        className={cn(
          "size-5",
          isBookedmarkByUser && "fill-primary text-primary",
        )}
      />
    </button>
  );
}

export default React.memo(BookmarkButton);
