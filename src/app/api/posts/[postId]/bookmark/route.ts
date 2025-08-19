import { cachedValidateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { BookmarkInfo } from "@/lib/types";

interface RouteParams {
  postId: string;
}

export async function GET(
  _req: Request,
  { params }: { params: RouteParams},
) {
  try {
    const { postId } = params;

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

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        postId_userId: {
          userId: loggedInUser.id,
          postId: postId,
        },
      },
    });

    const data: BookmarkInfo = {
      isBookedmarkByUser: !!bookmark,
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

export async function POST(
  { params }: { params: Promise<RouteParams> },
) {
  try {
    const { postId } = await params;

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

    await prisma.bookmark.upsert({
      where: {
        postId_userId: {
          userId: loggedInUser.id,
          postId: postId,
        },
      },
      create: {
        userId: loggedInUser.id,
        postId: postId,
      },
      update: {},
    });

    // this return success response by default
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

export async function DELETE(
  { params }: { params: Promise<RouteParams> },
) {
  try {
    const { postId } = await params;

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

    await prisma.bookmark.deleteMany({
      where: {
        userId: loggedInUser.id,
        postId: postId,
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
