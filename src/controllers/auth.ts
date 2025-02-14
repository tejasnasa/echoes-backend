import { ServerResponse } from "../models/serverResponse";
import { user } from "../db/schema";
import { db } from "../index";
import { eq, or } from "drizzle-orm";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async ({
  username,
  fullname,
  email,
  password,
}: typeof user.$inferInsert) => {
  try {
    // Check for existing username
    const existingUsername = await db
      .select()
      .from(user)
      .where(eq(user.username, username));

    if (existingUsername.length > 0) {
      throw new Error("Username already exists");
    }

    // Check for existing username
    const existingEmail = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (existingEmail.length > 0) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await hash(password, 10); // Password hash

    // Inserting values
    const newUser = await db
      .insert(user)
      .values({
        username,
        fullname,
        email,
        password: hashedPassword,
      })
      .returning({ id: user.id });

    // JWT token creation
    const token = jwt.sign(newUser[0].id, `${process.env.JWT_SECRET}`, {
      expiresIn: "1w",
    });

    return new ServerResponse(true, "User created", newUser[0].id, 201, token); // Returning successful response
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

export const login = async ({
  emailOrUsername,
  password,
}: {
  emailOrUsername: string;
  password: string;
}) => {
  try {
    // Check if user exists
    const userCheck = await db
      .select()
      .from(user)
      .where(
        or(eq(user.username, emailOrUsername), eq(user.email, emailOrUsername))
      );

    if (!userCheck.length) {
      throw new Error("User doesn't exist");
    }

    // Check if password is correct
    const isPasswordValid = await compare(password, userCheck[0].password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // JWT token creation
    const token = jwt.sign(userCheck[0].id, `${process.env.JWT_SECRET}`, {
      expiresIn: "1w",
    });

    return new ServerResponse( // Returning successful response
      true,
      "User logged in",
      userCheck[0].id,
      201,
      token
    );
  } catch (error) {
    console.log(error);

    if (
      error.message === "User doesn't exist" ||
      error.message === "Invalid password"
    ) {
      return new ServerResponse(false, error.message, error, 409); // Returning unsuccessful response
    }

    return new ServerResponse(false, "Server error", error, 400); // Returning unsuccessful response
  }
};
