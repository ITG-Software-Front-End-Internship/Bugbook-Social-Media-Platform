import loginImage from "@/assets/login-image.jpg";
import { loginPageMessages } from "@/lib/constants";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import GoogleLoginButton from "./google/GoogleLoginButton";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default async function Page() {
  const t = await getTranslations();
  console.log("t: ", t);

  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">
              {t(loginPageMessages.login.buttonLabel)}
            </h1>
          </div>
          <div className="space-y-5">
            <GoogleLoginButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted"></div>
              <span>{t(loginPageMessages.account.or)}</span>
              <div className="h-px flex-1 bg-muted"></div>
            </div>
            <LoginForm />
            <Link href="/signup" className="block text-center hover:underline">
              {t(loginPageMessages.account.signup)}
            </Link>
          </div>
        </div>
        <Image
          src={loginImage}
          alt="Login bugbook"
          className="hidden w-1/2 object-cover md:block"
          priority={true}
        />
      </div>
    </main>
  );
}
