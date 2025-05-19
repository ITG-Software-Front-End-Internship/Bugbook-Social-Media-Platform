"use server";

import { cachedValidateRequest, lucia } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const { session } = await cachedValidateRequest();

  if (!session) {
    throw new Error("Unauthorized");
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/login");
}
