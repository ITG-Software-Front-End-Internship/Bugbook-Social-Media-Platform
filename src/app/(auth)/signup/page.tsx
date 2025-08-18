import { Metadata } from "next";
import React from "react";
import { signupPageTranslations } from "@/lib/translationKeys";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./components/SignUpForm";

export const metadata: Metadata = {
  title: "SignUp",
};

async function page() {
  const t = await getTranslations();

  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">
              {t(signupPageTranslations.signup.title)}
            </h1>
            <p className="text-muted-foreground">
              {t.rich(signupPageTranslations.signup.subTitle, {
                italic: (chunks) => <span className="italic">{chunks}</span>,
              })}
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link href="/login" className="block text-center hover:underline">
              {t(signupPageTranslations.signup.account.login)}
            </Link>
          </div>
        </div>
        <Image
          src="/signup-image.jpg"
          alt="Signup bugbook"
          className="hidden w-1/2 object-cover md:block"
          priority={true}
        />
      </div>
    </main>
  );
}

export default page;
