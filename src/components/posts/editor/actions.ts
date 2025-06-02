"use server";

import { cachedValidateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { validationsMessages } from "@/lib/translationKeys";
import { getPostDataInclude } from "@/lib/types";
import { getCreatePostSchema } from "@/lib/validations";
import { getTranslations } from "next-intl/server";

export default async function submitPost(input: {
  content: string;
  mediaIds: string[];
}) {
  const { user } = await cachedValidateRequest();
  if (!user) {
    throw new Error(`Unauthorized.`);
  }

  const t = await getTranslations();

  const createPostSchemaMessages = {
    required: t(validationsMessages.required),
    maxNumberOfAttachments: t(validationsMessages.attachments.maxLength),
  };

  const { content, mediaIds } = getCreatePostSchema(
    createPostSchemaMessages,
  ).parse(input);

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
      attachments: {
        connect: mediaIds.map((mediaId) => ({ id: mediaId })),
      },
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}
