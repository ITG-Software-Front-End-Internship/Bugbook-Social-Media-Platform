"use server";

import { cachedValidateRequest } from "@/auth";
import { validationsMessages } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { getCreatePostSchema } from "@/lib/validations";
import { getTranslations } from "next-intl/server";

export default async function submitPost(input: string) {
  const { user } = await cachedValidateRequest();
  if (!user) {
    throw new Error(`Unauthorized.`);
  }

  const t = await getTranslations();

  const createPostSchemaMessages = {
    required: t(validationsMessages.required),
  };

  const { content } = getCreatePostSchema(createPostSchemaMessages).parse({
    content: input,
  });

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}
