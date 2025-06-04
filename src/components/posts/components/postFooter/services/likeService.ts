import { API_ENDPOINTS } from "@/lib/constants";
import kyInstance from "@/lib/ky";

export const unLikePost = (postId: string) => {
  return kyInstance.delete(API_ENDPOINTS.getPostLikesEndPoint(postId));
};

export const likePost = (postId: string) => {
  return kyInstance.post(API_ENDPOINTS.getPostLikesEndPoint(postId));
};
