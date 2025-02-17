import { and, eq } from "drizzle-orm";
import { like, post } from "../db/schema";
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
      userId: userId,
    });

    return new ServerResponse(true, "Post liked", null, 200); // Successful response
  } catch (error) {
    console.log(error);

    return new ServerResponse(false, "Internal server error", error, 400); // Unsuccessful response
  }
};

// export const fetchLikedPosts = async (userId: string) => {
//   try {
//     const likedPosts = await db.select({
//       postSerId: post.serialId,
//       text: post.text,
//       images: post.images
//     }).from(post)
//   } catch (error) {
    
//   }
// }
