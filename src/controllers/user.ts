import { and, eq, exists, ilike, not, or } from "drizzle-orm";
import { follow, post, user } from "../db/schema";
import { db } from "../index";
import { ServerResponse } from "../models/serverResponse";

export const getUserData = async (userSerId: string) => {
  try {
    // Fetch user data
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

    // Error case for user not existing
    if (!userData.length) {
      throw new Error("User doesn't exist");
    }

    return new ServerResponse(true, "User data fetched", userData[0], 200); // Successful response
  } catch (error) {
    console.log(error);

    if (error.message === "User doesn't exist") {
      return new ServerResponse(false, error.message, error, 404); // Unsuccessful response
    }

    return new ServerResponse(false, "Internal server error", error, 400); // Unsuccessful response
  }
};

export const followUser = async ({
  followerId,
  toBeFollowedSerId,
}: {
  followerId: string;
  toBeFollowedSerId: string;
}) => {
  try {
    // Fetch id of the user to be followed
    const [toBeFollowedUser] = await db
      .select({
        id: user.id,
      })
      .from(user)
      .where(eq(user.serialId, Number(toBeFollowedSerId)))
      .limit(1);

    // Check if the follow already exists
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
      // If follow exists, unfollow user
      await db
        .delete(follow)
        .where(
          and(
            eq(follow.followerId, followerId),
            eq(follow.followingId, toBeFollowedUser.id)
          )
        );

      return new ServerResponse(true, "Unfollowed user", null, 200); // Successful response
    }

    // If follow doesn't exist, follow user
    await db.insert(follow).values({
      followerId,
      followingId: toBeFollowedUser.id,
    });

    return new ServerResponse(true, "Followed user", null, 200); // Successful response
  } catch (error) {
    console.log(error);

    return new ServerResponse(false, "Internal server error", error, 400); // Unsuccessful response
  }
};

export const searchUsers = async (query: string) => {
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

    return new ServerResponse(true, "Searched users fetched", users, 200); // Succcessful response
  } catch (error) {
    console.log(error);

    return new ServerResponse(false, "Internal server error", error, 400); // Unsuccessful response
  }
};

export const fetchRecommendedUsers = async ({
  userId,
  limit,
}: {
  userId: string;
  limit: number;
}) => {
  try {
    // Fetching users who I don't follow, i.e.
    // Getting a list of all users excluding myself and users that I already follow
    const recommendedUsers = await db
      .select({
        serialId: user.serialId,
        username: user.username,
        fullname: user.fullname,
        profile_pic: user.profile_pic,
      })
      .from(user)
      .where(
        and(
          not(
            exists(
              db
                .select()
                .from(follow)
                .where(
                  and(
                    eq(follow.followerId, userId),
                    eq(follow.followingId, user.id)
                  )
                )
            )
          ),
          not(eq(user.id, userId))
        )
      )
      .limit(limit);

    return new ServerResponse( // Successful response
      true,
      "Recommended users fetched",
      recommendedUsers,
      200
    );
  } catch (error) {
    console.log(error);

    return new ServerResponse(false, "Internal server error", error, 400); // Unsuccessful response
  }
};
