import { eq } from "drizzle-orm";
import { user } from "../db/schema";
import { db } from "../index";
import { ServerResponse } from "../models/serverResponse";
import { compare, hash } from "bcrypt";

export const editPassword = async (userId: string, newPassword: string) => {
  try {
    const [{ password }] = await db
      .select({ password: user.password })
      .from(user)
      .where(eq(user.id, userId));

    const isPasswordSame = await compare(newPassword, password);

    if (isPasswordSame) {
      throw new Error("Password is the same");
    }

    const hashedPassword = await hash(newPassword, 10);

    await db
      .update(user)
      .set({ password: hashedPassword })
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
  userId: string,
) => {
  try {
    const updates: Partial<typeof user.$inferSelect> = {};
    if (data.bio !== undefined) updates.bio = data.bio;
    if (data.profile_pic !== undefined) updates.profile_pic = data.profile_pic;
    if (data.cover_pic !== undefined) updates.cover_pic = data.cover_pic;

    if (!Object.keys(updates).length) {
      return new ServerResponse(false, "No fields to update", null, 400);
    }

    await db.update(user).set(updates).where(eq(user.id, userId));

    return new ServerResponse(true, "Profile updated", null, 200);
  } catch (error) {
    return new ServerResponse(false, "Internal server error", null, 500);
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
