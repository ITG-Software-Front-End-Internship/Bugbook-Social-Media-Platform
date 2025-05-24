"use client";

import { cachedValidateRequest } from "@/auth";
import { validationsMessages } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import {
  getUpdateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validations";
import { getTranslations } from "next-intl/server";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const t = await getTranslations();

  const updateUserProfileSchemaMessages = {
    required: t(validationsMessages.required),
    maxLength: t(validationsMessages.displayName.maxLength),
  };

  const validatedValues = await getUpdateUserProfileSchema(
    updateUserProfileSchemaMessages,
  ).parse(values);

  const { user } = await cachedValidateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: validatedValues,
    select: getUserDataSelect(user.id),
  });

  return updatedUser;
}
