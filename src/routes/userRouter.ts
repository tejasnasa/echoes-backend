import express, { Request, Response } from "express";
import { followUser, getUserData, searchUsers } from "../controllers/user";

const userRouter = express.Router();

userRouter.get("/:userSerId", async (req: Request, res: Response) => {
  const { userSerId } = req.params;

  const response = await getUserData(userSerId);

  res.status(response.statusCode).json(response);
});

userRouter.post("/follow/:userSerId", async (req: Request, res: Response) => {
  const { userId } = req.body.token;
  const { userSerId } = req.params;

  const response = await followUser({
    followerId: userId,
    toBeFollowedSerId: userSerId,
  });

  res.status(response.statusCode).json(response);
});

userRouter.get("/search", async (req: Request, res: Response) => {
  const { query } = req.query;

  const response = await searchUsers(query as string);

  res.status(response.statusCode).json(response);
});

export default userRouter;
