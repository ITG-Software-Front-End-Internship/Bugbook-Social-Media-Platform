"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import PostContent from "./components/postContent/PostContent";
import PostFooter from "./components/postFooter/PostFooter";
import PostHeader from "./components/postHeader/PostHeader";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  console.log(`Post render ...`);

  const { user: loggedInUser } = useSession();
  const isCurrentUserPost = post.user.id === loggedInUser.id;

  /** We need this state to show and hide the comment */

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <PostHeader post={post} isCurrentUserPost={isCurrentUserPost} />
      <PostContent
        postTextContent={post.content}
        postAttachments={post.attachments}
      />
      <hr className="text-muted-foreground" />
      <PostFooter post={post} loggedInUserId={loggedInUser.id} />
    </article>
  );
}
