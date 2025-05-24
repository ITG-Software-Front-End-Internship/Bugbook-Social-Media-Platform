import { cachedValidateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: {
      maxFileSize: "512KB",
    },
  })
    .middleware(async () => {
      const { user: loggedInUser } = await cachedValidateRequest();

      if (!loggedInUser) {
        throw new UploadThingError("Unauthorized");
      }

      return { user: loggedInUser };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const newAvatarUrl = file.ufsUrl.replace(
        "/f/",
        `/f/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      );

      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          avatarUrl: newAvatarUrl,
        },
      });

      return { newAvatarUrl };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
