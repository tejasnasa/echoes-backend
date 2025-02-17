import express, { Request, Response } from "express";
import { likePost } from "../controllers/like";

const likeRouter = express.Router();

likeRouter.post("/:postSerId", async (req: Request, res: Response) => {
  const { postSerId } = req.params;
  const { userId } = req.body.token;

  const response = await likePost({ postSerId, userId });

  res.status(response.statusCode).json(response);
});

// likeRouter.get("/", async (req: Request, res: Response) => {
//   const { userId } = req.body.token;

//   const response = await fetchLikedPosts(userId);

//   res.status(response.statusCode).json(response);
// });

export default likeRouter;
