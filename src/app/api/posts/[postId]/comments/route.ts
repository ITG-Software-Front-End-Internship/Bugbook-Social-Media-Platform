import { cachedValidateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentsPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

interface RouteParams {
  postId: string;
}

/**
 * We need this api route handler because we want to pass this to infinite query for infinite loading
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<RouteParams> },
) {
  try {
    const { postId } = await params;

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 5;

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
     * We show the latest comment at the bottom and then we paginate upwards.
     
    * We can pass -ve value to take so we can take the items before this cursor.
     */

    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: getCommentDataInclude(loggedInUser.id),
      orderBy: {
        createdAt: "asc",
      },
      take: -(pageSize + 1),
      cursor: cursor ? { id: cursor } : undefined,
    });

    const hasMoreComments = comments.length > pageSize;

    /** Upwards */
    const previousCursor = hasMoreComments ? comments[0].id : null;

    /**
     * We have to slice the first element because the first element is the cursor.
     * Only if the length > pageSize otherwise returns the unchanged comments
     */

    const data: CommentsPage = {
      comments: hasMoreComments ? comments.slice(1) : comments,
      previousCursor,
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
