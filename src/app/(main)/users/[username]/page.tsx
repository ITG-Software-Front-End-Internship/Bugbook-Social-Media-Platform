"use server";

import { cachedValidateRequest } from "@/auth";
import TrendsSidebar from "@/components/customComponents/TrendsSidebar/TrendsSidebar";
import { getLocaleSettings } from "@/hooks/useLocaleSettings";
import { profileTranslations } from "@/lib/translationKeys";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import UserProfile from "./components/userProfile/UserProfile";
import getUser from "./helpers/getUser";
import UserPosts from "./UserPosts";

interface PageParamsProps {
  username: string;
}

export async function generateMetaData({
  params,
}: {
  params: Promise<PageParamsProps>;
}): Promise<Metadata> {
  const { username } = await params;

  const { user: loggedInUser } = await cachedValidateRequest();

  if (!loggedInUser) {
    /*
     * This is just to handle case of null
     * Our setup handle it and forward user to login page
     */
    return {};
  }
  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function page({
  params,
}: {
  params: Promise<PageParamsProps>;
}) {
  const { username } = await params;

  const { user: loggedInUser } = await cachedValidateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You are not authorized to view this page
      </p>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  const t = await getTranslations();

  const { direction } = await getLocaleSettings();

  const userPostTitle =
    direction === "rtl"
      ? `${t(profileTranslations.posts.title)} ${user.displayName}`
      : `${user.displayName} ${t(profileTranslations.posts.title)}`;

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">{userPostTitle}</h2>
        </div>
        {/*<UserPosts userId={user.id} />*/}
      </div>
      {/*<TrendsSidebar />*/}
    </main>
  );
}
