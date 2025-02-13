import { ClientResponse } from "../models/clientResponse";
import { user } from "../db/schema";
import { db } from "../index";
import { eq } from "drizzle-orm";

export const signup = async (data: typeof user.$inferInsert) => {
  const existingUsername = db
    .select()
    .from(user)
    .where(eq(user.username, data.username));
  if (existingUsername) {
    return new ClientResponse(false, "Username already exists", null, 409);
  }

  const existingEmail = db
    .select()
    .from(user)
    .where(eq(user.email, data.email));
  if (existingEmail) {
    return new ClientResponse(false, "Email already exists", null, 409);
  }

  const newUser = db.insert(user).values(data);

  return new ClientResponse(true, "User created", newUser, 201);
};
