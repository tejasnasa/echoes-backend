import express, { Request, Response } from "express";
import { getUserData } from "../controllers/user";

const userRouter = express.Router();

userRouter.get("/:userSerId", async (req: Request, res: Response) => {
  const { userSerId } = req.params;

  const response = await getUserData(userSerId);

  res.status(response.statusCode).json(response);
});

export default userRouter;
