import { ServerResponse } from "../models/serverResponse";
import { post, user } from "../db/schema";
import { db } from "../index";
import { and, eq } from "drizzle-orm";

export const getHomePosts = async () => {
  try {
    // Fetching posts
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

export const getPostData = async (postSerId: string) => {
  try {
    // Fetching post data
    const postData = await db
      .select()
      .from(post)
      .where(eq(post.serialId, postSerId))
      .limit(1);

    if (!postData.length) {
      throw new Error("Post does not exist");
    }

    return new ServerResponse(true, "Post data fetched", postData, 200); // Returning successful resposne
  } catch (error) {
    console.log(error);

    if (error.message === "Post does not exist") {
      return new ServerResponse(false, error.message, error, 400); // Returning unsuccessful response
    }

    return new ServerResponse(false, "Internal server error", error, 400); // Returning unsuccessful response
  }
};
