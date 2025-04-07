import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ServerResponse } from "../models/serverResponse";

const authCheck = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.session;
  if (!token) {
    // No token provided (logged out)
    const response = new ServerResponse(false, "No token provided", null, 401);
    res.status(response.statusCode).json(response);
    return;
  }

  try {
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as {
      userId: string;
      exp: number;
    };

    if (Math.floor(Date.now() / 1000) > decoded.exp) {
      // Clear the cookie if expired
      res.clearCookie("session", {
        httpOnly: true,
        secure: true,
        sameSite: true,
      });
      return res
        .status(403)
        .json(
          new ServerResponse(false, "Token expired, login again", null, 403)
        );
    }

    req.body.token = decoded;
    console.log(decoded);

    next();
  } catch (error) {
    const response = new ServerResponse(false, "Invalid token", error, 401);
    res.status(response.statusCode).json(response);
  }
};

export default authCheck;
