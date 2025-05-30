import { google, lucia } from "@/auth";
import kyInstance from "@/lib/ky";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { slugify } from "@/lib/utils";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  /**
   * They will send to us by google via the google search params
   */

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const storedCodeVerifer = (await cookies()).get("code_verifier")?.value;
  const storedState = (await cookies()).get("state")?.value;

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifer ||
    state !== storedState
  ) {
    return new Response(null, {
      status: 404,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifer,
    );

    const googleUser = await kyInstance
      .get("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      })
      .json<{ id: string; name: string }>();

    const existingUser = await prisma.user.findUnique({
      where: {
        googleId: googleUser.id,
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return Response.json(null, {
        status: 302,
        headers: { location: "/" },
      });
    }
    const userId = generateIdFromEntropySize(10);

    /** We take the name that user has on google */
    const username = `${slugify(googleUser.name)}-${userId.slice(0, 4)}`;

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username: username,
          googleId: googleUser.id,
          displayName: googleUser.name,
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

    return Response.json(null, {
      status: 302,
      headers: { location: "/" },
    });
  } catch (error) {
    console.error(error);

    if (error instanceof OAuth2RequestError) {
      return Response.json(null, {
        status: 400,
      });
    }
    return Response.json(null, {
      status: 500,
    });
  }
}
