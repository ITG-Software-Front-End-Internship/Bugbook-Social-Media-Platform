import { cachedValidateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

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

      const oldAvatarUrl = metadata.user.avatarUrl;

      if (oldAvatarUrl) {
        const fileKey = oldAvatarUrl.split("/f/")[1];

        await new UTApi().deleteFiles(fileKey);
      }

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
  attachments: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
    video: {
      maxFileSize: "64MB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      const { user: loggedInUser } = await cachedValidateRequest();

      if (!loggedInUser) {
        throw new UploadThingError("Unauthorized");
      }
      console.log(`Loggerd in user`, loggedInUser);

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const media = await prisma.media.create({
        data: {
          url: file.ufsUrl,
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        },
      });

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
