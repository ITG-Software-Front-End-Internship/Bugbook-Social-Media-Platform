import prisma from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Berar ${process.env.CRON_SECRET}`) {
      return Response.json(
        {
          error: "Invalid Authorization header",
        },
        {
          status: 401,
        },
      );
    }

    const unUsedMedias = await prisma.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lte: new Date(Date.now() - 1000 * 60 * 60 * 24),
              },
            }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    });

    /** Keys are a part of url */
    const fileKeys = unUsedMedias.map((media) => {
      const fileKey = media.url.split("/f/")[1];
      return fileKey;
    });

    if (fileKeys.length > 0) {
      const uTApi = new UTApi();
      await uTApi.deleteFiles(fileKeys);
    }

    const unUsedMediaIds = unUsedMedias.map((unUsedMedia) => {
      return unUsedMedia.id;
    });
    await prisma.media.deleteMany({
      where: {
        id: {
          in: unUsedMediaIds,
        },
      },
    });

    /** Success response */
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
