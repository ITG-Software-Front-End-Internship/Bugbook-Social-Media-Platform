import streamServerClient from "@/lib/stream";

export const getUnreadMessagesCount = async (userId: string) => {
  return (await streamServerClient.getUnreadCount(userId)).total_unread_count;
};
