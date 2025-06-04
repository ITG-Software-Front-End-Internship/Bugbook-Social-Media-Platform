import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";

export const getSuggestedUsersToFollow = async (loggedInUserId: string) => {
  const usersToFollow = await prisma.user.findMany({
    where: {
      // exclude the current logged-in user
      NOT: {
        id: loggedInUserId,
      },
      // exclude users already followed by this user.
      // Get users id that they are not follow the loggedIn user
      followers: {
        none: {
          followerId: loggedInUserId,
        },
      },
    },
    select: getUserDataSelect(loggedInUserId),
    take: 5,
  });

  return usersToFollow;
};
