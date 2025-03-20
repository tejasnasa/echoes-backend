import express, { Request, Response } from "express";
import {
  createPost,
  deletePost,
  getHomePosts,
  getPostData,
} from "../controllers/post";

const postRouter = express.Router();

postRouter.get("/", async (req: Request, res: Response) => {
  const { userId } = req.body.token;
  const response = await getHomePosts(userId);

  res.status(response.statusCode).json(response);
});

postRouter.get("/get/:postSerId", async (req: Request, res: Response) => {
  const { userId } = req.body.token;
  const { postSerId } = req.params;

  const response = await getPostData(postSerId, userId);

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
