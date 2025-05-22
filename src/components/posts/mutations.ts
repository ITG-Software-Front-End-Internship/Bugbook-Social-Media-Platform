import { PostData, PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { deletePost } from "./actions";

export function useDeletePostMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          const hasPostToDelete = oldData;
          if (!hasPostToDelete) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((post) => {
                return post.id !== deletedPost.id;
              }),
            })),
          };
        },
      );

      // For empty pages we cant see delete button
      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          // Invalidate query if its undefined, null,...
          return !query.state.data;
        },
      });

      toast.error("Deleted successfully ", {
        description: "Post deleted successfully",
      });

      if (pathname === `/posts/${deletedPost.id}`) {
        router.push(`/users/${deletedPost.user.username}`);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Faild to delete post !", {
        description: "Faild to delete post. Please try again",
      });
    },
  });

  return mutation;
}
