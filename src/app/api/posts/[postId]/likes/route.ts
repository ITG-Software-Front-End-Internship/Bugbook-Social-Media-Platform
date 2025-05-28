import { cachedValidateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { LikeInfo } from "@/lib/types";

interface RouteParams {
  postId: string;
}

export async function GET(
  req: Request,
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

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        likes: {
          where: {
            userId: loggedInUser.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return Response.json(
        {
          error: "Post not found",
        },
        {
          status: 404,
        },
      );
    }

    const data: LikeInfo = {
      likes: post._count.likes,
      isLikedByUser: !!post.likes.length,
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
  req: Request,
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

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        userId: true,
      },
    });

    if (!post) {
      return Response.json(
        {
          error: "Post not found",
        },
        {
          status: 404,
        },
      );
    }

    /**
     * issuerId: is the user who created the like: logged in user who called this end point.
     * recipientId: id of the user who created the post what was liked
     * postId: so we can link to the post later.
     */

    await prisma.$transaction([
      prisma.like.upsert({
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
      }),
      ...(loggedInUser.id !== post.userId
        ? [
            prisma.notification.create({
              data: {
                issuerId: loggedInUser.id,
                recipientId: post.userId,
                postId: postId,
                type: "LIKE",
              },
            }),
          ]
        : []),
    ]);

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
  req: Request,
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

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        userId: true,
      },
    });

    if (!post) {
      return Response.json(
        {
          error: "Post not found",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.$transaction([
      /** if there is not post to delete it will be ignored */
      prisma.like.deleteMany({
        where: {
          userId: loggedInUser.id,
          postId: postId,
        },
      }),
      /** if there is not post to delete it will be ignored */
      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: post.userId,
          postId: postId,
          type: "LIKE",
        },
      }),
    ]);

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
