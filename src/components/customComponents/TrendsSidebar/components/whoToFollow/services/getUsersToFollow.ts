import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";

export const getUsersToFollow = async (userId: string) => {
  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: userId,
      },
      followers: {
        none: {
          followerId: userId,
        },
      },
    },
    select: getUserDataSelect(userId),
    take: 5,
  });

  return usersToFollow;
};
