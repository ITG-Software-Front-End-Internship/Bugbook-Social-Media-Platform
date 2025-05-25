"use server";

import { cachedValidateRequest } from "@/auth";
import { validationsMessages } from "@/lib/constants";
import prisma from "@/lib/prisma";
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

  const validatedUpdatedUserProfileValues = await getUpdateUserProfileSchema(
    updateUserProfileSchemaMessages,
  ).parse(updatedUserProfileValues);

  const { user } = await cachedValidateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: validatedUpdatedUserProfileValues,
    select: getUserDataSelect(user.id),
  });

  return updatedUser;
}
