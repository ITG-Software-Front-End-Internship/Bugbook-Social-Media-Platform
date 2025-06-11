import Comments from "@/components/comments/components/Comments";
import { useLocaleSettings } from "@/hooks/useLocaleSettings";
import { PostData } from "@/lib/types";
import { useCallback, useMemo, useState } from "react";
import BookmarkButton from "./components/BookmarkButton";
import CommentButton from "./components/CommentButton";
import LikeButton from "./components/LikeButton";

interface PostFooterProps {
  post: PostData;
  loggedInUserId: string;
}

export default function PostFooter({ post, loggedInUserId }: PostFooterProps) {
  console.log(`PostFooter render ...`);

  const [showComment, setShowComment] = useState<boolean>(false);
  const { direction } = useLocaleSettings();

  /*const postLikes = useMemo(() => post.likes, [post.likes]);*/

  /*const likeInitialState = useMemo(() => {
    return {
      likes: post._count.likes,
      isLikedByUser: post.likes.some((post) => {
        return post.userId === loggedInUserId;
      }),
    };
  }, [loggedInUserId, post._count.likes, post.likes]);*/

  const bookmarkInitialState = useMemo(() => {
    return {
      isBookedmarkByUser: post.bookmarks.some((bookmark) => {
        return bookmark.userId === loggedInUserId;
      }),
    };
  }, [loggedInUserId, post.bookmarks]);

  const toggleShowComment = useCallback(() => {
    setShowComment((prevState) => !prevState);
  }, [setShowComment]);

  return (
    <>
      <div className="flex justify-between gap-5" dir={direction}>
        <div className="flex items-center gap-5">
          {/*<LikeButton postId={post.id} initialState={likeInitialState} />*/}
          {<CommentButton post={post} onClick={toggleShowComment} />}
        </div>
        {/*  <BookmarkButton
            postId={post.id}
            initialState={bookmarkInitialState}
          />*/}
      </div>
      {showComment && <Comments post={post} />}
    </>
  );
}
