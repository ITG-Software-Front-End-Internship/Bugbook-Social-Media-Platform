import { cachedValidateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NotificationCountInfo } from "@/lib/types";

export async function GET() {
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

    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: loggedInUser.id,
        isRead: false,
      },
    });

    const data: NotificationCountInfo = {
      unreadCount,
    };

    return Response.json(data);
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
