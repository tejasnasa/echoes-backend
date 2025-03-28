import { and, desc, eq } from "drizzle-orm";
import { like, post, user } from "../db/schema";
import { db } from "../index";
import { ServerResponse } from "../models/serverResponse";

export const likePost = async ({
  postSerId,
  userId,
}: {
  postSerId: string;
  userId: string;
}) => {
  try {
    // Getting id of post to be liked
    const [postToBeLiked] = await db
      .select({
        id: post.id,
      })
      .from(post)
      .where(eq(post.serialId, postSerId))
      .limit(1);

    // Checking if the like already exists
    const existingLike = await db
      .select()
      .from(like)
      .where(and(eq(like.postId, postToBeLiked.id), eq(like.userId, userId)))
      .limit(1);

    if (existingLike.length) {
      // Dislike post
      await db
        .delete(like)
        .where(and(eq(like.postId, postToBeLiked.id), eq(like.userId, userId)));

      return new ServerResponse(true, "Post disliked", null, 200); // Successful response
    }

    // Like post
    await db.insert(like).values({
      postId: postToBeLiked.id,
      userId,
    });

    return new ServerResponse(true, "Post liked", null, 200); // Successful response
  } catch (error) {
    console.log(error);

    return new ServerResponse(false, "Internal server error", error, 400); // Unsuccessful response
  }
};

export const fetchLikedPosts = async (userId: string) => {
  try {
    // Fetch posts having likes by the given user
    const likedPosts = await db
      .select({
        serialId: post.serialId,
        text: post.text,
        images: post.images,
        postAboveId: post.postAboveId,
        user: {
          serialId: user.serialId,
          username: user.username,
          profile_pic: user.profile_pic,
        },
      })
      .from(post)
      .innerJoin(like, eq(post.id, like.postId))
      .leftJoin(user, eq(post.userId, user.id))
      .where(eq(like.userId, userId))
      .orderBy(desc(like.createdAt));

    return new ServerResponse(true, "Liked posts fetched", likedPosts, 200); // Successful response
  } catch (error) {
    console.log(error);

    return new ServerResponse(false, "Internal server error", error, 400); // Unsuccessful response
  }
};
