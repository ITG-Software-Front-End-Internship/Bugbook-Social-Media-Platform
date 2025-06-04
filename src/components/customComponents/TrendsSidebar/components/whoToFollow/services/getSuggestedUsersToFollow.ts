import prisma from "@/lib/prisma";
import { whoToFollowSidebarTranslations } from "@/lib/translationKeys";
import { getUserDataSelect } from "@/lib/types";
import { getTranslations } from "next-intl/server";

export const getSuggestedUsersToFollow = async (loggedInUserId: string) => {
  const t = await getTranslations();

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
      error: t(whoToFollowSidebarTranslations.generalError),
    };
  }
};
