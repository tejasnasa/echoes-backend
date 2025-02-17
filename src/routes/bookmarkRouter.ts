import express, { Request, Response } from "express";
import { bookmarkPost, fetchBookmarkedPosts } from "../controllers/bookmark";

const bookmarkRouter = express.Router();

bookmarkRouter.post("/:postSerId", async (req: Request, res: Response) => {
  const { userId } = req.body.token;
  const { postSerId } = req.params;

  const response = await bookmarkPost({ userId, postSerId });

  res.status(response.statusCode).json(response);
});

bookmarkRouter.get("/", async (req: Request, res: Response) => {
  const { userId } = req.body.token;

  const response = await fetchBookmarkedPosts(userId);

  res.status(response.statusCode).json(response);
});

export default bookmarkRouter;
