import { cachedValidateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
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

      /**
       * It dose make a secnce if we rollback after an error happen because the file is already uploaded.
       * It's also fine because even if we dont update the stream user with the new avatar we will see the new avatar the next time we connect to the chat.
       */

      try {
        /*
         * To excute these 2 operation in parallel which make the whole this operation faster and save sometime.
         */

        await Promise.all([
          prisma.user.update({
            where: { id: metadata.user.id },
            data: {
              avatarUrl: newAvatarUrl,
            },
          }),
          streamServerClient.partialUpdateUser({
            id: metadata.user.id,
            set: {
              image: newAvatarUrl,
            },
          }),
        ]);
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
