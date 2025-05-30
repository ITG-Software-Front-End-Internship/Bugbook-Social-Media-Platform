"use server";

import { cachedValidateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import Link from "next/link";
import React, { use } from "react";
import MessagesButton from "./MessagesButton";
import NotificationsButton from "./NotificationsButton";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user: loggedInUser } = await cachedValidateRequest();

  if (!loggedInUser) {
    return null;
  }

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: loggedInUser.id,
        isRead: false,
      },
    }),
    (await streamServerClient.getUnreadCount(loggedInUser.id))
      .total_unread_count,
  ]);

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{
          unreadCount: unreadNotificationsCount,
        }}
      />
      <MessagesButton
        initialState={{
          unreadCount: unreadMessagesCount,
        }}
      />
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
}
