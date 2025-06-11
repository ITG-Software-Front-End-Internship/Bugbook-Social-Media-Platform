import { useLocaleSettings } from "@/hooks/useLocaleSettings";
import { postTranslations } from "@/lib/translationKeys";
import { PostData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../../ui/button";
import { usePostCommentsInfiniteQuery } from "../hooks/usePostCommentsInfiniteQuery";
import Comment from "./Comment";
import CommentInput from "./CommentInput";

interface CommentsProps {
  post: PostData;
}

export default function Comments({ post }: CommentsProps) {
  console.log(`Comments redner ....`);

  const t = useTranslations();

  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    usePostCommentsInfiniteQuery({ postId: post.id });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  const { direction } = useLocaleSettings();

  return (
    <div className="space-y-3" dir={direction}>
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          {t(postTranslations.footer.comments.loadPrevComment)}
        </Button>
      )}
      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
      {status === "success" && !comments.length && (
        <p className="text-center text-muted-foreground">
          {" "}
          {t(postTranslations.footer.comments.noComments)}
        </p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive">
          {t(postTranslations.footer.comments.error)}
        </p>
      )}
      <div className="divide-y">
        {comments.map((comment) => {
          return <Comment key={comment.id} comment={comment} />;
        })}
      </div>
    </div>
  );
}
