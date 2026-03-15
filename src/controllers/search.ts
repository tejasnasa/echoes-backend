import { count, eq, ilike, or, sql } from "drizzle-orm";
import { bookmark, like, post, repost, user } from "../db/schema";
import { db } from "../index";
import { ServerResponse } from "../models/serverResponse";

export const search = async (query: string, userId: string) => {
  try {
    const searchQuery = query.trim().slice(0, 20);

    if (!searchQuery) {
      return new ServerResponse(
        true,
        "Search results",
        { users: [], posts: [] },
        200,
      );
    }

    const searchPattern = `%${searchQuery}%`;

    const [users, posts] = await Promise.all([
      db
        .select({
          serialId: user.serialId,
          username: user.username,
          fullname: user.fullname,
          profile_pic: user.profile_pic,
        })
        .from(user)
        .where(
          or(
            ilike(user.username, searchPattern),
            ilike(user.fullname, searchPattern),
          ),
        )
        .limit(25),

      db
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
              "likedByUser",
            ),
          repostedByUser:
            sql<boolean>`COALESCE(SUM(CASE WHEN ${repost.userId} = ${userId} THEN 1 ELSE 0 END), 0) > 0`.as(
              "repostedByUser",
            ),
          bookmarkedByUser:
            sql<boolean>`COALESCE(SUM(CASE WHEN ${bookmark.userId} = ${userId} THEN 1 ELSE 0 END), 0) > 0`.as(
              "bookmarkedByUser",
            ),
        })
        .from(post)
        .leftJoin(user, eq(post.userId, user.id))
        .leftJoin(like, eq(post.id, like.postId))
        .leftJoin(repost, eq(post.id, repost.postId))
        .leftJoin(bookmark, eq(post.id, bookmark.postId))
        .where(ilike(post.text, searchPattern))
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
          user.profile_pic,
        )
        .limit(25),
    ]);

    return new ServerResponse(
      true,
      "Search results fetched",
      { users, posts },
      200,
    );
  } catch (error) {
    console.log(error);
    return new ServerResponse(false, "Internal server error", error, 400);
  }
};
