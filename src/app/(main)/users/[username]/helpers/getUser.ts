import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { notFound } from "next/navigation";
import { cache } from "react";

const getUser = async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) {
    notFound();
  }

  return user;
};

export default cache(getUser);
