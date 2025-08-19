import { cachedValidateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { BookmarkInfo } from "@/lib/types";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    // Await the dynamic route params
    const { postId } = await params;

    // Validate user
    const { user: loggedInUser } = await cachedValidateRequest();

    if (!loggedInUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    // Find bookmark
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        postId_userId: {
          userId: loggedInUser.id,
          postId,
        },
      },
    });

    // Prepare response
    const data: BookmarkInfo = {
      isBookedmarkByUser: !!bookmark,
    };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function POST(
  req: Request,
  { params }: { params: Promise<{ postId: string }> },
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
  req: Request,
  { params }: { params: Promise<{ postId: string }> },
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
