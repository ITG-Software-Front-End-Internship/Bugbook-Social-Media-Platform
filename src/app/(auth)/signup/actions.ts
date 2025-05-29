"use server";

import { lucia } from "@/auth";
import { errorsMessages, validationsMessages } from "@/lib/constants";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { getSignUpSchema, SignUpValuesType } from "@/lib/validations";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { getTranslations } from "next-intl/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type SignUpReturnType = { error: string };

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

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = generateIdFromEntropySize(10);

    /**
     * We need to execute the second after the create operation.
    
    * if create user faild,  the streamServerClient user will not even execute and it dosent have to rollback.
     
    * if the create user successed and the other faild (it will throw an error and rollback), so the create of user also will rollback the first operation.
     
     */

    await prisma.$transaction(async (tx) => {
      /**
       * We can not only pass prisma operation.
       * Like calling non prisma client
       */
      await tx.user.create({
        data: {
          id: userId,
          username: username,
          email: email,
          passwordHash: passwordHash,
          displayName: username,
        },
      });

      /**
     * In our prev implemntation we have to open message page to create our stream user otherwise we would not see our users in the search 
    
    - (will give problem if we want later to get unread count messages if the user then dose not exist it will return an error.)
    
    * Instead of waiting to call useInitializeChatClient to connect user to want to create stream user eailer when we sign up in the app.
    
    * Other alternative way is to call the useInitializeChatClient hook as soon as we open any pages then we create the user stream client (this creates unnecessary stream connection)

     */

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
      error: t(errorsMessages.general),
    };
  }
}
