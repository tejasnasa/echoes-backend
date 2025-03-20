import { ServerResponse } from "../models/serverResponse";
import { bookmark, like, post, repost, user } from "../db/schema";
import { db } from "../index";
import { and, count, desc, eq, sql } from "drizzle-orm";

export const getHomePosts = async (userId: string) => {
  try {
    // Fetching posts
    const posts = await db
      .select({
        serialId: post.serialId,
        text: post.text,
        images: post.images,
        createdAt: post.createdAt,
        user: {
          serialId: user.serialId,
          fullname: user.fullname,
          username: user.username,
          profile_pic: user.profile_pic,
        },
        likeCount: count(like.id),
        repostCount: count(repost.id),
        bookmarkCount: count(bookmark.id),
        likedByUser:
          sql<boolean>`COALESCE(SUM(CASE WHEN ${like.userId} = ${userId} THEN 1 ELSE 0 END), 0) > 0`.as(
            "likedByUser"
          ),
        repostedByUser:
          sql<boolean>`COALESCE(SUM(CASE WHEN ${repost.userId} = ${userId} THEN 1 ELSE 0 END), 0) > 0`.as(
            "repostedByUser"
          ),
        bookmarkedByUser:
          sql<boolean>`COALESCE(SUM(CASE WHEN ${bookmark.userId} = ${userId} THEN 1 ELSE 0 END), 0) > 0`.as(
            "bookmarkedByUser"
          ),
      })
      .from(post)
      .leftJoin(user, eq(post.userId, user.id))
      .leftJoin(like, eq(post.id, like.postId))
      .leftJoin(repost, eq(post.id, repost.postId))
      .leftJoin(bookmark, eq(post.id, bookmark.postId))
      .groupBy(
        post.serialId,
        post.text,
        post.images,
        post.createdAt,
        user.serialId,
        user.fullname,
        user.username,
        user.profile_pic
      )
      .orderBy(desc(post.createdAt));

    return new ServerResponse(true, "Posts fetched", posts, 200); // Returning successful response
  } catch (error) {
    console.log(error);
    return new ServerResponse(false, "Internal server error", error, 400); // Returning unsuccessful response
  }
};

export const getPopularPosts = () => {};

export const createPost = async (data: {
  userId: string;
  text: string;
  images: string[];
  postAboveId: string;
}) => {
  try {
    const [newPost] = await db // Post creation
      .insert(post)
      .values({ ...data })
      .returning({ serialId: post.serialId });

    return new ServerResponse(true, "Post created", newPost, 200); // Returning successful response
  } catch (error) {
    console.log(error);
    return new ServerResponse(false, "Internal server error", error, 400); // Returning unsuccessful response
  }
};

export const deletePost = async ({
  userId,
  postSerId,
}: {
  userId: string;
  postSerId: string;
}) => {
  try {
    // Checking if the user is authorized the delete the particular post
    const postCheck = await db
      .select()
      .from(post)
      .where(and(eq(post.serialId, postSerId), eq(post.userId, userId)));

    if (!postCheck.length) {
      // Throw error if user is unauthorized
      throw new Error("Unauthorized");
    }

    const deletedPost = await db // Deleting post
      .delete(post)
      .where(eq(post.serialId, postSerId));

    return new ServerResponse(true, "Post deleted", deletedPost, 200); // Returning successful response
  } catch (error) {
    console.log(error);

    if (error.message === "Unauthorized") {
      return new ServerResponse(false, error.message, error, 403); // Returning unsuccessful response
    }

    return new ServerResponse(false, "Internal server error", error, 400); // Returning unsuccessful response
  }
};

export const getPostData = async (postSerId: string, userId: string) => {
  try {
    // Fetching post data
    const postData = await db
      .select({
        serialId: post.serialId,
        text: post.text,
        images: post.images,
        createdAt: post.createdAt,
        user: {
          serialId: user.serialId,
          fullname: user.fullname,
          username: user.username,
          profile_pic: user.profile_pic,
        },
        likeCount: count(like.id),
        repostCount: count(repost.id),
        bookmarkCount: count(bookmark.id),
        likedByUser:
          sql<boolean>`COALESCE(SUM(CASE WHEN ${like.userId} = ${userId} THEN 1 ELSE 0 END), 0) > 0`.as(
            "likedByUser"
          ),
        repostedByUser:
          sql<boolean>`COALESCE(SUM(CASE WHEN ${repost.userId} = ${userId} THEN 1 ELSE 0 END), 0) > 0`.as(
            "repostedByUser"
          ),
        bookmarkedByUser:
          sql<boolean>`COALESCE(SUM(CASE WHEN ${bookmark.userId} = ${userId} THEN 1 ELSE 0 END), 0) > 0`.as(
            "bookmarkedByUser"
          ),
      })
      .from(post)
      .where(eq(post.serialId, postSerId))
      .leftJoin(user, eq(post.userId, user.id))
      .leftJoin(like, eq(post.id, like.postId))
      .leftJoin(repost, eq(post.id, repost.postId))
      .leftJoin(bookmark, eq(post.id, bookmark.postId))
      .groupBy(
        post.serialId,
        post.text,
        post.images,
        post.createdAt,
        user.serialId,
        user.fullname,
        user.username,
        user.profile_pic
      )
      .limit(1);

    if (!postData.length) {
      throw new Error("Post does not exist");
    }

    return new ServerResponse(true, "Post data fetched", postData[0], 200); // Returning successful resposne
  } catch (error) {
    console.log(error);

    if (error.message === "Post does not exist") {
      return new ServerResponse(false, error.message, error, 400); // Returning unsuccessful response
    }

    return new ServerResponse(false, "Internal server error", error, 400); // Returning unsuccessful response
  }
};
