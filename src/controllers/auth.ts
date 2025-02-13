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
    // Check for existing username
    const existingUsername = db
      .select()
      .from(user)
      .where(eq(user.username, username));
    if ((await existingUsername).length > 0) {
      throw new Error("Username already exists");
    }

    // Check for existing username
    const existingEmail = db.select().from(user).where(eq(user.email, email));
    if ((await existingEmail).length > 0) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await hash(password, 10); // Password hash

    // Inserting values
    const newUser = db
      .insert(user)
      .values({
        username,
        fullname,
        email,
        password: hashedPassword,
      })
      .returning({ id: user.id });

    return new ServerResponse(true, "User created", await newUser, 201); // Returning successful response
  } catch (error) {
    console.log(error);

    if (
      error.message === "Email already exists" ||
      error.message === "Username already exists"
    ) {
      return new ServerResponse(false, error.message, null, 409); // Returning unsuccessful response
    }

    return new ServerResponse(false, "Server error", error, 400); // Returning unsuccessful response
  }
};
