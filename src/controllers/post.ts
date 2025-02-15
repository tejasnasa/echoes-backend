import { ServerResponse } from "../models/serverResponse";
import { post, user } from "../db/schema";
import { db } from "../index";
import { eq } from "drizzle-orm";

export const getHomePosts = async () => {
  const posts = await db
    .select({
      serialId: post.serialId,
      text: post.text,
      images: post.images,
      createdAt: post.createdAt,
      user: {
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        profile_pic: user.profile_pic
      }
    })
    .from(post)
    .leftJoin(user, eq(post.userId, user.id));

  return new ServerResponse(true, "Posts fetched", posts, 200);
};

export const getPopularPosts = () => {};

export const createPost = async (data: {
  userId: string;
  text: string;
  images: string[];
  postAboveId: string;
}) => {
  const newPost = await db
    .insert(post)
    .values({ ...data })
    .returning({ serialId: post.serialId });

  return new ServerResponse(true, "Post created", newPost, 200);
};

export const deletePost = () => {};
