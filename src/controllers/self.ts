import { eq } from "drizzle-orm";
import { user } from "../db/schema";
import { db } from "../index";
import { ServerResponse } from "../models/serverResponse";

export const editPassword = async (userId: string, newPassword: string) => {
  try {
    const [{ password }] = await db
      .select({ password: user.password })
      .from(user)
      .where(eq(user.id, userId));

    if (password === newPassword) {
      throw new Error("Password is the same");
    }

    await db
      .update(user)
      .set({ password: newPassword })
      .where(eq(user.id, userId));

    return new ServerResponse(true, "Password changed", null, 200);
  } catch (error) {
    if (error.message === "Password is the same") {
      return new ServerResponse(false, error.message, error, 403);
    }

    return new ServerResponse(false, "Internal server error", error, 400);
  }
};

export const editProfile = async (
  data: { bio?: string; profile_pic?: string; cover_pic?: string },
  userId: string
) => {
  try {
    if (data.bio !== undefined) {
      await db
        .update(user)
        .set({ bio: data.bio } as unknown)
        .where(eq(user.id, userId));
    }

    if (data.profile_pic !== undefined) {
      await db
        .update(user)
        .set({ profile_pic: data.profile_pic } as unknown)
        .where(eq(user.id, userId));
    }

    if (data.cover_pic !== undefined) {
      await db
        .update(user)
        .set({ cover_pic: data.cover_pic } as unknown)
        .where(eq(user.id, userId));
    }
    return new ServerResponse(true, "Data updated", null, 200);
  } catch (error) {
    if (error.message === "Password is the same") {
      return new ServerResponse(false, error.message, error, 403);
    }

    return new ServerResponse(false, "Internal server error", error, 400);
  }
};

export const whoAmI = async (userId: string) => {
  try {
    const myData = await db
      .select({
        serialId: user.serialId,
        username: user.username,
        fullname: user.fullname,
        profile_pic: user.profile_pic,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!myData.length) {
      throw new Error("User doesn't exist");
    }

    return new ServerResponse(true, "My data fetched", myData[0], 200);
  } catch (error) {
    if (error.message === "User doesn't exist") {
      return new ServerResponse(false, error.message, error, 403);
    }

    return new ServerResponse(false, "Internal server error", error, 400);
  }
};
