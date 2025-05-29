import { cachedValidateRequest } from "@/auth";
import prisma from "@/lib/prisma";

/**
 * PATCH: We want to update a value on a server
 */

export async function PATCH() {
  try {
    const { user: loggedInUser } = await cachedValidateRequest();

    if (!loggedInUser) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    /**
     * TODO: Im assuming that entering the notfication page marks all the notfication as read.
     * TODO: We need to change it later to mark the notfication as read if we move to notfication detials page.
     */
    await prisma.notification.updateMany({
      where: {
        recipientId: loggedInUser.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
