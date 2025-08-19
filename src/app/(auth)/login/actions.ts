"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { errorsMessages, validationsMessages } from "@/lib/translationKeys";
import { getLoginSchema, LoginValuesType } from "@/lib/validations";
import { verify } from "@node-rs/argon2";
import { getTranslations } from "next-intl/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type LoginReturnType = { error: string };

const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export async function login(
  credentials: LoginValuesType,
): Promise<LoginReturnType> {
  try {
    const t = await getTranslations();

    const loginSchemaMessages = {
      passwordMinLength: t(validationsMessages.password.minLength),
      required: t(validationsMessages.required),
    };

    const { userName, password: unHashedPassword } =
      getLoginSchema(loginSchemaMessages).parse(credentials);

    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: userName,
          mode: "insensitive",
        },
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: t(validationsMessages.credentials.invalid),
      };
    }

    const validPassword = await verify(
      existingUser.passwordHash,
      unHashedPassword,
      ARGON2_OPTIONS,
    );

    if (!validPassword) {
      return {
        error: t(validationsMessages.credentials.invalid),
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return redirect("/");
  } catch (error) {
    console.error(error);

    if (isRedirectError(error)) {
      throw error;
    }

    const t = await getTranslations("errors");

    return {
      error: t(errorsMessages.general.title),
    };
  }
}
