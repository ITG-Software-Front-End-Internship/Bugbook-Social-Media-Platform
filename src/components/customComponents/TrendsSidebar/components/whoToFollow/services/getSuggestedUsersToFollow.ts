import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";

export const getSuggestedUsersToFollow = async (loggedInUserId: string) => {
  try {
    const suggestedUsersToFollow = await prisma.user.findMany({
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

    return { suggestedUsersToFollow };
  } catch (error) {
    console.log(error);

    return {
      error: "An error occurred while loading suggested users to follow",
    };
  }
};
