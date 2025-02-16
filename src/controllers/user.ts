import { eq } from "drizzle-orm";
import { post, user } from "../db/schema";
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

export const followUser = () => {};

export const unfollowUser = () => {};

export const searchUsers = () => {};

export const getRecommendedUsers = () => {};
