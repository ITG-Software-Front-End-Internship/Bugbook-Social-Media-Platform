import { API_ENDPOINTS } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import { LikeInfo } from "@/lib/types";

export const unLikePost = (postId: string) => {
  return kyInstance.delete(API_ENDPOINTS.getPostLikesEndPoint(postId));
};

export const likePost = (postId: string) => {
  return kyInstance.post(API_ENDPOINTS.getPostLikesEndPoint(postId));
};

export const getPostLikes = (postId: string) => {
  return kyInstance
    .get(API_ENDPOINTS.getPostLikesEndPoint(postId))
    .json<LikeInfo>();
};
