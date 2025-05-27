import { cachedValidateRequest } from "@/auth";
import Post from "@/components/posts/Post";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

interface PageParamsProps {
  postId: string;
}

const getPost = async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(postId),
  });

  if (!post) {
    return notFound();
  }

  return post;
};
const cachedGetPost = cache(getPost);

export async function generateMetaData({
  params,
}: {
  params: Promise<PageParamsProps>;
}): Promise<Metadata> {
  const { postId } = await params;

  const { user: loggedInUser } = await cachedValidateRequest();

  if (!loggedInUser) {
    /*
     * This is just to handle case of null
     * Our setup handle it and forward user to login page
     */
    return {};
  }
  const post = await cachedGetPost(postId, loggedInUser.id);

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<PageParamsProps>;
}) {
  const { postId } = await params;

  const { user: loggedInUser } = await cachedValidateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You are not authorized to view this page
      </p>
    );
  }

  const post = await cachedGetPost(postId, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
    </main>
  );
}
