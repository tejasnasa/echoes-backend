import { and, desc, eq } from "drizzle-orm";
import { bookmark, post, user } from "../db/schema";
import { db } from "../index";
import { ServerResponse } from "../models/serverResponse";

export const bookmarkPost = async ({
  userId,
  postSerId,
}: {
  userId: string;
  postSerId: string;
}) => {
  try {
    // Fetch id of the post to be bookmarked
    const [postToBeBookmarked] = await db
      .select({ id: post.id })
      .from(post)
      .where(eq(post.serialId, Number(postSerId)))
      .limit(1);

    // Check if the bookmark already exists
    const existingBookmark = await db
      .select()
      .from(bookmark)
      .where(
        and(
          eq(bookmark.userId, userId),
          eq(bookmark.postId, postToBeBookmarked.id)
        )
      )
      .limit(1);

    if (existingBookmark.length) {
      // If bookmark already exists, unbookmark
      await db
        .delete(bookmark)
        .where(
          and(
            eq(bookmark.userId, userId),
            eq(bookmark.postId, postToBeBookmarked.id)
          )
        );

      return new ServerResponse(true, "Post unbookmarked", null, 200); // Successful response
    }

    // If bookmark doesn't exist, create one
    await db.insert(bookmark).values({
      userId,
      postId: postToBeBookmarked.id,
    });

    return new ServerResponse(true, "Post bookmarked", null, 200); // Successful response
  } catch (error) {
    console.log(error);

    return new ServerResponse(false, "Internal server error", error, 400); // Unsuccessful response
  }
};

export const fetchBookmarkedPosts = async (userId: string) => {
  try {
    // Fetch posts having bookmarks by the given user
    const bookmarkedPosts = await db
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
      .innerJoin(bookmark, eq(post.id, bookmark.postId))
      .leftJoin(user, eq(post.userId, user.id))
      .where(eq(bookmark.userId, userId))
      .orderBy(desc(bookmark.createdAt));

    return new ServerResponse(true, "Bookmarks fetched", bookmarkedPosts, 200); // Successful response
  } catch (error) {
    console.log(error);

    return new ServerResponse(false, "Internal server error", error, 400); // Unsuccessful response
  }
};
