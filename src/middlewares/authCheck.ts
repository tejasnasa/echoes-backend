import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ServerResponse } from "../models/serverResponse";

const authCheck = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.session;
  if (!token) {
    const response = new ServerResponse(true, "No token provided", null, 401);
    res.status(response.statusCode).json(response);
  }

  try {
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as {
      userId: string;
    };
    req.body.token = decoded;
    console.log(decoded);
    next();
  } catch (error) {
    const response = new ServerResponse(true, "Invalid token", error, 401);
    res.status(response.statusCode).json(response);
  }
};

export default authCheck;
