import { and, eq, ilike, or } from "drizzle-orm";
import { follow, post, user } from "../db/schema";
import { db } from "../index";
import { ServerResponse } from "../models/serverResponse";

export const getUserData = async (userSerId: string) => {
  const userData = await db
    .select({
      serialId: user.serialId,
      username: user.username,
      fullname: user.username,
      profile_pic: user.profile_pic,
      bio: user.bio,
      cover_pic: user.cover_pic,
      post: {
        serialId: post.serialId,
        text: post.text,
        images: post.images,
      },
    })
    .from(user)
    .where(eq(user.serialId, Number(userSerId)))
    .leftJoin(post, eq(post.userId, user.id));

  if (!userData.length) {
    throw new Error("User doesn't exist");
  }

  return new ServerResponse(true, "User data fetched", userData[0], 200);
};

export const followUser = async ({
  followerId,
  toBeFollowedSerId,
}: {
  followerId: string;
  toBeFollowedSerId: string;
}) => {
  const [toBeFollowedUser] = await db
    .select({
      id: user.id,
    })
    .from(user)
    .where(eq(user.serialId, Number(toBeFollowedSerId)))
    .limit(1);

  const existingFollow = await db
    .select()
    .from(follow)
    .where(
      and(
        eq(follow.followerId, followerId),
        eq(follow.followingId, toBeFollowedUser.id)
      )
    )
    .limit(1);

  if (existingFollow.length) {
    // Unfollow
    await db
      .delete(follow)
      .where(
        and(
          eq(follow.followerId, followerId),
          eq(follow.followingId, toBeFollowedUser.id)
        )
      );

    return new ServerResponse(true, "Unfollowed user", null, 200);
  }

  // Follow
  await db.insert(follow).values({
    followerId,
    followingId: toBeFollowedUser.id,
  });

  return new ServerResponse(true, "Followed user", null, 200);
};

export const searchUsers = async (query: string) => {
  const searchQuery = query.trim();

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
  
    return new ServerResponse(true, "Searched users fetched", users, 200)
};

export const getRecommendedUsers = () => {};
