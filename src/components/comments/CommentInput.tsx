import { PostData } from "@/lib/types";
import { Loader2, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSubmitCommentMutation } from "./mutations";

interface CommentInputProps {
  post: PostData;
}

export default function CommentInput({ post }: CommentInputProps) {
  const [commentInput, setCommentInput] = useState<string>("");

  const mutation = useSubmitCommentMutation(post.id);

  /**
   * * Since comment dose not need any error messages validations, so i decided to use simple input field without any form library.
   * TODO: change it later to tiptap editor and add form library ti it.
   */

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!commentInput) {
      return;
    }

    mutation.mutate(
      {
        post: post,
        content: commentInput,
      },
      {
        onSuccess() {
          /** Make comment input empty again */
          setCommentInput("");
        },
      },
    );
  }

  return (
    <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
      <Input
        placeholder="Write a comment ..."
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
        autoFocus
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!commentInput.trim() || mutation.isPending}
      >
        {!mutation.isPending ? (
          <SendHorizonal className="size-5 cursor-pointer" />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </Button>
    </form>
  );
}
