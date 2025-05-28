import kyInstance from "@/lib/ky";
import { CommentsPage, PostData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import Comment from "./Comment";
import CommentInput from "./CommentInput";

interface CommentsProps {
  post: PostData;
}

export default function Comments({ post }: CommentsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) => {
        return kyInstance
          .get(`/api/posts/${post.id}/comments`)
          .json<CommentsPage>();
      },
      /** Initally page params is null but we have to infer it to the type pageParam  */
      initialPageParam: null as string | null,
      /** Upward pagination */
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      /** Select function to modify data before we then recive it up */
      select: (data) => {
        return {
          /** Last comment at the top and the newest at the comment */
          /** React query documnation */
          pages: [...data.pages].reverse(),
          pageParams: [...data.pageParams].reverse(),
        };
      },
    });

  /**          
          inifinite loading return type
          {
            pageParams: any , note : "cursor ....",
            pages: Pages[]
          }

          pages type : 
          {
            nextCursor: any (id of next page if it exist),
            comments : Comment[]
          }
    */

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      <div className="divide-y">
        {comments.map((comment) => {
          return <Comment key={comment.id} comment={comment} />;
        })}
      </div>
    </div>
  );
}
