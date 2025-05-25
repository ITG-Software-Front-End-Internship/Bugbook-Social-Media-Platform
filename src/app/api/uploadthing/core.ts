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
      console.log(`Loggerd in user`, loggedInUser);

      return { user: loggedInUser };
    })
    .onUploadError(({ error }) => {
      console.error("UploadThing onUploadError triggered:");
      console.error(error);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log({ metadata });
      console.log(`Upload complete !!`);

      const newAvatarUrl = file.ufsUrl;
      console.log(newAvatarUrl);
      try {
        await prisma.user.update({
          where: { id: metadata.user.id },
          data: {
            avatarUrl: newAvatarUrl,
          },
        });
      } catch (error) {
        console.error(error);
        throw error;
      }

      return { newAvatarUrl };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
