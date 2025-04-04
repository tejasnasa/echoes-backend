import express, { Request, Response } from "express";
import {
  fetchRecommendedUsers,
  followUser,
  getUserData,
} from "../controllers/user";

const userRouter = express.Router();

userRouter.get("/get/:userSerId", async (req: Request, res: Response) => {
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



userRouter.get("/recommended/:limit", async (req: Request, res: Response) => {
  const { userId } = req.body.token;
  const { limit } = req.params;

  const response = await fetchRecommendedUsers({ userId, limit });

  res.status(response.statusCode).json(response);
});

export default userRouter;
