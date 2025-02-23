import { eq } from "drizzle-orm";
import { user } from "../db/schema";
import { db } from "../index";
import { ServerResponse } from "../models/serverResponse";

export const editPassword = () => {};

export const editProfile = () => {};

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
