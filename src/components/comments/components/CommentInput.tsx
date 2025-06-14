import { postTranslations } from "@/lib/translationKeys";
import { PostData } from "@/lib/types";
import { Loader2, SendHorizonal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useSubmitCommentMutation } from "../hooks/useSubmitCommentMutation";

interface CommentInputProps {
  post: PostData;
}

export default function CommentInput({ post }: CommentInputProps) {
  console.log(`Comment input render ...`);

  const t = useTranslations();

  const [commentInput, setCommentInput] = useState<string>("");

  const { mutate: submitCommentMutate, isPending } = useSubmitCommentMutation(
    post.id,
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!commentInput) {
      return;
    }

    submitCommentMutate(
      {
        post: post,
        content: commentInput,
      },
      {
        onSuccess() {
          setCommentInput("");
        },
      },
    );
  }

  return (
    <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
      <Input
        placeholder={t(postTranslations.footer.comments.writeAComment)}
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
        autoFocus
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!commentInput.trim() || isPending}
      >
        {!isPending ? (
          <SendHorizonal className="size-5 cursor-pointer" />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </Button>
    </form>
  );
}
