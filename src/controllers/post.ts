import { ServerResponse } from "../models/serverResponse";
import { post, user } from "../db/schema";
import { db } from "../index";
import { and, eq } from "drizzle-orm";

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
        profile_pic: user.profile_pic,
      },
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

export const deletePost = async ({
  userId,
  postSerId,
}: {
  userId: string;
  postSerId: string;
}) => {
  const postCheck = await db
    .select()
    .from(post)
    .where(and(eq(post.serialId, postSerId), eq(post.userId, userId)));

  if (!postCheck.length) {
    return new ServerResponse(true, "Nope created", postCheck, 400);
  }

  const deletedPost = await db.delete(post).where(eq(post.serialId, postSerId));

  return new ServerResponse(true, "Deleted", deletedPost, 200);
};
