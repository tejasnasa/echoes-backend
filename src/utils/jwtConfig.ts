import jwt from "jsonwebtoken";
import { ServerResponse } from "../models/serverResponse";

const JWT_token = `${process.env.JWT_SECRET}`; // JWT key for encryption and decryption

// JWT token creation
export const createToken = (payload: object): string => {
  return jwt.sign(payload, JWT_token, { expiresIn: "1w" });
};

// JWT token verification
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_token);
  } catch (error) {
    console.log(error);
    return new ServerResponse(false, "Invalid Token", error, 401);
  }
};
