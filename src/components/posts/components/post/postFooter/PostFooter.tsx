import Comments from "@/components/comments/Comments";
import { useLocaleSettings } from "@/hooks/useLocaleSettings";
import { PostData } from "@/lib/types";
import { useState } from "react";
import BookmarkButton from "../../BookmarkButton";
import { CommentButton } from "./components/CommentButton";
import LikeButton from "./components/LikeButton";

interface PostFooterProps {
  post: PostData;
  loggedInUserId: string;
}

export default function PostFooter({ post, loggedInUserId }: PostFooterProps) {
  console.log(`PostFooter render ...`);

  const [showComment, setShowComment] = useState<boolean>(false);
  const { direction } = useLocaleSettings();

  return (
    <>
      <div className="flex justify-between gap-5" dir={direction}>
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.likes,
              isLikedByUser: post.likes.some((post) => {
                return post.userId === loggedInUserId;
              }),
            }}
          />
          <CommentButton
            post={post}
            onClick={() => setShowComment(!showComment)}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookedmarkByUser: post.bookmarks.some((bookmark) => {
              return bookmark.userId === loggedInUserId;
            }),
          }}
        />
      </div>
      {showComment && <Comments post={post} />}
    </>
  );
}
