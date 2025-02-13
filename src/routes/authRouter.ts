import express, { Request, Response } from "express";
import { signup } from "../controllers/auth";

const authRouter = express.Router();

authRouter.post("/signup", async (req: Request, res: Response) => {
  console.log(req.body);
  const { username, fullname, email, password } = req.body;

  const response = await signup({ username, fullname, email, password });
  console.log(response);
  res.status(response.statusCode).json(response);
});

export default authRouter;
