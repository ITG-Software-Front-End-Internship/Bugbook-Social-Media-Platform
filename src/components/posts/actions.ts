"use server";

import { cachedValidateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function deletePost(postId: string) {
  const { user } = await cachedValidateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error("Post not found.");
  }

  const isAuthorizedToDelete = post.userId === user.id;

  if (!isAuthorizedToDelete) {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({
    where: { id: postId },
  });
}
