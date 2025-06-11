import { cachedValidateRequest } from "@/auth";
import FollowButton from "@/components/customComponents/TrendsSidebar/components/whoToFollow/components/FollowButton";
import UserAvatar from "@/components/customComponents/UserAvatar";
import Linkify from "@/components/linkify/Linkify";
import Post from "@/components/posts/components/post/Post";
import UserToolTip from "@/components/UserTooltip/UserTooltip";
import prisma from "@/lib/prisma";
import { getPostDataInclude, UserData } from "@/lib/types";
import { log } from "console";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

interface PageParamsProps {
  postId: string;
}

const getPost = async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(postId),
  });

  if (!post) {
    return notFound();
  }

  return post;
};
const cachedGetPost = cache(getPost);

export async function generateMetaData({
  params,
}: {
  params: Promise<PageParamsProps>;
}): Promise<Metadata> {
  const { postId } = await params;

  const { user: loggedInUser } = await cachedValidateRequest();

  if (!loggedInUser) {
    /*
     * This is just to handle case of null
     * Our setup handle it and forward user to login page
     */
    return {};
  }
  const post = await cachedGetPost(postId, loggedInUser.id);

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<PageParamsProps>;
}) {
  const { postId } = await params;

  const { user: loggedInUser } = await cachedValidateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You are not authorized to view this page
      </p>
    );
  }

  const post = await cachedGetPost(postId, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none md:block lg:w-80">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSideBar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
}

interface UserInfoSideBarProps {
  user: UserData;
}

async function UserInfoSideBar({ user }: UserInfoSideBarProps) {
  const { user: loggedInUser } = await cachedValidateRequest();

  if (!loggedInUser) {
    return null;
  }

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="mb-3 text-xl font-bold">About this user</div>
      <UserToolTip user={user}>
        <Link href={`/users/${user.username}`}>
          <div className="flex items-center gap-3">
            <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-all text-primary-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserToolTip>
      {user.bio && (
        <Linkify>
          <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
            {user.bio}
          </div>
        </Linkify>
      )}
      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(({ followerId }) => {
              /** Current logged in user is following this user if it include 
               the follower id
               */
              return followerId === loggedInUser.id;
            }),
          }}
        />
      )}
    </div>
  );
}
