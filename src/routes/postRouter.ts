import express, { Request, Response } from "express";
import { createPost, deletePost, getHomePosts } from "../controllers/post";

const postRouter = express.Router();

postRouter.get("/", async (req: Request, res: Response) => {
  const response = await getHomePosts();
  res.status(response.statusCode).json(response);
});

postRouter.post("/create", async (req: Request, res: Response) => {
  const { userId } = req.body.token;
  const { text, images, postAboveId } = req.body;

  const response = await createPost({ userId, text, images, postAboveId });

  res.status(response.statusCode).json(response);
});

postRouter.delete("/delete/:postSerId", async (req: Request, res: Response) => {
  const { userId } = req.body.token;
  const { postSerId } = req.params;

  const response = await deletePost({ userId, postSerId });

  res.status(response.statusCode).json(response);
});

export default postRouter;
