import { google } from "@/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";

const NUMBER_OF_MINUTES = 10;
const SECONDS_IN_MINUTES = 60;

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, [
    "profile",
    "email",
  ]);

  (await cookies()).set("state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: NUMBER_OF_MINUTES * SECONDS_IN_MINUTES,
    sameSite: "lax",
  });

  (await cookies()).set("code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: NUMBER_OF_MINUTES * SECONDS_IN_MINUTES,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
