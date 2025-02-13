import { ServerResponse } from "../models/serverResponse";
import { user } from "../db/schema";
import { db } from "../index";
import { eq } from "drizzle-orm";
import { hash } from "bcrypt";

export const signup = async ({
  username,
  fullname,
  email,
  password,
}: typeof user.$inferInsert) => {
  try {
    const existingUsername = db
      .select()
      .from(user)
      .where(eq(user.username, username));

    if ((await existingUsername).length > 0) {
      return new ServerResponse(false, "Username already exists", null, 409);
    }

    const existingEmail = db.select().from(user).where(eq(user.email, email));
    if ((await existingEmail).length > 0) {
      return new ServerResponse(false, "Email already exists", null, 409);
    }

    const hashedPassword = await hash(password, 10);

    const newUser = db
      .insert(user)
      .values({
        username,
        fullname,
        email,
        password: hashedPassword,
      })
      .returning();
    console.log(newUser);

    return new ServerResponse(true, "User created", await newUser, 201);
  } catch (error) {
    console.log(error);
    return new ServerResponse(false, "Server error", error, 400);
  }
};
