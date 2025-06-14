import { QUERY_KEYS } from "@/lib/queryKeys";
import { PostsPage, UserData } from "@/lib/types";
import { InfiniteData, QueryClient, QueryFilters } from "@tanstack/react-query";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { updateCacheWithUpdatedUser } from "./updateCacheWithUpdatedUser";

interface HandleUpdateProfileOptimisticUpdate {
  queryClient: QueryClient;
  router: AppRouterInstance;
  newAvatarUrl: string | undefined;
  updatedUser: UserData;
  updateProfileSuccessMessages: { [key: string]: string };
}

export async function handleUpdateProfileOptimisticUpdate({
  queryClient,
  router,
  newAvatarUrl,
  updatedUser,
  updateProfileSuccessMessages,
}: HandleUpdateProfileOptimisticUpdate) {
  const queryFilter: QueryFilters = {
    queryKey: QUERY_KEYS.postFeed,
  };

  await queryClient.cancelQueries(queryFilter);

  queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
    queryFilter,
    (oldData) =>
      updateCacheWithUpdatedUser({
        oldPosts: oldData,
        updatedUser,
        newAvatarUrl,
      }),
  );

  router.refresh();

  toast.success(updateProfileSuccessMessages.title, {
    description: updateProfileSuccessMessages.description,
  });
}
