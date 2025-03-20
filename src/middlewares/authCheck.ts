import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ServerResponse } from "../models/serverResponse";

const authCheck = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.session;
  if (!token) {
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
      throw new Error("Token expired, login again");
    }

    req.body.token = decoded;
    console.log(decoded);

    next();
  } catch (error) {
    if (error.message === "Token expired, login again") {
      const response = new ServerResponse(false, error.message, null, 403);

      res.status(response.statusCode).json(response);
    }

    const response = new ServerResponse(false, "Invalid token", error, 401);
    res.status(response.statusCode).json(response);
  }
};

export default authCheck;
