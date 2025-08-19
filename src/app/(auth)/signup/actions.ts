"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { errorsMessages, validationsMessages } from "@/lib/translationKeys";
import { getSignUpSchema, SignUpValuesType } from "@/lib/validations";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { getTranslations } from "next-intl/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type SignUpReturnType = { error: string };

const HASH_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export async function signUp(
  credentials: SignUpValuesType,
): Promise<SignUpReturnType> {
  try {
    const t = await getTranslations();

    const signUpSchemaMessages = {
      emailInvalid: t(validationsMessages.email.invalid),
      userNameInvalidChars: t(validationsMessages.userName.invalidChars),
      passwordMinLength: t(validationsMessages.password.minLength),
      required: t(validationsMessages.required),
    };

    const { username, email, password } =
      getSignUpSchema(signUpSchemaMessages).parse(credentials);

    const existingUserName = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUserName) {
      return {
        error: t(validationsMessages.userName.alreadyTaken),
      };
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: t(validationsMessages.email.alreadyTaken),
      };
    }

    const passwordHash = await hash(password, HASH_OPTIONS);
    const userId = generateIdFromEntropySize(10);

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username: username,
          email: email,
          passwordHash: passwordHash,
          displayName: username,
        },
      });

      await streamServerClient.upsertUser({
        id: userId,
        username: username,
        name: username,
      });
    });

    const session = await lucia.createSession(userId, {});

    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    console.error(error);

    if (isRedirectError(error)) throw error;
    const t = await getTranslations("errors");
    return {
      error: t(errorsMessages.general.title),
    };
  }
}
