import { google } from "@/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";

const NUMBER_OF_MINUTES = 10;
const SECONDS_IN_MINUTES = 60;

export async function GET() {
  /**
   * This state is a random string that will be send to google and back, and from this we will verify that this is actually our own request and it wasnt changed with some way
   */

  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = google.createAuthorizationURL(state, codeVerifier, [
    "profile",
    "email",
  ]);

  /** Put state and verifer in cookes */

  (await cookies()).set("state", state, {
    path: "/",
    /** Just in production we will use https: */
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: NUMBER_OF_MINUTES * SECONDS_IN_MINUTES,
    sameSite: "lax",
  });

  (await cookies()).set("code_verifier", codeVerifier, {
    path: "/",
    /** Just in production we will use https: */
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: NUMBER_OF_MINUTES * SECONDS_IN_MINUTES,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
