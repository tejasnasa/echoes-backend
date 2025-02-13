import express, { Request, Response } from "express";
import { signup } from "../controllers/auth";

const authRouter = express.Router();

authRouter.post("/signup", async (req: Request, res: Response) => {
  const { username, fullname, email, password } = req.body;

  const response = await signup({ username, fullname, email, password });
  
  res.status(response.statusCode).json(response);
});

export default authRouter;
