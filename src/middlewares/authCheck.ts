import { NextFunction, Request, Response } from "express";
import { ServerResponse } from "../models/serverResponse";
import jwt from "jsonwebtoken";

const authCheck = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    const response = new ServerResponse(true, "No token provided", null, 401);
    res.status(response.statusCode).json(response);
  }

  try {
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
    req.body.user = decoded;
    next();
  } catch (error) {
    const response = new ServerResponse(true, "Invalid token", error, 401);
    res.status(response.statusCode).json(response);
  }
};

export default authCheck;
