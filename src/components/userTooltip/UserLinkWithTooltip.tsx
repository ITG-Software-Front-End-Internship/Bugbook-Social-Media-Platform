"use client";

import Link from "next/link";
import { PropsWithChildren } from "react";
import UserTooltip from "./UserTooltip";
import { useFetchUserData } from "./hooks/useFetchUserData";

interface UserLinkWithTooltipProps extends PropsWithChildren {
  username: string;
}

export default function UserLinkWithTooltip({
  children,
  username,
}: UserLinkWithTooltipProps) {
  const { data: userData } = useFetchUserData({
    username,
  });

  if (!userData) {
    return (
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    );
  }

  return (
    <UserTooltip user={userData}>
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    </UserTooltip>
  );
}
