import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia, Session, User } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import prisma from "./lib/prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      userName: databaseUserAttributes.userName,
      displayName: databaseUserAttributes.displayName,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  userName: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}

type ValidRequestType = { user: User; session: Session };
type InValidRequestType = { user: null; session: null };
type ValidateRequest = ValidRequestType | InValidRequestType;

const validateRequest = async (): Promise<ValidateRequest> => {
  const sessionId =
    (await cookies()).get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const validatedSessionRecord = await lucia.validateSession(sessionId);

  try {
    const isValidSession = validatedSessionRecord.session;
    const isFreshSession = validatedSessionRecord.session?.fresh;

    if (isValidSession && isFreshSession) {
      const sessionCookie = lucia.createSessionCookie(
        validatedSessionRecord.session.id,
      );

      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }

    const isSessionExists = validatedSessionRecord.session;

    if (!isSessionExists) {
      const blankSessionCookie = lucia.createBlankSessionCookie();

      (await cookies()).set(
        blankSessionCookie.name,
        blankSessionCookie.value,
        blankSessionCookie.attributes,
      );
    }
  } catch (error) {
    console.error(`An error happen while validate request`, error);
  }

  return validatedSessionRecord;
};

export const cachedValidateRequest = cache(validateRequest);
