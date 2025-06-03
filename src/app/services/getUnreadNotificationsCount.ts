import prisma from "@/lib/prisma";

export const getUnreadNotificationsCount = (recipientId: string) => {
  return prisma.notification.count({
    where: {
      recipientId: recipientId,
      isRead: false,
    },
  });
};
