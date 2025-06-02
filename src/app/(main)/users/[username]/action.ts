"use server";

import { cachedValidateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { validationsMessages } from "@/lib/translationKeys";
import { getUserDataSelect } from "@/lib/types";
import {
  getUpdateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validations";
import { getTranslations } from "next-intl/server";

export async function updateUserProfile(
  updatedUserProfileValues: UpdateUserProfileValues,
) {
  const t = await getTranslations();

  const updateUserProfileSchemaMessages = {
    required: t(validationsMessages.required),
    maxLength: t(validationsMessages.displayName.maxLength),
  };

  const validatedUpdatedUserProfileValues = getUpdateUserProfileSchema(
    updateUserProfileSchemaMessages,
  ).parse(updatedUserProfileValues);

  const { user } = await cachedValidateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  /**
   * Note: for description of chat client see the create part.
   */

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: {
        id: user.id,
      },
      data: validatedUpdatedUserProfileValues,
      select: getUserDataSelect(user.id),
    });
    await streamServerClient.partialUpdateUser({
      id: user.id,
      set: {
        name: validatedUpdatedUserProfileValues.displayName,
      },
    });
    return updatedUser;
  });

  return updatedUser;
}
