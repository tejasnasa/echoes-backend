import { count, eq, ilike, or, sql } from "drizzle-orm";
import { bookmark, like, post, repost, user } from "../db/schema";
import { db } from "../index";
import { ServerResponse } from "../models/serverResponse";

export const search = async (query: string, userId: string) => {
  try {
    const searchQuery = query.trim();
    // Perform search by username and fullname
    const users = await db
      .select({
        serialId: user.serialId,
        username: user.username,
        fullname: user.fullname,
        profile_pic: user.profile_pic,
      })
      .from(user)
      .where(
        or(
          ilike(user.username, `%${searchQuery}%`),
          ilike(user.fullname, `%${searchQuery}%`)
        )
      )
      .limit(5);

    // Perform search by post
    const posts = await db
      .select({
        id: post.id,
        serialId: post.serialId,
        text: post.text,
        images: post.images,
        createdAt: post.createdAt,
        postAboveId: post.postAboveId,
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
        post.id,
        post.serialId,
        post.text,
        post.images,
        post.createdAt,
        post.postAboveId,
        user.serialId,
        user.fullname,
        user.username,
        user.profile_pic
      )
      .where(or(ilike(post.text, `%${searchQuery}%`)));

    return new ServerResponse(
      true,
      "Searched users fetched",
      {
        users: users,
        posts: posts,
      },
      200
    ); // Succcessful response
  } catch (error) {
    console.log(error);

    return new ServerResponse(false, "Internal server error", error, 400); // Unsuccessful response
  }
};
